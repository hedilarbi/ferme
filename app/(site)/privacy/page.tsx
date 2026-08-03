import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentSite } from "@/lib/tenant/get-current-site";
import { getDesign } from "@/components/designs/registry";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  if (!site) return {};

  return {
    title: `Mentions Légales & Confidentialité | ${site.brandName}`,
    description: `Mentions légales et politique de confidentialité du site ${site.brandName}.`,
    alternates: {
      canonical: `https://${site.primaryHostname}/privacy`,
    },
  };
}

export default async function PrivacyPage() {
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
        "name": "Mentions Légales",
        "item": `${baseUrl}/privacy`,
      },
    ],
  };

  const Design = getDesign(site.theme.designKey);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Design.PrivacyPage site={site} />
    </>
  );
}
