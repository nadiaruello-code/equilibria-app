'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Offres() {
  const [loading, setLoading] = useState('');

  async function checkout(plan: string) {
    try {
      setLoading(plan);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur Stripe');
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error('Lien de paiement introuvable.');
    } catch (error: any) {
      console.error('Erreur checkout :', error);

      alert(
        error?.message ||
          'Une erreur est survenue. Merci de réessayer.'
      );
    } finally {
      setLoading('');
    }
  }

  const isLoading = loading !== '';

  return (
    <main className="section">
      <div className="container">

        {/* INTRO */}

        <div
          style={{
            textAlign: 'center',
            maxWidth: 800,
            margin: '0 auto 50px',
          }}
        >
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 700,
              color: '#b38b2f',
              marginBottom: 12,
            }}
          >
            Equilibria
          </p>

          <h1>
            Choisissez la suite de votre voyage
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              opacity: 0.85,
              marginTop: 18,
            }}
          >
            Vous avez découvert le premier chapitre.
            Continuez à votre rythme et choisissez
            l'expérience qui correspond le mieux à
            vos besoins aujourd'hui.
          </p>
        </div>

        {/* OFFRES PRINCIPALES */}

        <div className="cards">

          {/* GRATUIT */}

          <div className="card">
            <div
              style={{
                fontSize: 32,
                marginBottom: 12,
              }}
            >
              🌱
            </div>

            <h3>
              Continuer gratuitement
            </h3>

            <div className="price">
              0 €
            </div>

            <p
              style={{
                opacity: 0.75,
                minHeight: 48,
              }}
            >
              Gardez votre espace Equilibria et
              prenez le temps de découvrir
              l'expérience.
            </p>

            <div
              style={{
                lineHeight: 1.9,
                margin: '25px 0',
              }}
            >
              ✓ Votre espace personnel
              <br />
              ✓ Réécouter le chapitre 1
              <br />
              ✓ Journal personnel
            </div>

            <Link
              href="/app"
              className="btn"
              style={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              Continuer gratuitement
            </Link>
          </div>

          {/* 7 JOURS */}

          <div className="card">
            <div
              style={{
                fontSize: 32,
                marginBottom: 12,
              }}
            >
              🌿
            </div>

            <h3>
              Voyage 7 jours
            </h3>

            <div className="price">
              47 €
            </div>

            <p
              style={{
                opacity: 0.75,
                minHeight: 48,
              }}
            >
              Une première semaine pour entrer
              pleinement dans l'univers Equilibria.
            </p>

            <div
              style={{
                lineHeight: 1.9,
                margin: '25px 0',
              }}
            >
              ✓ Les 7 premiers chapitres
              <br />
              ✓ Les audios du parcours
              <br />
              ✓ Exercices guidés
              <br />
              ✓ Journal personnel
            </div>

            <button
              className="btn"
              disabled={isLoading}
              onClick={() =>
                checkout('starter')
              }
              style={{
                width: '100%',
              }}
            >
              {loading === 'starter'
                ? 'Ouverture du paiement...'
                : 'Commencer les 7 jours'}
            </button>

            <p
              style={{
                textAlign: 'center',
                marginTop: 12,
                fontSize: 13,
                opacity: 0.65,
              }}
            >
              Paiement unique
            </p>
          </div>

          {/* PREMIUM */}

          <div
            className="card premium"
            style={{
              border: '2px solid #d4af37',
              position: 'relative',
              boxShadow:
                '0 18px 50px rgba(35,48,43,0.10)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -14,
                left: '50%',
                transform:
                  'translateX(-50%)',
                background: '#d4af37',
                color: '#fff',
                padding: '7px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                whiteSpace: 'nowrap',
              }}
            >
              ✨ L'expérience complète
            </div>

            <div
              style={{
                fontSize: 32,
                marginTop: 12,
                marginBottom: 12,
              }}
            >
              ✨
            </div>

            <h3>
              Voyage complet
            </h3>

            <div className="price">
              197 €
            </div>

            <p
              style={{
                fontWeight: 700,
                color: '#9a771e',
                marginTop: -4,
              }}
            >
              ou 3 × 69 €
            </p>

            <p
              style={{
                opacity: 0.75,
                minHeight: 48,
              }}
            >
              L'intégralité du voyage Equilibria :
              42 chapitres pour avancer à votre
              rythme.
            </p>

            <div
              style={{
                lineHeight: 1.9,
                margin: '25px 0',
              }}
            >
              ✓ Les 42 chapitres
              <br />
              ✓ Tous les audios immersifs
              <br />
              ✓ Journal complet
              <br />
              ✓ Les symboles du voyage
              <br />
              ✓ Futures mises à jour incluses
            </div>

            {/* 197 € */}

            <button
              className="btn gold"
              disabled={isLoading}
              onClick={() =>
                checkout('premium')
              }
              style={{
                width: '100%',
                marginBottom: 12,
              }}
            >
              {loading === 'premium'
                ? 'Ouverture du paiement...'
                : 'Payer 197 € en une fois'}
            </button>

            {/* 3 X 69 */}

            <button
              className="btn"
              disabled={isLoading}
              onClick={() =>
                checkout('premium3x')
              }
              style={{
                width: '100%',
              }}
            >
              {loading === 'premium3x'
                ? 'Ouverture du paiement...'
                : 'Payer en 3 × 69 €'}
            </button>

            <p
              style={{
                textAlign: 'center',
                marginTop: 14,
                fontSize: 13,
                opacity: 0.7,
                lineHeight: 1.5,
              }}
            >
              3 mensualités de 69 €.
              <br />
              Total : 207 €.
            </p>

            <p
              style={{
                textAlign: 'center',
                marginTop: 10,
                fontSize: 13,
                opacity: 0.7,
              }}
            >
              🔒 Paiement sécurisé par Stripe
            </p>
          </div>
        </div>

        {/* RÉASSURANCE */}

        <div
          style={{
            maxWidth: 900,
            margin: '55px auto 0',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              marginBottom: 15,
            }}
          >
            Votre voyage, à votre rythme
          </h2>

          <p
            style={{
              lineHeight: 1.7,
              opacity: 0.8,
            }}
          >
            Equilibria est un programme de
            bien-être et de relaxation. Vous
            choisissez quand écouter vos séances
            et avancez selon votre propre rythme.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 18,
              marginTop: 25,
            }}
          >
            <span>
              🎧 Accès immédiat
            </span>

            <span>
              🌿 À votre rythme
            </span>

            <span>
              🔒 Paiement sécurisé
            </span>
          </div>
        </div>

        {/* CERCLE */}

        <div
          className="card"
          style={{
            marginTop: 60,
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 32,
              marginBottom: 10,
            }}
          >
            🌸
          </div>

          <h3>
            Cercle Equilibria
          </h3>

          <div
            className="price"
            style={{
              marginBottom: 5,
            }}
          >
            14,90 €
          </div>

          <p
            style={{
              fontWeight: 600,
              marginTop: 0,
            }}
          >
            par mois
          </p>

          <p
            style={{
              maxWidth: 520,
              margin:
                '20px auto 25px',
              lineHeight: 1.7,
              opacity: 0.8,
            }}
          >
            Pour prolonger l'expérience avec du
            contenu exclusif, de nouveaux exercices
            et des ressources supplémentaires.
          </p>

          <button
            className="btn"
            disabled={isLoading}
            onClick={() =>
              checkout('circle')
            }
          >
            {loading === 'circle'
              ? 'Ouverture du paiement...'
              : 'Rejoindre le Cercle'}
          </button>
        </div>

        {/* MENTION */}

        <p
          style={{
            maxWidth: 800,
            margin: '45px auto 0',
            textAlign: 'center',
            fontSize: 13,
            lineHeight: 1.6,
            opacity: 0.6,
          }}
        >
          Equilibria est un programme de
          bien-être et de relaxation. Il ne
          remplace pas une consultation ou une
          prise en charge médicale,
          psychologique ou psychiatrique.
        </p>

      </div>
    </main>
  );
}