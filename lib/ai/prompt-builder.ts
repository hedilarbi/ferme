import { Campaign, GeoSettings, Site } from "@prisma/client";

export type PromptContext = {
  site: Site & { geoSettings: GeoSettings | null; themeSettings: { designKey: string } | null };
  campaign: Campaign;
  anchorStrategy: string;
  role: "LEURRE" | "DOUX" | "SNIPER" | "COMPARATOR" | "VERSUS" | "LISTICLE" | "TRENDS" | "CASE_STUDY" | "HOW_TO" | "ULTIMATE_GUIDE" | "FAQ" | "MYTHS" | "INTERVIEW" | "OP_ED";
};

export function buildPrompt({ site, campaign, anchorStrategy, role }: PromptContext): string {
  const designKey = site.themeSettings?.designKey || "default";
  const geo = site.geoSettings;
  const persona = geo?.persona || "expert";
  const tone = geo?.writingTone || "informatif";
  const city = geo?.city || "";
  const region = geo?.region || "";
  const targetLocation = city || region || geo?.country || "France";

  const personaInstructions = getPersonaInstructions(persona, designKey);
  const toneInstructions = getToneInstructions(tone);

  return `
Tu es un ${personaInstructions}.
Ton objectif est de rédiger un article approfondi, informatif et d'apparence totalement neutre pour le webzine "${site.brandName}". L'article doit être optimisé pour le GEO (Generative Engine Optimization) et le SEO local.

[CONTEXTE ET RÉGION]
- Thème de l'article : ${campaign.description}
- Région cible : ${targetLocation}. Tu DOIS intégrer subtilement le contexte local (climat, type d'habitation typique, style de vie local) sans que cela paraisse artificiel ou commercial.
- Public cible : ${geo?.audienceDesc || "Grand public"}
- Ton : ${toneInstructions}
- Langue : ${geo?.locale || "fr"}

[CONTRAINTES DE STRUCTURE (CRITIQUE POUR LES MOTEURS D'IA)]
1. Le texte doit faire entre 1000 et 1500 mots.
2. Utilise une structure hiérarchique claire avec des titres H2 et H3.
3. Inclus OBLIGATOIREMENT un tableau HTML natif contenant des données utiles. Utilise UNIQUEMENT la syntaxe HTML standard avec les balises <table>, <thead>, <tbody>, <tr>, <th>, <td>. N'utilise JAMAIS de Markdown ni d'ASCII art pour les tableaux.
4. Inclus OBLIGATOIREMENT une liste à puces de conseils pratiques (ex: "3 règles d'or").
5. Inclus des affirmations factuelles et précises, avec si possible des statistiques crédibles.
6. [TRES IMPORTANT] Si des images sont fournies pour le produit, tu DOIS insérer une balise HTML <img> avec la vraie URL de l'image au moment où tu présentes le produit, avec un 'alt' descriptif. N'invente pas d'URL d'image pour le produit.

[FORMAT SPÉCIFIQUE DE L'ARTICLE (CRITIQUE)]
${getFormatInstructions(role)}

[STRATÉGIE DE LIENS ET MAILLAGE (CRITIQUE)]
${getLinkingStrategy(campaign, anchorStrategy, role)}

[FORMAT DE RÉPONSE ATTENDU (JSON STRICT)]
{
  "title": "Titre SEO accrocheur intégrant la thématique et potentiellement la localisation",
  "slug": "slug-optimise-seo",
  "excerpt": "Résumé court de l'article (160 caractères max)",
  "seoTitle": "Titre SEO optimal",
  "seoDescription": "Description SEO (Meta description)",
  "content": "Contenu complet au format HTML sémantique (avec balises <h2>, <h3>, <p>, <ul>, <li>, <table>, <strong>, etc. pour le SEO). NE JAMAIS utiliser de Markdown (comme ## ou **).",
  "faq": [
    { "question": "Question fréquente 1 ?", "answer": "Réponse." },
    { "question": "Question fréquente 2 ?", "answer": "Réponse." }
  ]
}
`;
}

