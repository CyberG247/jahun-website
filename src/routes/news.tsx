import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FileText } from 'lucide-react';
import { PageIntro } from '@/components/portal-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/portal-data';
export const Route=createFileRoute('/news')({head:()=>pageHead('News & public gazette','Council notices, project updates and verified public gazette publications from Jahun.'),component:News});
function News(){const[tab,setTab]=useState('All updates');return <main id="main"><PageIntro eyebrow="OPEN & ACCOUNTABLE GOVERNANCE" title="News & public gazette" description="Council notices, public works updates and official publications."/><section className="site-width page-body"><div className="service-tabs">{['All updates','Council projects','Public notices','Gazette'].map(t=><Button variant="ghost" key={t} className={t===tab?'tab-current':''} onClick={()=>setTab(t)}>{t}</Button>)}</div><div className="py-20 text-center"><FileText className="mx-auto text-primary mb-5" size={35}/><h2 className="text-xl font-semibold">{tab==='All updates'?'Official publications':tab}</h2><p className="mt-3 text-muted-foreground text-sm">No verified publications have been posted yet.</p></div></section></main>}
