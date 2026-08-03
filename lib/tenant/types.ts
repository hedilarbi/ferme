import type {
  Site,
  Domain,
  ThemeSettings,
  SeoSettings,
  NavigationItem,
} from "@prisma/client";

// SQLite stocke les statuts comme String — ces types documentent les valeurs attendues
export type SiteStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Full site payload loaded per request.
 * All relational data that every page needs is included here.
 */
export type SiteWithRelations = Site & {
  domains: Domain[];
  themeSettings: ThemeSettings | null;
  seoSettings: SeoSettings | null;
  navigationItems: NavigationItem[];
};

/**
 * Minimal site info passed as a prop to layout components.
 */
export type SiteContext = {
  id: string;
  slug: string;
  brandName: string;
  description: string | null;
  defaultLocale: string;
  primaryHostname: string;
  theme: {
    logo: string | null;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    designKey: string;
  };
  seo: {
    titleTemplate: string;
    metaDescription: string | null;
    defaultOgImage: string | null;
    robots: string;
  };
  navigation: Array<{
    id: string;
    label: string;
    href: string;
    order: number;
    parentId: string | null;
  }>;
};

export class TenantNotFoundError extends Error {
  constructor(hostname: string) {
    super(`No site registered for hostname: ${hostname}`);
    this.name = "TenantNotFoundError";
  }
}
