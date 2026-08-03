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

function CategoryPill({ slug, name }: { slug: string; name: string }) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="inline-flex items-center rounded-full border border-[#E6E5E0] bg-white/50 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B8A85] transition-all hover:border-[#C17F59] hover:text-[#C17F59]"
    >
      {name}
    </Link>
  );
}

function DecoArticleCard({
  article,
  featured = false,
}: {
  article: ArticleSummary;
  featured?: boolean;
}) {
  const date = formatDate(article.publishedAt);

  return (
    <article
      className={`group flex flex-col justify-between border border-[#E6E5E0] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] ${
        featured ? "p-8 md:p-12 lg:col-span-2" : "p-6 md:p-8"
      }`}
    >
      <div>
        {article.featuredImage && (
          <div className="mb-6 overflow-hidden rounded-lg">
            <img 
              src={article.featuredImage} 
              alt={article.title} 
              className="w-full h-48 md:h-64 object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        )}

        {article.categories && article.categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {article.categories.map((category) => (
              <CategoryPill key={category.slug} {...category} />
            ))}
          </div>
        )}

        <h2
          className={`font-serif font-light leading-tight text-[#3A3935] ${
            featured ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"
          }`}
        >
          <Link href={`/articles/${article.slug}`} className="transition-colors hover:text-[#C17F59]">
            {article.title}
          </Link>
        </h2>

        {article.excerpt && (
          <p className="mt-5 text-sm font-light leading-relaxed text-[#8B8A85] line-clamp-3">
            {article.excerpt}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#E6E5E0] pt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#A3A29D]">
        {article.author && <span className="text-[#3A3935]">{article.author.name}</span>}
        {article.author && date && <span aria-hidden="true" className="text-[#E6E5E0]">|</span>}
        {date && <time dateTime={article.publishedAt?.toISOString()}>{date}</time>}
      </div>
    </article>
  );
}

function Header({ site }: LayoutComponentProps) {
  const navItems = rootNavigation(site.navigation);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E6E5E0]/50 bg-[#FDFCF8]/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-8 md:px-12 md:flex-row md:justify-between md:py-6">
        <Link href="/" className="font-serif text-2xl font-light tracking-wide text-[#3A3935] transition-opacity hover:opacity-70">
          {site.brandName}
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8B8A85] transition-colors hover:text-[#C17F59]"
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
    <footer className="mt-24 border-t border-[#E6E5E0] bg-white px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="font-serif text-3xl font-light tracking-wide text-[#3A3935]">
            {site.brandName}
          </Link>
          {site.description && (
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-[#8B8A85]">
              {site.description}
            </p>
          )}
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C17F59]">
            Explorer
          </h3>
          <div className="mt-6 flex flex-col gap-4">
            <Link href="/articles" className="text-sm font-light text-[#8B8A85] transition-colors hover:text-[#3A3935]">
              Journal
            </Link>
            <Link href="/about" className="text-sm font-light text-[#8B8A85] transition-colors hover:text-[#3A3935]">
              Manifeste
            </Link>
            <a href="/sitemap.xml" className="text-sm font-light text-[#8B8A85] transition-colors hover:text-[#3A3935]">
              Sitemap
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C17F59]">
            Légal
          </h3>
          <div className="mt-6 flex flex-col gap-4">
            <Link href="/privacy" className="text-sm font-light text-[#8B8A85] transition-colors hover:text-[#3A3935]">
              Mentions Légales
            </Link>
            <Link href="/privacy" className="text-sm font-light text-[#8B8A85] transition-colors hover:text-[#3A3935]">
              Confidentialité
            </Link>
            <Link href="/contact" className="text-sm font-light text-[#8B8A85] transition-colors hover:text-[#3A3935]">
              Nous Contacter
            </Link>
          </div>
          <p className="mt-8 text-xs font-light leading-relaxed text-[#8B8A85]/50">
            © {new Date().getFullYear()} {site.brandName}.
          </p>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ site, articles }: HomePageProps) {
  const [featured, ...rest] = articles;

  return (
    <div className="animate-in fade-in duration-1000">
      <section className="px-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-[#C17F59]">
            Inspiration d'intérieur
          </span>
          <h1 className="mx-auto mt-8 max-w-4xl font-serif text-5xl font-light leading-[1.1] text-[#3A3935] md:text-7xl">
            {site.brandName}
          </h1>
          {site.description && (
            <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-[#8B8A85]">
              {site.description}
            </p>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          {featured ? (
            <DecoArticleCard article={featured} featured />
          ) : (
            <div className="col-span-3 py-20 text-center text-[#8B8A85]">
              Aucune publication pour le moment.
            </div>
          )}
          {rest.slice(0, 4).map((article) => (
            <DecoArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ArticlesPage({ articles, page, totalPages }: ArticlesPageProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-1000 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C17F59]">
            Archives
          </span>
          <h1 className="mt-6 font-serif text-5xl font-light text-[#3A3935] md:text-6xl">
            Le Journal
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <DecoArticleCard
              key={article.slug}
              article={article}
              featured={index === 0 && page === 1}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="mt-20 flex justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`/articles?page=${pageNumber}`}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-light transition-colors ${
                  pageNumber === page
                    ? "bg-[#3A3935] text-white"
                    : "border border-[#E6E5E0] bg-white text-[#8B8A85] hover:border-[#C17F59] hover:text-[#C17F59]"
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
    <article className="animate-in fade-in duration-1000">
      <header className="px-6 py-20 text-center md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          {article.featuredImage && (
            <div className="mb-12 overflow-hidden rounded-xl shadow-sm">
              <img 
                src={article.featuredImage} 
                alt={article.title} 
                className="w-full max-h-[60vh] object-cover"
              />
            </div>
          )}

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {article.categories.map((category) => (
              <CategoryPill key={category.slug} {...category} />
            ))}
          </div>
          <h1 className="font-serif text-4xl font-light leading-[1.1] text-[#3A3935] md:text-6xl md:leading-[1.15]">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mx-auto mt-8 max-w-2xl text-xl font-light leading-relaxed text-[#8B8A85]">
              {article.excerpt}
            </p>
          )}
          <div className="mt-12 flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#A3A29D]">
            {article.author && <span className="text-[#3A3935]">{article.author.name}</span>}
            {article.author && date && <span className="h-px w-6 bg-[#E6E5E0]"></span>}
            {date && <time dateTime={article.publishedAt?.toISOString()}>{date}</time>}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-24 md:px-12">
        <div
          className="prose prose-stone prose-lg max-w-none 
            prose-headings:font-serif prose-headings:font-light prose-headings:text-[#3A3935] 
            prose-p:font-light prose-p:leading-loose prose-p:text-[#5C5B56] 
            prose-a:text-[#C17F59] prose-a:underline-offset-4 hover:prose-a:text-[#3A3935]
            prose-blockquote:border-l-[#C17F59] prose-blockquote:font-serif prose-blockquote:font-light prose-blockquote:text-2xl prose-blockquote:text-[#3A3935]
            prose-table:border-[#E6E5E0] prose-th:bg-[#FDFCF8] prose-th:font-medium prose-th:uppercase prose-th:tracking-wider prose-th:text-[11px] prose-th:text-[#8B8A85]
            prose-td:border-[#E6E5E0] prose-td:font-light prose-td:text-[#5C5B56]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </article>
  );
}

function CategoryPage({ category }: CategoryPageProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-1000 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C17F59]">
            Rubrique
          </span>
          <h1 className="mt-6 font-serif text-5xl font-light text-[#3A3935] md:text-6xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-[#8B8A85]">
              {category.description}
            </p>
          )}
        </div>

        {category.articles.length === 0 ? (
          <div className="py-20 text-center text-[#8B8A85]">
            Aucune publication dans cette rubrique.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {category.articles.map((article) => (
              <DecoArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AboutPage({ site }: AboutPageProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-1000 md:px-12 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C17F59]">
          Manifeste
        </span>
        <h1 className="mt-6 font-serif text-5xl font-light text-[#3A3935] md:text-6xl">
          {site.brandName}
        </h1>
        <div className="mx-auto mt-12 h-px w-24 bg-[#E6E5E0]"></div>
        <div className="mt-12 space-y-8 text-xl font-light leading-loose text-[#5C5B56]">
          <p>
            {site.description ?? `Bienvenue sur ${site.brandName}.`}
          </p>
          <p>
            Nous croyons en un design épuré, intemporel et fonctionnel. Ce carnet
            d'inspiration explore les frontières entre minimalisme, matières naturelles
            et artisanat contemporain.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactPage({ site }: LayoutComponentProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-1000 md:px-12 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C17F59]">
          Contact
        </span>
        <h1 className="mt-6 font-serif text-5xl font-light text-[#3A3935] md:text-6xl">
          Écrivez-nous
        </h1>
        <div className="mx-auto mt-12 h-px w-24 bg-[#E6E5E0]"></div>
        <div className="mt-12 space-y-8 text-xl font-light leading-loose text-[#5C5B56]">
          <p>
            Vous avez une question ou souhaitez collaborer avec {site.brandName} ? 
            Nous serions ravis d'échanger avec vous.
          </p>
          <p className="font-medium text-[#C17F59]">
            contact@{site.primaryHostname}
          </p>
        </div>
      </div>
    </section>
  );
}

function PrivacyPage({ site }: LayoutComponentProps) {
  return (
    <section className="animate-in fade-in px-6 py-20 duration-1000 md:px-12 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C17F59]">
          Légal
        </span>
        <h1 className="mt-6 font-serif text-5xl font-light text-[#3A3935] md:text-6xl">
          Confidentialité
        </h1>
        <div className="mx-auto mt-12 h-px w-24 bg-[#E6E5E0]"></div>
        <div className="mt-12 space-y-8 text-left text-lg font-light leading-loose text-[#5C5B56]">
          <h2 className="font-serif text-2xl text-[#3A3935]">1. Éditeur</h2>
          <p>{site.primaryHostname} est la propriété de {site.brandName}.</p>
          
          <h2 className="font-serif text-2xl text-[#3A3935]">2. Hébergement</h2>
          <p>La plateforme est hébergée sur des serveurs sécurisés pour garantir la protection de vos données.</p>
          
          <h2 className="font-serif text-2xl text-[#3A3935]">3. Données personnelles</h2>
          <p>Nous respectons votre vie privée. Les données récoltées ne sont jamais revendues à des tiers et servent uniquement à l'amélioration de notre contenu.</p>
        </div>
      </div>
    </section>
  );
}

export const decoDesign: SiteDesign = {
  rootClassName: "bg-[#FDFCF8] text-[#3A3935] selection:bg-[#C17F59] selection:text-white font-sans",
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
