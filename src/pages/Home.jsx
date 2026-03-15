import { Link } from 'react-router-dom';
import { regionsData } from '../data/regions';

export default function Home() {
  return (
    <div className="container">
      <section className="hero-section">
        <h2>Pokémon Regions Guide</h2>
        <p>Explore all Pokémon regions, their starters, legendaries, and more</p>
      </section>

      <div className="regions-grid">
        {regionsData.map(region => (
          <Link key={region.slug} to={`/region/${region.slug}`} className="region-card-link">
            <div className="region-card" style={{ borderLeftColor: region.color }}>
              <div className="region-card-header" style={{ backgroundColor: region.color }}>
                <h3>{region.name}</h3>
                <span className="generation">Gen {region.generation}</span>
              </div>
              <div className="region-card-content">
                <p className="region-card-desc">{region.description.substring(0, 120)}...</p>
                <div className="region-stats">
                  <div className="stat">
                    <strong>{region.pokemonCount}</strong>
                    <span>Pokémon</span>
                  </div>
                  <div className="stat">
                    <strong>{region.gymCount}</strong>
                    <span>Gyms</span>
                  </div>
                  <div className="stat">
                    <strong>{region.introduced}</strong>
                    <span>Year</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
