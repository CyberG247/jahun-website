import { Link } from '@tanstack/react-router';
import { ArrowRight,Quote } from 'lucide-react';
import { welcome } from '@/lib/portal-data';
import { Button } from './ui/button';
import councilLogo from '@/assets/jahun-council-logo.png';
import chairmanPhoto from '@/assets/chairman-jamilu-danmalam.jpg';

export function ChairmanMessage({full=false}:{full?:boolean}){
  return (
    <div className="chairman-layout">
      <div className="portrait-placeholder">
        <div className="portrait-frame">
          <img
            src={chairmanPhoto}
            width={683}
            height={1024}
            className="portrait-img"
            alt="Hon. Jamilu Muhammad Danmalam, Executive Chairman of Jahun Local Government Council"
          />
          <div className="portrait-seal-badge">
            <img src={councilLogo} width={20} height={20} alt="" />
            <span>Executive Chairman</span>
          </div>
        </div>
        <div className="portrait-caption">
          <strong>Hon. Jamilu Muhammad Danmalam</strong>
          <span>Executive Chairman, Jahun LGA</span>
        </div>
      </div>
      <div className="chairman-copy">
        <p className="eyebrow"><span/>A MESSAGE FROM THE CHAIRMAN</p>
        <h2>A council that serves.<br/>A community that thrives.</h2>
        <Quote className="quote-icon" size={31}/>
        <blockquote>{full?welcome:'“Peace be upon you all. On behalf of the Jahun Local Government Council, I welcome you to our official civic and digital administration portal. We serve with transparency, equity, and dedication to the people.”'}</blockquote>
        <p className="chairman-signature">Hon. Jamilu Muhammad Danmalam</p>
        <p className="text-sm text-muted-foreground">Executive Chairman, Jahun Local Government Council</p>
        {!full&&<Button asChild variant="link" className="mt-5 p-0"><Link to="/administration">Read the Chairman’s welcome<ArrowRight/></Link></Button>}
      </div>
    </div>
  );
}


