import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email manquant' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configuration Brevo manquante' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },

        body: JSON.stringify({
          sender: {
            name: 'Equilibria',
            email: 'contact@voyage-equilibria.fr',
          },

          to: [{ email }],

          subject: '🗝️ La clé du Refuge vous attend',

          htmlContent: `
            <div style="
              max-width:600px;
              margin:0 auto;
              font-family:Arial,sans-serif;
              color:#28332f;
              line-height:1.7;
            ">

              <p style="
                font-size:13px;
                letter-spacing:2px;
                color:#987b5f;
              ">
                EQUILIBRIA
              </p>

              <h1>Vous avez franchi votre première étape.</h1>

              <p>Bonjour,</p>

              <p>
                Vous venez d'aller au bout du premier chapitre
                d'Equilibria.
              </p>

              <p>
                Vous avez découvert <strong>La rencontre</strong>,
                cet espace où ralentir, respirer et revenir à vous.
              </p>

              <p>
                Mais la rencontre n'était que le commencement…
              </p>

              <div style="
                margin:32px 0;
                padding:28px 24px;
                background:#f7f3ef;
                border-radius:16px;
                text-align:center;
              ">

                <div style="font-size:36px;">🗝️</div>

                <p style="
                  font-size:12px;
                  letter-spacing:2px;
                  color:#987b5f;
                ">
                  JOUR 2
                </p>

                <h2>La clé du Refuge</h2>

                <p>
                  Une nouvelle étape vous attend pour ouvrir
                  ce qui, jusqu'ici, était resté fermé.
                </p>

                <p>
                  Lumen vous attend pour poursuivre le voyage.
                </p>

                <a
                  href="https://www.voyage-equilibria.fr/offres"
                  style="
                    display:inline-block;
                    margin-top:12px;
                    padding:14px 24px;
                    background:#28332f;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:30px;
                    font-weight:bold;
                  "
                >
                  Continuer mon voyage →
                </a>

              </div>

              <p>
                Equilibria se poursuit progressivement,
                chapitre après chapitre, à votre rythme.
              </p>

              <p>
                À bientôt dans le Refuge,
              </p>

              <p>
                Nadia<br>
                <strong>Créatrice d'Equilibria</strong>
              </p>

              <hr style="
                margin-top:35px;
                border:none;
                border-top:1px solid #e5e5e5;
              ">

              <p style="font-size:12px;color:#777;">
                Equilibria propose des contenus de bien-être et
                d'accompagnement personnel. Ils ne remplacent pas
                un suivi médical ou psychologique.
              </p>

            </div>
          `,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur Brevo chapitre 1 :', data);

      return NextResponse.json(
        { error: 'Erreur lors de l’envoi', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data.messageId,
    });

  } catch (error) {
    console.error('Erreur send-chapter1-completed :', error);

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}