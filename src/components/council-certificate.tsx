import { useEffect, useState } from 'react';
import { Printer, CheckCircle2, ShieldCheck, Download, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services, councilTSADetails, type ServiceId } from '@/lib/portal-data';
import councilLogo from '@/assets/jahun-council-logo.png';
import QRCode from 'qrcode';

export interface CouncilCertificateProps {
  applicationId: string;
  serviceId: ServiceId | string;
  fullName: string;
  ward: string;
  details?: Record<string, string>;
  issuedAt?: string;
  tsaReference?: string;
  amountPaid?: string;
  onClose?: () => void;
  showPrintButton?: boolean;
}

export function CouncilCertificate({
  applicationId,
  serviceId,
  fullName,
  ward,
  details = {},
  issuedAt = new Date().toISOString(),
  tsaReference,
  amountPaid,
  onClose,
  showPrintButton = true
}: CouncilCertificateProps) {
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const service = services.find(s => s.id === serviceId);
  const certTitle = service?.certificateTitle || 'Certificate of Local Government Registration';
  const certSubtitle = service?.certificateSubtitle || 'Office of the Executive Chairman · Jahun Local Government Council';

  const effectiveTsaRef = tsaReference || details['TSA Reference'] || details['TSA Clearance Code'] || `TSA-JLG-${applicationId.slice(0, 8).toUpperCase()}`;
  const effectiveAmount = amountPaid || details['Amount Paid'] || service?.feeFormatted || '₦2,500.00';
  const certNumber = details['Certificate Number'] || `JLG/CERT/2026/${applicationId.slice(0, 8).toUpperCase()}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verifyUrl = `${window.location.origin}/verify/${applicationId}`;
      QRCode.toDataURL(verifyUrl, {
        width: 150,
        margin: 1,
        color: {
          dark: '#144e33',
          light: '#ffffff'
        }
      })
        .then(setQrCodeData)
        .catch(() => setQrCodeData(''));
    }
  }, [applicationId]);

  function copyCertNumber() {
    navigator.clipboard.writeText(certNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Action bar (hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/50 rounded-lg border border-border text-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-semibold text-foreground">
            Official Council Certificate Issued & Certified
          </span>
          <span className="text-muted-foreground hidden sm:inline">
            · TSA Payment Cleared
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={copyCertNumber}
          >
            {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy Cert No.'}
          </Button>

          {showPrintButton && (
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground font-semibold shadow-xs"
              onClick={() => window.print()}
            >
              <Printer size={14} /> Print Certificate
            </Button>
          )}

          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="council-certificate-document relative border-8 border-double border-primary/50 bg-[#fffdf8] dark:bg-card text-foreground p-6 sm:p-10 rounded-sm shadow-md print:border-4 print:p-6 print:shadow-none print:m-0">
        {/* Subtle Ornamental Corner Accents */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary/60 pointer-events-none" />

        {/* Watermark in center background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <img src={councilLogo} alt="" className="w-96 h-96 object-contain" />
        </div>

        {/* Certificate Header with Official Council Crest */}
        <div className="text-center relative z-10 space-y-1.5">
          <div className="flex justify-center mb-2">
            <div className="relative p-1 rounded-full bg-white shadow-xs border border-primary/20">
              <img
                src={councilLogo}
                alt="Seal of Jahun Local Government Council"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto"
              />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-serif uppercase tracking-wider text-primary">
            Jahun Local Government Council
          </h1>
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-muted-foreground font-sans">
            Jigawa State · Federal Republic of Nigeria
          </h2>
          <p className="text-[11px] font-sans font-bold tracking-widest text-primary/90 uppercase pt-0.5">
            {certSubtitle}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-0.5 w-16 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="w-2 h-2 rotate-45 bg-primary/60" />
            <span className="h-0.5 w-16 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>

        {/* Certificate Title Badge */}
        <div className="mt-5 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded bg-primary/10 border border-primary/30">
            <h3 className="text-base sm:text-lg font-bold font-serif tracking-wide text-primary uppercase">
              {certTitle}
            </h3>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
            <span>
              Cert No: <strong className="text-foreground">{certNumber}</strong>
            </span>
            <span>·</span>
            <span>
              Issued: <strong className="text-foreground">{new Date(issuedAt).toLocaleDateString('en-GB')}</strong>
            </span>
          </div>
        </div>

        {/* Preamble & Bearer Declaration */}
        <div className="mt-6 text-sm sm:text-base leading-relaxed text-center sm:text-left space-y-4 max-w-2xl mx-auto font-sans relative z-10">
          <p className="text-justify leading-relaxed">
            This is to officially certify that <strong className="text-primary font-serif uppercase tracking-wide text-base">{fullName}</strong> of{' '}
            <strong className="text-foreground">{ward} Ward</strong>, Jahun Local Government Area, Jigawa State, having fulfilled all statutory council registration requisites and settled mandatory assessment levies into the <strong>Local Government Treasury Single Account (TSA)</strong>, is hereby duly issued this official statutory certificate under the seal of the Executive Chairman.
          </p>

          {/* Particulars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 p-4 rounded-md bg-white/80 dark:bg-card/80 border border-primary/20 text-xs shadow-2xs">
            <div>
              <span className="text-muted-foreground">Beneficiary / Applicant:</span>{' '}
              <strong className="text-foreground">{fullName}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Administrative Ward:</span>{' '}
              <strong className="text-foreground">{ward} Ward</strong>
            </div>

            {serviceId === 'indigene' && (
              <>
                <div>
                  <span className="text-muted-foreground">Village / Community:</span>{' '}
                  <strong className="text-foreground">{details['Village / Community'] || 'Jahun'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Clan / Family Compound:</span>{' '}
                  <strong className="text-foreground">{details['Family / Compound name'] || '—'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">National ID (NIN):</span>{' '}
                  <strong className="font-mono text-foreground">{details['National Identification Number (NIN)'] || '—'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Father’s Name:</span>{' '}
                  <strong className="text-foreground">{details['Father’s full name'] || '—'}</strong>
                </div>
              </>
            )}

            {serviceId === 'business' && (
              <>
                <div>
                  <span className="text-muted-foreground">Enterprise Name:</span>{' '}
                  <strong className="text-foreground">{details['Business name'] || fullName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Trade Category:</span>{' '}
                  <strong className="text-foreground">{details['Trade category'] || 'Commercial'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Premises Location:</span>{' '}
                  <strong className="text-foreground">{details['Premises address'] || 'Jahun LGA'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner NIN:</span>{' '}
                  <strong className="font-mono text-foreground">{details['Owner NIN'] || '—'}</strong>
                </div>
              </>
            )}

            {serviceId === 'contractor' && (
              <>
                <div>
                  <span className="text-muted-foreground">Company Name:</span>{' '}
                  <strong className="text-foreground">{details['Company name'] || fullName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">CAC RC Number:</span>{' '}
                  <strong className="font-mono text-foreground">{details['CAC RC number'] || '—'}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Works Category:</span>{' '}
                  <strong className="text-foreground">{details['Public works category'] || 'Civil Engineering'}</strong>
                </div>
              </>
            )}

            {serviceId === 'cooperative' && (
              <>
                <div>
                  <span className="text-muted-foreground">Society Name:</span>{' '}
                  <strong className="text-foreground">{details['Society name'] || fullName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Membership Strength:</span>{' '}
                  <strong className="text-foreground">{details['Member count'] || '—'} Verified Members</strong>
                </div>
              </>
            )}

            {serviceId === 'skills' && (
              <>
                <div>
                  <span className="text-muted-foreground">Vocational Trade:</span>{' '}
                  <strong className="text-foreground">{details['Skill category'] || 'Artisan Trade'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Certification Status:</span>{' '}
                  <strong className="text-foreground">{details['Certification status'] || 'Practicing Craftsman'}</strong>
                </div>
              </>
            )}

            {serviceId === 'bursary' && (
              <>
                <div>
                  <span className="text-muted-foreground">Tertiary Institution:</span>{' '}
                  <strong className="text-foreground">{details['Institution name'] || '—'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Course / Matric:</span>{' '}
                  <strong className="text-foreground">{details['Course of study'] || '—'} ({details['Matriculation number'] || '—'})</strong>
                </div>
              </>
            )}

            {serviceId === 'complaint' && (
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Ombudsman Matter:</span>{' '}
                <strong className="text-foreground">{details['Complaint category'] || 'Public Civic Infrastructure'}</strong>
              </div>
            )}
          </div>

          {/* Treasury Single Account (TSA) Clearance Bar */}
          <div className="p-3 rounded bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-300">
                  Treasury Single Account (TSA) Clearance:
                </span>{' '}
                <span className="text-emerald-800 dark:text-emerald-400 font-mono">
                  {effectiveTsaRef}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-800 dark:text-emerald-400 sm:text-right">
              <span>Amount: <strong>{effectiveAmount}</strong></span> · 
              <span className="font-semibold text-emerald-900 dark:text-emerald-300"> CLEARED TO REVENUE POOL</span>
            </div>
          </div>
        </div>

        {/* Official Signatures, Seal of Executive Chairman, and QR Code */}
        <div className="mt-8 pt-6 border-t-2 border-primary/20 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 text-xs font-sans relative z-10">
          {/* Verification QR Code */}
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            {qrCodeData ? (
              <div className="p-1.5 border border-primary/30 rounded bg-white shadow-2xs">
                <img
                  src={qrCodeData}
                  alt="QR Verification"
                  className="w-24 h-24 object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 border border-dashed rounded flex items-center justify-center text-[10px] text-muted-foreground">
                QR Code
              </div>
            )}
            <span className="text-[10px] text-muted-foreground mt-1">
              Scan to verify authentic council record
            </span>
          </div>

          {/* Official Sign & Seal of the Local Government Chairman */}
          <div className="text-center order-first sm:order-none space-y-2">
            {/* The Chairman's Official Council Seal Stamp */}
            <div className="mx-auto w-24 h-24 rounded-full border-2 border-amber-600/80 bg-gradient-to-b from-amber-100/60 to-emerald-100/40 dark:from-amber-900/20 dark:to-emerald-900/20 p-1 flex flex-col items-center justify-center text-center shadow-xs relative">
              <img
                src={councilLogo}
                alt="Chairman Seal"
                className="w-9 h-9 object-contain opacity-90"
              />
              <span className="text-[7px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-tighter leading-none mt-0.5">
                OFFICIAL SEAL
              </span>
              <span className="text-[6.5px] font-semibold text-emerald-900 dark:text-emerald-400 uppercase tracking-tighter leading-none">
                EXECUTIVE CHAIRMAN
              </span>
            </div>

            {/* Calligraphic Signature */}
            <div className="border-b border-foreground/50 pb-1 max-w-[200px] mx-auto font-serif italic text-base sm:text-lg font-bold text-primary tracking-wide">
              Hon. Jamilu M. Danmalam
            </div>

            <div>
              <strong className="block text-xs text-foreground font-bold">
                Hon. Jamilu Muhammad Danmalam
              </strong>
              <span className="text-[10px] text-muted-foreground block font-medium">
                Executive Chairman, Jahun LGA
              </span>
              <span className="text-[9px] text-muted-foreground/80 block">
                Jigawa State, Nigeria
              </span>
            </div>
          </div>

          {/* Council Secretariat Endorsement */}
          <div className="text-center sm:text-right space-y-2">
            <div className="h-10 flex items-end justify-center sm:justify-end pb-1">
              <span className="font-serif italic text-sm text-primary/80 border-b border-foreground/50 pb-0.5 px-4">
                Secretariat Reg. 2026
              </span>
            </div>

            <div>
              <strong className="block text-xs text-foreground font-bold">
                Office of Council Secretary
              </strong>
              <span className="text-[10px] text-muted-foreground block font-medium">
                Secretary to the Local Government
              </span>
              <span className="text-[9px] text-muted-foreground/80 block">
                Jahun Council Secretariat
              </span>
            </div>
          </div>
        </div>

        {/* Footer Security Watermark */}
        <div className="mt-8 pt-3 border-t border-border/60 text-center text-[10px] text-muted-foreground font-sans relative z-10 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>
            JLG TSA Account: {councilTSADetails.accountNumber} ({councilTSADetails.bankName})
          </span>
          <span>
            Digitally certified & protected under Jahun Local Government Council Administration Act
          </span>
        </div>
      </div>
    </div>
  );
}
