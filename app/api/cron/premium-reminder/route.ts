import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
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

    // Il faut avoir terminé le chapitre 1 depuis au moins 3 jours
    const cutoff = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(
        'id,email,plan,chapter1_completed_at,premium_reminder_sent_at'
      )
      .eq('plan', 'free')
      .not('chapter1_completed_at', 'is', null)
      .is('premium_reminder_sent_at', null)
      .lte('chapter1_completed_at', cutoff);

    if (error) {
      console.error('Erreur recherche profils Premium :', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucune relance Premium à envoyer',
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

              // Les réponses iront dans ton Gmail
              replyTo: {
                email: 'nadia.ruello@gmail.com',
                name: 'Nadia',
              },

              to: [
                {
                  email: profile.email,
                },
              ],

              subject: 'Et si Le Refuge n’était que le début ? ✨',

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
                    Le Refuge n'était que le début.
                  </h1>

                  <p>Bonjour,</p>

                  <p>
                    Il y a quelques jours, vous avez franchi
                    la première étape d'Equilibria.
                  </p>

                  <p>
                    Vous avez découvert <strong>la rencontre</strong>.
                    Un premier espace pour ralentir, respirer
                    et revenir à vous.
                  </p>

                  <p>
                    Mais Equilibria a été imaginé comme un véritable
                    voyage intérieur.
                  </p>

                  <p>
                    Pas comme une collection d'audios à écouter
                    les uns après les autres.
                  </p>

                  <p>
                    Chaque chapitre vous emmène un peu plus loin,
                    à travers le récit, la respiration,
                    la visualisation et l'hypnose douce.
                  </p>

                  <div style="
                    margin:32px 0;
                    padding:28px 24px;
                    background:#f7f3ef;
                    border-radius:16px;
                    text-align:center;
                  ">

                    <div style="font-size:36px;">
                      🗝️
                    </div>

                    <p style="
                      font-size:12px;
                      letter-spacing:2px;
                      color:#987b5f;
                    ">
                      LA SUITE DU VOYAGE
                    </p>

                    <h2>
                      42 chapitres pour avancer à votre rythme
                    </h2>

                    <p>
                      Environ 10 minutes par jour,
                      guidé(e) par Lumen.
                    </p>

                    <p>
                      Votre prochaine étape :
                      <strong>Jour 2 — La clé du Refuge.</strong>
                    </p>

                    <a
                      href="https://www.voyage-equilibria.fr/offres"
                      style="
                        display:inline-block;
                        margin-top:14px;
                        padding:14px 24px;
                        background:#28332f;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:30px;
                        font-weight:bold;
                      "
                    >
                      Découvrir la suite d'Equilibria →
                    </a>

                  </div>

                  <p>
                    L'accès au voyage complet est proposé à
                    <strong>197 €</strong>.
                  </p>

                  <p>
                    Et si vous hésitez ou souhaitez savoir
                    si Equilibria correspond à ce dont vous avez
                    besoin actuellement, vous pouvez simplement
                    répondre à cet email.
                  </p>

                  <p>
                    Je vous répondrai personnellement.
                  </p>

                  <p>
                    À bientôt,<br>
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
            `Erreur Brevo Premium pour ${profile.email} :`,
            details
          );

          failed++;
          continue;
        }

        // On ne marque le mail comme envoyé
        // qu'après confirmation de Brevo
        await supabase
          .from('profiles')
          .update({
            premium_reminder_sent_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        sent++;
      } catch (emailError) {
        console.error(
          `Erreur relance Premium pour ${profile.email} :`,
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
    console.error('Erreur cron premium-reminder :', error);

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}