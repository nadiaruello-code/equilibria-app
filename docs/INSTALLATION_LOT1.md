# Installation Lot 1 V6.1

## Git
Copie tout le contenu à la racine du dépôt GitHub, commit puis push.

## Vercel
Ajoute les variables de `.env.example`.

## Supabase
SQL Editor : exécute `supabase/schema.sql`.

Authentication > Providers > Email :
- active Email
- pour tester vite, désactive temporairement Confirm email.

URL Configuration :
- Site URL : https://ton-site.vercel.app
- Redirect URLs :
  - https://ton-site.vercel.app/login
  - https://ton-site.vercel.app/app
  - https://ton-site.vercel.app/auth/callback

## Stripe
Webhook :
https://ton-site.vercel.app/api/stripe/webhook

Events :
- checkout.session.completed
- customer.subscription.deleted
- invoice.payment_failed
