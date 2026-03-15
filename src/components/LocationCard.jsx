import { Link } from 'react-router-dom';

export default function LocationCard({ location, eventCount = 0 }) {
  return (
    <Link to={`/location/${location.slug}`} className="location-card-link">
      <div className="location-card">
        <div 
          className="location-card-image"
          style={{ backgroundImage: `url(${location.image_url})` }}
        />
        <div className="location-card-content">
          <h3>{location.name}</h3>
          <p className="location-card-desc">{location.description}</p>
          <div className="location-card-meta">
            <span className="event-count">📅 {eventCount} event{eventCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
