# Installation Lot 3 — Administration

## Fichiers à copier

Copie tous les fichiers de ce lot dans ton projet V6.1, en remplaçant les fichiers existants si demandé.

## CSS

Ajoute le contenu de :

`docs/CSS_AJOUT_LOT3.css`

à la fin de :

`app/globals.css`

## Supabase SQL

Dans Supabase > SQL Editor, exécute :

`supabase/admin_lot3.sql`

## Buckets Supabase Storage

Crée ces buckets privés :

- `equilibria-audios`
- `equilibria-illustrations`

## Variables Vercel

Ajoute :

`SUPABASE_ILLUSTRATION_BUCKET=equilibria-illustrations`

Tu dois déjà avoir :

`SUPABASE_AUDIO_BUCKET=equilibria-audios`

## Pages admin

- `/admin`
- `/admin/chapters`
- `/admin/users`
- `/admin/upload`
- `/admin/illustrations`

## Test rapide

1. Connecte-toi avec l’email défini dans `ADMIN_EMAILS`.
2. Va sur `/admin`.
3. Modifie un chapitre.
4. Va sur `/admin/upload` pour envoyer un audio.
5. Va sur `/admin/illustrations` pour envoyer une illustration.
