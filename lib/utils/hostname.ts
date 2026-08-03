/**
 * Normalizes a raw hostname into a stable key for DB lookup.
 *
 * Rules:
 * - Strip trailing dots (DNS edge case)
 * - Lowercase always
 * - Keep subdomains intact: "deco-salon.localhost" stays as-is
 * - Strip "www." prefix so www.tenant.com and tenant.com hit the same record
 * - Never strips port — that is removed by the caller (NextRequest.nextUrl.hostname)
 */
export function normalizeHostname(hostname: string): string {
  let h = hostname.toLowerCase().replace(/\.+$/, "");

  // Treat "www.foo.com" as "foo.com" so both map to the same site
  if (h.startsWith("www.")) {
    h = h.slice(4);
  }

  return h;
}

/**
 * Returns true when the hostname looks like a local-dev address.
 * Used to enable helpful dev-mode messages.
 */
export function isLocalhostHostname(hostname: string): boolean {
  const h = normalizeHostname(hostname);
  return h === "localhost" || h.endsWith(".localhost") || h === "127.0.0.1";
}

/**
 * Extracts the subdomain portion from a *.localhost dev address.
 * "deco-salon.localhost" → "deco-salon"
 * "localhost" → null
 */
export function extractLocalhostSubdomain(hostname: string): string | null {
  const h = normalizeHostname(hostname);
  if (h.endsWith(".localhost")) {
    return h.slice(0, -(".localhost".length));
  }
  return null;
}
