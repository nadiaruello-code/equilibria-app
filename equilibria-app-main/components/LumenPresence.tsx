export default function LumenPresence({ quote }: { quote: string }) {
  return <section className="lumenPresence" aria-label="Présence de Lumen">
    <div className="lumenAura"><div className="lumenFigure"><div className="lumenHead"/><div className="lumenBody"/><div className="lumenLight"/></div></div>
    <div className="lumenWords"><p className="lumenName">LUMEN</p><blockquote>« {quote} »</blockquote></div>
  </section>;
}
