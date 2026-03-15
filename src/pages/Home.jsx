import { useState, useEffect } from 'react';
import { getLocations, getAllEvents } from '../services/api';
import LocationCard from '../components/LocationCard';

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [locationsData, eventsData] = await Promise.all([
          getLocations(),
          getAllEvents()
        ]);
        setLocations(locationsData);
        setEvents(eventsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load Pokemon regions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading Pokémon regions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  // Count events per location
  const eventCountByLocation = {};
  events.forEach(event => {
    if (!eventCountByLocation[event.location_id]) {
      eventCountByLocation[event.location_id] = 0;
    }
    eventCountByLocation[event.location_id]++;
  });

  return (
    <div className="container">
      <section className="hero-section">
        <h2>Explore Pokémon Regions</h2>
        <p>Browse regions and discover community events happening near you</p>
      </section>

      <div className="locations-grid">
        {locations.map(location => (
          <LocationCard 
            key={location.id} 
            location={location}
            eventCount={eventCountByLocation[location.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}
