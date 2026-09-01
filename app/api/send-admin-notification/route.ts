import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email inscrit manquant' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!apiKey || !adminEmail) {
      console.error('BREVO_API_KEY ou ADMIN_EMAIL manquant');

      return NextResponse.json(
        { error: 'Configuration email manquante' },
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
              email: adminEmail,
            },
          ],

          subject: '🌿 Nouvelle inscription Equilibria',

          htmlContent: `
            <div style="
              max-width:600px;
              margin:0 auto;
              font-family:Arial,sans-serif;
              color:#28332f;
              line-height:1.6;
            ">
              <h2>🌿 Nouvelle inscription Equilibria</h2>

              <p>
                Une nouvelle personne vient de créer son espace gratuit.
              </p>

              <div style="
                padding:20px;
                margin:20px 0;
                background:#f7f3ef;
                border-radius:14px;
              ">
                <strong>Email :</strong><br>
                ${email}
              </div>

              <p>
                Tu peux maintenant suivre son parcours :
                inscription → chapitre 1 → Premium.
              </p>
            </div>
          `,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur Brevo notification admin :', data);

      return NextResponse.json(
        { error: 'Erreur Brevo', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data.messageId,
    });

  } catch (error) {
    console.error('Erreur notification admin :', error);

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}