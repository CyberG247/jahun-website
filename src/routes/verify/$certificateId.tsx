import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShieldCheck, ShieldX, Printer, CheckCircle2 } from 'lucide-react';
import { PageIntro } from '@/components/portal-shell';
import { pageHead, services } from '@/lib/portal-data';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import councilLogo from '@/assets/jahun-council-logo.png';

export const Route = createFileRoute('/verify/$certificateId')({
  head: () => pageHead(
    'Verify a certificate',
    'Check the official authenticity of a council-issued Jahun certificate of origin or business premises registration.'
  ),
  component: Verify
});

interface CertDisplayData {
  id: string;
  recipientName: string;
  ward: string;
  issuedAt: string;
  certType: string;
}

function Verify() {
  const { certificateId } = Route.useParams();
  const [qr, setQr] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.origin + '/verify/' + encodeURIComponent(certificateId), {
        width: 160,
        margin: 1
      }).then(setQr).catch(() => setQr(''));
    }
  }, [certificateId]);

  const query = useQuery({
    queryKey: ['certificate-verify', certificateId],
    queryFn: async (): Promise<CertDisplayData | null> => {
      if (!z.string().uuid().safeParse(certificateId).success) return null;

      // 1. Try public certificates table
      const { data: cert, error: certError } = await supabase
        .from('certificates')
        .select('id, business_name, ward, issued_at')
        .eq('id', certificateId)
        .maybeSingle();

      if (cert) {
        return {
          id: cert.id,
          recipientName: cert.business_name,
          ward: cert.ward,
          issuedAt: cert.issued_at,
          certType: 'Business Premises Registration Certificate'
        };
      }

      // 2. Try service_applications table (accessible for authenticated citizen / desk officer)
      const { data: appData } = await supabase
        .from('service_applications')
        .select('id, full_name, ward, created_at, status, service, details')
        .eq('id', certificateId)
        .maybeSingle();

      if (appData) {
        const details = (appData.details || {}) as Record<string, string>;
        const isPaid = details['Payment Status']?.includes('PAID') || appData.status === 'APPROVED' || appData.status === 'Approved for Disbursement' || appData.status === 'Application Submitted';
        
        if (isPaid) {
          const serviceMatch = services.find(s => s.id === appData.service);
          return {
            id: appData.id,
            recipientName: appData.full_name,
            ward: appData.ward,
            issuedAt: appData.created_at,
            certType: serviceMatch?.certificateTitle || 'Certificate of Local Government Registration'
          };
        }
      }

      if (certError) throw certError;
      return null;
    }
  });

  return (
    <main id="main">
      <PageIntro 
        eyebrow="COUNCIL AUTHENTICITY VERIFICATION" 
        title="Certificate verification" 
        description="Public authenticity check for certificates formally issued by Jahun Local Government Council, Jigawa State."
      />

      <section className="site-width page-body text-center">
        {query.isPending ? (
          <div className="py-12 text-sm text-muted-foreground">
            Verifying certificate against council records...
          </div>
        ) : query.isError ? (
          <div className="py-10 max-w-md mx-auto space-y-3">
            <ShieldX className="mx-auto text-destructive" size={44} />
            <p role="alert" className="text-sm text-destructive font-medium">
              Verification service is temporarily unavailable. Please retry.
            </p>
            <Button variant="outline" size="sm" onClick={() => query.refetch()}>
              Try again
            </Button>
          </div>
        ) : query.data ? (
          <div className="max-w-xl mx-auto p-8 rounded-xl border border-primary/30 bg-card shadow-sm text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={councilLogo} 
                width={84} 
                height={84} 
                className="w-20 h-20 object-contain drop-shadow-xs" 
                alt="Official Seal of Jahun Local Government Council" 
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <CheckCircle2 size={14} /> Officially Authenticated by Council
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {query.data.certType}
            </h2>

            <div className="p-4 rounded-lg bg-secondary/50 border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Issued to / Enterprise:</span>
                <strong className="text-foreground text-sm font-semibold">{query.data.recipientName}</strong>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Ward / Administrative Area:</span>
                <span className="text-foreground font-medium">{query.data.ward} Ward, Jahun LGA</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Jurisdiction:</span>
                <span className="text-foreground">Jigawa State, Federal Republic of Nigeria</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Date of Issuance:</span>
                <span className="text-foreground font-medium">
                  {new Date(query.data.issuedAt).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-mono text-[11px]">
                <span className="text-muted-foreground">Reference:</span>
                <span className="text-primary font-bold break-all">{query.data.id}</span>
              </div>
            </div>

            {qr && (
              <div className="pt-2">
                <img 
                  src={qr} 
                  width={140} 
                  height={140} 
                  alt="Certificate verification QR code" 
                  className="mx-auto border p-2 rounded-lg bg-white shadow-2xs" 
                />
                <span className="text-[10px] text-muted-foreground mt-1.5 block">
                  Scan QR code on any device to verify this authentic council record
                </span>
              </div>
            )}

            <div className="pt-3 flex justify-center gap-3 print:hidden">
              <Button onClick={() => window.print()} className="gap-2">
                <Printer size={15} /> Print verification record
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto p-8 rounded-lg border border-destructive/20 bg-card shadow-sm space-y-4">
            <ShieldX className="mx-auto text-destructive" size={48} />
            <h2 className="text-xl font-bold text-foreground">Certificate Not Found</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The reference number <code>{certificateId}</code> does not match any valid, approved certificate issued by Jahun Local Government Council. It may be revoked, incorrect, or undergoing verification.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <a href="/services">Go to E-Services</a>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
