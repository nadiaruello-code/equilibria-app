'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Offres() {
  const [loading, setLoading] = useState('');

  async function checkout(plan: string) {
    setLoading(plan);

    const r = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });

    const d = await r.json();

    if (d.url) {
      window.location.href = d.url;
    } else {
      alert(d.error || 'Erreur Stripe');
    }

    setLoading('');
  }

  return (
    <main className="section">
      <div className="container">

        <h1>Choisissez la suite de votre voyage</h1>

        <p
          style={{
            textAlign: 'center',
            maxWidth: 700,
            margin: '0 auto 40px'
          }}
        >
          Votre premier chapitre est terminé.
          Vous pouvez continuer gratuitement ou choisir un accompagnement
          plus complet pour aller plus loin dans votre transformation.
        </p>

        <div className="cards">

          {/* GRATUIT */}

          <div className="card">

            <h3>🌱 Continuer gratuitement</h3>

            <div className="price">0 €</div>

            <p>
              ✔ Votre espace personnel
              <br />
              ✔ Réécouter le chapitre 1
              <br />
              ✔ Journal personnel
            </p>

            <Link href="/app" className="btn">
              Continuer gratuitement
            </Link>

          </div>

          {/* STARTER */}

          <div className="card">

            <h3>🌿 Voyage 7 jours</h3>

            <div className="price">47 €</div>

            <p>
              ✔ Les 7 premiers jours
              <br />
              ✔ Tous les audios
              <br />
              ✔ Exercices
              <br />
              ✔ Journal
            </p>

            <button
              className="btn"
              disabled={loading !== ''}
              onClick={() => checkout('starter')}
            >
              {loading === 'starter'
                ? 'Chargement...'
                : 'Débloquer 7 jours'}
            </button>

          </div>

          {/* PREMIUM */}

          <div
            className="card premium"
            style={{
              border: '2px solid #d4af37'
            }}
          >

            <h3>✨ Voyage complet</h3>

            <div className="price">197 €</div>

            <p>
              ✔ Les 42 chapitres
              <br />
              ✔ Tous les audios
              <br />
              ✔ Journal complet
              <br />
              ✔ Symboles
              <br />
              ✔ Futures mises à jour
            </p>

            <button
              className="btn gold"
              disabled={loading !== ''}
              onClick={() => checkout('premium')}
            >
              {loading === 'premium'
                ? 'Chargement...'
                : 'Débloquer tout le voyage'}
            </button>

          </div>

        </div>

        <div
          className="card"
          style={{
            marginTop: 50,
            maxWidth: 650,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <h3>🌸 Cercle Equilibria</h3>

          <p>
            Un accompagnement mensuel avec du contenu exclusif,
            de nouveaux exercices et des ressources supplémentaires.
          </p>

          <button
            className="btn"
            disabled={loading !== ''}
            onClick={() => checkout('circle')}
          >
            {loading === 'circle'
              ? 'Chargement...'
              : 'Rejoindre le Cercle'}
          </button>

          <p style={{ marginTop: 10 }}>
            14,90 € / mois
          </p>

        </div>

      </div>
    </main>
  );
}