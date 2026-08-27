import Link from 'next/link';
import { stripe } from '@/lib/stripe';
import MetaPurchase from '@/components/MetaPurchase';

export default async function Merci({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  let paymentConfirmed = false;
  let value = 0;
  let plan = '';

  if (sessionId) {
    try {
      const session =
        await stripe.checkout.sessions.retrieve(sessionId);

      paymentConfirmed =
        session.payment_status === 'paid' ||
        session.payment_status === 'no_payment_required';

      value = (session.amount_total ?? 0) / 100;
      plan = session.metadata?.plan ?? '';
    } catch (error) {
      console.error(
        'Erreur vérification paiement Stripe :',
        error
      );
    }
  }

  return (
    <main className="section">
      {paymentConfirmed && value > 0 && (
        <MetaPurchase
  value={value}
  plan={plan}
  sessionId={sessionId!}
/>
      )}

      <div className="container">
        <div className="card">
          <h1>Bienvenue dans Equilibria</h1>

          <p>
            Paiement reçu. Connecte-toi avec le même email.
          </p>

          <Link className="btn gold" href="/login">
            Me connecter
          </Link>
        </div>
      </div>
    </main>
  );
}