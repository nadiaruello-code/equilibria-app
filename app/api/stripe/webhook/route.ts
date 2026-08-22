import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const ALLOWED_PLANS = ['starter', 'premium', 'circle'] as const;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Signature absente.' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Signature Stripe invalide :', error);

    return NextResponse.json(
      {
        error:
          error.message ||
          'Signature Stripe invalide.',
      },
      { status: 400 }
    );
  }

  /*
   * IMPORTANT :
   * aucun événement Stripe TEST
   * ne doit modifier Supabase en production.
   */
  if (
    !event.livemode &&
    process.env.NODE_ENV === 'production'
  ) {
    console.log(
      'Événement Stripe test ignoré en production :',
      event.id
    );

    return NextResponse.json({
      received: true,
    });
  }

  const admin = createAdminClient();

  console.log('Webhook reçu :', event.type);

  try {
    /*
     * ===============================
     * PAIEMENT CHECKOUT RÉUSSI
     * ===============================
     */

    if (event.type === 'checkout.session.completed') {
      const session =
        event.data.object as Stripe.Checkout.Session;

      /*
       * On donne l'accès uniquement
       * si Stripe confirme le paiement.
       */
      if (
        session.payment_status !== 'paid' &&
        session.payment_status !== 'no_payment_required'
      ) {
        console.log(
          'Session terminée sans paiement confirmé :',
          {
            sessionId: session.id,
            paymentStatus: session.payment_status,
          }
        );

        return NextResponse.json({
          received: true,
        });
      }

      const metadataPlan =
        session.metadata?.plan;

      if (
        !metadataPlan ||
        !ALLOWED_PLANS.includes(
          metadataPlan as
            (typeof ALLOWED_PLANS)[number]
        )
      ) {
        console.error(
          'Plan Stripe invalide :',
          metadataPlan
        );

        return NextResponse.json(
          { error: 'Plan Stripe invalide.' },
          { status: 400 }
        );
      }

      const plan = metadataPlan;

      const paymentOption =
        session.metadata?.payment_option ||
        'single';

      const userId =
        session.metadata?.user_id ||
        session.client_reference_id;

      const email =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.user_email ||
        null;

      const stripeCustomerId =
        typeof session.customer === 'string'
          ? session.customer
          : null;

      /*
       * ===============================
       * PREMIUM EN 3 × 69 €
       * ===============================
       *
       * Stripe crée d'abord un abonnement
       * mensuel à 69 €.
       *
       * Ensuite nous transformons cet
       * abonnement en planning limité
       * à exactement 3 mensualités.
       */

      if (
        plan === 'premium' &&
        paymentOption === '3x' &&
        typeof session.subscription === 'string'
      ) {
        const subscriptionId =
          session.subscription;

        const subscription =
          await stripe.subscriptions.retrieve(
            subscriptionId
          );

        /*
         * Évite de créer un deuxième
         * planning si Stripe renvoie
         * plusieurs fois le webhook.
         */
        if (!subscription.schedule) {
          const schedule =
            await stripe.subscriptionSchedules.create({
              from_subscription:
                subscriptionId,
            });

          const currentPhase =
            schedule.phases[0];

          const phaseItems =
            currentPhase.items.map((item) => ({
              price:
                typeof item.price === 'string'
                  ? item.price
                  : item.price.id,

              quantity:
                item.quantity || 1,
            }));

          await stripe.subscriptionSchedules.update(
            schedule.id,
            {
              end_behavior: 'cancel',

              phases: [
                {
                  start_date:
                    currentPhase.start_date,

                  items: phaseItems,

                  /*
                   * Tarif mensuel ×
                   * 3 périodes = 3 paiements.
                   */
                  iterations: 3,
                },
              ],
            }
          );

          console.log(
            'Premium 3x configuré :',
            {
              subscriptionId,
              scheduleId: schedule.id,
            }
          );
        }
      }

      /*
       * ===============================
       * MISE À JOUR DU PROFIL SUPABASE
       * ===============================
       */

      const updateData = {
        plan,
        stripe_customer_id:
          stripeCustomerId,
        started_at:
          new Date().toISOString(),
      };

      let rows: any[] | null = null;

      /*
       * Recherche prioritaire par ID.
       */
      if (userId) {
        console.log({
          userId,
          email,
          plan,
          paymentOption,
          stripeCustomerId,
        });

        const result =
          await admin
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
            .select('id,email,plan');

        if (result.error) {
          console.error(
            'Erreur de mise à jour du profil :',
            result.error
          );

          return NextResponse.json(
            {
              error:
                result.error.message,
            },
            { status: 500 }
          );
        }

        rows = result.data;
      }

      /*
       * Si aucun profil trouvé par ID,
       * tentative avec l'adresse e-mail.
       */
      if (
        (!rows || rows.length === 0) &&
        email
      ) {
        const result =
          await admin
            .from('profiles')
            .update(updateData)
            .ilike(
              'email',
              email.trim()
            )
            .select('id,email,plan');

        if (result.error) {
          console.error(
            'Erreur de recherche du profil par e-mail :',
            result.error
          );

          return NextResponse.json(
            {
              error:
                result.error.message,
            },
            { status: 500 }
          );
        }

        rows = result.data;
      }

      if (!rows || rows.length === 0) {
        console.error(
          'Profil Supabase introuvable',
          {
            userId,
            email,
            plan,
          }
        );

        return NextResponse.json(
          {
            error:
              'Profil Supabase introuvable.',
          },
          { status: 404 }
        );
      }

      console.log(
        'Plan Supabase mis à jour :',
        rows
      );
    }

    /*
     * ===============================
     * ÉCHEC D'UNE MENSUALITÉ
     * ===============================
     */

    if (
      event.type === 'invoice.payment_failed'
    ) {
      const invoice =
        event.data.object as Stripe.Invoice;

      const customerId =
        typeof invoice.customer === 'string'
          ? invoice.customer
          : '';

      if (customerId) {
        console.log(
          'Paiement récurrent échoué :',
          customerId
        );

        const { error } =
          await admin
            .from('profiles')
            .update({
              plan: 'free',
            })
            .eq(
              'stripe_customer_id',
              customerId
            );

        if (error) {
          console.error(
            'Erreur retour au plan gratuit :',
            error
          );

          return NextResponse.json(
            {
              error:
                error.message,
            },
            { status: 500 }
          );
        }
      }
    }

    /*
     * ===============================
     * RÉSILIATION D'UN ABONNEMENT
     * ===============================
     */

    if (
      event.type ===
      'customer.subscription.deleted'
    ) {
      const subscription =
        event.data.object as Stripe.Subscription;

      const customerId =
        typeof subscription.customer ===
        'string'
          ? subscription.customer
          : '';

      const subscriptionPlan =
        subscription.metadata?.plan;

      const paymentOption =
        subscription.metadata
          ?.payment_option;

      /*
       * Premium payé en 3 fois :
       *
       * après les 3 mensualités Stripe
       * termine automatiquement
       * l'abonnement.
       *
       * Mais la cliente a alors acheté
       * définitivement Premium.
       *
       * On NE remet donc PAS son profil
       * en free.
       */
      if (
        subscriptionPlan === 'premium' &&
        paymentOption === '3x'
      ) {
        console.log(
          'Fin Premium 3x : accès Premium conservé.',
          subscription.id
        );

        return NextResponse.json({
          received: true,
        });
      }

      /*
       * Circle :
       * lorsqu'il est réellement résilié,
       * retour au compte gratuit.
       */
      if (
        customerId &&
        subscriptionPlan === 'circle'
      ) {
        const { error } =
          await admin
            .from('profiles')
            .update({
              plan: 'free',
            })
            .eq(
              'stripe_customer_id',
              customerId
            );

        if (error) {
          console.error(
            'Erreur résiliation Circle :',
            error
          );

          return NextResponse.json(
            {
              error:
                error.message,
            },
            { status: 500 }
          );
        }

        console.log(
          'Circle résilié : retour au plan free.',
          customerId
        );
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error: any) {
    console.error(
      'Erreur webhook Stripe :',
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          'Erreur webhook.',
      },
      { status: 500 }
    );
  }
}