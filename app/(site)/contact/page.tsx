import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentSite } from "@/lib/tenant/get-current-site";
import { getDesign } from "@/components/designs/registry";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  if (!site) return {};

  return {
    title: `Contact | ${site.brandName}`,
    description: `Contactez l'équipe de ${site.brandName}.`,
    alternates: {
      canonical: `https://${site.primaryHostname}/contact`,
    },
  };
}

export default async function ContactPage() {
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
        "name": "Contact",
        "item": `${baseUrl}/contact`,
      },
    ],
  };

  const Design = getDesign(site.theme.designKey);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Design.ContactPage site={site} />
    </>
  );
}
