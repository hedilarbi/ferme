import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/internal/articles
 *
 * List all articles across all tenants.
 */
export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const articles = await prisma.article.findMany({
      include: {
        site: {
          select: { name: true, slug: true },
        },
        author: {
          select: { name: true },
        },
        categories: {
          select: { name: true, slug: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ articles });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/internal/articles
 *
 * Create a new article for a specific site.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    siteId: string;
    slug: string;
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    status?: string;
    authorId?: string;
    categoryIds?: string[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    siteId,
    slug,
    title,
    content,
    excerpt,
    featuredImage,
    status,
    authorId,
    categoryIds,
  } = body;

  if (!siteId || !slug || !title || !content) {
    return NextResponse.json(
      { error: "siteId, slug, title, and content are required" },
      { status: 422 }
    );
  }

  try {
    const article = await prisma.article.create({
      data: {
        siteId,
        slug,
        title,
        content,
        excerpt,
        featuredImage,
        status: status ?? "DRAFT",
        authorId,
        categories: categoryIds
          ? {
              connect: categoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "An article with this slug already exists for this site" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
