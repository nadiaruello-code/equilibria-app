import { NextResponse } from 'next/server';
import { stripe, PRICE_MAP } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    if (!['starter', 'premium', 'circle'].includes(plan)) {
      return NextResponse.json({ error: 'Offre invalide.' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Connecte-toi avant de procéder au paiement.' },
        { status: 401 }
      );
    }

    const price = PRICE_MAP[plan];
    if (!price) {
      return NextResponse.json(
        { error: `Price ID Stripe manquant pour ${plan}.` },
        { status: 500 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'circle' ? 'subscription' : 'payment',
      client_reference_id: user.id,
      customer_email: user.email || undefined,
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/offres`,
      allow_promotion_codes: true,
      metadata: {
        plan,
        user_id: user.id,
        user_email: user.email || ''
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur Checkout :', error);
    return NextResponse.json(
      { error: error.message || 'Erreur Stripe.' },
      { status: 500 }
    );
  }
}
