import type { SiteContext } from "@/lib/tenant/types";

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: Date | null;
  author?: { name: string } | null;
  categories?: Array<{ slug: string; name: string }>;
};

export type ArticleDetail = ArticleSummary & {
  content: string;
  author?: { name: string; bio?: string | null } | null;
  categories: Array<{ slug: string; name: string }>;
};

export type CategoryWithArticles = {
  slug: string;
  name: string;
  description?: string | null;
  articles: ArticleSummary[];
};

export type LayoutComponentProps = {
  site: SiteContext;
};

export type HomePageProps = {
  site: SiteContext;
  articles: ArticleSummary[];
};

export type ArticlesPageProps = {
  site: SiteContext;
  articles: ArticleSummary[];
  page: number;
  totalPages: number;
};

export type ArticlePageProps = {
  site: SiteContext;
  article: ArticleDetail;
};

export type CategoryPageProps = {
  site: SiteContext;
  category: CategoryWithArticles;
};

export type AboutPageProps = {
  site: SiteContext;
};

export type SiteDesign = {
  rootClassName: string;
  Header: (props: LayoutComponentProps) => React.ReactNode;
  Footer: (props: LayoutComponentProps) => React.ReactNode;
  HomePage: (props: HomePageProps) => React.ReactNode;
  ArticlesPage: (props: ArticlesPageProps) => React.ReactNode;
  ArticlePage: (props: ArticlePageProps) => React.ReactNode;
  CategoryPage: (props: CategoryPageProps) => React.ReactNode;
  AboutPage: (props: AboutPageProps) => React.ReactNode;
  ContactPage: (props: LayoutComponentProps) => React.ReactNode;
  PrivacyPage: (props: LayoutComponentProps) => React.ReactNode;
};
