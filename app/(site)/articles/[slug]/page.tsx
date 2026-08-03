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

  const article = await prisma.article.findUnique({
    where: { siteId_slug: { siteId: rawSite.id, slug } },
    include: { author: true },
  });

  if (!article) return { title: "Article introuvable" };

  const baseUrl = `https://${site.primaryHostname}`;

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt ?? undefined,
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt ?? undefined,
      type: "article",
      url: `${baseUrl}/articles/${slug}`,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: article.author ? [article.author.name] : undefined,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/articles/${slug}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const [site, rawSite, { slug }] = await Promise.all([
    getCurrentSite(),
    getCurrentSiteRaw(),
    params,
  ]);

  if (!site || !rawSite) notFound();

  const article = await prisma.article.findUnique({
    where: {
      siteId_slug: { siteId: rawSite.id, slug },
      status: "PUBLISHED",
    },
    include: {
      author: true,
      categories: { select: { slug: true, name: true } },
    },
  });

  if (!article) notFound();

  const baseUrl = `https://${site.primaryHostname}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.featuredImage ? [article.featuredImage] : undefined,
        "datePublished": article.publishedAt?.toISOString(),
        "dateModified": article.updatedAt.toISOString(),
        "author": article.author
          ? [
              {
                "@type": "Person",
                "name": article.author.name,
              },
            ]
          : undefined,
        "publisher": {
          "@type": "Organization",
          "name": site.brandName,
          "logo": site.theme.logo
            ? {
                "@type": "ImageObject",
                "url": site.theme.logo,
              }
            : undefined,
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/articles/${slug}`,
        },
      },
      {
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
            "name": "Articles",
            "item": `${baseUrl}/articles`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": article.title,
            "item": `${baseUrl}/articles/${slug}`,
          },
        ],
      },
    ],
  };

  const Design = getDesign(site.theme.designKey);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Design.ArticlePage site={site} article={article} />
    </>
  );
}
