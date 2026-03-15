import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocationBySlug, getEventsByLocationSlug } from '../services/api';
import EventCard from '../components/EventCard';

export default function LocationDetail() {
  const { slug } = useParams();
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [locationData, eventsData] = await Promise.all([
          getLocationBySlug(slug),
          getEventsByLocationSlug(slug)
        ]);
        setLocation(locationData);
        setEvents(eventsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load region details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container">
        <Link to="/" className="back-link">← Back to Regions</Link>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Link to="/" className="back-link">← Back to Regions</Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!location) {
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

      <section className="location-detail">
        <div className="location-detail-header">
          <div 
            className="location-detail-image"
            style={{ backgroundImage: `url(${location.image_url})` }}
          />
          <div className="location-detail-info">
            <h1>{location.name}</h1>
            <p className="location-description">{location.description}</p>
            {location.latitude && location.longitude && (
              <p className="location-coordinates">
                📍 Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="location-events">
        <h2>
          Community Events in {location.name}
          <span className="event-count">({events.length})</span>
        </h2>

        {events.length === 0 ? (
          <div className="no-events">
            <p>No events scheduled in this region yet.</p>
            <Link to="/events" className="btn btn-primary">View all events</Link>
          </div>
        ) : (
          <div className="events-list">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
