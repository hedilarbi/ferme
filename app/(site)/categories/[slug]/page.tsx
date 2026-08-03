import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentSite, getCurrentSiteRaw } from "@/lib/tenant/get-current-site";
import { prisma } from "@/lib/db";
import { getDesign } from "@/components/designs/registry";
import { JsonLd } from "@/components/seo/json-ld";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [site, rawSite, { slug }] = await Promise.all([
    getCurrentSite(),
    getCurrentSiteRaw(),
    params,
  ]);
  if (!site || !rawSite) return {};

  // Categories follow the same tenant-scoped slug rule as articles.
  const category = await prisma.category.findUnique({
    where: { siteId_slug: { siteId: rawSite.id, slug } },
  });

  if (!category) return { title: "Catégorie introuvable" };

  return {
    title: `${category.name} | ${site.brandName}`,
    description: category.description ?? undefined,
    alternates: {
      canonical: `https://${site.primaryHostname}/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const [site, rawSite, { slug }] = await Promise.all([
    getCurrentSite(),
    getCurrentSiteRaw(),
    params,
  ]);

  if (!site || !rawSite) notFound();

  const category = await prisma.category.findUnique({
    // The compound key prevents one tenant's category slug from resolving on
    // another tenant that happens to use the same URL segment.
    where: { siteId_slug: { siteId: rawSite.id, slug } },
    include: {
      articles: {
        // Only public content is rendered here; drafts stay available for
        // future admin tooling but are not listed on the public site.
        where: { status: "PUBLISHED" },
        include: {
          author: { select: { name: true } },
          categories: { select: { slug: true, name: true } },
        },
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!category) notFound();

  const baseUrl = `https://${site.primaryHostname}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": site.brandName,
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category.name,
        "item": `${baseUrl}/categories/${slug}`,
      },
    ],
  };

  const Design = getDesign(site.theme.designKey);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Design.CategoryPage site={site} category={category} />
    </>
  );
}
