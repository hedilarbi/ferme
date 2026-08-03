import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentSite } from "@/lib/tenant/get-current-site";
import { getDesign } from "@/components/designs/registry";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  if (!site) return {};

  return {
    title: `À propos | ${site.brandName}`,
    description: site.description ?? undefined,
    alternates: {
      canonical: `https://${site.primaryHostname}/about`,
    },
  };
}

export default async function AboutPage() {
  const site = await getCurrentSite();
  if (!site) notFound();

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
        "name": "À propos",
        "item": `${baseUrl}/about`,
      },
    ],
  };

  const Design = getDesign(site.theme.designKey);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Design.AboutPage site={site} />;
    </>
  );
}
