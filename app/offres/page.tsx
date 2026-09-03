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
            maxWidth: 820,
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
            Vos 3 premières étapes étaient le début.
          </h1>

          <p
            style={{
              fontSize: '1.08rem',
              lineHeight: 1.75,
              opacity: 0.85,
              marginTop: 18,
            }}
          >
            Vous avez rencontré Lumen, découvert l&apos;univers
            d&apos;Equilibria et commencé à créer vos premiers repères
            intérieurs.
            <br />
            <br />
            Si vous souhaitez poursuivre, choisissez maintenant la façon
            dont vous voulez continuer votre voyage.
          </p>
        </div>

        {/* OFFRE PRINCIPALE */}

        <div
          className="card premium"
          style={{
            maxWidth: 780,
            margin: '0 auto',
            border: '2px solid #d4af37',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(35,48,43,0.12)',
            padding: '42px 32px 32px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#d4af37',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            ✨ Le voyage complet
          </div>

          <div
            style={{
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 38,
                marginBottom: 10,
              }}
            >
              🌿
            </div>

            <h2
              style={{
                marginBottom: 8,
              }}
            >
              42 jours pour retrouver votre espace intérieur
            </h2>

            <p
              style={{
                maxWidth: 620,
                margin: '0 auto',
                lineHeight: 1.7,
                opacity: 0.78,
              }}
            >
              Poursuivez l&apos;histoire de Lumen et laissez-vous guider,
              une étape après l&apos;autre, sans avoir à vous demander
              quoi faire ni par où commencer.
            </p>
          </div>

          {/* PROMO */}

          <div
            style={{
              textAlign: 'center',
              margin: '30px 0 24px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: '#f6efe0',
                color: '#8a6a1f',
                padding: '7px 15px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                marginBottom: 14,
              }}
            >
              🍂 OFFRE RENTRÉE · -24 %
            </div>

            <div>
              <span
                style={{
                  textDecoration: 'line-through',
                  opacity: 0.45,
                  fontSize: 22,
                  marginRight: 12,
                }}
              >
                197 €
              </span>

              <span
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: '#9a771e',
                }}
              >
                150 €
              </span>
            </div>

            <p
              style={{
                margin: '10px 0 6px',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              avec le code
            </p>

            <div
              style={{
                display: 'inline-block',
                border: '2px dashed #d4af37',
                borderRadius: 8,
                padding: '7px 15px',
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#8a6a1f',
                background: '#fffdf7',
              }}
            >
              RENTREE26
            </div>

            <p
              style={{
                margin: '9px 0 0',
                fontSize: 13,
                opacity: 0.65,
              }}
            >
              Offre valable jusqu&apos;au 15 septembre 2026
            </p>
          </div>

          {/* BÉNÉFICES */}

          <div
            style={{
              maxWidth: 570,
              margin: '30px auto',
              lineHeight: 2,
              fontSize: '1rem',
            }}
          >
            <div>✓ 10 minutes par jour pour vous retrouver</div>
            <div>✓ Une progression guidée sur 42 chapitres</div>
            <div>✓ Tous les audios immersifs d&apos;Equilibria</div>
            <div>✓ Une histoire qui évolue avec votre parcours</div>
            <div>✓ Votre journal personnel</div>
            <div>✓ Les symboles récoltés au fil du voyage</div>
            <div>✓ Accès à l&apos;ensemble du parcours</div>
            <div>✓ Futures mises à jour incluses</div>
          </div>

          <p
            style={{
              maxWidth: 620,
              margin: '0 auto 28px',
              textAlign: 'center',
              lineHeight: 1.7,
              opacity: 0.78,
            }}
          >
            Vous n&apos;avez pas besoin d&apos;aller vite.
            Equilibria est conçu pour avancer progressivement,
            en laissant chaque étape faire son chemin.
          </p>

          {/* PAIEMENT COMPTANT */}

          <button
            className="btn gold"
            disabled={isLoading}
            onClick={() => checkout('premium')}
            style={{
              width: '100%',
              maxWidth: 520,
              display: 'block',
              margin: '0 auto 8px',
              padding: '15px 20px',
              fontSize: 16,
            }}
          >
            {loading === 'premium'
              ? 'Ouverture du paiement...'
              : '✨ Continuer le voyage complet'}
          </button>

          <p
            style={{
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 24,
              fontSize: 13,
              fontWeight: 700,
              color: '#9a771e',
            }}
          >
            Entrez le code RENTREE26 au moment du paiement pour bénéficier
            du tarif de 150 €
          </p>

          {/* 3 FOIS */}

          <div
            style={{
              borderTop: '1px solid rgba(0,0,0,0.08)',
              maxWidth: 520,
              margin: '25px auto 20px',
            }}
          />

          <p
            style={{
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 12,
              opacity: 0.75,
            }}
          >
            Vous préférez étaler votre paiement ?
          </p>

          <button
            className="btn"
            disabled={isLoading}
            onClick={() => checkout('premium3x')}
            style={{
              width: '100%',
              maxWidth: 520,
              display: 'block',
              margin: '0 auto',
            }}
          >
            {loading === 'premium3x'
              ? 'Ouverture du paiement...'
              : 'Payer en 3 × 69 €'}
          </button>

          <p
            style={{
              textAlign: 'center',
              marginTop: 12,
              fontSize: 12,
              opacity: 0.62,
              lineHeight: 1.5,
            }}
          >
            3 mensualités de 69 € · Total : 207 €
            <br />
            Le code RENTREE26 ne s&apos;applique pas au paiement en 3 fois.
          </p>

          <p
            style={{
              textAlign: 'center',
              marginTop: 15,
              fontSize: 13,
              opacity: 0.7,
            }}
          >
            🔒 Paiement sécurisé par Stripe
          </p>
        </div>

        {/* POURQUOI CONTINUER */}

        <div
          style={{
            maxWidth: 900,
            margin: '65px auto 0',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: 30,
            }}
          >
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 700,
                color: '#8b9b8e',
                fontSize: 13,
              }}
            >
              La suite du voyage
            </p>

            <h2>
              Les premières étapes ouvrent la porte.
              <br />
              La transformation se construit ensuite.
            </h2>
          </div>

          <div className="cards">
            <div className="card">
              <div
                style={{
                  fontSize: 30,
                  marginBottom: 10,
                }}
              >
                🌿
              </div>

              <h3>Créer votre rendez-vous</h3>

              <p
                style={{
                  lineHeight: 1.65,
                  opacity: 0.78,
                }}
              >
                Quelques minutes régulières pour sortir du rythme
                automatique et revenir vers vous.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  fontSize: 30,
                  marginBottom: 10,
                }}
              >
                🏮
              </div>

              <h3>Suivre un chemin</h3>

              <p
                style={{
                  lineHeight: 1.65,
                  opacity: 0.78,
                }}
              >
                Vous n&apos;avez rien à préparer. Lumen vous accompagne
                d&apos;une étape à la suivante.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  fontSize: 30,
                  marginBottom: 10,
                }}
              >
                ✨
              </div>

              <h3>Laisser une trace</h3>

              <p
                style={{
                  lineHeight: 1.65,
                  opacity: 0.78,
                }}
              >
                Votre journal et vos symboles vous permettent de voir
                progressivement le chemin parcouru.
              </p>
            </div>
          </div>
        </div>

        {/* PETITE OFFRE 7 JOURS */}

        <div
          className="card"
          style={{
            maxWidth: 700,
            margin: '65px auto 0',
            padding: '30px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 32,
                marginBottom: 8,
              }}
            >
              🌱
            </div>

            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: 12,
                fontWeight: 700,
                opacity: 0.6,
              }}
            >
              Une alternative plus courte
            </p>

            <h2
              style={{
                marginBottom: 8,
              }}
            >
              Voyage 7 jours
            </h2>

            <div
              className="price"
              style={{
                marginBottom: 14,
              }}
            >
              47 €
            </div>

            <p
              style={{
                maxWidth: 540,
                margin: '0 auto 22px',
                lineHeight: 1.7,
                opacity: 0.78,
              }}
            >
              Vous souhaitez prolonger l&apos;expérience sans vous engager
              encore dans les 42 chapitres ? Accédez aux 7 premières étapes
              du voyage.
            </p>

            <div
              style={{
                maxWidth: 430,
                margin: '0 auto 25px',
                lineHeight: 1.9,
                textAlign: 'left',
              }}
            >
              ✓ Accès aux 7 premiers chapitres
              <br />
              ✓ Tous les audios de ces 7 étapes
              <br />
              ✓ Exercices guidés
              <br />
              ✓ Journal personnel
            </div>

            <button
              className="btn"
              disabled={isLoading}
              onClick={() => checkout('starter')}
              style={{
                width: '100%',
                maxWidth: 420,
              }}
            >
              {loading === 'starter'
                ? 'Ouverture du paiement...'
                : 'Continuer jusqu’au chapitre 7'}
            </button>

            <p
              style={{
                marginTop: 10,
                fontSize: 13,
                opacity: 0.62,
              }}
            >
              Paiement unique de 47 €
            </p>
          </div>
        </div>

        {/* PAS MAINTENANT */}

        <div
          style={{
            maxWidth: 700,
            margin: '45px auto 0',
            textAlign: 'center',
            padding: '25px 20px',
          }}
        >
          <p
            style={{
              lineHeight: 1.7,
              opacity: 0.72,
              marginBottom: 12,
            }}
          >
            Vous ne souhaitez pas poursuivre maintenant ?
            Vos 3 premiers chapitres et votre espace Equilibria
            restent accessibles.
          </p>

          <Link
            href="/app"
            className="textLink darkLink"
          >
            Retourner à mon espace →
          </Link>
        </div>

        {/* RÉASSURANCE */}

        <div
          style={{
            maxWidth: 900,
            margin: '50px auto 0',
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
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            Equilibria est une expérience de bien-être et de relaxation.
            Vous choisissez quand écouter vos séances et avancez
            progressivement selon votre propre rythme.
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
            <span>🎧 Accès depuis votre espace</span>
            <span>🌿 À votre rythme</span>
            <span>🔒 Paiement sécurisé</span>
          </div>
        </div>

        {/* CERCLE */}

        <div
          className="card"
          style={{
            marginTop: 65,
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

          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: 12,
              fontWeight: 700,
              opacity: 0.6,
            }}
          >
            Pour aller encore plus loin
          </p>

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
              margin: '20px auto 25px',
              lineHeight: 1.7,
              opacity: 0.8,
            }}
          >
            Un espace complémentaire pour prolonger l&apos;expérience
            avec du contenu exclusif, de nouveaux exercices et des
            ressources supplémentaires.
          </p>

          <button
            className="btn"
            disabled={isLoading}
            onClick={() => checkout('circle')}
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
          Equilibria est un programme de bien-être et de relaxation.
          Il ne remplace pas une consultation ou une prise en charge
          médicale, psychologique ou psychiatrique.
        </p>

      </div>
    </main>
  );
}