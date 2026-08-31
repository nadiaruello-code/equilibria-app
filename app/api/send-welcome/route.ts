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
      console.error('BREVO_API_KEY manquante');

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

          to: [
            {
              email,
            },
          ],

          subject: 'Bienvenue dans Equilibria 🌿',

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
                text-transform:uppercase;
                color:#987b5f;
              ">
                EQUILIBRIA
              </p>

              <h1 style="font-size:28px;">
                Votre voyage commence ici 🌿
              </h1>

              <p>Bonjour,</p>

              <p>
                Votre espace Equilibria vient d'être créé.
              </p>

              <p>
                Avant de penser à la suite, je vous invite simplement
                à vous accorder quelques minutes pour découvrir
                votre première immersion.
              </p>

              <p>
                Installez-vous dans un endroit calme, prenez vos
                écouteurs si vous le pouvez, et laissez-vous guider
                par Lumen.
              </p>

              <div style="
                margin:32px 0;
                padding:24px;
                background:#f7f3ef;
                border-radius:16px;
                text-align:center;
              ">

                <div style="font-size:30px;">🏮</div>

                <h2>
                  Jour 1 — Le Refuge
                </h2>

                <p>
                  Environ 10 minutes pour respirer,
                  ralentir et entrer dans l'univers d'Equilibria.
                </p>

                <a
                  href="https://www.voyage-equilibria.fr/chapitre/1"
                  style="
                    display:inline-block;
                    margin-top:12px;
                    padding:14px 24px;
                    background:#28332f;
                    color:white;
                    text-decoration:none;
                    border-radius:30px;
                    font-weight:bold;
                  "
                >
                  🎧 Entrer dans le Refuge
                </a>

              </div>

              <p>
                Il n'y a rien à réussir.
                Seulement quelques minutes à vous accorder.
              </p>

              <p>
                Je vous souhaite un beau voyage.
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

              <p style="
                font-size:12px;
                color:#777;
              ">
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
      console.error('Erreur Brevo :', data);

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
    console.error('Erreur send-welcome :', error);

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}