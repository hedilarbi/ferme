import React from "react";
import Link from "next/link";
import type { 
  SiteDesign, 
  HomePageProps, 
  ArticlePageProps, 
  ArticlesPageProps, 
  CategoryPageProps, 
  AboutPageProps,
  LayoutComponentProps,
  ArticleSummary
} from "../types";

function MagazineMarquee({ text }: { text: string }) {
  return (
    <div className="flex w-full overflow-hidden border-y-4 border-black bg-[#E60000] py-3 text-white">
      <div className="flex animate-[marquee_15s_linear_infinite] whitespace-nowrap">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-4 text-2xl font-black uppercase tracking-widest">
            {text} •
          </span>
        ))}
      </div>
    </div>
  );
}

function MagazineArticleCard({
  article,
  hero = false,
}: {
  article: ArticleSummary;
  hero?: boolean;
}) {
  return (
    <Link 
      href={`/articles/${article.slug}`} 
      className={`group relative block overflow-hidden border-4 border-black bg-white transition-transform hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#E60000] ${hero ? "col-span-full md:grid md:grid-cols-2 md:items-stretch" : "flex flex-col"}`}
    >
      <div className={`relative border-black bg-black ${hero ? "border-r-4 md:h-full h-[50vh]" : "border-b-4 aspect-[4/5]"} overflow-hidden`}>
        {article.featuredImage ? (
          <img 
            src={article.featuredImage} 
            alt={article.title} 
            className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-6xl font-black italic text-zinc-800">
            PHOTO
          </div>
        )}
        <div className="absolute left-0 top-0 bg-[#E60000] px-4 py-2 text-xl font-black uppercase text-white">
          {article.categories?.[0]?.name || "Édito"}
        </div>
      </div>
      
      <div className={`flex flex-col justify-between ${hero ? "p-8 md:p-16" : "p-6 lg:p-8"}`}>
        <div>
          <h2 className={`font-black uppercase leading-[0.85] tracking-tighter transition-colors group-hover:text-[#E60000] ${hero ? "text-5xl md:text-6xl lg:text-7xl" : "text-3xl lg:text-4xl"}`}>
            {article.title}
          </h2>
          {article.excerpt && (
            <p className={`mt-6 font-medium italic leading-relaxed text-zinc-600 ${hero ? "text-2xl" : "text-lg line-clamp-3"}`}>
              {article.excerpt}
            </p>
          )}
        </div>
        
        <div className="mt-8 flex items-center gap-4 border-t-4 border-black pt-4 font-black uppercase tracking-widest text-black">
          <span className="bg-black px-3 py-1 text-white">
            {article.author?.name || "Redaction"}
          </span>
          {article.publishedAt && (
            <span className="text-sm">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

const Header = ({ site }: LayoutComponentProps) => (
  <header className="sticky top-0 z-50 border-b-4 border-black bg-white">
    <div className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="group relative">
        <h1 className="text-4xl font-black uppercase leading-none tracking-tighter transition-transform group-hover:scale-[1.02] md:text-5xl">
          {site.brandName}
        </h1>
        <div className="absolute -bottom-2 left-0 h-2 w-0 bg-[#E60000] transition-all duration-300 group-hover:w-full"></div>
      </Link>
      
      <nav className="hidden border-l-4 border-black pl-8 lg:block">
        <ul className="flex items-center gap-8">
          {site.navigation.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.href} 
                className="text-2xl font-black uppercase tracking-tighter hover:text-[#E60000] hover:underline"
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

const Footer = ({ site }: LayoutComponentProps) => (
  <footer className="mt-auto border-t-4 border-black bg-black text-white">
    <MagazineMarquee text="L'ÉDITION NUMÉRIQUE" />
    <div className="grid grid-cols-1 border-b-4 border-white lg:grid-cols-2">
      <div className="border-b-4 border-white p-12 lg:border-b-0 lg:border-r-4">
        <h2 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter lg:text-7xl">
          {site.brandName}
        </h2>
        <p className="mt-8 max-w-xl text-2xl font-medium italic text-zinc-400">
          {site.description}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r-4 border-white p-12">
          <h3 className="mb-8 text-3xl font-black uppercase tracking-tighter text-[#E60000]">Navigation</h3>
          <ul className="space-y-4 text-2xl font-black uppercase">
            {site.navigation.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="hover:text-[#E60000] hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-12">
          <h3 className="mb-8 text-3xl font-black uppercase tracking-tighter text-[#E60000]">Légal</h3>
          <ul className="space-y-3">
            <li><Link href="/privacy" className="text-gray-400 transition-colors hover:text-[#E60000]">Mentions Légales</Link></li>
            <li><Link href="/privacy" className="text-gray-400 transition-colors hover:text-[#E60000]">Politique de Confidentialité</Link></li>
            <li><Link href="/contact" className="text-gray-400 transition-colors hover:text-[#E60000]">Nous Contacter</Link></li>
            <li className="mt-4 text-xl font-bold uppercase text-zinc-400">© {new Date().getFullYear()}</li>
            <li className="text-xl font-bold uppercase text-zinc-400">Tous Droits Réservés</li>
            <li className="text-xl font-bold uppercase text-zinc-400">Paris, France</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

const HomePage = ({ site, articles }: HomePageProps) => {
  const heroArticle = articles[0];
  const gridArticles = articles.slice(1, 5);

  return (
    <div className="animate-in fade-in duration-700">
      {heroArticle && (
        <section className="border-b-4 border-black bg-[#E60000] p-4 md:p-8 lg:p-12">
          <MagazineArticleCard article={heroArticle} hero />
        </section>
      )}

      <MagazineMarquee text="À LA UNE • LECTURES • TENDANCES" />

      <section className="bg-zinc-100 p-4 md:p-8 lg:p-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {gridArticles.map((article) => (
            <MagazineArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
};

const ArticlePage = ({ site, article }: ArticlePageProps) => (
  <article className="animate-in fade-in duration-700">
    <header className="border-b-4 border-black bg-zinc-100 p-6 md:p-12 lg:p-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex gap-4">
          {article.categories.map(c => (
            <span key={c.slug} className="bg-black px-4 py-2 text-2xl font-black uppercase text-white">
              {c.name}
            </span>
          ))}
        </div>
        <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-6xl lg:text-7xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-12 border-l-8 border-[#E60000] pl-8 text-3xl font-medium italic leading-relaxed text-zinc-700 md:text-4xl">
            {article.excerpt}
          </p>
        )}
      </div>
    </header>

    {article.featuredImage && (
      <div className="w-full border-b-4 border-black">
        <img 
          src={article.featuredImage} 
          alt={article.title} 
          className="max-h-[80vh] w-full object-cover grayscale transition-all duration-1000 hover:grayscale-0" 
        />
      </div>
    )}

    <div className="mx-auto max-w-4xl p-6 py-20 md:p-12 lg:py-32">
      <div className="mb-20 flex flex-col gap-4 border-y-4 border-black py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-black uppercase">Par</span>
          <span className="bg-[#E60000] px-4 py-2 text-2xl font-black uppercase text-white">
            {article.author?.name || site.brandName}
          </span>
        </div>
        <span className="text-2xl font-black uppercase tracking-widest text-zinc-400">
          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Draft"}
        </span>
      </div>

      <div 
        className="prose prose-2xl prose-zinc max-w-none 
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-black
          prose-h2:text-6xl prose-h2:border-b-4 prose-h2:border-black prose-h2:pb-4
          prose-p:font-medium prose-p:leading-relaxed
          prose-a:text-[#E60000] prose-a:font-bold prose-a:decoration-4 hover:prose-a:bg-[#E60000] hover:prose-a:text-white
          prose-strong:font-black prose-strong:bg-zinc-200 prose-strong:px-1
          prose-blockquote:border-l-8 prose-blockquote:border-black prose-blockquote:bg-zinc-100 prose-blockquote:p-8 prose-blockquote:italic prose-blockquote:font-black prose-blockquote:text-3xl prose-blockquote:text-black
          prose-table:border-4 prose-table:border-black prose-th:border-4 prose-th:border-black prose-th:bg-black prose-th:text-white prose-th:p-4 prose-th:uppercase prose-th:font-black prose-td:border-4 prose-td:border-black prose-td:p-4 prose-td:font-bold"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  </article>
);

const ArticlesPage = ({ site, articles, page, totalPages }: ArticlesPageProps) => (
  <div className="bg-zinc-100">
    <div className="border-b-4 border-black bg-white py-20 text-center">
      <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-6xl lg:text-7xl">
        Archives
      </h1>
    </div>
    <MagazineMarquee text="TOUS LES ARTICLES • TOUTES LES ÉDITIONS" />
    <div className="p-4 md:p-8 lg:p-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <MagazineArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  </div>
);

const CategoryPage = ({ site, category }: CategoryPageProps) => (
  <div className="bg-zinc-100">
    <div className="border-b-4 border-black bg-[#E60000] py-20 text-center text-white">
      <span className="bg-black px-6 py-2 text-xl font-black uppercase tracking-widest text-white">Section</span>
      <h1 className="mt-8 text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-6xl lg:text-7xl">
        {category.name}
      </h1>
      {category.description && (
        <p className="mx-auto mt-8 max-w-3xl text-3xl font-medium italic">{category.description}</p>
      )}
    </div>
    
    <div className="p-4 md:p-8 lg:p-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {category.articles.map((article) => (
          <MagazineArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  </div>
);

function AboutPage({ site }: AboutPageProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          À propos de {site.brandName}
        </h1>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="lead text-xl text-gray-900">
            {site.description ?? `Bienvenue sur ${site.brandName}.`}
          </p>
          <p>
            Notre mission est de vous fournir le meilleur contenu éditorial. Nous
            sélectionnons avec soin les sujets qui comptent pour vous apporter des
            informations fiables et inspirantes.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactPage({ site }: LayoutComponentProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Contactez-nous
        </h1>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p>Vous souhaitez nous poser une question, nous faire une suggestion ou établir un partenariat avec {site.brandName} ?</p>
          <p>N'hésitez pas à nous envoyer un email à l'adresse suivante :</p>
          <p className="text-xl font-medium text-[#E60000]">contact@{site.primaryHostname}</p>
          <p>Notre équipe vous répondra dans les plus brefs délais.</p>
        </div>
      </div>
    </div>
  );
}

function PrivacyPage({ site }: LayoutComponentProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Mentions Légales & Confidentialité
        </h1>
        <div className="prose prose-lg max-w-none text-gray-600">
          <h2>1. Éditeur du site</h2>
          <p>Le site {site.primaryHostname} est édité par la société {site.brandName}.</p>
          
          <h2>2. Hébergement</h2>
          <p>Ce site est hébergé sur des serveurs sécurisés garantissant une haute disponibilité.</p>

          <h2>3. Cookies et données personnelles</h2>
          <p>Notre site web s'engage à respecter la confidentialité de vos données personnelles. Les données collectées sont utilisées uniquement à des fins analytiques ou pour améliorer votre expérience utilisateur.</p>
        </div>
      </div>
    </div>
  );
}

export const MagazineDesign: SiteDesign = {
  rootClassName: "bg-white text-black font-sans antialiased selection:bg-[#E60000] selection:text-white",
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
