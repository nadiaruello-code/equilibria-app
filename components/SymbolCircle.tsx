export default function SymbolCircle({ completedDays, chapters }: { completedDays: number[]; chapters: any[] }) {
  return <div className="circlePanel">
    <h3>Le Cercle des Symboles</h3>
    <p className="muted">Chaque chapitre terminé allume une lumière.</p>
    <div className="symbolCircle">
      {chapters.map((c:any) => <div key={c.day} className={`symbolDot ${completedDays.includes(c.day) ? 'done' : ''}`}>{c.emoji || '✦'}</div>)}
    </div>
  </div>;
}
