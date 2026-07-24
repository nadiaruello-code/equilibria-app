"use client"

import Link from "next/link"

type ChapterOneSignupProps = {
  isLoggedIn: boolean
  onContinue?: () => void
}

export default function ChapterOneSignup({
  isLoggedIn,
  onContinue,
}: ChapterOneSignupProps) {
  // Une personne déjà connectée peut poursuivre normalement.
  if (isLoggedIn) {
    return (
      <section className="chapter-one-continue">
        <div className="chapter-one-continue__light" />

        <p className="chapter-one-continue__eyebrow">
          Le voyage continue
        </p>

        <h2>Votre prochaine étape vous attend</h2>

        <p>
          Retrouvez votre espace personnel pour découvrir la suite de votre
          parcours, à votre rythme.
        </p>

        {onContinue && (
          <button
            type="button"
            className="chapter-one-continue__primary"
            onClick={onContinue}
          >
            Continuer mon voyage
          </button>
        )}
      </section>
    )
  }

  return (
    <section className="chapter-one-signup">
      <div className="chapter-one-signup__symbol" aria-hidden="true">
        ✦
      </div>

      <p className="chapter-one-signup__eyebrow">
        Votre première étape est accomplie
      </p>

      <h2>Prêt(e) à poursuivre votre voyage&nbsp;?</h2>

      <p className="chapter-one-signup__text">
        Créez gratuitement votre compte pour conserver votre progression et
        débloquer la suite de votre parcours Equilibria.
      </p>

      <blockquote>
        « Si ce premier voyage vous a apporté un peu de calme, imaginez ce que
        les prochaines étapes peuvent vous faire découvrir. Je vous attendrai
        pour la suite. »
        <span>— Lumen</span>
      </blockquote>

      <div className="chapter-one-signup__actions">
        <Link
          href="/inscription?redirect=/chapitres/2"
          className="chapter-one-signup__primary"
        >
          Créer mon compte gratuitement
        </Link>

        <Link
          href="/connexion?redirect=/chapitres/2"
          className="chapter-one-signup__secondary"
        >
          J’ai déjà un compte
        </Link>
      </div>

      <p className="chapter-one-signup__reassurance">
        Inscription gratuite · Quelques secondes seulement
      </p>
    </section>
  )
}
