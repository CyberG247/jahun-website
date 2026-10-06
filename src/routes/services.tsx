import { createFileRoute } from '@tanstack/react-router';
import { PageIntro } from '@/components/portal-shell';
import { ServicesHub } from '@/components/services-hub';
import { pageHead } from '@/lib/portal-data';
export const Route=createFileRoute('/services')({head:()=>pageHead('Citizen E-Services','Apply for business registration, student bursaries, cooperative enrollment and civic services in Jahun.'),component:Services});
function Services(){return <main id="main"><PageIntro eyebrow="JAHUN DIGITAL DESK" title="Citizen E-Services" description="Access your council services, submit your documents securely and follow your application’s progress."/><section className="site-width page-body"><ServicesHub/></section></main>}
