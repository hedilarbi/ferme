import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant/resolve-tenant";
import { normalizeHostname } from "@/lib/utils/hostname";
import { prisma } from "@/lib/db";

// Dynamically rendered per tenant
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const rawHostname = headersList.get("x-tenant-hostname") ?? "";
  const hostname = normalizeHostname(rawHostname);

  // The sitemap is generated from the request hostname, not from a configured
  // default domain, so custom domains receive tenant-correct URLs.
  const site = await resolveTenant(hostname);
  if (!site) return [];

  const base = `https://${hostname}`;

  // Static public pages that exist for every active tenant.
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: site.updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: site.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/contact`,
      lastModified: site.updatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: site.updatedAt,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];

  // Tenant-scoped article URLs. Drafts are excluded from search indexes.
  const articles = await prisma.article.findMany({
    where: { siteId: site.id, status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Categories do not have a publication status, so all tenant categories are
  // exposed here. Add a status field later if categories need draft behavior.
  const categories = await prisma.category.findMany({
    where: { siteId: site.id },
    select: { slug: true, updatedAt: true },
  });

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...articleUrls, ...categoryUrls];
}
