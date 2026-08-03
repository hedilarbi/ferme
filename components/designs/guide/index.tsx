import Link from "next/link";
import { formatDate, rootNavigation } from "../utils";
import type {
  AboutPageProps,
  ArticlePageProps,
  ArticlesPageProps,
  ArticleSummary,
  CategoryPageProps,
  HomePageProps,
  LayoutComponentProps,
  SiteDesign,
} from "../types";

function GuideBadge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "neon" }) {
  const styles = {
    default: "bg-[#1E293B] text-[#94A3B8] border border-[#334155]",
    neon: "bg-[#06B6D4]/10 text-[#22D3EE] border border-[#06B6D4]/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
}

function GuideArticleCard({
  article,
  compact = false,
}: {
  article: ArticleSummary;
  compact?: boolean;
}) {
  const date = formatDate(article.publishedAt);
  const primaryCategory = article.categories?.[0];

  return (
    <article className="group relative rounded-xl border border-[#1E293B] bg-[#0F172A] p-6 transition-all duration-300 hover:border-[#06B6D4]/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col h-full">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      {article.featuredImage && (
        <div className="relative z-10 mb-6 -mx-2 -mt-2 overflow-hidden rounded-lg">
          <img 
            src={article.featuredImage} 
            alt={article.title} 
            className="h-40 w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-4">
        {primaryCategory ? (
          <Link href={`/categories/${primaryCategory.slug}`}>
            <GuideBadge variant="neon">{primaryCategory.name}</GuideBadge>
          </Link>
        ) : (
          <GuideBadge>Guide</GuideBadge>
        )}
        <div className="flex h-2 w-2 items-center justify-center rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
      </div>

      <h2
        className={`relative z-10 mt-6 font-bold leading-snug text-white ${
          compact ? "text-xl" : "text-2xl md:text-3xl"
        }`}
      >
        <Link href={`/articles/${article.slug}`} className="transition-colors hover:text-[#22D3EE]">
          {article.title}
        </Link>
      </h2>

      {article.excerpt && (
        <p className="relative z-10 mt-4 text-sm leading-relaxed text-[#94A3B8] line-clamp-3">
          {article.excerpt}
        </p>
      )}

      <div className="mt-auto pt-8">
        <div className="relative z-10 flex flex-wrap items-center gap-3 border-t border-[#1E293B] pt-4 text-xs font-semibold text-[#64748B]">
          {article.author && <span className="text-[#E2E8F0]">{article.author.name}</span>}
          {article.author && date && <span aria-hidden="true">•</span>}
          {date && <time dateTime={article.publishedAt?.toISOString()}>{date}</time>}
        </div>
      </div>
    </article>
  );
}

function Header({ site }: LayoutComponentProps) {
  const navItems = rootNavigation(site.navigation);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1E293B] bg-[#020617]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-white transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span className="text-sm text-white">●</span>
          </div>
          {site.brandName}
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-[#94A3B8] transition-all hover:bg-[#1E293B] hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer({ site }: LayoutComponentProps) {
  return (
    <footer className="mt-auto border-t border-[#1E293B] bg-[#020617] px-6 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-white">
            {site.brandName}
          </Link>
          {site.description && (
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#94A3B8]">
              {site.description}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Navigation</h3>
          <div className="mt-6 grid gap-3 text-sm font-medium text-[#94A3B8]">
            <Link href="/articles" className="transition-colors hover:text-[#22D3EE]">
              Tous les Guides
            </Link>
            <Link href="/about" className="transition-colors hover:text-[#22D3EE]">
              À Propos
            </Link>
            <a href="/sitemap.xml" className="transition-colors hover:text-[#22D3EE]">
              Sitemap
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Légal & Contact</h3>
          <div className="mt-6 grid gap-3 text-sm font-medium text-[#94A3B8]">
            <Link href="/privacy" className="transition-colors hover:text-[#22D3EE]">
              Mentions Légales
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-[#22D3EE]">
              Politique de Confidentialité
            </Link>
            <Link href="/contact" className="transition-colors hover:text-[#22D3EE]">
              Nous Contacter
            </Link>
          </div>
          <div className="mt-8 rounded-xl border border-[#1E293B] bg-[#0F172A] p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs font-bold text-[#E2E8F0]">Statut : En ligne</span>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-[#64748B]">
              © {new Date().getFullYear()} {site.brandName}. Interface optimisée pour la décision rapide et l'analyse de données.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ site, articles }: HomePageProps) {
  const [featured, ...rest] = articles;

  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative overflow-hidden border-b border-[#1E293B] bg-[#020617] px-6 py-24 lg:px-8">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="h-[400px] w-[800px] rounded-full bg-[#06B6D4] blur-[120px]"></div>
        </div>
        
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <GuideBadge variant="neon">Base de Connaissance</GuideBadge>
            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              {site.brandName}
            </h1>
            {site.description && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#94A3B8]">
                {site.description}
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/articles" className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] px-6 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                Explorer les données
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] opacity-20 blur"></div>
            <div className="relative rounded-2xl border border-[#1E293B] bg-[#020617] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between border-b border-[#1E293B] pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs font-bold tracking-widest text-[#64748B]">FEATURED_DATA</span>
              </div>
              {featured ? (
                <GuideArticleCard article={featured} />
              ) : (
                <div className="py-12 text-center text-[#64748B]">Aucune donnée disponible.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between border-b border-[#1E293B] pb-6">
            <div>
              <h2 className="text-3xl font-black text-white">Analyses Récentes</h2>
              <p className="mt-2 text-sm text-[#94A3B8]">Flux de données actualisé en temps réel.</p>
            </div>
            <Link href="/articles" className="hidden text-sm font-bold text-[#22D3EE] hover:underline md:block">
              Voir l'archive complète →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.slice(0, 6).map((article) => (
              <GuideArticleCard key={article.slug} article={article} compact />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ArticlesPage({ articles, page, totalPages }: ArticlesPageProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-700 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-8 lg:p-12">
          <GuideBadge variant="neon">Index</GuideBadge>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Base de Données Globale
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#94A3B8]">
            L'ensemble de nos comparatifs, guides techniques et analyses de marché, indexés pour une recherche optimale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <GuideArticleCard key={article.slug} article={article} compact />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="mt-16 flex justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`/articles?page=${pageNumber}`}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  pageNumber === page
                    ? "bg-[#06B6D4] text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "border border-[#1E293B] bg-[#0F172A] text-[#94A3B8] hover:border-[#334155] hover:text-white"
                }`}
              >
                {pageNumber}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}

function ArticlePage({ article }: ArticlePageProps) {
  const date = formatDate(article.publishedAt);

  return (
    <article className="animate-in fade-in duration-700">
      <div className="border-b border-[#1E293B] bg-[#0F172A] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {article.featuredImage && (
            <div className="mb-10 overflow-hidden rounded-2xl border border-[#1E293B] shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <img 
                src={article.featuredImage} 
                alt={article.title} 
                className="w-full max-h-[50vh] object-cover opacity-90"
              />
            </div>
          )}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {article.categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                <GuideBadge variant="neon">{category.name}</GuideBadge>
              </Link>
            ))}
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-[#94A3B8]">
              {article.excerpt}
            </p>
          )}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-[#64748B]">
            {article.author && (
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-[#1E293B]"></span>
                <span className="text-[#E2E8F0]">{article.author.name}</span>
              </div>
            )}
            {date && <time dateTime={article.publishedAt?.toISOString()}>MAJ: {date}</time>}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div
          className="prose prose-invert prose-lg max-w-none 
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white 
            prose-p:text-[#94A3B8] prose-p:leading-relaxed 
            prose-a:text-[#22D3EE] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-bold
            prose-blockquote:border-l-[#06B6D4] prose-blockquote:bg-[#0F172A] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-[#E2E8F0] prose-blockquote:not-italic
            prose-table:w-full prose-table:rounded-xl prose-table:overflow-hidden prose-table:border-collapse
            prose-thead:bg-[#0F172A] prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:text-xs prose-th:uppercase prose-th:tracking-wider prose-th:text-[#94A3B8] prose-th:border-b prose-th:border-[#1E293B]
            prose-tbody:bg-[#020617] prose-td:px-6 prose-td:py-4 prose-td:border-b prose-td:border-[#1E293B]/50 prose-td:text-sm prose-td:text-[#CBD5E1]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </article>
  );
}

function CategoryPage({ category }: CategoryPageProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-700 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-8 lg:flex-row lg:items-center lg:p-12">
          <div>
            <GuideBadge>Catégorie</GuideBadge>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-4 max-w-2xl text-lg text-[#94A3B8]">
                {category.description}
              </p>
            )}
          </div>
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border border-[#1E293B] bg-[#020617] shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
            <span className="text-4xl font-black text-white">{category.articles.length}</span>
            <span className="text-xs font-bold text-[#64748B]">ENTRÉES</span>
          </div>
        </div>

        {category.articles.length === 0 ? (
          <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] py-20 text-center text-[#64748B]">
            Aucune donnée indexée dans cette catégorie.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {category.articles.map((article) => (
              <GuideArticleCard key={article.slug} article={article} compact />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AboutPage({ site }: AboutPageProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-700 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          <span className="text-3xl text-white">●</span>
        </div>
        <h1 className="mt-8 text-5xl font-black tracking-tight text-white md:text-6xl">
          Mission & Méthodologie
        </h1>
        <div className="mt-12 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-8 text-left lg:p-12">
          <p className="text-xl leading-relaxed text-[#E2E8F0]">
            {site.description ?? `Bienvenue sur ${site.brandName}, la plateforme d'analyse.`}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {["Data-Driven", "Comparatif", "Objectif"].map((item) => (
              <div key={item} className="rounded-xl border border-[#1E293B] bg-[#020617] p-6 text-center">
                <span className="text-sm font-bold uppercase tracking-wider text-[#22D3EE]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactPage({ site }: LayoutComponentProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-700 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <GuideBadge variant="neon">Transmission</GuideBadge>
        <h1 className="mt-8 text-5xl font-black tracking-tight text-white md:text-6xl">
          Point de Contact
        </h1>
        <div className="mt-12 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-8 text-left lg:p-12">
          <p className="text-xl leading-relaxed text-[#E2E8F0]">
            Pour toute requête analytique, proposition de partenariat ou demande de correction de données, 
            veuillez initialiser une connexion vers notre centre de traitement.
          </p>
          <div className="mt-10 rounded-xl border border-[#1E293B] bg-[#020617] p-6 text-center">
            <span className="text-sm font-bold tracking-wider text-[#22D3EE]">
              contact@{site.primaryHostname}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyPage({ site }: LayoutComponentProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-700 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <GuideBadge variant="neon">Sécurité & Légal</GuideBadge>
        <h1 className="mt-8 text-5xl font-black tracking-tight text-white md:text-6xl">
          Protocoles & Confidentialité
        </h1>
        <div className="mt-12 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-8 text-left lg:p-12">
          <h2 className="text-2xl font-bold text-white mb-4">1. Identifiant Réseau</h2>
          <p className="text-[#94A3B8] mb-8">Le domaine {site.primaryHostname} est opéré sous la marque {site.brandName}.</p>
          
          <h2 className="text-2xl font-bold text-white mb-4">2. Infrastructure</h2>
          <p className="text-[#94A3B8] mb-8">Base de données hébergée sur des nœuds sécurisés avec redondance active.</p>
          
          <h2 className="text-2xl font-bold text-white mb-4">3. Télémétrie et RGPD</h2>
          <p className="text-[#94A3B8]">Les logs de connexion sont anonymisés. Aucune donnée personnelle n'est stockée sans consentement explicite du nœud utilisateur.</p>
        </div>
      </div>
    </section>
  );
}

export const guideDesign: SiteDesign = {
  rootClassName: "bg-[#020617] text-[#F1F5F9] font-sans antialiased selection:bg-[#06B6D4] selection:text-white",
  Header,
  Footer,
  HomePage,
  ArticlesPage,
  ArticlePage,
  CategoryPage,
  AboutPage,
  ContactPage,
  PrivacyPage,
};
