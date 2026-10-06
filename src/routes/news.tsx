import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { 
  FileText, Search, Calendar, MapPin, Tag, Share2, Printer, 
  ArrowRight, Check, X, ShieldCheck, Newspaper, Award, Sparkles, 
  ExternalLink, Building2
} from 'lucide-react';
import { PageIntro } from '@/components/portal-shell';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { pageHead } from '@/lib/portal-data';
import { newsArticles, type NewsArticle } from '@/lib/news-data';
import councilLogo from '@/assets/jahun-council-logo.png';

export const Route = createFileRoute('/news')({
  head: () => pageHead(
    'News & public gazette',
    'Official news, empowerment programmes, infrastructure projects and verified gazette publications of Hon. Jamilu Muhammad Danmalam, Executive Chairman of Jahun Local Government Council.'
  ),
  component: News
});

const categories = [
  'All updates',
  'Empowerment & Welfare',
  'Constructions & Infrastructure',
  'Agricultural Inputs & Distribution',
  'Education & Youth',
  'Healthcare & Community',
  'Security Logistics',
  'Public Gazette'
] as const;

function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All updates');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All updates' || article.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      article.title.toLowerCase().includes(q) ||
      article.summary.toLowerCase().includes(q) ||
      article.location.toLowerCase().includes(q) ||
      article.tags.some(t => t.toLowerCase().includes(q)) ||
      article.gazetteRef.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(a => a.featured) || newsArticles[0];

  function copyArticleLink(article: NewsArticle) {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/news#${article.slug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <main id="main">
      <PageIntro 
        eyebrow="OPEN & ACCOUNTABLE GOVERNANCE" 
        title="News & public gazette" 
        description="Official updates, developmental milestones, empowerment drives, and public gazette notices from the administration of Executive Chairman Hon. Jamilu Muhammad Danmalam."
      />

      <section className="site-width page-body space-y-8">
        {/* Category Toolbar & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 text-xs" role="tablist" aria-label="News categories">
            {categories.map(cat => (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                role="tab"
                aria-selected={selectedCategory === cat}
                className={selectedCategory === cat ? 'tab-current' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search news, projects, gazette..."
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
        </div>

        {/* Featured Story Banner (Shown when viewing "All updates" without search filter) */}
        {selectedCategory === 'All updates' && !searchQuery && featuredArticle && (
          <article className="border border-border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] overflow-hidden bg-secondary">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-xs">
                  FEATURED GAZETTE REPORT
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-background/90 text-foreground backdrop-blur-xs shadow-xs">
                  {featuredArticle.category}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {featuredArticle.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <MapPin size={13} /> {featuredArticle.location}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {featuredArticle.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Ref: <strong className="text-primary">{featuredArticle.gazetteRef}</strong>
                </span>

                <Button 
                  size="sm" 
                  className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold"
                  onClick={() => setActiveArticle(featuredArticle)}
                >
                  Read full gazette <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </article>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>
            Showing <strong className="text-foreground">{filteredArticles.length}</strong> official {filteredArticles.length === 1 ? 'publication' : 'publications'}
            {selectedCategory !== 'All updates' && ` in "${selectedCategory}"`}
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <ShieldCheck size={14} className="text-primary" /> Verified by Council Secretariat
          </span>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <article 
              key={article.id} 
              className="border border-border rounded-lg bg-card overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Photo container */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-secondary">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-background/90 text-primary backdrop-blur-xs border border-primary/20 shadow-xs">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {article.date}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[140px] text-right">
                      <MapPin size={12} className="shrink-0" /> {article.location.split(',')[0]}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-border/60 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {article.gazetteRef}
                </span>

                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 text-xs font-semibold text-primary hover:text-primary/80"
                  onClick={() => setActiveArticle(article)}
                >
                  Read full story <ArrowRight size={13} className="ml-1" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 border border-dashed rounded-lg bg-card p-8 max-w-md mx-auto space-y-3">
            <Newspaper size={40} className="mx-auto text-muted-foreground opacity-60" />
            <h3 className="font-semibold text-base">No articles found</h3>
            <p className="text-xs text-muted-foreground">
              No news or gazette entries matched your current search filters. Try clearing your query or selecting another category.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setSelectedCategory('All updates'); setSearchQuery(''); }}
            >
              Reset filters
            </Button>
          </div>
        )}

        {/* Official Gazette Administration Notice Box */}
        <div className="p-6 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-secondary/40 to-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img src={councilLogo} alt="Seal" className="w-12 h-12 object-contain shrink-0" />
            <div>
              <strong className="text-foreground text-sm block">
                Official Gazette of Jahun Local Government Council
              </strong>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Published by authority of the Executive Chairman, Hon. Jamilu Muhammad Danmalam · Jigawa State, Nigeria.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <a href="/administration">
                <Building2 size={13} /> Council Secretariat
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Full Article Reader Dialog */}
      {activeArticle && (
        <Dialog open={!!activeArticle} onOpenChange={open => { if (!open) setActiveArticle(null); }}>
          <DialogContent className="max-h-[94vh] overflow-y-auto sm:max-w-3xl p-6 sm:p-8">
            <DialogHeader className="border-b border-border pb-4 print:hidden">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Gazette Ref: <strong className="font-mono text-foreground">{activeArticle.gazetteRef}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs gap-1.5"
                    onClick={() => copyArticleLink(activeArticle)}
                  >
                    {copied ? <Check size={13} className="text-primary" /> : <Share2 size={13} />}
                    {copied ? 'Link copied' : 'Share'}
                  </Button>

                  <Button 
                    type="button" 
                    size="sm" 
                    className="h-8 text-xs gap-1.5"
                    onClick={() => window.print()}
                  >
                    <Printer size={13} /> Print report
                  </Button>
                </div>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-bold font-serif text-foreground mt-3 leading-snug">
                {activeArticle.title}
              </DialogTitle>

              <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-3 pt-1">
                <span>By {activeArticle.author}</span>
                <span>·</span>
                <span>{activeArticle.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <MapPin size={12} /> {activeArticle.location}
                </span>
              </DialogDescription>
            </DialogHeader>

            {/* Article Content Body */}
            <div className="space-y-6 pt-4 text-sm leading-relaxed text-foreground">
              {/* Image banner */}
              <div className="rounded-lg overflow-hidden border border-border bg-secondary shadow-xs">
                <img 
                  src={activeArticle.image} 
                  alt={activeArticle.title} 
                  className="w-full max-h-[380px] object-cover object-center"
                />
                <p className="p-2.5 text-xs text-muted-foreground bg-secondary/60 italic text-center border-t border-border/60">
                  {activeArticle.imageCaption}
                </p>
              </div>

              {/* Lead Paragraph */}
              <div className="p-4 rounded-lg bg-secondary/40 border-l-4 border-primary text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                {activeArticle.summary}
              </div>

              {/* Narrative Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                {activeArticle.content.map((paragraph, index) => (
                  <p key={index} className="text-justify leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Official Seal Attribution Box */}
              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <img src={councilLogo} alt="Council Crest" className="w-12 h-12 object-contain" />
                  <div>
                    <strong className="block text-foreground">Office of the Executive Chairman</strong>
                    <span className="text-[11px] text-muted-foreground">Hon. Jamilu Muhammad Danmalam · Jahun LGA</span>
                  </div>
                </div>

                <div className="text-center sm:text-right text-[11px] font-mono text-muted-foreground">
                  <div>Document Class: Verified Public Gazette</div>
                  <div className="text-primary font-bold">{activeArticle.gazetteRef}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-end print:hidden">
              <Button variant="outline" size="sm" onClick={() => setActiveArticle(null)}>
                Close reader
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
