import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    // Sécurise l'appel du Cron Vercel
    const authHeader = request.headers.get('authorization');

    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      return NextResponse.json(
        { error: 'BREVO_API_KEY manquante' },
        { status: 500 }
      );
    }

    // Il faut que l'inscription date d'au moins 24 h
    const cutoff = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(
        'id,email,plan,created_at,chapter1_started_at,chapter1_reminder_sent_at'
      )
      .eq('plan', 'free')
      .is('chapter1_started_at', null)
      .is('chapter1_reminder_sent_at', null)
      .lte('created_at', cutoff);

    if (error) {
      console.error('Erreur recherche profils :', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun rappel à envoyer',
        sent: 0,
      });
    }

    let sent = 0;
    let failed = 0;

    for (const profile of profiles) {
      if (!profile.email) continue;

      try {
        const response = await fetch(
          'https://api.brevo.com/v3/smtp/email',
          {
            method: 'POST',

            headers: {
              accept: 'application/json',
              'api-key': brevoApiKey,
              'content-type': 'application/json',
            },

            body: JSON.stringify({
              sender: {
                name: 'Equilibria',
                email: 'contact@voyage-equilibria.fr',
              },
replyTo: {
  email: 'nadia.ruello@gmail.com',
  name: 'Nadia',
},
              to: [
                {
                  email: profile.email,
                },
              ],

              subject: '🌿 La rencontre vous attend',

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

                  <h1>
                   La rencontre vous attend 🌿
                  </h1>

                  <p>Bonjour,</p>

                  <p>
                    Vous avez créé votre espace Equilibria,
                    mais votre voyage n'a pas encore vraiment commencé.
                  </p>

                  <p>
                    Votre première immersion est là,
                    prête à vous accueillir lorsque vous aurez
                    quelques minutes pour vous.
                  </p>

                  <div style="
                    margin:32px 0;
                    padding:28px 24px;
                    background:#f7f3ef;
                    border-radius:16px;
                    text-align:center;
                  ">

                    <div style="font-size:36px;">
                      🏮
                    </div>

                    <p style="
                      font-size:12px;
                      letter-spacing:2px;
                      color:#987b5f;
                    ">
                      JOUR 1
                    </p>

                    <h2>
                      La rencontre
                    </h2>

                    <p>
                      Environ 10 minutes pour ralentir,
                      respirer et entrer dans l'univers d'Equilibria.
                    </p>

                    <a
                      href="https://www.voyage-equilibria.fr/login"
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
                      🎧 Reprendre mon voyage
                    </a>

                  </div>

                  <p>
                    Il n'y a aucune performance à atteindre,
                    aucun rythme à suivre.
                  </p>

                  <p>
                    Seulement quelques minutes à vous accorder,
                    quand ce sera le bon moment.
                  </p>

                  <p>
                    Lumen vous attend pour vous rencontrez.
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
                    Equilibria propose des contenus de bien-être
                    et d'accompagnement personnel. Ils ne remplacent
                    pas un suivi médical ou psychologique.
                  </p>

                </div>
              `,
            }),
          }
        );

        if (!response.ok) {
          const details = await response.text();

          console.error(
            `Erreur Brevo pour ${profile.email} :`,
            details
          );

          failed++;
          continue;
        }

        // Le rappel n'est marqué comme envoyé
        // que si Brevo l'a bien accepté
        await supabase
          .from('profiles')
          .update({
            chapter1_reminder_sent_at:
              new Date().toISOString(),
          })
          .eq('id', profile.id);

        sent++;
      } catch (emailError) {
        console.error(
          `Erreur envoi rappel pour ${profile.email} :`,
          emailError
        );

        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      eligible: profiles.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error(
      'Erreur cron chapter1-reminder :',
      error
    );

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}