import { notFound } from "next/navigation";
import { getCurrentSite } from "@/lib/tenant/get-current-site";
import { getDesign } from "@/components/designs/registry";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

/**
 * Tenant-aware layout.
 *
 * Runs on every request that falls under the (site) group.
 * Loads site config once — React's cache() in getCurrentSite() ensures
 * child pages that also call getCurrentSite() don't re-query the DB.
 *
 * Injects per-tenant CSS variables as an inline <style> block so
 * Tailwind utility classes can reference them.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  if (!site) return {};

  const baseUrl = `https://${site.primaryHostname}`;

  return {
    title: {
      default: site.brandName,
      template: site.seo.titleTemplate.replace("%site", site.brandName),
    },
    description: site.seo.metaDescription ?? site.description ?? undefined,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      siteName: site.brandName,
      title: site.brandName,
      description: site.seo.metaDescription ?? site.description ?? undefined,
      url: baseUrl,
      locale: site.defaultLocale,
      type: "website",
      ...(site.seo.defaultOgImage && { images: [site.seo.defaultOgImage] }),
    },
    robots: site.seo.robots,
  };
}

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getCurrentSite();

  if (!site) {
    notFound();
  }

  const { primaryColor, secondaryColor, fontFamily } = site.theme;
  const Design = getDesign(site.theme.designKey);

  const baseUrl = `https://${site.primaryHostname}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": site.brandName,
        "url": baseUrl,
        ...(site.theme.logo && { "logo": site.theme.logo }),
        "description": site.description,
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": site.brandName,
        "publisher": { "@id": `${baseUrl}/#organization` },
        "description": site.description,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* These CSS variables are the theming boundary for shared components. */}
      <style>{`
        :root {
          --color-primary: ${primaryColor};
          --color-secondary: ${secondaryColor};
          --font-body: ${fontFamily};
        }
      `}</style>

      <div className={`flex min-h-screen flex-col ${Design.rootClassName}`}>
        <Design.Header site={site} />
        <main className="flex-1">{children}</main>
        <Design.Footer site={site} />
      </div>
    </>
  );
}
