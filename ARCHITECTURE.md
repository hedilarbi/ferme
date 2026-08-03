# 🏗️ Architecture du Projet Ferme

Bienvenue dans la documentation de **Ferme**, un CMS (Content Management System) multi-sites moderne. Ce document est conçu pour être compris par tout le monde, même si vous débutez en développement web.

---

## 🌟 1. Le Concept : "Un moteur, plusieurs carrosseries"

Imaginez que vous voulez lancer 10 sites web différents. Au lieu de copier-coller le code 10 fois, **Ferme** utilise une seule "usine" (le code) pour générer tous les sites à la volée.

- **Un seul code** : Toutes les mises à jour profitent à tout le monde.
- **Une seule base de données** : Tout est centralisé.
- **Personnalisation totale** : Chaque site a son propre nom, ses couleurs, son domaine et son design.

### Comment le système reconnaît le site ?
Quand vous tapez `deco-salon.localhost:3000`, le serveur regarde l'adresse (le "Hostname") et cherche dans la base de données : *"À quel site appartient cette adresse ?"*. Il charge ensuite les articles et les couleurs de ce site précis.

---

## 💾 2. La Base de Données (Simple)

La base de données est le cerveau du projet. Voici les éléments principaux :

- **Site (Tenant)** : C'est l'identité du site (ex: "Déco Salon").
- **Domain** : L'adresse internet du site (ex: `deco-salon.com`). Un site peut avoir plusieurs adresses.
- **Article** : Le contenu (Titre, texte HTML, image). Chaque article appartient à **un seul** site.
- **NavigationItem** : Les liens qui s'affichent dans le menu en haut (Accueil, Contact, etc.).
- **ThemeSettings** : Les "habits" du site (Couleur primaire, Couleur secondaire, et le choix du Design).

---

## 🎨 3. Le Système de Designs

Nous ne changeons pas juste les couleurs, nous pouvons changer toute la structure visuelle grâce au **designKey**.

Actuellement, il existe 3 styles :
1.  **Deco** : Un style "carnet de notes" chaleureux et élégant.
2.  **Guide** : Un style professionnel, propre, idéal pour des comparatifs.
3.  **Magazine** : Un style percutant, avec de grandes images et une typographie forte (style Vogue).

---

## 🛠️ 4. Guide d'utilisation de l'Admin

L'interface d'administration est accessible sur `/admin`.

### Créer un nouveau site
1. Allez dans **Sites** > **New Site**.
2. Remplissez le **Hostname** (ex: `mon-blog.localhost`).
3. Choisissez un **Design Template** (ex: Magazine).
4. Le système créera automatiquement les liens de menu par défaut pour vous.

### Gérer le Menu (Navigation)
1. Allez dans **Navigation**.
2. Sélectionnez votre site.
3. Ajoutez des liens (ex: Label: `Instagram`, URL: `https://instagr.am/...`).
4. Supprimez ou réorganisez les liens existants.

### Publier un Article
1. Allez dans **Articles** > **New Article**.
2. Écrivez votre contenu (vous pouvez utiliser du HTML directement).
3. **Important** : Choisissez bien le site cible dans la liste.

---

## 📂 5. Structure des Fichiers (Où est quoi ?)

Voici les dossiers importants si vous voulez toucher au code :

- `app/(site)/` : Contient les pages que voient vos visiteurs (Accueil, Articles, etc.).
- `app/admin/` : Contient toute l'interface de gestion.
- `components/designs/` : C'est ici que se trouve le "look" des sites. Chaque dossier (`magazine`, `deco`, `guide`) contient ses propres fichiers visuels.
- `lib/` : Le "moteur" interne qui gère la base de données et la détection des sites.
- `prisma/schema.prisma` : La définition de la structure de la base de données.

---

## 🚀 6. Commandes utiles (Terminal)

Si vous devez gérer le projet techniquement :

```bash
npm run dev          # Lancer le projet pour travailler dessus
npx prisma studio    # Ouvrir une interface visuelle pour voir TOUTE la base de données
npm run db:seed      # Réinitialiser les sites de démonstration
```

---

*Ferme est conçu pour être simple à utiliser et puissant à faire évoluer. Bon blogging !*
