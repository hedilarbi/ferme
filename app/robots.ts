import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant/resolve-tenant";
import { normalizeHostname } from "@/lib/utils/hostname";

// Dynamically rendered per tenant — must NOT be statically cached
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const rawHostname = headersList.get("x-tenant-hostname") ?? "";
  const hostname = normalizeHostname(rawHostname);

  // Unknown tenants should not be indexed. Returning a restrictive robots file
  // is safer than exposing a generic public policy for unregistered domains.
  const site = await resolveTenant(hostname);

  if (!site) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  const robotsDirective = site.seoSettings?.robots ?? "index,follow";
  // Current SEO settings store the robots directive as a compact string
  // ("index,follow" or "noindex,nofollow"). Split tokens so "noindex" does
  // not accidentally match "index".
  const robotTokens = robotsDirective
    .split(",")
    .map((token) => token.trim().toLowerCase());
  const allowIndexing = robotTokens.includes("index");

  return {
    rules: {
      userAgent: "*",
      allow: allowIndexing ? "/" : undefined,
      disallow: allowIndexing ? ["/api/"] : "/",
    },
    sitemap: `https://${hostname}/sitemap.xml`,
  };
}
