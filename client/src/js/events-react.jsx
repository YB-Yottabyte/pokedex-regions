const { useEffect, useMemo, useState } = React;

function titleCase(value) {
  return String(value || '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function getCountdownLabel(startsAt, endsAt, now = Date.now()) {
  const startMs = new Date(startsAt).getTime();
  const endMs = new Date(endsAt).getTime();

  if (now >= startMs && now <= endMs) return 'Live now';
  if (now > endMs) return 'Event has passed';

  const diffMs = startMs - now;
  const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `Starts in ${days}d ${hours}h ${minutes}m`;
  return `Starts in ${hours}h ${minutes}m`;
}

function deriveTemporalStatus(eventItem, now = Date.now()) {
  const startMs = new Date(eventItem.startsAt).getTime();
  const endMs = new Date(eventItem.endsAt).getTime();

  if (now >= startMs && now <= endMs) return 'live';
  if (now > endMs) return 'completed';
  return 'scheduled';
}

function eventStatusClass(eventItem, now = Date.now()) {
  const status = deriveTemporalStatus(eventItem, now);

  if (status === 'live') return 'is-live';
  if (status === 'completed') return 'is-past';
  return 'is-upcoming';
}

function pseudoTime(index) {
  const minutes = (index + 1) * 7;
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function userHandle(name, index) {
  return `${String(name).slice(0, 4).toLowerCase()}_trainer_${(index % 9) + 1}`;
}

function EventsApp() {
  const [locations, setLocations] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('soon');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');
  const [timeTick, setTimeTick] = useState(Date.now());

  const [liveFeed, setLiveFeed] = useState(null);
  const [liveSort, setLiveSort] = useState('dex');
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      try {
        const res = await fetch('/api/locations');
        if (!res.ok) throw new Error('Could not fetch locations');
        const payload = await res.json();
        setLocations(payload);
      } catch (err) {
        console.error(err);
      }
    }

    loadLocations();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      setLoadingEvents(true);
      setEventsError('');

      try {
        const params = new URLSearchParams();
        if (selectedLocation) params.set('locationSlug', selectedLocation);
        params.set('sort', sortBy);

        const res = await fetch(`/api/events?${params.toString()}`);
        if (!res.ok) throw new Error('Could not fetch events');
        const payload = await res.json();
        setEvents(payload);
      } catch (err) {
        console.error(err);
        setEventsError('Unable to load events right now.');
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEvents();
  }, [selectedLocation, sortBy]);

  useEffect(() => {
    const timer = setInterval(() => setTimeTick(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadLiveFeed = async (forceRefresh = false) => {
    setLoadingLive(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '12');
      params.set('sort', liveSort);
      if (forceRefresh) params.set('refresh', '1');

      const res = await fetch(`/api/live/pokemon-feed?${params.toString()}`);
      if (!res.ok) throw new Error('Could not fetch live web data');
      const payload = await res.json();
      setLiveFeed(payload);
    } catch (err) {
      console.error(err);
      setLiveFeed(null);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    loadLiveFeed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveSort]);

  const forumThreads = useMemo(() => {
    if (!liveFeed?.items?.length) return [];

    const spotlightName = liveFeed.spotlight?.name ? titleCase(liveFeed.spotlight.name) : null;

    return liveFeed.items.slice(0, 6).map((item, index) => {
      const displayName = titleCase(item.name);
      const typeLine = (item.types || []).map(titleCase).join(' / ');
      const title = spotlightName && index === 0
        ? `Hot Topic: Is ${spotlightName} the strongest in today's feed?`
        : `Build Advice: Best ${typeLine} setup for ${displayName}?`;

      const body = `Dex #${item.id} has base EXP ${item.baseExperience}. Community members are sharing move combos and counters for ${displayName}.`;

      return {
        id: `${item.id}-${index}`,
        title,
        body,
        avatar: item.sprite,
        time: pseudoTime(index),
        handle: userHandle(item.name, index),
        tag: typeLine,
      };
    });
  }, [liveFeed]);

  const allEventTypes = useMemo(() => {
    const set = new Set(events.map((eventItem) => eventItem.eventType).filter(Boolean));
    return [...set].sort();
  }, [events]);

  const visibleEvents = useMemo(() => {
    if (!eventTypeFilter) return events;
    return events.filter((eventItem) => eventItem.eventType === eventTypeFilter);
  }, [events, eventTypeFilter]);

  return (
    <>
      <a href="/" className="back-btn">&#8592; Back to Regions</a>

      <section className="community-events-shell">
        <header className="community-events-head">
          <h1>Virtual Community Event Space</h1>
          <p>Explore events by location, with live status and countdown timing.</p>
          <div className="community-inline-links">
            <a href="/events-legacy" className="tag community-link-tag">Open legacy forum view</a>
          </div>
        </header>

        <div className="community-events-controls">
          <label className="community-control">
            <span>Filter by location</span>
            <select
              className="community-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All locations</option>
              {locations.map((loc) => (
                <option key={loc.slug} value={loc.slug}>
                  {loc.name} ({loc.regionName})
                </option>
              ))}
            </select>
          </label>

          <label className="community-control">
            <span>Sort by date</span>
            <select
              className="community-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="soon">Soonest first</option>
              <option value="latest">Latest first</option>
            </select>
          </label>

          <label className="community-control">
            <span>Filter by event type</span>
            <select
              className="community-select"
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
            >
              <option value="">All event types</option>
              {allEventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="community-results-label">
          {loadingEvents ? 'Loading events...' : `${visibleEvents.length} events shown`}
        </p>

        {eventsError ? (
          <p className="community-empty">{eventsError}</p>
        ) : (
          <div className="community-events-grid">
            {loadingEvents ? (
              <>
                <div className="skeleton" style={{ height: '230px', borderRadius: '14px' }}></div>
                <div className="skeleton" style={{ height: '230px', borderRadius: '14px' }}></div>
              </>
            ) : visibleEvents.length === 0 ? (
              <p className="community-empty">No events match this filter.</p>
            ) : (
              visibleEvents.map((eventItem) => {
                const computedStatus = deriveTemporalStatus(eventItem, timeTick);
                return (
                <article key={eventItem.id} className={`community-event-card ${eventStatusClass(eventItem, timeTick)}`}>
                  <header>
                    <span className="community-chip">{eventItem.eventType}</span>
                    <span className={`community-chip ${computedStatus === 'completed' ? 'community-chip-muted' : ''}`}>
                      {computedStatus}
                    </span>
                  </header>
                  <h3>{eventItem.title}</h3>
                  <p>{eventItem.description}</p>
                  <div className="community-event-meta">
                    <span>{formatDate(eventItem.startsAt)}</span>
                    <span>{eventItem.locationName}</span>
                  </div>
                  <div className="community-countdown">
                    {getCountdownLabel(eventItem.startsAt, eventItem.endsAt, timeTick)}
                  </div>
                  <a className="community-inline-link" href={`/locations/${eventItem.locationSlug}`}>
                    Open location page &rarr;
                  </a>
                </article>
              )})
            )}
          </div>
        )}
      </section>

      <section className="community-events-shell">
        <header className="community-events-head">
          <h2>Live Community Forum</h2>
          <p>Generated from current live PokeAPI feed to keep discussion fresh.</p>
        </header>

        <div className="live-feed-controls">
          <label className="community-control">
            <span>Sort live feed</span>
            <select className="community-select" value={liveSort} onChange={(e) => setLiveSort(e.target.value)}>
              <option value="dex">Dex Number (Ascending)</option>
              <option value="dex-desc">Dex Number (Descending)</option>
              <option value="exp">Base Experience (High to Low)</option>
            </select>
          </label>
          <button className="hero-cta live-refresh-btn" type="button" onClick={() => loadLiveFeed(true)}>
            Refresh Live Feed
          </button>
        </div>

        {loadingLive ? (
          <div className="forum-list">
            <div className="skeleton" style={{ height: '120px', borderRadius: '12px' }}></div>
            <div className="skeleton" style={{ height: '120px', borderRadius: '12px' }}></div>
          </div>
        ) : (
          <div className="forum-list">
            {forumThreads.map((thread) => (
              <article key={thread.id} className="forum-thread-card">
                <img src={thread.avatar || ''} alt="forum avatar" className="forum-avatar" loading="lazy" />
                <div className="forum-thread-main">
                  <header>
                    <h4>{thread.title}</h4>
                    <span>{thread.time}</span>
                  </header>
                  <p>{thread.body}</p>
                  <div className="forum-thread-meta">
                    <span>@{thread.handle}</span>
                    <span>{thread.tag}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('events-app')).render(<EventsApp />);
