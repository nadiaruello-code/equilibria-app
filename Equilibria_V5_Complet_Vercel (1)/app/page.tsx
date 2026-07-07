import Link from 'next/link';

const symbols = [
  ['🏮', 'La lanterne', 'Retrouver le chemin'],
  ['🗝️', 'La clé', 'Ouvrir le refuge intérieur'],
  ['🪶', 'La plume', 'Revenir au souffle'],
  ['🪨', 'Le galet', 'Laisser circuler'],
  ['🌱', 'La graine', 'Faire grandir le calme'],
  ['🌙', 'La nuit', 'Réapprendre le repos'],
  ['⭕', 'Le cercle', 'Rassembler ses ressources'],
  ['💎', 'Le cristal', 'Retrouver la sécurité']
];

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="container navin">
          <div className="brand">EQUILIBRIA</div>
          <div className="row">
            <Link className="btn ghost" href="/login">Connexion</Link>
            <Link className="btn gold" href="/offres">Commencer</Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container grid">
          <div>
            <p className="kicker">Lumen · roman sonore · hypnose immersive</p>
            <h1>Le voyage intérieur qui se vit comme une histoire.</h1>
            <p className="lead">
              Equilibria est une expérience audio en 42 chapitres, guidée par Lumen,
              pour retrouver calme, sécurité intérieure et équilibre émotionnel.
            </p>
            <p className="row">
              <Link className="btn gold" href="/offres">Découvrir les offres</Link>
              <Link className="btn ghost" href="/app">Entrer dans l’application</Link>
            </p>
          </div>
          <div><div className="orb"><span /></div></div>
        </div>
      </header>

      <section className="section">
        <div className="container center">
          <p className="kicker dark">Une expérience différente</p>
          <h2>Ce n’est pas une simple série d’hypnoses.</h2>
          <p className="intro">Chaque jour, vous entrez dans un lieu, recevez un symbole, écoutez une immersion audio et écrivez dans votre journal.</p>
          <div className="cards">
            <div className="card"><h3>📖 Livre audio immersif</h3><p>42 chapitres construits comme un voyage initiatique.</p></div>
            <div className="card"><h3>🎧 Lecteur audio sécurisé</h3><p>Chaque chapitre possède son expérience audio privée.</p></div>
            <div className="card"><h3>🌿 Journal personnel</h3><p>Les ressentis et progrès sont sauvegardés au fil du voyage.</p></div>
          </div>
        </div>
      </section>

      <section className="section symbolSection">
        <div className="container">
          <div className="grid">
            <div>
              <p className="kicker dark">Le Cercle des Symboles</p>
              <h2>Chaque symbole devient une ressource intérieure.</h2>
              <p>À chaque chapitre terminé, un symbole rejoint le cercle. La lanterne, la clé, la plume, le galet… deviennent des repères que l’utilisateur peut retrouver dans son quotidien.</p>
            </div>
            <div className="symbolShowcase">
              {symbols.map(([emoji, name, text]) => (
                <div className="symbolItem" key={name}>
                  <span>{emoji}</span>
                  <div><strong>{name}</strong><p>{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section offers">
        <div className="container center">
          <p className="kicker dark">Choisir son accès</p>
          <h2>Commencer doucement, ou vivre le voyage complet.</h2>
          <div className="cards">
            <div className="card"><h3>Découverte</h3><div className="price">47 €</div><p>Les 7 premiers chapitres pour découvrir Lumen.</p><Link className="btn" href="/offres">Commencer</Link></div>
            <div className="card premium"><h3>Voyage Complet</h3><div className="price">197 €</div><p>Les 42 chapitres, audios, journal et accès à vie.</p><Link className="btn gold" href="/offres">Débloquer tout</Link></div>
            <div className="card"><h3>Cercle Equilibria</h3><div className="price">14,90 €/mois</div><p>Nouveaux voyages, bonus et immersions mensuelles.</p><Link className="btn" href="/offres">Rejoindre</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
