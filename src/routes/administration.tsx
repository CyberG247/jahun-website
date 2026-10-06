import { createFileRoute } from '@tanstack/react-router';
import { PageIntro } from '@/components/portal-shell';
import { ChairmanMessage } from '@/components/chairman-message';
import { pageHead } from '@/lib/portal-data';
export const Route=createFileRoute('/administration')({head:()=>pageHead('Council administration','A welcome from Hon. Jamilu Muhammad Danmalam, Executive Chairman of Jahun Local Government Council.'),component:Administration});
function Administration(){return <main id="main"><PageIntro eyebrow="LEADERSHIP & PUBLIC SERVICE" title="Our administration" description="Dedicated to transparent grassroots governance and the wellbeing of every community in Jahun."/><section className="site-width page-body"><ChairmanMessage full/></section></main>}
