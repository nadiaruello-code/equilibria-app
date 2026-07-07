import './globals.css';
export const metadata = { title: 'Equilibria', description: 'Voyage immersif hypnotique en 42 chapitres.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
