import { useParams, Link } from 'react-router-dom';
import { regionsData } from '../data/regions';

export default function RegionDetail() {
  const { slug } = useParams();
  const region = regionsData.find(r => r.slug === slug);

  if (!region) {
    return (
      <div className="container">
        <Link to="/" className="back-link">← Back to Regions</Link>
        <div className="error">Region not found</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← Back to Regions</Link>

      <section className="region-detail">
        <div className="region-detail-header" style={{ borderColor: region.color }}>
          <div className="region-detail-info">
            <h1 style={{ color: region.color }}>{region.name}</h1>
            <p className="region-description">{region.description}</p>
            
            <div className="region-meta">
              <div className="meta-item">
                <strong>Generation:</strong> Generation {region.generation}
              </div>
              <div className="meta-item">
                <strong>Introduced:</strong> {region.introduced}
              </div>
              <div className="meta-item">
                <strong>Pokémon Count:</strong> {region.pokemonCount}
              </div>
              <div className="meta-item">
                <strong>Professor:</strong> {region.professor}
              </div>
              <div className="meta-item">
                <strong>Gym Leaders:</strong> {region.gymCount}
              </div>
              {region.villain && (
                <div className="meta-item">
                  <strong>Main Villain:</strong> {region.villain}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="region-content">
          <section className="region-section">
            <h2>Starter Pokémon</h2>
            <div className="starter-grid">
              {region.starters.map((starter, idx) => (
                <div key={idx} className="starter-card">
                  <div className="starter-name">{starter.name}</div>
                  <div className="starter-type">{starter.type}</div>
                  <div className="starter-id">#{starter.id}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="region-section">
            <h2>Legendary Pokémon</h2>
            <div className="legendary-card">
              <div className="legendary-name">{region.legendary.name}</div>
              <div className="legendary-id">#{region.legendary.id}</div>
            </div>
          </section>

          <section className="region-section">
            <h2>Notable Locations</h2>
            <ul className="location-list">
              {region.notableLocations.map((location, idx) => (
                <li key={idx}>{location}</li>
              ))}
            </ul>
          </section>

          <section className="region-section">
            <h2>Games</h2>
            <ul className="games-list">
              {region.games.map((game, idx) => (
                <li key={idx}>{game}</li>
              ))}
            </ul>
          </section>

          <section className="region-section">
            <h2>Community Events in {region.name}</h2>
            <p>Visit the <Link to="/events" className="link-btn">Community Events</Link> section to see tournaments and activities happening in this region!</p>
          </section>
        </div>
      </section>
    </div>
  );
}
