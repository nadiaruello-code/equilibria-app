import './globals.css';

export const metadata = {
  title: 'Equilibria | Voyage audio immersif pour retrouver calme et équilibre',
  description:
    'Découvrez Equilibria, un voyage audio immersif en 42 chapitres pour ralentir, retrouver le calme et prendre soin de votre équilibre émotionnel. Premier chapitre gratuit.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}