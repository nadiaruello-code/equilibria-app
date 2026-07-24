"use client";

import Link from "next/link";

type ChapterOneSignupProps = {
  isLoggedIn: boolean;
};

export default function ChapterOneSignup({ isLoggedIn }: ChapterOneSignupProps) {
  return (
    <section className="chapter-one-signup">
      <div className="chapter-one-signup__symbol" aria-hidden="true">✦</div>
      <p className="chapter-one-signup__eyebrow">Votre première étape est accomplie</p>
      <h2>Prêt(e) à poursuivre votre voyage&nbsp;?</h2>
      <p className="chapter-one-signup__text">
        Le chapitre 1 reste accessible gratuitement. Pour débloquer la suite du parcours,
        choisissez maintenant l’accès qui vous correspond.
      </p>
      <blockquote>
        « Si ce premier voyage vous a apporté un peu de calme, imaginez ce que les
        prochaines étapes peuvent vous faire découvrir. Je vous attendrai pour la suite. »
        <span>— Lumen</span>
      </blockquote>
      <div className="chapter-one-signup__actions">
        {isLoggedIn ? (
          <Link href="/offres" className="chapter-one-signup__primary">
            Découvrir les accès
          </Link>
        ) : (
          <>
            <Link href="/signup?next=/offres" className="chapter-one-signup__primary">
              Créer mon compte et continuer
            </Link>
            <Link href="/login?next=/offres" className="chapter-one-signup__secondary">
              J’ai déjà un compte
            </Link>
          </>
        )}
      </div>
      <p className="chapter-one-signup__reassurance">
        Chapitre 1 gratuit · Paiement sécurisé pour poursuivre
      </p>
    </section>
  );
}
