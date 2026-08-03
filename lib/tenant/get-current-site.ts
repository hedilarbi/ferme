import { cache } from "react";
import { headers } from "next/headers";
import { resolveTenant } from "./resolve-tenant";
import { toSiteContext } from "./cache";
import type { SiteContext, SiteWithRelations } from "./types";

/**
 * Reads the hostname injected by proxy.ts and returns the full site payload.
 *
 * `cache()` from React deduplicates this call within a single render pass,
 * so calling it from both layout and page costs only one DB round-trip.
 *
 * Returns null when no matching site is found. Callers should call
 * `notFound()` from "next/navigation" in that case.
 */
export const getCurrentSite = cache(async (): Promise<SiteContext | null> => {
  const headersList = await headers();

  // `x-tenant-hostname` is injected by proxy.ts. Do not trust user-provided
  // tenant IDs in route params or query strings for public tenant resolution.
  const hostname = headersList.get("x-tenant-hostname");

  if (!hostname) return null;

  const site = await resolveTenant(hostname);
  if (!site) return null;

  return toSiteContext(site, hostname);
});

/**
 * Same as getCurrentSite but returns the raw Prisma record.
 * Useful when you need to pass siteId to content queries.
 */
export const getCurrentSiteRaw = cache(
  async (): Promise<SiteWithRelations | null> => {
    const headersList = await headers();
    const hostname = headersList.get("x-tenant-hostname");

    if (!hostname) return null;

    // Pages use this raw object mainly for `site.id`, which must be included
    // in every content query to avoid mixing articles between tenants.
    return resolveTenant(hostname);
  }
);
