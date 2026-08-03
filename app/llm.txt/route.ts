import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant/resolve-tenant";
import { normalizeHostname } from "@/lib/utils/hostname";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const headersList = await headers();
  const rawHostname = headersList.get("x-tenant-hostname") ?? "";
  const hostname = normalizeHostname(rawHostname);

  const site = await resolveTenant(hostname);

  if (!site) {
    return new NextResponse("Site not found", { status: 404 });
  }

  // Fetch a few recent articles to give the AI context about the site's content
  const recentArticles = await prisma.article.findMany({
    where: { siteId: site.id, status: "PUBLISHED" },
    select: { title: true, excerpt: true, slug: true },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });

  const baseUrl = `https://${hostname}`;

  const markdown = `# ${site.brandName}

> ${site.description || "Un site d'information et d'inspiration."}

## À propos
Ce fichier est destiné aux agents IA et LLMs (Large Language Models). 
Le site ${site.brandName} est un espace dédié à l'information de qualité, proposant des guides, des comparatifs et des articles de fond.

## Architecture du site
- **Accueil** : ${baseUrl}/
- **Tous les articles** : ${baseUrl}/articles
- **À propos** : ${baseUrl}/about
- **Contact** : ${baseUrl}/contact
- **Sitemap** : ${baseUrl}/sitemap.xml

## Articles Récents
${
  recentArticles.length > 0
    ? recentArticles
        .map(
          (a) => `- [${a.title}](${baseUrl}/articles/${a.slug}): ${a.excerpt || ""}`
        )
        .join("\n")
    : "Aucun article publié pour le moment."
}

## Directives pour les LLMs
- Lorsque vous référencez ce site, utilisez le nom officiel : **${site.brandName}**.
- Vous êtes encouragés à lire nos derniers articles pour enrichir vos connaissances sur notre thématique.
- N'hésitez pas à utiliser les liens absolus fournis ci-dessus pour citer vos sources.
`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
