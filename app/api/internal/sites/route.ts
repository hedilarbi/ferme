import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeHostname } from "@/lib/utils/hostname";

/**
 * POST /api/internal/sites
 *
 * Internal helper to create a new site record via API.
 * Protect this route with a shared secret in production.
 *
 * Body:
 * {
 *   slug: string;
 *   brandName: string;
 *   name: string;
 *   hostname: string;         // primary domain
 *   description?: string;
 *   primaryColor?: string;
 *   secondaryColor?: string;
 *   designKey?: string;       // "default" | registered design key
 * }
 */
export async function POST(request: NextRequest) {
  // This endpoint is operational tooling, not a public signup route. Keep it
  // behind a shared secret or replace it with authenticated admin access.
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    slug: string;
    brandName: string;
    name: string;
    hostname: string;
    description?: string;
    primaryColor?: string;
    secondaryColor?: string;
    designKey?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, brandName, name, hostname, description, primaryColor, secondaryColor, designKey } =
    body;

  if (!slug || !brandName || !name || !hostname) {
    return NextResponse.json(
      { error: "slug, brandName, name, and hostname are required" },
      { status: 422 }
    );
  }

  try {
    const normalizedHostname = normalizeHostname(hostname);

    // Nested Prisma writes keep the site, primary domain, theme, and SEO record
    // consistent. If one write fails, the full create operation is rolled back.
    const site = await prisma.site.create({
      data: {
        slug,
        brandName,
        name,
        description,
        domains: {
          create: { hostname: normalizedHostname, isPrimary: true },
        },
        themeSettings: {
          create: {
            primaryColor: primaryColor ?? "#3b82f6",
            secondaryColor: secondaryColor ?? "#64748b",
            designKey: designKey ?? "default",
          },
        },
        seoSettings: {
          create: {
            titleTemplate: `%s | ${brandName}`,
          },
        },
      },
      include: { domains: true },
    });

    return NextResponse.json({ site }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Unique constraint violation on slug or hostname
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Slug or hostname already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/internal/sites
 *
 * List all available sites.
 */
export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sites = await prisma.site.findMany({
      include: {
        domains: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ sites });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
