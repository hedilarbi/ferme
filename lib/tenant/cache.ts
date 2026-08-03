import type { SiteContext, SiteWithRelations } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Cache tag helpers
//
// These tags are used with Next.js cache invalidation (revalidateTag).
// When you add a persistent cache handler, wire revalidateTag calls here.
// ─────────────────────────────────────────────────────────────────────────────

export function siteTag(siteId: string) {
  return `site:${siteId}`;
}

export function articleTag(siteId: string, slug?: string) {
  return slug ? `article:${siteId}:${slug}` : `articles:${siteId}`;
}

export function categoryTag(siteId: string, slug?: string) {
  return slug ? `category:${siteId}:${slug}` : `categories:${siteId}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shape transformer
//
// Converts the raw Prisma Site record into the leaner SiteContext type
// that layout and page components actually consume.
// ─────────────────────────────────────────────────────────────────────────────

export function toSiteContext(
  site: SiteWithRelations,
  requestHostname: string
): SiteContext {
  const primaryDomain =
    site.domains.find((d) => d.isPrimary)?.hostname ??
    site.domains[0]?.hostname ??
    requestHostname;

  return {
    id: site.id,
    slug: site.slug,
    brandName: site.brandName,
    description: site.description,
    defaultLocale: site.defaultLocale,
    primaryHostname: primaryDomain,
    theme: {
      logo: site.themeSettings?.logo ?? null,
      primaryColor: site.themeSettings?.primaryColor ?? "#3b82f6",
      secondaryColor: site.themeSettings?.secondaryColor ?? "#64748b",
      fontFamily:
        site.themeSettings?.fontFamily ?? "system-ui, sans-serif",
      designKey: site.themeSettings?.designKey ?? "default",
    },
    seo: {
      titleTemplate:
        site.seoSettings?.titleTemplate ?? "%s | " + site.brandName,
      metaDescription: site.seoSettings?.metaDescription ?? null,
      defaultOgImage: site.seoSettings?.defaultOgImage ?? null,
      robots: site.seoSettings?.robots ?? "index,follow",
    },
    navigation: site.navigationItems.map((n) => ({
      id: n.id,
      label: n.label,
      href: n.href,
      order: n.order,
      parentId: n.parentId,
    })),
  };
}
