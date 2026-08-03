import { prisma } from "@/lib/db";
import { normalizeHostname } from "@/lib/utils/hostname";
import type { SiteWithRelations } from "./types";

/**
 * Looks up the site that owns `hostname`.
 *
 * Returns null when no matching Domain record exists so callers can
 * render a "site not found" experience rather than throwing.
 *
 * The query is intentionally lean: only data used in every render is
 * selected. Article / category content is fetched separately per page.
 */
export async function resolveTenant(
  rawHostname: string
): Promise<SiteWithRelations | null> {
  // Always normalize before querying. Domain records should be stored in the
  // same normalized format so custom domains and localhost tenants behave the
  // same way.
  const hostname = normalizeHostname(rawHostname);

  if (!hostname) return null;

  const domain = await prisma.domain.findUnique({
    where: { hostname },
    include: {
      site: {
        include: {
          domains: true,
          themeSettings: true,
          seoSettings: true,
          navigationItems: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!domain) return null;

  // Inactive sites are intentionally hidden from all public pages and metadata
  // routes. Admin tooling can use a separate lookup if it needs to inspect them.
  if (domain.site.status !== "ACTIVE") return null;

  return domain.site;
}
