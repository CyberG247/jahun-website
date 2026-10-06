import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, FileText, Search, FileBadge, ArrowUpRight, 
  Printer, ChevronDown, ChevronUp, ShieldCheck, Download, AlertCircle, X 
} from 'lucide-react';
import { PageIntro } from '@/components/portal-shell';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { usePortalAuth } from '@/components/portal-auth';
import { pageHead, services } from '@/lib/portal-data';
import { getApplications, getDocumentLink } from '@/lib/services.functions';
import { CouncilCertificate } from '@/components/council-certificate';

export const Route = createFileRoute('/applications')({
  head: () => pageHead('My applications', 'Securely track your Jahun civic applications and supporting documents.'),
  component: Applications
});

interface ApplicationRow {
  id: string;
  service: string;
  status: string;
  ward: string;
  created_at: string;
  document_path: string | null;
  full_name: string;
  details: Record<string, string>;
}

function Applications() {
  const { user, openLogin } = usePortalAuth();
  const fetch = useServerFn(getApplications);
  const document = useServerFn(getDocumentLink);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [certApplication, setCertApplication] = useState<ApplicationRow | null>(null);

  const query = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () => fetch(),
    enabled: !!user
  });

  const rawData = (query.data || []) as unknown as ApplicationRow[];

  const filteredData = rawData.filter(row => {
    const matchesSearch = !search.trim() || 
      row.id.toLowerCase().includes(search.trim().toLowerCase()) ||
      row.full_name?.toLowerCase().includes(search.trim().toLowerCase()) ||
      row.ward.toLowerCase().includes(search.trim().toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'APPROVED' && row.status === 'APPROVED') ||
      (statusFilter === 'PENDING' && (row.status === 'Application Submitted' || row.status === 'Under Ward Verification' || row.status === 'INVESTIGATING')) ||
      (statusFilter === 'REJECTED' && row.status === 'REJECTED');

    return matchesSearch && matchesStatus;
  });

  return (
    <main id="main">
      <PageIntro 
        eyebrow="YOUR DIGITAL CIVIC DESK" 
        title="My applications" 
        description="Follow your application’s statutory progress, review submitted particulars, and access council certificates."
      />

      <section className="site-width page-body">
        {!user ? (
          <div className="py-14 text-center max-w-md mx-auto space-y-4">
            <ShieldCheck size={48} className="mx-auto text-primary" />
            <h2 className="text-xl font-bold">Sign in to view your applications</h2>
            <p className="text-sm text-muted-foreground">
              Your applications, verification status, and certificates are securely linked to your citizen account.
            </p>
            <Button onClick={openLogin}>Citizen sign in</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: 'All applications', key: 'ALL' },
                  { label: 'Under review', key: 'PENDING' },
                  { label: 'Approved & issued', key: 'APPROVED' },
                  { label: 'Rejected', key: 'REJECTED' }
                ].map(tab => (
                  <Button
                    key={tab.key}
                    variant="ghost"
                    size="sm"
                    className={statusFilter === tab.key ? 'tab-current' : ''}
                    onClick={() => setStatusFilter(tab.key)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  className="field pl-9 pr-3 py-1.5 text-xs h-9" 
                  placeholder="Find by reference or keyword" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  maxLength={50}
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {query.isPending ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading your applications from the council registry...
              </div>
            ) : query.isError ? (
              <div className="py-10 text-center space-y-3">
                <AlertCircle className="mx-auto text-destructive" size={32} />
                <p role="alert" className="text-sm text-destructive">Unable to load your applications. Please check your connection.</p>
                <Button variant="outline" size="sm" onClick={() => query.refetch()}>Try again</Button>
              </div>
            ) : rawData.length === 0 ? (
              <div className="py-16 text-center border border-dashed rounded-lg bg-card p-8 max-w-lg mx-auto">
                <FileText size={40} className="mx-auto text-muted-foreground mb-3 opacity-60" />
                <h3 className="font-semibold text-base">No applications submitted yet</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  You haven’t submitted any civic applications yet. Apply for an Indigene Certificate, Business Premises, or Student Bursary today.
                </p>
                <Button asChild size="sm" className="mt-5">
                  <Link to="/services">Explore E-Services Hub</Link>
                </Button>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No applications match your current filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredData.map(row => {
                  const serviceConfig = services.find(s => s.id === row.service);
                  const isApproved = row.status === 'APPROVED' || row.status === 'Approved for Disbursement';
                  const isRejected = row.status === 'REJECTED';
                  const isIndigene = row.service === 'indigene';
                  const isBusiness = row.service === 'business';
                  const isExpanded = expandedId === row.id;

                  return (
                    <article className="border border-border rounded-lg bg-card p-6 shadow-xs transition-all hover:border-primary/40" key={row.id}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-md bg-secondary text-primary shrink-0">
                            {serviceConfig?.icon ? <serviceConfig.icon size={22} /> : <FileText size={22} />}
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-foreground">
                              {serviceConfig?.title || row.service}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {row.full_name} · {row.ward} Ward · Submitted {new Date(row.created_at).toLocaleDateString('en-GB')}
                            </p>
                          </div>
                        </div>

                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start sm:self-center ${
                          isApproved ? 'bg-primary/10 text-primary border border-primary/20' :
                          isRejected ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                          'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          <Clock size={12} /> {row.status}
                        </span>
                      </div>

                      {/* Progress workflow bars */}
                      {isIndigene && (
                        <div className="mt-5 pt-4 border-t border-border/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                            Statutory Verification Lifecycle
                          </span>
                          <ol className="flex flex-wrap gap-4 text-xs">
                            {['Application Submitted', 'Under Ward Verification', 'APPROVED'].map((stepName, i) => {
                              const activeIndex = ['Application Submitted', 'Under Ward Verification', 'APPROVED'].indexOf(row.status);
                              const isPastOrCurrent = isApproved ? true : activeIndex >= i;
                              return (
                                <li key={stepName} className={`flex items-center gap-1.5 font-medium ${isPastOrCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                  <CheckCircle2 size={15} className={isPastOrCurrent ? 'text-primary' : 'text-muted-foreground/50'} />
                                  <span>{stepName === 'APPROVED' ? 'Approved & Certified' : stepName}</span>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      )}

                      {row.service === 'bursary' && (
                        <div className="mt-5 pt-4 border-t border-border/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                            Bursary Verification Lifecycle
                          </span>
                          <ol className="flex flex-wrap gap-4 text-xs">
                            {['Application Submitted', 'Under Ward Verification', 'Approved for Disbursement'].map((stepName, i) => {
                              const activeIndex = ['Application Submitted', 'Under Ward Verification', 'Approved for Disbursement'].indexOf(row.status);
                              const isPastOrCurrent = activeIndex >= i;
                              return (
                                <li key={stepName} className={`flex items-center gap-1.5 font-medium ${isPastOrCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                  <CheckCircle2 size={15} className={isPastOrCurrent ? 'text-primary' : 'text-muted-foreground/50'} />
                                  <span>{stepName}</span>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-muted-foreground font-mono text-[11px]">
                          Ref: <span className="text-foreground">{row.id}</span>
                        </span>

                        <div className="flex flex-wrap items-center gap-3">
                          {row.details && Object.keys(row.details).length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => setExpandedId(isExpanded ? null : row.id)}
                            >
                              {isExpanded ? (
                                <>Less details <ChevronUp size={13} /></>
                              ) : (
                                <>View details <ChevronDown size={13} /></>
                              )}
                            </Button>
                          )}

                          {row.document_path && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs gap-1.5"
                              onClick={async () => {
                                try {
                                  const url = await document({ data: { id: row.id } });
                                  window.open(url, '_blank', 'noopener,noreferrer');
                                } catch {
                                  setError('Your document could not be opened. Please retry.');
                                }
                              }}
                            >
                              <FileText size={13} /> Supporting document
                            </Button>
                          )}

                          {/* Certificate issuance actions */}
                          {((row.details && row.details['Payment Status']?.includes('PAID')) || row.status === 'APPROVED' || row.status === 'Approved for Disbursement' || row.status === 'Application Submitted') && (
                            <Button 
                              size="sm" 
                              className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground font-semibold"
                              onClick={() => setCertApplication(row)}
                            >
                              <FileBadge size={14} /> View & print certificate
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Expandable particulars */}
                      {isExpanded && row.details && (
                        <div className="mt-4 p-4 rounded-md bg-secondary/40 border border-border text-xs space-y-2">
                          <span className="font-semibold text-foreground block">Submitted Application Particulars:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-muted-foreground">
                            {Object.entries(row.details).map(([k, v]) => (
                              <div key={k} className="border-b border-border/40 pb-1">
                                <span className="font-medium text-foreground">{k}: </span>
                                <span>{v || '—'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {error && (
              <p role="alert" className="text-destructive text-xs mt-3 flex items-center gap-1.5">
                <AlertCircle size={14} /> {error}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Official Council Certificate Dialog / Printable View */}
      {certApplication && (
        <Dialog open={!!certApplication} onOpenChange={open => { if (!open) setCertApplication(null); }}>
          <DialogContent className="max-h-[96vh] overflow-y-auto sm:max-w-4xl p-6">
            <CouncilCertificate
              applicationId={certApplication.id}
              serviceId={certApplication.service}
              fullName={certApplication.full_name}
              ward={certApplication.ward}
              details={certApplication.details}
              issuedAt={certApplication.created_at}
              onClose={() => setCertApplication(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