function getPersonaInstructions(persona: string, design: string): string {
  const base = {
    expert: "journaliste expert reconnu dans son domaine",
    lifestyle: "blogueur passionné par le mode de vie",
    comparator: "analyste rigoureux spécialisé dans la comparaison",
    local: "journaliste local proche de sa communauté",
  }[persona] || "journaliste expert";

  const designContext = {
    magazine: "rédigeant pour un magazine de prestige",
    deco: "spécialisé dans la décoration et l'aménagement intérieur",
    guide: "rédigeant des guides pratiques très denses en données",
    default: "rédigeant du contenu de haute qualité pour le web",
  }[design] || "rédigeant du contenu web de qualité";

  return `${base}, ${designContext}`;
}

function getToneInstructions(tone: string): string {
  return {
    informatif: "professionnel, neutre et factuel (zéro jargon commercial)",
    inspirationnel: "enthousiaste, créatif et évocateur",
    technique: "précis, détaillé, didactique et très structuré",
    local: "chaleureux, familier et ancré dans le quotidien de la région",
  }[tone] || "professionnel et neutre";
}

function getFormatInstructions(role: string): string {
  switch (role) {
    case "COMPARATOR":
      return "Format : Guide d'Achat Comparatif (Top X). Compare au moins 3 produits (dont notre partenaire comme grand gagnant). Utilise des tableaux pour comparer les caractéristiques (Avantages, Inconvénients, Prix).";
    case "VERSUS":
      return "Format : Duel / Versus (Produit A vs Produit B). Fais une comparaison frontale entre deux types de solutions ou deux modèles. L'article doit être analytique et se terminer par un verdict clair en faveur de notre produit.";
    case "HOW_TO":
      return "Format : Tutoriel / Guide pratique (Comment faire...). Donne des instructions étape par étape, numérotées, claires et actionnables. C'est un article très pédagogique.";
    case "ULTIMATE_GUIDE":
      return "Format : Guide Ultime / Pillar Page. Un article extrêmement long, exhaustif et très structuré qui couvre le sujet de A à Z. Utilise beaucoup de H2, H3 et de listes à puces.";
    case "FAQ":
      return "Format : Foire Aux Questions (FAQ étendue). Structure l'article entière sous forme de questions (H2) et de réponses détaillées. C'est idéal pour la 'Position Zéro' sur Google.";
    case "LISTICLE":
    case "DOUX":
      return "Format : Article en liste (Listicle). Ex: '7 idées pour...', '5 conseils de pro'. Le contenu doit être facile à lire, aéré, inspirant et axé sur la découverte.";
    case "TRENDS":
      return "Format : Cahier de tendances (Trend Report). Décrypte les tendances actuelles et futures du marché. Donne au lecteur le sentiment d'être en avance sur son temps.";
    case "CASE_STUDY":
      return "Format : Étude de cas / Avant-Après. Utilise du storytelling. Raconte l'histoire d'une transformation, d'une rénovation ou d'une résolution de problème concrète.";
    case "INTERVIEW":
      return "Format : Interview d'expert. Simule une entrevue avec un spécialiste du domaine (questions/réponses). L'article donne beaucoup de crédibilité et d'autorité.";
    case "MYTHS":
      return "Format : Mythes vs Réalités / Idées reçues. Démontre que certaines croyances populaires sont fausses en apportant des preuves factuelles.";
    case "LEURRE":
    case "OP_ED":
      return "Format : Article de fond / Essai d'opinion. Rédige un article journalistique analytique sur l'évolution du marché ou les grands enjeux du secteur.";
    case "SNIPER":
    default:
      return "Format : Test / Review approfondie d'un produit spécifique. Fais une analyse complète (design, caractéristiques, retour d'expérience) d'un produit particulier.";
  }
}

