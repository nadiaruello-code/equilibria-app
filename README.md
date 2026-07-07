# Equilibria V5 — Projet complet unique pour Vercel

Cette V5 remplace les étapes séparées.

Inclus :
- site d'accueil premium amélioré
- symboles premium
- application membre
- lecteur audio sécurisé
- journal
- progression
- cercle des symboles
- Stripe Checkout
- webhook Stripe
- Supabase Auth
- audios privés Supabase Storage
- espace admin
- upload MP3 admin

## Installation
1. Mets ce dossier sur GitHub.
2. Connecte GitHub à Vercel.
3. Ajoute les variables de `.env.example` dans Vercel.
4. Dans Supabase, exécute `supabase/schema.sql`.
5. Crée le bucket privé `equilibria-audios`.
6. Déploie.

## Admin
Connecte-toi avec l’email défini dans `ADMIN_EMAILS`, puis va sur :
`/admin`

## Upload audio
Va sur :
`/admin/upload`
