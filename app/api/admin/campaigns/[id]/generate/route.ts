import { prisma } from "@/lib/db";
import { buildPrompt } from "@/lib/ai/prompt-builder";
import { generateContent } from "@/lib/ai/generator";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: campaignId } = await params;

  console.log(">>> API ROUTE START: /api/admin/campaigns/generate", { campaignId });

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Update campaign status to GENERATING
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "GENERATING" },
    });

    const sites = await prisma.site.findMany({
      where: { status: "ACTIVE" },
      include: {
        geoSettings: true,
        themeSettings: true,
      },
    });

    // --- Role Distribution Strategy ---
    type RoleType = "LEURRE" | "DOUX" | "SNIPER" | "COMPARATOR" | "VERSUS" | "LISTICLE" | "TRENDS" | "CASE_STUDY" | "HOW_TO" | "ULTIMATE_GUIDE" | "FAQ" | "MYTHS" | "INTERVIEW" | "OP_ED";
    let availableRoles: RoleType[] = [];

    const allRoles: RoleType[] = [
      "COMPARATOR", "SNIPER", "VERSUS", "LISTICLE", "TRENDS", 
      "CASE_STUDY", "HOW_TO", "ULTIMATE_GUIDE", "FAQ", "MYTHS", "INTERVIEW", "OP_ED"
    ];

    if (campaign.strategy === "COMPARATOR_TOP_3") {
      availableRoles = Array(sites.length).fill("COMPARATOR");
    } else if (campaign.strategy === "100_SNIPER") {
      availableRoles = Array(sites.length).fill("SNIPER");
    } else if (campaign.strategy === "70_20_10") {
      // Minimum mix, fill the rest with LEURRE
      availableRoles = ["OP_ED", "DOUX", "SNIPER"];
      while (availableRoles.length < sites.length) availableRoles.push("LEURRE");
    } else {
      // MIXED strategy (default)
      // Guarantee at least one of each intent (Direct, Soft, Decoy)
      const directRoles: RoleType[] = ["COMPARATOR", "SNIPER", "VERSUS"];
      const softRoles: RoleType[] = ["LISTICLE", "TRENDS", "CASE_STUDY", "HOW_TO", "DOUX"];
      const decoyRoles: RoleType[] = ["ULTIMATE_GUIDE", "FAQ", "MYTHS", "INTERVIEW", "OP_ED", "LEURRE"];

      availableRoles.push(directRoles[Math.floor(Math.random() * directRoles.length)]);
      availableRoles.push(softRoles[Math.floor(Math.random() * softRoles.length)]);
      availableRoles.push(decoyRoles[Math.floor(Math.random() * decoyRoles.length)]);

      // Fill remaining if there are more than 3 sites
      while (availableRoles.length < sites.length) {
        availableRoles.push(allRoles[Math.floor(Math.random() * allRoles.length)]);
      }
      
      // Shuffle them so the sites get them randomly
      availableRoles = availableRoles.sort(() => Math.random() - 0.5);
    }

    // Shuffle roles randomly so each site gets a different style every time
    availableRoles = availableRoles.sort(() => Math.random() - 0.5);

    const generationResults = [];
    
    for (const site of sites) {
      try {
        console.log(`>>> GENERATING for site: ${site.name} (${site.id})`);
        
        // Check if already generated
        const existing = await prisma.campaignArticle.findFirst({
          where: { campaignId, siteId: site.id },
        });

        if (existing?.status === "READY" || existing?.status === "PUBLISHED") {
          console.log(`>>> SKIPPING site ${site.name} (already ready/published)`);
          generationResults.push({ siteId: site.id, status: "SKIPPED" });
          continue;
        }

        // Pop a role from our randomized list (fallback to SNIPER just in case)
        const role = availableRoles.pop() || "SNIPER";
        console.log(`>>> ASSIGNED ROLE: ${role} for site: ${site.name}`);

        // Randomize anchor strategy to avoid footprints
        const anchorStrategies = [
          "Mot-clé exact (ex: le nom exact du produit)",
          "Longue traîne (ex: description fonctionnelle détaillée du produit)",
          "Branding (ex: mention du produit avec la marque)",
          "Ancre diluée ou URL nue (ex: 'cliquez ici' ou l'URL complète)"
        ];
        const randomAnchor = anchorStrategies[Math.floor(Math.random() * anchorStrategies.length)];

        const prompt = buildPrompt({ site, campaign, anchorStrategy: randomAnchor, role });
        const generated = await generateContent(prompt);

        // Since free scrapers (like Flickr) return cats for missing French keywords,
        // we use a fast AI image generator to create a perfectly relevant "stock photo" look.
        const imagePrompt = `Professional architectural photography of ${campaign.category}, modern interior design, photorealistic, 8k resolution, natural lighting`;
        const featuredImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=800&nologo=true`;

        const article = await prisma.article.create({
          data: {
            siteId: site.id,
            title: generated.title,
            slug: generated.slug,
            excerpt: generated.excerpt,
            content: generated.content,
            featuredImage: featuredImage,
            seoTitle: generated.seoTitle,
            seoDescription: generated.seoDescription,
            status: "DRAFT",
          }
        });

        await prisma.campaignArticle.upsert({
          where: { 
            campaignId_siteId: { campaignId, siteId: site.id } 
          },
          create: {
            campaignId,
            siteId: site.id,
            status: "READY",
            promptUsed: prompt,
            articleId: article.id
          },
          update: {
            status: "READY",
            promptUsed: prompt,
            articleId: article.id
          }
        });

        generationResults.push({ siteId: site.id, status: "SUCCESS" });
        
        // Wait 3 seconds between sites to respect free tier rate limits
        console.log(`>>> WAITING 3s for next site...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`Failed to generate for site ${site.id}:`, error);
        generationResults.push({ siteId: site.id, status: "FAILED", error: String(error) });
      }
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "REVIEW" },
    });

    return NextResponse.json({ results: generationResults });
  } catch (error) {
    console.error("Campaign generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
