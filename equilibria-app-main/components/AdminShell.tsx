import Link from 'next/link';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="section">
      <div className="container admin">
        <aside className="side">
          <div className="brand">EQUILIBRIA ADMIN</div>
          <p className="muted">Pilotage du voyage</p>
          <p><Link className="btn" href="/admin">Tableau de bord</Link></p>
          <p><Link className="btn" href="/admin/chapters">Chapitres</Link></p>
          <p><Link className="btn" href="/admin/upload">Audios</Link></p>
          <p><Link className="btn" href="/admin/illustrations">Illustrations</Link></p>
          <p><Link className="btn" href="/admin/users">Utilisateurs</Link></p>
          <p><Link className="btn gold" href="/app">Voir l’application</Link></p>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