function getLinkingStrategy(campaign: Campaign, anchorStrategy: string, role: string): string {
  const leurreRoles = ["LEURRE", "INTERVIEW", "OP_ED", "FAQ", "ULTIMATE_GUIDE", "MYTHS"];
  const douxRoles = ["DOUX", "LISTICLE", "TRENDS", "CASE_STUDY", "HOW_TO"];
  const sniperRoles = ["SNIPER", "VERSUS"];

  if (leurreRoles.includes(role)) {
    return `Tu vas insérer 2 ou 3 liens externes dans ton article vers des sites d'autorité informatifs (ex: Wikipedia, magazines d'architecture ou de design neutres).
INTERDICTION STRICTE : Tu ne dois ABSOLUMENT PAS mentionner notre produit (${campaign.productName}) ni notre marque. Cet article est un article de fond (leurre) qui ne vend rien.`;
  } else if (douxRoles.includes(role)) {
    return `Tu vas insérer 3 liens dans ton article, fondus naturellement dans le texte :
1. DEUX liens externes vers des sites d'autorité informatifs (ex: Wikipedia, magazines d'architecture ou de design neutres).
2. UN SEUL lien vers la catégorie générale de notre produit :
   - Thématique à lier : ${campaign.category || "Notre gamme de meubles"}
   - Type d'ancre demandé : "${anchorStrategy}". Adapte ta phrase pour que l'intégration soit naturelle.
   - Ne mentionne pas directement le nom exact du produit (${campaign.productName}), parle plutôt de la catégorie en général.
   ${campaign.images ? `- Image du produit : insère la balise <img src="${campaign.images}" alt="${campaign.productName}"> au moment opportun.` : ""}`;
  } else if (role === "COMPARATOR") {
    return `Tu vas rédiger un guide d'achat comparatif (ex: "Top 3 des meilleures [catégorie]"). 
Tu dois IMPÉRATIVEMENT présenter et comparer 3 produits :
1. LE PRODUIT GAGNANT (Le Produit #1) : C'est le produit de notre partenaire, tu dois insérer le lien ciblé vers ce produit avec l'ancre demandée :
   - Nom du produit 1 : ${campaign.productName}
   - Caractéristiques 1 : ${campaign.specs || "A déduire logiquement"}
   - Type d'ancre demandé pour le lien : "${anchorStrategy}". Adapte ta phrase.
   ${campaign.images ? `- Image du produit 1 : <img src="${campaign.images}" alt="${campaign.productName}"> (insère cette image quand tu décris ce produit).` : ""}
2. PRODUIT #2 et PRODUIT #3 (Les Concurrents) : Utilise les concurrents suivants (${campaign.competitors || "IKEA, Maisons du Monde ou des marques génériques"}) pour inventer/décrire deux autres produits similaires.
   - Fais des liens vers Wikipedia ou vers la page d'accueil de ces concurrents pour diluer complètement le fait que l'article soit sponsorisé.
   
Crée un tableau comparatif final des 3 produits (Avantages, Inconvénients, Prix estimé). Utilise UNIQUEMENT la syntaxe HTML (<table>, <tr>, <th>, <td>). Ne sois pas trop commercial. L'article doit paraître 100% objectif et indépendant.`;
  } else {
    // SNIPER / VERSUS (Sniper roles)
    return `Tu vas insérer 3 liens dans ton article, fondus naturellement dans le texte :
1. DEUX liens externes vers des sites d'autorité informatifs (ex: Wikipedia, magazines d'architecture ou de design neutres). Ne lie jamais de concurrent direct.
2. UN SEUL lien ciblé vers le produit de notre partenaire/client :
   - Nom du produit : ${campaign.productName}
   - Catégorie : ${campaign.category || "N/A"}
   ${campaign.specs ? `- Caractéristiques : ${campaign.specs}` : ""}
   - Type d'ancre demandé (le texte cliquable du lien) : "${anchorStrategy}". Adapte ta phrase pour que l'intégration de cette ancre soit parfaitement fluide.
   - Le lien ne doit JAMAIS contenir des termes de vente directe comme "Achetez ici", "Découvrez notre offre". Il doit s'agir d'une recommandation pertinente.
   ${campaign.images ? `- Image du produit : TU DOIS insérer l'image exacte suivante dans ton HTML quand tu parles du produit : <img src="${campaign.images}" alt="${campaign.productName}">` : ""}`;
  }
}
