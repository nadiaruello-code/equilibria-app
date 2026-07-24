# V6.3 — Correctif Premium automatique

Remplace dans ton projet :

- `app/api/checkout/route.ts`
- `app/api/stripe/webhook/route.ts`

Puis :

1. Commit
2. Push
3. Attends le redéploiement Vercel
4. Connecte-toi avant de cliquer sur une offre
5. Refais un paiement de test
6. Vérifie dans Supabase > profiles que `plan` devient `premium`

Pour un achat déjà réalisé, mets temporairement `plan = premium` à la main dans Supabase.

Le webhook utilise maintenant l'identifiant Supabase du compte connecté, et garde l'email comme solution de secours.
