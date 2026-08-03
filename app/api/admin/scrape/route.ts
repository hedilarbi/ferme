import { NextResponse } from "next/server";
import { GEMINI_API_KEY, AI_MODEL } from "@/lib/ai/config";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    // 1. Fetch the raw HTML
    const pageResponse = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    
    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch URL: ${pageResponse.statusText}`);
    }
    const html = await pageResponse.text();

    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || 
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    const imageUrl = ogImageMatch ? ogImageMatch[1] : null;

    // Clean HTML to save tokens (remove script, style, SVG tags roughly)
    const cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
      .replace(/<[^>]+>/g, " ") // Remove all other tags
      .replace(/\s+/g, " ")     // Collapse whitespace
      .substring(0, 20000);     // Keep only first 20k chars to stay within limits

    // 2. Send to Gemini for extraction
    const prompt = `
Tu es un expert en extraction de données e-commerce.
Voici le texte brut d'une page produit :
---
${cleanHtml}
---

Extrais les informations suivantes au format JSON STRICT :
{
  "productName": "Nom court du produit (sans la marque si possible)",
  "category": "Catégorie déduite du produit (ex: Table à manger, Canapé)",
  "description": "Une description marketing attrayante basée sur le texte",
  "specs": "Caractéristiques techniques formatées de manière lisible (ex: Dimensions: X, Matériaux: Y, Couleur: Z)",
  "keywords": "5 mots-clés SEO pertinents séparés par des virgules"
}
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const data = await geminiResponse.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;

    if (!text) {
      throw new Error("No content extracted by AI");
    }

    const extracted = JSON.parse(text);
    if (imageUrl) {
      extracted.imageUrl = imageUrl;
    }
    return NextResponse.json(extracted);

  } catch (error: any) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
