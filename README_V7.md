# Equilibria V7 — Chapitre 1 gratuit puis paiement

## Installation

1. Remplacez votre projet Vercel par le contenu de cette archive.
2. Dans Supabase > SQL Editor, exécutez `supabase/v7_free_chapter_migration.sql`.
3. Vérifiez les variables Vercel existantes pour Supabase et Stripe.
4. Redéployez.

## Parcours utilisateur

- `/chapitre/1` : audio et texte accessibles sans compte.
- Fin de l'audio ou bouton « J’ai terminé » : proposition de créer un compte.
- Création/connexion : redirection vers `/offres`.
- Paiement Stripe : le webhook place le compte en `starter`, `premium` ou `circle`.
- Sans paiement (`free`) : seul le chapitre 1 est accessible.
- `starter` : chapitres 1 à 7, un par jour.
- `premium` et `circle` : chapitres 1 à 42, un par jour.

## Attention aux anciens comptes

La migration ne transforme pas automatiquement tous les comptes `starter` en `free`, afin de ne pas retirer l'accès à des clients qui auraient déjà payé. Une requête commentée est fournie dans le fichier SQL pour convertir uniquement les comptes sans identifiant Stripe.
