import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  ArrowRight, ArrowUpRight, GraduationCap, Store, MessageSquare, 
  ShieldCheck, MapPin, Users, Leaf, Calendar, Newspaper, FileBadge,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServicesHub } from '@/components/services-hub';
import { ChairmanMessage } from '@/components/chairman-message';
import { pageHead } from '@/lib/portal-data';
import { newsArticles } from '@/lib/news-data';
import fields from '@/assets/jahun-fields.jpg';

export const Route = createFileRoute('/')({
  head: () => pageHead(
    'Jahun LGA — Governance for the people',
    'Welcome to Jahun Local Government Council. Access civic services, explore executive updates from Hon. Jamilu Muhammad Danmalam, and discover our eleven wards.'
  ),
  component: Home
});

function Home() {
  const topNews = newsArticles.slice(0, 3);

  return (
    <main id="main">
      {/* Hero Section */}
      <section className="home-hero">
        <img 
          src={fields} 
          alt="Farmlands in Jahun, Jigawa State" 
          width={1920} 
          height={1024} 
          fetchPriority="high" 
          className="hero-image" 
        />
        <div className="hero-shade" />
        <div className="site-width hero-content">
          <div className="hero-eyebrow">
            <span /> WELCOME TO JAHUN LOCAL GOVERNMENT
          </div>
          <h1>
            Growing together.<br />Governing for <em>you.</em>
          </h1>
          <p>
            Driving sustainable development, agriculture<br className="hidden sm:block" /> and citizen prosperity across our 11 wards.
          </p>
          <div className="hero-actions">
            <Button asChild className="hero-button">
              <Link to="/services">
                Explore E-Services <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="hero-secondary">
              <Link to="/about">
                Discover Jahun <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="hero-trust">
            <ShieldCheck size={16} />
            <span>Transparent governance. Accessible services. Stronger communities.</span>
          </div>
        </div>
        <div className="hero-location">
          <MapPin size={15} /> Jahun, Jigawa State <span>•</span> Nigeria
        </div>
      </section>

      {/* Quick Services Bar */}
      <section className="quick-section site-width" aria-label="Quick services">
        {[
          { icon: FileBadge, title: 'Indigene certificate', sub: 'Statutory certificate of origin', to: '/services' },
          { icon: GraduationCap, title: 'Apply for a bursary', sub: 'Supporting your education', to: '/services' },
          { icon: Store, title: 'Register your business', sub: 'Grow your enterprise', to: '/services' },
          { icon: MessageSquare, title: 'Complaints & feedback', sub: 'Your voice matters', to: '/services' }
        ].map(item => (
          <Link className="quick-link" to={item.to} key={item.title}>
            <item.icon size={25} />
            <div>
              <h2>{item.title}</h2>
              <p>{item.sub}</p>
            </div>
            <ArrowUpRight size={17} />
          </Link>
        ))}
      </section>

      {/* Notice Strip */}
      <div className="site-width notice-strip">
        <span className="notice-label">PUBLIC NOTICE</span>
        <p>Verified updates from the administration of Executive Chairman Hon. Jamilu Muhammad Danmalam are now available.</p>
        <Link to="/news">
          View gazette <ArrowRight size={14} />
        </Link>
      </div>

      {/* Chairman Message */}
      <section className="site-width chairman-section">
        <ChairmanMessage />
      </section>

      {/* News & Executive Updates Showcase Section */}
      <section className="bg-secondary/40 border-y border-border py-14">
        <div className="site-width space-y-8">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXECUTIVE UPDATES & DEVELOPMENT</p>
              <h2>News & Public Gazette</h2>
              <p>Key empowerment programmes, agricultural distributions, and projects under Hon. Jamilu Muhammad Danmalam.</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/news">
                All news & gazette <ArrowUpRight size={14} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topNews.map(item => (
              <article 
                key={item.id} 
                className="border border-border rounded-lg bg-card overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-secondary">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-background/90 text-primary backdrop-blur-xs border border-primary/20">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Calendar size={11} /> {item.date} · <span>{item.location.split(',')[0]}</span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-muted-foreground">{item.gazetteRef}</span>
                  <Link 
                    to="/news" 
                    className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1"
                  >
                    Read report <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="site-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR COUNCIL, AT YOUR FINGERTIPS</p>
              <h2>Citizen E-Services</h2>
              <p>Less paperwork. More possibilities. Access statutory certifications and council permits online.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/services">
                All E-Services <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <ServicesHub compact />
          <div className="service-assurance">
            <ShieldCheck size={16} />
            Secure applications<span>•</span>TSA Payment Clearance<span>•</span>Instant Certificate Issuance
          </div>
        </div>
      </section>

      {/* Wards Preview Section */}
      <section className="site-width wards-preview">
        <div>
          <p className="eyebrow">ELEVEN WARDS. ONE COMMUNITY.</p>
          <h2>
            Rooted in Jahun.<br />Connected for progress.
          </h2>
          <p>
            From our agricultural heartlands to our vibrant trading markets, discover the eleven communities that make Jahun LGA strong.
          </p>
          <Button asChild className="mt-7">
            <Link to="/wards">
              Explore our wards <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="ward-stats">
          <div>
            <Users />
            <strong>11</strong>
            <span>Administrative wards</span>
          </div>
          <div>
            <Leaf />
            <strong>Agriculture</strong>
            <span>The heart of our economy</span>
          </div>
          <div>
            <MapPin />
            <strong>Jigawa</strong>
            <span>Our state. Our home.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
