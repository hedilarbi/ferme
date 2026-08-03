import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─────────────────────────────────────────────────────────────────────────
  // Site 1 — Déco Salon
  // Accessible at: deco-salon.localhost:3000
  // ─────────────────────────────────────────────────────────────────────────

  const decoSalon = await prisma.site.upsert({
    where: { slug: "deco-salon" },
    update: {},
    create: {
      slug: "deco-salon",
      name: "Déco Salon",
      brandName: "Déco Salon",
      description:
        "Inspirations, conseils et tendances pour décorer votre salon avec style.",
      status: "ACTIVE",
      defaultLocale: "fr",

      domains: {
        create: [
          { hostname: "deco-salon.localhost", isPrimary: true },
          { hostname: "deco-salon.fr", isPrimary: false },
        ],
      },

      themeSettings: {
        create: {
          primaryColor: "#a85b1f",
          secondaryColor: "#2a1b12",
          fontFamily: "Georgia, serif",
          designKey: "deco",
        },
      },

      seoSettings: {
        create: {
          titleTemplate: "%s | Déco Salon",
          metaDescription:
            "Découvrez les meilleures idées déco pour transformer votre salon.",
          robots: "index,follow",
        },
      },

      navigationItems: {
        create: [
          { label: "Accueil", href: "/", order: 0 },
          { label: "Articles", href: "/articles", order: 1 },
          { label: "À propos", href: "/about", order: 2 },
        ],
      },

      authors: {
        create: [
          {
            name: "Sophie Martin",
            bio: "Décoratrice d'intérieur passionnée par les espaces de vie.",
          },
          {
            name: "Julien Lefèvre",
            bio: "Architecte et amateur de design contemporain.",
          },
        ],
      },
    },
    include: {
      authors: true,
      domains: true,
    },
  });

  await prisma.themeSettings.upsert({
    where: { siteId: decoSalon.id },
    update: {
      primaryColor: "#a85b1f",
      secondaryColor: "#2a1b12",
      fontFamily: "Georgia, serif",
      designKey: "deco",
    },
    create: {
      siteId: decoSalon.id,
      primaryColor: "#a85b1f",
      secondaryColor: "#2a1b12",
      fontFamily: "Georgia, serif",
      designKey: "deco",
    },
  });

  // Categories for Déco Salon
  const [tendances, diy, inspirations] = await Promise.all([
    prisma.category.upsert({
      where: { siteId_slug: { siteId: decoSalon.id, slug: "tendances" } },
      update: {},
      create: {
        siteId: decoSalon.id,
        slug: "tendances",
        name: "Tendances",
        description: "Les dernières tendances en matière de décoration intérieure.",
      },
    }),
    prisma.category.upsert({
      where: { siteId_slug: { siteId: decoSalon.id, slug: "diy" } },
      update: {},
      create: {
        siteId: decoSalon.id,
        slug: "diy",
        name: "DIY",
        description: "Projets créatifs à réaliser soi-même pour embellir votre salon.",
      },
    }),
    prisma.category.upsert({
      where: { siteId_slug: { siteId: decoSalon.id, slug: "inspirations" } },
      update: {},
      create: {
        siteId: decoSalon.id,
        slug: "inspirations",
        name: "Inspirations",
        description: "Sélections de salons qui nous ont inspirés.",
      },
    }),
  ]);

  const sophie = decoSalon.authors[0];
  const julien = decoSalon.authors[1];

  // Articles for Déco Salon
  const decoArticles = [
    {
      slug: "couleurs-tendance-2026",
      title: "Les couleurs tendance pour votre salon en 2026",
      excerpt:
        "Terracotta, vert sauge, bleu canard... Découvrez la palette de l'année et comment l'intégrer à votre intérieur.",
      content: `<p>L'année 2026 marque un retour aux nuances chaudes et naturelles dans la décoration intérieure. Le <strong>terracotta</strong>, décliné dans ses teintes les plus douces, s'invite dans les salons contemporains en harmonie avec le bois et le lin brut.</p>
<h2>Le vert sauge, star de l'année</h2>
<p>Doux et apaisant, le vert sauge continue sa montée en puissance. Il se marie parfaitement avec des meubles en chêne clair et des textiles en coton naturel.</p>
<h2>Comment adopter ces couleurs ?</h2>
<ul>
<li>Commencez par un mur d'accent dans la couleur choisie</li>
<li>Ajoutez des coussins et plaids dans des tons complémentaires</li>
<li>Misez sur des plantes vertes pour renforcer l'harmonie</li>
</ul>`,
      authorId: sophie.id,
      categories: tendances.id,
      publishedAt: new Date("2026-01-15"),
      seoTitle: "Couleurs tendance salon 2026 — Guide complet",
      seoDescription:
        "Terracotta, vert sauge, bleu canard : nos conseils pour choisir les couleurs tendance pour votre salon en 2026.",
    },
    {
      slug: "petit-salon-grande-personnalite",
      title: "Petit salon, grande personnalité : maximiser un espace réduit",
      excerpt:
        "Vous avez un salon de moins de 20 m² ? Voici nos astuces pour le rendre grand, lumineux et chaleureux.",
      content: `<p>Un salon de petite superficie n'est pas une fatalité. Avec les bons choix de mobilier et une organisation réfléchie, il devient un espace intime et accueillant.</p>
<h2>Le mobilier multifonction</h2>
<p>Privilégiez un canapé avec rangements intégrés, une table basse transformable en bureau et des étagères murales pour libérer le sol.</p>
<h2>Les couleurs claires</h2>
<p>Un salon peint en blanc cassé ou en gris perle paraîtra instantanément plus grand. Jouez sur les textures pour éviter la monotonie.</p>`,
      authorId: julien.id,
      categories: inspirations.id,
      publishedAt: new Date("2026-02-03"),
    },
    {
      slug: "fabriquer-table-basse-bois",
      title: "Comment fabriquer une table basse en bois récupéré",
      excerpt:
        "Un projet DIY accessible pour donner vie à une table basse unique et éco-responsable.",
      content: `<p>Récupérer des palettes ou des planches de bois pour créer votre propre table basse est un projet à la portée de tous, même sans expérience en menuiserie.</p>
<h2>Matériel nécessaire</h2>
<ul>
<li>2 palettes Europe en bon état</li>
<li>Papier de verre (grain 80 puis 120)</li>
<li>Huile de lin ou vernis mat</li>
<li>Roulettes industrielles (optionnel)</li>
</ul>
<h2>Étapes</h2>
<p>Commencez par poncer soigneusement les palettes pour éliminer les échardes. Appliquez deux couches d'huile de lin en laissant sécher 24h entre chaque couche. Assemblez les deux palettes et fixez les roulettes si souhaité.</p>`,
      authorId: sophie.id,
      categories: diy.id,
      publishedAt: new Date("2026-02-20"),
    },
  ];

  for (const article of decoArticles) {
    await prisma.article.upsert({
      where: { siteId_slug: { siteId: decoSalon.id, slug: article.slug } },
      update: {},
      create: {
        siteId: decoSalon.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        status: "PUBLISHED",
        publishedAt: article.publishedAt,
        authorId: article.authorId,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        categories: { connect: { id: article.categories } },
      },
    });
  }

  console.log(`✅ Site "Déco Salon" seeded (${decoSalon.domains[0].hostname})`);

  // ─────────────────────────────────────────────────────────────────────────
  // Site 2 — Guide Canapé
  // Accessible at: guide-canape.localhost:3000
  // ─────────────────────────────────────────────────────────────────────────

  const guideCanape = await prisma.site.upsert({
    where: { slug: "guide-canape" },
    update: {},
    create: {
      slug: "guide-canape",
      name: "Guide Canapé",
      brandName: "Guide Canapé",
      description:
        "Le guide de référence pour choisir, entretenir et sublimer votre canapé.",
      status: "ACTIVE",
      defaultLocale: "fr",

      domains: {
        create: [
          { hostname: "guide-canape.localhost", isPrimary: true },
          { hostname: "guide-canape.com", isPrimary: false },
        ],
      },

      themeSettings: {
        create: {
          primaryColor: "#07605a",
          secondaryColor: "#102532",
          fontFamily: "system-ui, sans-serif",
          designKey: "guide",
        },
      },

      seoSettings: {
        create: {
          titleTemplate: "%s | Guide Canapé",
          metaDescription:
            "Comparez, choisissez et entretenez votre canapé grâce à nos guides experts.",
          robots: "index,follow",
        },
      },

      navigationItems: {
        create: [
          { label: "Accueil", href: "/", order: 0 },
          { label: "Articles", href: "/articles", order: 1 },
          { label: "Choisir son canapé", href: "/categories/choisir-canape", order: 2 },
          { label: "À propos", href: "/about", order: 3 },
        ],
      },

      authors: {
        create: [
          {
            name: "Marie Dupont",
            bio: "Experte en ameublement et design d'intérieur depuis 15 ans.",
          },
          {
            name: "Thomas Bernard",
            bio: "Passionné de confort et de mobilier contemporain.",
          },
        ],
      },
    },
    include: {
      authors: true,
      domains: true,
    },
  });

  await prisma.themeSettings.upsert({
    where: { siteId: guideCanape.id },
    update: {
      primaryColor: "#07605a",
      secondaryColor: "#102532",
      fontFamily: "system-ui, sans-serif",
      designKey: "guide",
    },
    create: {
      siteId: guideCanape.id,
      primaryColor: "#07605a",
      secondaryColor: "#102532",
      fontFamily: "system-ui, sans-serif",
      designKey: "guide",
    },
  });

  // Categories for Guide Canapé
  const [choisirCanape, entretien, styles] = await Promise.all([
    prisma.category.upsert({
      where: { siteId_slug: { siteId: guideCanape.id, slug: "choisir-canape" } },
      update: {},
      create: {
        siteId: guideCanape.id,
        slug: "choisir-canape",
        name: "Choisir son canapé",
        description: "Tous nos conseils pour trouver le canapé parfait.",
      },
    }),
    prisma.category.upsert({
      where: { siteId_slug: { siteId: guideCanape.id, slug: "entretien" } },
      update: {},
      create: {
        siteId: guideCanape.id,
        slug: "entretien",
        name: "Entretien",
        description: "Comment nettoyer et entretenir votre canapé pour qu'il dure.",
      },
    }),
    prisma.category.upsert({
      where: { siteId_slug: { siteId: guideCanape.id, slug: "styles" } },
      update: {},
      create: {
        siteId: guideCanape.id,
        slug: "styles",
        name: "Styles & tendances",
        description: "Du scandinave au minimaliste, tous les styles de canapés.",
      },
    }),
  ]);

  const marie = guideCanape.authors[0];
  const thomas = guideCanape.authors[1];

  // Articles for Guide Canapé
  const canapeArticles = [
    {
      slug: "choisir-canape-angle-ou-droit",
      title: "Canapé d'angle ou canapé droit : lequel choisir ?",
      excerpt:
        "Tout dépend de la superficie de votre salon et de vos habitudes. Notre guide comparatif pour trancher.",
      content: `<p>Le choix entre un canapé d'angle et un canapé droit est souvent la première grande décision lors de l'aménagement d'un salon. Voici les critères essentiels pour bien choisir.</p>
<h2>Le canapé d'angle</h2>
<p>Idéal pour les grandes pièces, il offre une capacité d'assise maximale et délimite naturellement l'espace salon. Son principal inconvénient : il est difficile à déplacer et peut sembler encombrant dans un petit espace.</p>
<h2>Le canapé droit</h2>
<p>Plus polyvalent, il s'adapte à toutes les configurations de pièce. En version 2, 3 ou 4 places, il reste facilement déplaçable et peut être accompagné d'un fauteuil pour créer un ensemble modulable.</p>
<h2>Notre verdict</h2>
<p>Pour moins de 20 m², optez pour un canapé droit 3 places. Au-delà, le canapé d'angle devient une option sérieuse à envisager.</p>`,
      authorId: marie.id,
      categories: choisirCanape.id,
      publishedAt: new Date("2026-01-10"),
      seoTitle: "Canapé d'angle vs canapé droit — Comment choisir ?",
      seoDescription:
        "Superficie, habitudes, budget : nos critères pour choisir entre canapé d'angle et canapé droit.",
    },
    {
      slug: "nettoyer-canape-tissu",
      title: "Comment nettoyer un canapé en tissu sans l'abîmer",
      excerpt:
        "Taches de café, graisse, poils d'animaux... nos recettes maison pour retrouver un canapé comme neuf.",
      content: `<p>Un canapé en tissu est une éponge à taches. Voici comment le nettoyer efficacement en préservant la matière.</p>
<h2>Le nettoyage régulier</h2>
<p>Passez l'aspirateur avec la brosse à tissu toutes les semaines. Retournez les coussins régulièrement pour usure uniforme.</p>
<h2>Traitement des taches</h2>
<p>Pour une tache de café fraîche : tamponnez (ne frottez pas !) avec du liquide vaisselle dilué dans de l'eau froide. Pour les taches grasses : appliquez du bicarbonate de soude, laissez agir 15 minutes, puis aspirez.</p>
<h2>Nettoyage en profondeur</h2>
<p>Une à deux fois par an, utilisez un nettoyeur vapeur ou confiez votre canapé à un professionnel pour un résultat optimal.</p>`,
      authorId: thomas.id,
      categories: entretien.id,
      publishedAt: new Date("2026-02-05"),
    },
    {
      slug: "canape-style-scandinave",
      title: "Le canapé style scandinave : intemporel et fonctionnel",
      excerpt:
        "Lignes épurées, matières naturelles, palette neutre — le canapé scandinave s'invite dans tous les intérieurs.",
      content: `<p>Le design scandinave a conquis les salons du monde entier pour une raison simple : il allie beauté et fonctionnalité de manière exemplaire.</p>
<h2>Caractéristiques</h2>
<p>Un canapé scandinave se reconnaît à ses pieds en bois fin (chêne, bouleau), ses lignes horizontales et ses tisssus en teintes naturelles (beige, gris, blanc cassé).</p>
<h2>Comment l'intégrer ?</h2>
<p>Associez-le à une table basse en bois clair, un tapis à motifs géométriques et quelques plantes vertes. Évitez le trop plein d'accessoires : le minimalisme est la clé.</p>
<h2>Nos marques recommandées</h2>
<p>Pour un budget serré, explorez les collections IKEA Stockholm. Pour un investissement long terme, les marques Normann Copenhagen ou Muuto offrent une qualité supérieure.</p>`,
      authorId: marie.id,
      categories: styles.id,
      publishedAt: new Date("2026-03-01"),
    },
  ];

  for (const article of canapeArticles) {
    await prisma.article.upsert({
      where: { siteId_slug: { siteId: guideCanape.id, slug: article.slug } },
      update: {},
      create: {
        siteId: guideCanape.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        status: "PUBLISHED",
        publishedAt: article.publishedAt,
        authorId: article.authorId,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        categories: { connect: { id: article.categories } },
      },
    });
  }

  console.log(
    `✅ Site "Guide Canapé" seeded (${guideCanape.domains[0].hostname})`
  );
  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
