import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentSite, getCurrentSiteRaw } from "@/lib/tenant/get-current-site";
import { prisma } from "@/lib/db";
import { getDesign } from "@/components/designs/registry";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  if (!site) return {};

  return {
    title: site.brandName,
    description: site.seo.metaDescription ?? site.description ?? undefined,
    alternates: {
      canonical: `https://${site.primaryHostname}/`,
    },
  };
}

export default async function HomePage() {
  // Load both shapes once: `site` drives rendering/SEO, `rawSite.id` scopes
  // Prisma queries. The React cache in get-current-site deduplicates lookups.
  const [site, rawSite] = await Promise.all([
    getCurrentSite(),
    getCurrentSiteRaw(),
  ]);

  if (!site || !rawSite) notFound();

  const articles = await prisma.article.findMany({
    where: {
      // Multi-tenant invariant: every content query must be scoped by siteId.
      siteId: rawSite.id,
      status: "PUBLISHED",
    },
    include: {
      author: { select: { name: true } },
      categories: { select: { slug: true, name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  const Design = getDesign(site.theme.designKey);

  return <Design.HomePage site={site} articles={articles} />;
}
