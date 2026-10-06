import { useState, useId, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  ArrowRight, ShieldCheck, CheckCircle2, Upload, Search, 
  FileBadge, FileText, Check, AlertCircle, Copy, X, Loader2,
  CreditCard, Building2, Banknote, ShieldAlert, Sparkles, Printer
} from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  services, wards, tradeCategories, publicWorksCategories, skillCategories, 
  certificationStatuses, yearsOfStudy, complaintCategories, indigenePurposes, 
  nigerianBanks, councilTSADetails, type ServiceId 
} from '@/lib/portal-data';
import { applicationSchema } from '@/lib/application-schema';
import { submitApplication } from '@/lib/services.functions';
import { supabase } from '@/integrations/supabase/client';
import { usePortalAuth } from './portal-auth';
import { CouncilCertificate } from './council-certificate';
import councilLogo from '@/assets/jahun-council-logo.png';

const serviceCategories = ['All services', 'Civic & statutory', 'Business & trade', 'Education & youth', 'Community'] as const;

export function ServicesHub({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<string>('All services');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<ServiceId | null>(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Form field state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('');
  const [details, setDetails] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);

  // Treasury Single Account (TSA) Payment state (Step 3: Second-to-last step)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCleared, setPaymentCleared] = useState(false);
  const [tsaReference, setTsaReference] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Certificate issued state
  const [issuedCert, setIssuedCert] = useState<{
    id: string;
    serviceId: ServiceId;
    fullName: string;
    ward: string;
    details: Record<string, string>;
    issuedAt: string;
    tsaReference: string;
    amountPaid: string;
  } | null>(null);

  const { user, openLogin } = usePortalAuth();
  const submit = useServerFn(submitApplication);
  const service = services.find(s => s.id === selected);

  const fileInputId = useId();

  function open(id: ServiceId) {
    const s = services.find(item => item.id === id);
    const generatedRef = `TSA-JLG-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setSelected(id);
    setStep(1);
    setError('');
    setResult('');
    setIssuedCert(null);
    setCopiedAccount(false);
    setDetails({});
    setFile(null);
    setConsent(false);
    setTsaReference(generatedRef);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');

    // If service fee is 0 (e.g. bursary or complaint), auto-clear subsidy
    if (s && s.fee === 0) {
      setPaymentCleared(true);
    } else {
      setPaymentCleared(false);
    }
  }

  function handleDetailChange(field: string, val: string) {
    setDetails(prev => ({ ...prev, [field]: val }));
    if (error) setError('');
  }

  function validateStep1(): boolean {
    if (fullName.trim().length < 3) {
      setError('Please enter your full legal name (at least 3 characters).');
      return false;
    }
    if (!/^(\+234|0)[789][01]\d{8}$/.test(phone.trim())) {
      setError('Please enter a valid Nigerian mobile phone number (e.g. 08012345678).');
      return false;
    }
    if (!ward) {
      setError('Please select your administrative ward in Jahun LGA.');
      return false;
    }
    setError('');
    return true;
  }

  function validateStep2(): boolean {
    if (!service) return false;
    for (const field of service.fields) {
      const val = details[field]?.trim() || '';
      if (!field.includes('optional') && !val) {
        setError(`Please provide "${field}".`);
        return false;
      }
      if ((field.includes('NIN') || field === 'BVN') && !/^\d{11}$/.test(val)) {
        setError(`${field} must contain exactly 11 digits.`);
        return false;
      }
      if (field === 'Account number' && !/^\d{10}$/.test(val)) {
        setError('Account number must contain exactly 10 digits.');
        return false;
      }
      if (field === 'Member count' && (!/^\d+$/.test(val) || Number(val) < 2)) {
        setError('Member count must be at least 2 members.');
        return false;
      }
      if (field === 'Date of birth') {
        const parsed = Date.parse(val);
        if (isNaN(parsed) || new Date(val) >= new Date()) {
          setError('Please select a valid past date of birth.');
          return false;
        }
      }
    }

    const requiresDocument = 'document' in service && (service.id === 'indigene' || service.id === 'bursary' || service.id === 'contractor');
    if (requiresDocument && !file) {
      setError(`Please upload the required supporting document (${service.document}).`);
      return false;
    }

    setError('');
    return true;
  }

  function validateStep3(): boolean {
    if (!service) return false;
    if (service.fee > 0 && !paymentCleared) {
      setError('Please complete payment into the Local Government Treasury Single Account (TSA) before proceeding.');
      return false;
    }
    setError('');
    return true;
  }

  // Handle simulated TSA Payment Clearance
  async function handleSimulateTsaPayment() {
    if (!service) return;
    setError('');

    if (paymentMethod === 'card') {
      const cleanedCard = cardNumber.replace(/\s+/g, '');
      if (cleanedCard.length < 12) {
        setError('Please enter a valid debit card number.');
        return;
      }
      if (!cardExpiry) {
        setError('Please enter card expiry date (MM/YY).');
        return;
      }
      if (cardCvv.length < 3) {
        setError('Please enter 3-digit CVV.');
        return;
      }
    }

    setPaymentProcessing(true);
    // Simulate real-world gateway settlement with Treasury Single Account clearance
    await new Promise(r => setTimeout(r, 1400));
    setPaymentProcessing(false);
    setPaymentCleared(true);
    setError('');
  }

  function copyTSAAccountNumber() {
    navigator.clipboard.writeText(councilTSADetails.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Please acknowledge the legal declaration and consent to council verification.');
      return;
    }

    if (!service || !user) return;

    if (service.fee > 0 && !paymentCleared) {
      setError('Treasury Single Account (TSA) clearance is required before certificate issuance.');
      setStep(3);
      return;
    }

    const candidate = {
      service: service.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      ward,
      details: {
        ...details,
        'Payment Status': 'PAID - TREASURY CLEARED',
        'TSA Reference': tsaReference,
        'Amount Paid': service.feeFormatted,
        'Payment Date': new Date().toLocaleDateString('en-GB')
      },
      documentPath: file ? 'pending' : undefined
    };

    const parsed = applicationSchema.safeParse(candidate);
    if (!parsed.success) {
      setError(parsed.error.issues.map(i => i.message).join('. '));
      return;
    }

    setBusy(true);
    try {
      let path: string | undefined;

      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Maximum file upload size is 5MB.');
        }

        const isComplaintImage = service.id === 'complaint';
        if (!isComplaintImage && file.type !== 'application/pdf') {
          throw new Error('Supporting document must be in PDF format.');
        }
        if (isComplaintImage && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error('Photographs must be in JPG, PNG or WebP format.');
        }

        const signature = new Uint8Array(await file.slice(0, 8).arrayBuffer());
        if (!isComplaintImage && String.fromCharCode(...signature.slice(0, 5)) !== '%PDF-') {
          throw new Error('The selected file is not a valid PDF document.');
        }

        const ext = isComplaintImage ? (file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg') : 'pdf';
        path = `${user.id}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage.from('civic-documents').upload(path, file, {
          contentType: file.type
        });

        if (uploadError) {
          throw new Error('Document upload failed. Please try again.');
        }
      }

      const row = await submit({
        data: {
          ...parsed.data,
          documentPath: path
        }
      });

      const issuedPayload = {
        id: row.id,
        serviceId: service.id,
        fullName: fullName.trim(),
        ward,
        details: candidate.details,
        issuedAt: row.created_at || new Date().toISOString(),
        tsaReference,
        amountPaid: service.feeFormatted
      };

      setResult(row.id);
      setIssuedCert(issuedPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please retry.');
    } finally {
      setBusy(false);
    }
  }

  const filteredServices = services.filter(s => {
    const matchesFilter = filter === 'All services' || s.category === filter;
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="space-y-4">
        <div className="service-toolbar flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="service-tabs flex flex-wrap gap-2" role="tablist" aria-label="Service categories">
            {serviceCategories.map(cat => (
              <Button
                key={cat}
                variant="ghost"
                role="tab"
                aria-selected={filter === cat}
                className={filter === cat ? 'tab-current' : ''}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!compact && (
              <div className="relative flex-1 md:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="field pl-9 pr-3 py-1.5 text-xs h-9"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
            {!compact && (
              <Button asChild variant="outline" size="sm" className="h-9 shrink-0">
                <Link to="/applications">
                  <FileText size={14} /> Track application
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="service-grid">
          {filteredServices.map(s => {
            const Icon = s.icon;
            const isIndigene = s.id === 'indigene';
            return (
              <article 
                className={`service-card relative transition-all duration-200 hover:shadow-md ${isIndigene ? 'border-primary/40 bg-gradient-to-b from-card to-secondary/30' : ''}`} 
                key={s.id}
              >
                <div className="flex items-center justify-between">
                  <span className="service-icon">
                    <Icon size={24} />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {s.feeFormatted}
                    </span>
                    <span className="service-tag">{s.category}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground mt-3">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 min-h-11 leading-relaxed">{s.description}</p>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Banknote size={11} className="text-primary" /> TSA Payment & Instant Cert
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 text-xs font-semibold ml-auto text-primary hover:text-primary/80" 
                    onClick={() => open(s.id)}
                  >
                    Apply now <ArrowRight size={14} />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-lg bg-card p-6">
            <Search size={32} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold text-base">No services found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try resetting your category filter or search terms.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setFilter('All services'); setSearchQuery(''); }}>
              View all services
            </Button>
          </div>
        )}
      </div>

      {/* Application Dialog Modal */}
      <Dialog open={selected !== null} onOpenChange={v => { if (!v) setSelected(null); }}>
        <DialogContent className={`max-h-[94vh] overflow-y-auto ${result ? 'sm:max-w-4xl' : 'sm:max-w-2xl'} p-6`}>
          <DialogHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={councilLogo} width={36} height={36} className="h-9 w-9 object-contain shrink-0" alt="Official Seal" />
                <div>
                  <DialogTitle className="text-lg font-bold">{service?.title}</DialogTitle>
                  <DialogDescription className="text-xs">
                    {result ? 'Official Certificate Issued by Executive Chairman' : `Jahun Local Government Council E-Services · ${service?.category}`}
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* 4-Step Stepper Header */}
            {!result && user && (
              <div className="grid grid-cols-4 gap-1.5 mt-4 pt-2 border-t border-border/50 text-[11px]">
                <div className={`flex items-center gap-1.5 p-1.5 rounded ${step === 1 ? 'bg-primary/10 text-primary font-bold' : step > 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${step === 1 ? 'bg-primary text-primary-foreground' : step > 1 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {step > 1 ? <Check size={10} /> : '1'}
                  </span>
                  <span className="truncate">1. Applicant</span>
                </div>

                <div className={`flex items-center gap-1.5 p-1.5 rounded ${step === 2 ? 'bg-primary/10 text-primary font-bold' : step > 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${step === 2 ? 'bg-primary text-primary-foreground' : step > 2 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {step > 2 ? <Check size={10} /> : '2'}
                  </span>
                  <span className="truncate">2. Particulars</span>
                </div>

                {/* Step 3: Second-to-last step (Payment in Local Govt Treasury Single Account) */}
                <div className={`flex items-center gap-1.5 p-1.5 rounded ${step === 3 ? 'bg-primary/10 text-primary font-bold' : step > 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${step === 3 ? 'bg-primary text-primary-foreground' : step > 3 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {step > 3 ? <Check size={10} /> : '3'}
                  </span>
                  <span className="truncate font-semibold">3. TSA Payment</span>
                </div>

                {/* Step 4: Final step (Declaration & Immediate Certificate Issuance) */}
                <div className={`flex items-center gap-1.5 p-1.5 rounded ${step === 4 ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${step === 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    4
                  </span>
                  <span className="truncate">4. Issue Cert</span>
                </div>
              </div>
            )}
          </DialogHeader>

          {/* Certificate View (Immediately Issued Once Submitted) */}
          {result && issuedCert ? (
            <div className="py-2 space-y-4">
              <CouncilCertificate
                applicationId={issuedCert.id}
                serviceId={issuedCert.serviceId}
                fullName={issuedCert.fullName}
                ward={issuedCert.ward}
                details={issuedCert.details}
                issuedAt={issuedCert.issuedAt}
                tsaReference={issuedCert.tsaReference}
                amountPaid={issuedCert.amountPaid}
                onClose={() => setSelected(null)}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border text-xs print:hidden">
                <span className="text-muted-foreground font-mono">
                  Registry Record ID: <strong className="text-foreground">{result}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/applications" onClick={() => setSelected(null)}>
                      <FileText size={14} /> My Applications Desk
                    </Link>
                  </Button>
                  <Button size="sm" onClick={() => setSelected(null)}>
                    Done
                  </Button>
                </div>
              </div>
            </div>
          ) : !user ? (
            <div className="py-8 text-center space-y-4">
              <ShieldCheck size={48} className="mx-auto text-primary" />
              <div>
                <h3 className="text-lg font-bold">Citizen Authentication Required</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                  Sign in or create your free citizen account to make payment into the Treasury Single Account (TSA) and receive your instant council certificate.
                </p>
              </div>
              <Button onClick={() => { setSelected(null); openLogin(); }}>
                Citizen sign in
              </Button>
            </div>
          ) : service && (
            <form onSubmit={handleSubmit} noValidate className="space-y-5 pt-2">
              {/* STEP 1: Applicant Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="p-3 bg-secondary/40 rounded border border-border text-xs text-muted-foreground flex items-start gap-2">
                    <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>Please provide your accurate legal name, mobile number, and ward within Jahun Local Government Area.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="field-label sm:col-span-2">
                      Full legal name
                      <input 
                        className="field" 
                        value={fullName} 
                        onChange={e => { setFullName(e.target.value); setError(''); }}
                        placeholder="e.g. Amina Ibrahim"
                        required 
                        maxLength={100} 
                      />
                    </label>

                    <label className="field-label">
                      Phone number (active)
                      <input 
                        className="field" 
                        value={phone} 
                        onChange={e => { setPhone(e.target.value); setError(''); }}
                        type="tel" 
                        placeholder="08012345678" 
                        required 
                        maxLength={14} 
                      />
                      <span className="text-[10px] text-muted-foreground">Standard 11-digit Nigerian mobile number</span>
                    </label>

                    <label className="field-label">
                      Ward of origin / residence
                      <select 
                        aria-label="Ward" 
                        className="field" 
                        value={ward} 
                        onChange={e => { setWard(e.target.value); setError(''); }}
                        required
                      >
                        <option value="" disabled>Select your ward</option>
                        {wards.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <span className="text-[10px] text-muted-foreground">11 administrative wards of Jahun LGA</span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 2: Service-Specific Fields & Supporting Document Upload */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.fields.map(field => {
                      const isOptional = field.includes('optional');
                      const isFullWidth = field === 'Description' || field === 'Executive committee details' || 
                        field === 'Tooling needs' || field === 'Past job references' || field === 'Premises address';
                      const value = details[field] || '';

                      return (
                        <label 
                          key={field} 
                          className={`field-label ${isFullWidth ? 'sm:col-span-2' : ''}`}
                        >
                          <span className="flex items-center justify-between">
                            <span>{field}</span>
                            {isOptional && <span className="text-[10px] text-muted-foreground font-normal">Optional</span>}
                          </span>

                          {field === 'Trade category' ? (
                            <select 
                              className="field" 
                              value={value} 
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            >
                              <option value="" disabled>Select trade category</option>
                              {tradeCategories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field === 'Public works category' ? (
                            <select 
                              className="field" 
                              value={value} 
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            >
                              <option value="" disabled>Select procurement category</option>
                              {publicWorksCategories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field === 'Skill category' ? (
                            <select 
                              className="field" 
                              value={value} 
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            >
                              <option value="" disabled>Select vocation / trade</option>
                              {skillCategories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field === 'Certification status' ? (
                            <select 
                              className="field" 
                              value={value} 
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            >
                              <option value="" disabled>Select certification level</option>
                              {certificationStatuses.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field === 'Year of study' ? (
                            <select 
                              className="field" 
                              value={value} 
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            >
                              <option value="" disabled>Select current academic year</option>
                              {yearsOfStudy.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field === 'Complaint category' ? (
                            <select 
                              className="field" 
                              value={value} 
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            >
                              <option value="" disabled>Select complaint category</option>
                              {complaintCategories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field === 'Purpose of certificate' ? (
                            <select 
                              className="field" 
                              value={value} 
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            >
                              <option value="" disabled>Select official purpose</option>
                              {indigenePurposes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field === 'Bank name' ? (
                            <select 
                              className="field" 
                              value={value} 
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            >
                              <option value="" disabled>Select bank</option>
                              {nigerianBanks.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field === 'Date of birth' ? (
                            <input 
                              type="date"
                              className="field"
                              value={value}
                              max={new Date().toISOString().split('T')[0]}
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            />
                          ) : isFullWidth ? (
                            <textarea 
                              className="field min-h-20"
                              value={value}
                              maxLength={1500}
                              placeholder={`Enter details for ${field}...`}
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            />
                          ) : (
                            <input 
                              type={field.includes('NIN') || field === 'BVN' || field === 'Account number' || field === 'Member count' ? 'number' : 'text'}
                              className="field"
                              value={value}
                              placeholder={
                                field.includes('NIN') || field === 'BVN' ? '11-digit numeric identifier' :
                                field === 'Account number' ? '10-digit NUBAN number' :
                                field === 'CAC RC number' ? 'e.g. RC-123456' :
                                `Enter ${field}`
                              }
                              maxLength={
                                field.includes('NIN') || field === 'BVN' ? 11 :
                                field === 'Account number' ? 10 : 1500
                              }
                              onChange={e => handleDetailChange(field, e.target.value)}
                              required={!isOptional}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Document upload inside Step 2 */}
                  {'document' in service && (
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      <span className="field-label">
                        {service.document}
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {service.id === 'complaint' ? 'JPG, PNG or WebP · Up to 5MB' : 'PDF Document only · Up to 5MB'}
                        </span>
                      </span>

                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center bg-card hover:bg-secondary/20 transition-colors">
                        <input
                          id={fileInputId}
                          type="file"
                          className="hidden"
                          accept={service.id === 'complaint' ? 'image/jpeg,image/png,image/webp' : 'application/pdf'}
                          onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) {
                              if (f.size > 5 * 1024 * 1024) {
                                setError('File exceeds 5MB maximum allowed size.');
                                return;
                              }
                              setFile(f);
                              setError('');
                            }
                          }}
                        />

                        {file ? (
                          <div className="flex items-center justify-between p-2.5 bg-secondary rounded border border-border">
                            <div className="flex items-center gap-3 overflow-hidden text-left">
                              <FileText size={20} className="text-primary shrink-0" />
                              <div className="overflow-hidden">
                                <p className="text-xs font-semibold truncate text-foreground">{file.name}</p>
                                <p className="text-[10px] text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={() => setFile(null)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <label htmlFor={fileInputId} className="cursor-pointer block py-1.5">
                            <Upload size={24} className="mx-auto text-primary mb-1.5 opacity-80" />
                            <p className="text-xs font-semibold text-foreground">Click to attach supporting document</p>
                            <p className="text-[10px] text-muted-foreground">
                              {service.id === 'complaint' ? 'Select photo evidence' : 'Select verified PDF certificate'}
                            </p>
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: SECOND-TO-THE-LAST STEP - Local Govt Treasury Single Account (TSA) Payment */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Council TSA Banner */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/60 to-primary/5 border border-primary/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wide">
                          <Building2 size={15} /> Jahun Local Government Council
                        </div>
                        <h4 className="text-base font-bold text-foreground mt-0.5">
                          Treasury Single Account (TSA) Payment
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {service.feeTitle}
                        </p>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Statutory Due</span>
                        <span className="text-xl font-bold font-mono text-primary">{service.feeFormatted}</span>
                      </div>
                    </div>
                  </div>

                  {/* If fee is 0 (Bursary or Complaint) */}
                  {service.fee === 0 ? (
                    <div className="p-5 rounded-lg border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-300">
                          100% Council Subsidized Civic Service
                        </h4>
                        <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mt-1 max-w-md mx-auto">
                          This civic service is fully subsidized under the Executive Chairman’s civic welfare initiative. Statutory TSA charges are waived for all bonafide indigenes of Jahun LGA.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-semibold">
                        TSA Clearance Code: {tsaReference}
                      </div>
                    </div>
                  ) : paymentCleared ? (
                    /* Cleared TSA State */
                    <div className="p-5 rounded-lg border-2 border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 size={30} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          TSA Payment Cleared & Verified
                        </span>
                        <h4 className="text-base font-bold text-foreground mt-2">
                          Credited into Jahun LGA Treasury Single Account
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Official electronic payment e-receipt has been generated and sealed.
                        </p>
                      </div>

                      <div className="p-3 rounded bg-white dark:bg-card border border-emerald-300 dark:border-emerald-800/50 max-w-sm mx-auto text-left text-xs font-mono space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">TSA Ref:</span>
                          <strong className="text-primary">{tsaReference}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount Credited:</span>
                          <strong>{service.feeFormatted}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">TSA Account:</span>
                          <span>{councilTSADetails.accountNumber}</span>
                        </div>
                      </div>

                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                        ✓ Proceed to the final step to submit and immediately print your official Chairman’s Certificate.
                      </p>
                    </div>
                  ) : (
                    /* Interactive TSA Payment Mode */
                    <div className="space-y-4">
                      {/* Payment Method Switcher */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                            paymentMethod === 'card' 
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs' 
                              : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
                          }`}
                          onClick={() => setPaymentMethod('card')}
                        >
                          <CreditCard size={18} />
                          <div>
                            <div>Instant Online TSA Card</div>
                            <span className="text-[10px] opacity-75 font-normal">Debit Card / Remita / USSD</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                            paymentMethod === 'transfer' 
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs' 
                              : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
                          }`}
                          onClick={() => setPaymentMethod('transfer')}
                        >
                          <Building2 size={18} />
                          <div>
                            <div>Direct TSA Bank Transfer</div>
                            <span className="text-[10px] opacity-75 font-normal">Single Account Transfer</span>
                          </div>
                        </button>
                      </div>

                      {/* Official Council TSA Bank Details Display */}
                      <div className="p-4 rounded-lg bg-secondary/60 border border-border text-xs space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-border/60">
                          <span className="font-semibold text-foreground">Designated Council Treasury Single Account (TSA):</span>
                          <span className="text-[10px] font-mono text-muted-foreground">Billing Code: {councilTSADetails.billerCode}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                          <div>
                            <span className="text-[11px] block">Beneficiary Name:</span>
                            <strong className="text-foreground">{councilTSADetails.accountName}</strong>
                          </div>
                          <div>
                            <span className="text-[11px] block">Designated Bank:</span>
                            <strong className="text-foreground">{councilTSADetails.bankName}</strong>
                          </div>
                          <div>
                            <span className="text-[11px] block">TSA NUBAN Account No:</span>
                            <div className="flex items-center gap-2">
                              <strong className="text-primary font-mono text-sm">{councilTSADetails.accountNumber}</strong>
                              <button
                                type="button"
                                onClick={copyTSAAccountNumber}
                                className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1 border rounded px-1.5 py-0.5 bg-card"
                              >
                                {copiedAccount ? <Check size={11} className="text-primary" /> : <Copy size={11} />}
                                {copiedAccount ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] block">TSA Mandate Reference (RRR):</span>
                            <strong className="text-foreground font-mono">{tsaReference}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Card Input Mode */}
                      {paymentMethod === 'card' && (
                        <div className="p-4 rounded-lg border border-border bg-card space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">Enter Debit Card for TSA Settlement:</span>
                            <span className="text-[10px] text-muted-foreground">Supports Verve, Mastercard & Visa</span>
                          </div>

                          <div className="space-y-3">
                            <label className="field-label">
                              Card Number
                              <input
                                className="field font-mono"
                                placeholder="5399 •••• •••• 1234"
                                maxLength={19}
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                              />
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                              <label className="field-label">
                                Expiry Date
                                <input
                                  className="field font-mono"
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={e => setCardExpiry(e.target.value)}
                                />
                              </label>

                              <label className="field-label">
                                CVV / Security Code
                                <input
                                  className="field font-mono"
                                  placeholder="123"
                                  maxLength={4}
                                  type="password"
                                  value={cardCvv}
                                  onChange={e => setCardCvv(e.target.value)}
                                />
                              </label>
                            </div>

                            <Button
                              type="button"
                              className="w-full gap-2 mt-2 h-10 font-bold bg-primary text-primary-foreground"
                              disabled={paymentProcessing}
                              onClick={handleSimulateTsaPayment}
                            >
                              {paymentProcessing ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  Settling {service.feeFormatted} into Council TSA...
                                </>
                              ) : (
                                <>
                                  <CreditCard size={16} />
                                  Pay {service.feeFormatted} into Council TSA
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Transfer Mode */}
                      {paymentMethod === 'transfer' && (
                        <div className="p-4 rounded-lg border border-border bg-card space-y-3 text-xs">
                          <div className="flex items-start gap-2 text-muted-foreground">
                            <AlertCircle size={16} className="text-primary shrink-0 mt-0.5" />
                            <span>
                              Make a bank transfer of <strong>{service.feeFormatted}</strong> from your banking app to the TSA Account Number above, quoting reference <code>{tsaReference}</code> in remarks.
                            </span>
                          </div>

                          <Button
                            type="button"
                            className="w-full gap-2 mt-2 h-10 font-bold"
                            disabled={paymentProcessing}
                            onClick={handleSimulateTsaPayment}
                          >
                            {paymentProcessing ? (
                              <>
                                <Loader2 size={16} className="animate-spin" /> Verifying TSA Credit...
                              </>
                            ) : (
                              <>
                                <Check size={16} /> I Have Completed Transfer to Council TSA
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: FINAL STEP - Summary, Attestation & Immediate Certificate Issuance */}
              {step === 4 && (
                <div className="space-y-4">
                  {/* Summary Box */}
                  <div className="p-4 bg-secondary/50 rounded-lg border border-border text-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="font-bold text-foreground">Registration Summary</span>
                      <span className="text-[10px] text-muted-foreground font-mono">Service: {service.title}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-muted-foreground">
                      <div><strong className="text-foreground">Full Name:</strong> {fullName}</div>
                      <div><strong className="text-foreground">Ward:</strong> {ward} Ward</div>
                      <div><strong className="text-foreground">Phone:</strong> {phone}</div>
                      <div><strong className="text-foreground">Document:</strong> {file ? file.name : 'Verified on record'}</div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                      <span className="flex items-center gap-1 font-semibold">
                        <CheckCircle2 size={14} /> Treasury Single Account (TSA) Clearance:
                      </span>
                      <span className="font-mono font-bold">{tsaReference} ({service.feeFormatted})</span>
                    </div>
                  </div>

                  {/* Immediate Issuance Notice */}
                  <div className="p-3.5 rounded-lg border border-primary/30 bg-primary/5 text-xs flex items-start gap-2.5">
                    <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">Immediate Certificate Issuance with Chairman’s Seal</strong>
                      <span className="text-muted-foreground mt-0.5 block leading-relaxed">
                        Upon final submission, your official council certificate bearing the calligraphic signature and official seal of the Executive Chairman, Hon. Jamilu Muhammad Danmalam, will be generated and issued immediately with a live verification QR code.
                      </span>
                    </div>
                  </div>

                  {/* Attestation declaration */}
                  <label className="flex items-start gap-2.5 text-xs text-muted-foreground p-3.5 bg-card border rounded-md cursor-pointer hover:bg-secondary/20 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={consent}
                      onChange={e => { setConsent(e.target.checked); if (error) setError(''); }}
                      className="mt-0.5 rounded border-input" 
                    />
                    <span className="leading-relaxed">
                      I solemnly certify and declare under statutory oath that all personal details and documents provided are genuine and accurate, and I confirm the settlement of statutory dues into the Jahun Local Government Council Treasury Single Account (TSA).
                    </span>
                  </label>
                </div>
              )}

              {/* Error banner */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded text-xs border border-destructive/20" role="alert">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Wizard navigation buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                {step > 1 ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => { setStep(step - 1); setError(''); }}>
                    Back
                  </Button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  {step < 4 ? (
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={() => {
                        if (step === 1 && validateStep1()) {
                          setStep(2);
                        } else if (step === 2 && validateStep2()) {
                          setStep(3);
                        } else if (step === 3 && validateStep3()) {
                          setStep(4);
                        }
                      }}
                    >
                      {step === 2 ? 'Proceed to TSA Payment' : 'Continue'} <ArrowRight size={14} />
                    </Button>
                  ) : (
                    <Button type="submit" size="sm" disabled={busy} className="gap-2 bg-primary text-primary-foreground font-semibold">
                      {busy ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Issuing Official Certificate...
                        </>
                      ) : (
                        <>
                          <FileBadge size={14} /> Submit & Issue Certificate
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
