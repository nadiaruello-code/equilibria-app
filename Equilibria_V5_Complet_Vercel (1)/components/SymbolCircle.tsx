export default function SymbolCircle({ completedDays, chapters }: { completedDays: number[], chapters: any[] }) {
  return <div className="circlePanel"><h3>Le Cercle des Symboles</h3><div className="symbolCircle">
    {chapters.map((c:any) => <div key={c.day} className={`symbolDot ${completedDays.includes(c.day) ? 'done' : ''}`} title={`Jour ${c.day}`}>{c.emoji || '✦'}</div>)}
  </div></div>
}
