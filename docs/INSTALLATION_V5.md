# Installation V5

Utilise uniquement cette version désormais.

## Vercel
Ajoute les variables :
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_AUDIO_BUCKET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PRICE_STARTER
- NEXT_PUBLIC_STRIPE_PRICE_PREMIUM
- NEXT_PUBLIC_STRIPE_PRICE_CIRCLE
- NEXT_PUBLIC_SITE_URL
- ADMIN_EMAILS

## Supabase
SQL Editor : exécuter `supabase/schema.sql`.
Storage : créer `equilibria-audios`, privé.

## Stripe
Webhook :
`https://ton-site.vercel.app/api/stripe/webhook`

Events :
- checkout.session.completed
- customer.subscription.deleted
- invoice.payment_failed
