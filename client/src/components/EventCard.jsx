import { useState, useEffect } from 'react';

function formatCountdown(eventDate) {
  const now = new Date();
  const event = new Date(eventDate);
  const diff = event - now;

  if (diff < 0) {
    return { text: 'Event has passed', isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return { text: `${days}d ${hours}h away`, isPast: false };
  } else if (hours > 0) {
    return { text: `${hours}h ${minutes}m away`, isPast: false };
  } else if (minutes > 0) {
    return { text: `${minutes}m away`, isPast: false };
  } else {
    return { text: 'Happening now!', isPast: false };
  }
}

export default function EventCard({ event }) {
  const [countdown, setCountdown] = useState(() => formatCountdown(event.event_date));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatCountdown(event.event_date));
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [event.event_date]);

  return (
    <div className={`event-card ${countdown.isPast ? 'event-past' : ''}`}>
      <div 
        className="event-card-image"
        style={{ backgroundImage: `url(${event.image_url})` }}
      />
      <div className="event-card-content">
        <div className="event-card-header">
          <h3>{event.title}</h3>
          <span className={`countdown ${countdown.isPast ? 'past' : ''}`}>
            {countdown.text}
          </span>
        </div>
        <p className="event-card-desc">{event.description}</p>
        <div className="event-card-meta">
          <span className="category">{event.category}</span>
          <span className="organizer">by {event.organizer}</span>
          <span className="time">🕐 {event.event_time}</span>
          {event.capacity && <span className="capacity">👥 {event.capacity} capacity</span>}
        </div>
        {event.location_name && (
          <div className="event-location">
            📍 {event.location_name}
          </div>
        )}
      </div>
    </div>
  );
}
