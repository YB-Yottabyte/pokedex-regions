import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents, getLocations } from '../services/api';
import EventCard from '../components/EventCard';

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, locationsData] = await Promise.all([
          getAllEvents(),
          getLocations()
        ]);
        setEvents(eventsData);
        setLocations(locationsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.location_id === parseInt(filter));

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.event_date) - new Date(b.event_date);
    } else if (sortBy === 'location') {
      return a.location_name.localeCompare(b.location_name);
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading events...</div>
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

  return (
    <div className="container">
      <section className="events-page-header">
        <h1>Community Events</h1>
        <p>Discover Pokémon League tournaments, trainer workshops, and regional celebrations happening across all regions</p>
      </section>

      <div className="events-controls">
        <div className="filter-group">
          <label htmlFor="location-filter">Filter by Region:</label>
          <select 
            id="location-filter"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="select-input"
          >
            <option value="all">All Regions</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select 
            id="sort-by"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="select-input"
          >
            <option value="date">Date</option>
            <option value="location">Region</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      <div className="events-summary">
        Showing {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
      </div>

      {sortedEvents.length === 0 ? (
        <div className="no-events">
          <p>No events found with the selected filters.</p>
          <Link to="/" className="btn btn-primary">Back to Regions</Link>
        </div>
      ) : (
        <div className="events-list">
          {sortedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
