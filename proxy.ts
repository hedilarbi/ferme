import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { normalizeHostname } from "@/lib/utils/hostname";

/**
 * Multi-tenant hostname proxy.
 *
 * Runs before every route. Extracts the request hostname, normalizes it,
 * and forwards it as `x-tenant-hostname` so server components can load
 * the right site without any URL rewrites.
 *
 * Security: we always overwrite any client-supplied `x-tenant-hostname`
 * header to prevent spoofing.
 */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Strip any client-supplied value to prevent header spoofing
  requestHeaders.delete("x-tenant-hostname");

  // This header is the internal contract between the edge/proxy layer and
  // server components. All tenant-aware code should read this value instead of
  // parsing Host headers directly in pages.
  const hostHeader = request.headers.get("host") ?? request.nextUrl.hostname;
  const hostname = normalizeHostname(hostHeader.split(":")[0] ?? "");
  requestHeaders.set("x-tenant-hostname", hostname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static assets.
     * sitemap.xml and robots.txt are included so they can use the
     * x-tenant-hostname header to return per-tenant content.
     *
     * If new public metadata routes are added, keep them inside this matcher
     * so they resolve the same tenant as normal pages.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
