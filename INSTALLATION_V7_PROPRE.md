# EQUILIBRIA V7 PROPRE — installation sans mélanger les fichiers

## 1. Ce ZIP est déjà à la bonne racine

Après extraction, le dossier doit contenir directement :

- `app/`
- `components/`
- `lib/`
- `public/`
- `supabase/`
- `package.json`
- `next.config.js`
- `tsconfig.json`

Ne téléversez pas un dossier `equilibria-app-main` à l’intérieur d’un autre dossier du même nom.

## 2. La méthode la plus sûre avec GitHub Desktop

1. Téléchargez d’abord une sauvegarde du dépôt GitHub actuel.
2. Sur votre ordinateur, ouvrez le dossier local relié au dépôt GitHub.
3. Supprimez uniquement les anciens fichiers et dossiers du projet dans ce dossier local. Ne supprimez pas le dossier caché `.git`.
4. Copiez dans ce dossier local tout le contenu de cette V7.
5. Dans GitHub Desktop, vérifiez les changements.
6. Saisissez le message `Installation V7 propre`.
7. Cliquez sur **Commit to main**, puis **Push origin**.
8. Vercel relancera le déploiement automatiquement.

## 3. Migration Supabase obligatoire

Dans Supabase :

1. Ouvrez **SQL Editor**.
2. Ouvrez le fichier `supabase/v7_free_chapter_migration.sql` de cette V7.
3. Copiez tout son contenu dans une nouvelle requête.
4. Cliquez sur **Run**.

Cette migration autorise le plan `free`, utilisé pour laisser le chapitre 1 accessible sans paiement.

## 4. Fonctionnement de cette V7

- `/chapitre/1` : accessible sans compte, avec audio et texte.
- À la fin : création de compte ou connexion.
- `/offres` : choix du paiement Stripe.
- Chapitres 2 à 42 : compte et formule payante nécessaires.
- Le rythme d’un chapitre par jour est conservé.

## 5. Variables Vercel à conserver

Ne supprimez pas les variables déjà présentes dans Vercel. Cette version utilise notamment :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_AUDIO_BUCKET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PREMIUM`
- `STRIPE_PRICE_CIRCLE`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAILS`

## 6. Vérification après publication

Testez dans une fenêtre de navigation privée :

1. La page d’accueil s’ouvre.
2. Le bouton d’écoute gratuite ouvre `/chapitre/1` sans connexion.
3. L’audio du chapitre 1 se charge.
4. Le chapitre 2 redirige vers la connexion ou les offres.
5. La création de compte fonctionne.
6. La page `/offres` ouvre Stripe après connexion.
