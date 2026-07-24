import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature absente.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = session.metadata?.plan || 'starter';
      const userId = session.metadata?.user_id || session.client_reference_id;
      const email =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.user_email ||
        null;

      const stripeCustomerId =
        typeof session.customer === 'string' ? session.customer : null;

      let rows: any[] | null = null;

      if (userId) {
        const result = await admin
          .from('profiles')
          .update({ plan, stripe_customer_id: stripeCustomerId })
          .eq('id', userId)
          .select('id,email,plan');

        if (result.error) {
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
          .update({ plan, stripe_customer_id: stripeCustomerId })
          .ilike('email', email.trim())
          .select('id,email,plan');

        if (result.error) {
          return NextResponse.json(
            { error: result.error.message },
            { status: 500 }
          );
        }

        rows = result.data;
      }

      if (!rows || rows.length === 0) {
        console.error('Profil introuvable', { userId, email, plan });
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
      const object: any = event.data.object;
      const customerId =
        typeof object.customer === 'string' ? object.customer : '';

      if (customerId) {
        const { error } = await admin
          .from('profiles')
          .update({ plan: 'starter' })
          .eq('stripe_customer_id', customerId);

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur webhook.' },
      { status: 500 }
    );
  }
}
