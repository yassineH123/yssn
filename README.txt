══════════════════════════════════════════════
  ÉTAPES COMPLÈTES — DÉPLOIEMENT
══════════════════════════════════════════════

ÉTAPE 1 — Créer un nouveau repo GitHub
────────────────────────────────────────
1. Va sur https://github.com
2. Clique le + en haut à droite → "New repository"
3. Nom : lovegift
4. Visibility : Private
5. NE PAS cocher "Add README"
6. Clique "Create repository"
7. Copie le lien (ex: https://github.com/yassineH123/lovegift.git)


ÉTAPE 2 — Envoyer le code sur GitHub
──────────────────────────────────────
Ouvre un terminal dans le dossier lovegift/ et tape :

  git init
  git add .
  git commit -m "first commit"
  git branch -M main
  git remote add origin https://github.com/yassineH123/lovegift.git
  git push -u origin main


ÉTAPE 3 — Déployer sur Vercel
───────────────────────────────
1. Va sur https://vercel.com
2. "Add New Project" → sélectionne "lovegift"
3. Avant de déployer, ouvre "Environment Variables" et ajoute :

   ADMIN_PASSWORD  →  love2024
   JSONBIN_ID      →  69b8023faa77b81da9ec8909
   JSONBIN_KEY     →  $2a$10$0mouktWmzpzMaX1Ia6RIx.4cKwRUdznnhBHQ2.Ri.wY2Gy9COITeO

4. Clique "Deploy"
5. Tu reçois ton lien !


UTILISATION
─────────────
Son lien (envoie-lui ça) :
  https://ton-site.vercel.app

Ton admin (uniquement toi) :
  https://ton-site.vercel.app/admin.html
  Mot de passe : love2024


══════════════════════════════════════════════
