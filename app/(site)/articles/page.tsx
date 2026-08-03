import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentSite, getCurrentSiteRaw } from "@/lib/tenant/get-current-site";
import { prisma } from "@/lib/db";
import { getDesign } from "@/components/designs/registry";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  if (!site) return {};

  return {
    title: `Articles | ${site.brandName}`,
    alternates: {
      canonical: `https://${site.primaryHostname}/articles`,
    },
  };
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // In Next.js 16, searchParams is asynchronous. Resolve it with tenant data so
  // pagination and site context are ready before running the article queries.
  const [site, rawSite, { page: pageParam }] = await Promise.all([
    getCurrentSite(),
    getCurrentSiteRaw(),
    searchParams,
  ]);

  if (!site || !rawSite) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const pageSize = 9;

  // The list query and count query must use the same tenant/status filter so
  // pagination totals never include content from another site.
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { siteId: rawSite.id, status: "PUBLISHED" },
      include: {
        author: { select: { name: true } },
        categories: { select: { slug: true, name: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.article.count({
      where: { siteId: rawSite.id, status: "PUBLISHED" },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const Design = getDesign(site.theme.designKey);

  return (
    <Design.ArticlesPage
      site={site}
      articles={articles}
      page={page}
      totalPages={totalPages}
    />
  );
}
