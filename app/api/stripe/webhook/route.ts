import { headers } from 'next/headers';
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
      { error: error.message || 'Signature Stripe invalide.' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  console.log("Webhook reçu :", event.type);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
if (
  session.payment_status !== 'paid' &&
  session.payment_status !== 'no_payment_required'
) {
  console.log('Session terminée sans paiement confirmé :', {
    sessionId: session.id,
    paymentStatus: session.payment_status,
  });

  return NextResponse.json({ received: true });
}
      const metadataPlan = session.metadata?.plan;

      if (
        !metadataPlan ||
        !ALLOWED_PLANS.includes(
          metadataPlan as (typeof ALLOWED_PLANS)[number]
        )
      ) {
        console.error('Plan Stripe invalide :', metadataPlan);

        return NextResponse.json(
          { error: 'Plan Stripe invalide.' },
          { status: 400 }
        );
      }

      const plan = metadataPlan;
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

      let rows: any[] | null = null;

      if (userId) {
        console.log({
  userId,
  email,
  plan,
  stripeCustomerId,
});
        const result = await admin
          .from('profiles')
          .update({
            plan,
            stripe_customer_id: stripeCustomerId,
          })
          .eq('id', userId)
          .select('id,email,plan');

        if (result.error) {
          console.error(
            'Erreur de mise à jour du profil :',
            result.error
          );

          return NextResponse.json(
            { error: result.error.message },
            { status: 500 }
          );
        }

        rows = result.data;
      }

      if ((!rows || rows.length === 0) && email) {
        const result = await admin
          .from('profiles')
          .update({
            plan,
            stripe_customer_id: stripeCustomerId,
          })
          .ilike('email', email.trim())
          .select('id,email,plan');

        if (result.error) {
          console.error(
            'Erreur de recherche du profil par e-mail :',
            result.error
          );

          return NextResponse.json(
            { error: result.error.message },
            { status: 500 }
          );
        }

        rows = result.data;
      }

      if (!rows || rows.length === 0) {
        console.error('Profil Supabase introuvable', {
          userId,
          email,
          plan,
        });

        return NextResponse.json(
          { error: 'Profil Supabase introuvable.' },
          { status: 404 }
        );
      }

      console.log('Plan mis à jour :', rows);
    }

    if (
      event.type === 'customer.subscription.deleted' ||
      event.type === 'invoice.payment_failed'
    ) {
      const object = event.data.object as
        | Stripe.Subscription
        | Stripe.Invoice;

      const customerId =
        typeof object.customer === 'string'
          ? object.customer
          : '';

      if (customerId) {
        const { error } = await admin
          .from('profiles')
          .update({ plan: 'free' })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error(
            'Erreur de retour au plan gratuit :',
            error
          );

          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erreur webhook Stripe :', error);

    return NextResponse.json(
      { error: error.message || 'Erreur webhook.' },
      { status: 500 }
    );
  }
}