const slug = window.location.pathname.replace('/locations/', '').replace(/\/$/, '');

const content = document.getElementById('location-content');
const countdownNodes = [];

function statusClass(eventItem) {
  if (eventItem.status === 'live') return 'is-live';
  if (eventItem.status === 'completed') return 'is-past';
  return 'is-upcoming';
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

function getCountdownLabel(startsAt, endsAt) {
  const now = Date.now();
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

function eventCard(eventItem) {
  const countText = `${eventItem.attendeeCount}/${eventItem.capacity} joined`;
  return `
    <article class="community-event-card ${statusClass(eventItem)}">
      <header>
        <span class="community-chip">${eventItem.eventType}</span>
        <span class="community-chip ${eventItem.status === 'completed' ? 'community-chip-muted' : ''}">${eventItem.status}</span>
      </header>
      <h3>${eventItem.title}</h3>
      <p>${eventItem.description}</p>
      <div class="community-event-meta">
        <span>${formatDate(eventItem.startsAt)}</span>
        <span>${countText}</span>
      </div>
      <div class="community-countdown" data-starts-at="${eventItem.startsAt}" data-ends-at="${eventItem.endsAt}">
        ${getCountdownLabel(eventItem.startsAt, eventItem.endsAt)}
      </div>
    </article>`;
}

function refreshCountdowns() {
  countdownNodes.forEach((node) => {
    node.textContent = getCountdownLabel(node.dataset.startsAt, node.dataset.endsAt);
  });
}

function render(location, events) {
  document.title = `${location.name} Community Events`;

  content.innerHTML = `
    <div class="container page-content" style="--rc: ${location.cardColor || '#ffde00'}">
      <a href="/regions/${location.regionSlug}" class="back-btn">&#8592; Back to ${location.regionName}</a>

      <section class="community-events-shell">
        <header class="community-events-head">
          <h1>${location.name}</h1>
          <p>${location.description}</p>
          <div class="community-inline-links">
            <span class="tag">${location.regionName}</span>
            <span class="tag">${events.length} events</span>
            <a href="/events" class="tag community-link-tag">View all events</a>
          </div>
        </header>

        <div class="community-events-grid" id="location-events-grid">
          ${events.length ? events.map(eventCard).join('') : '<p class="community-empty">No events scheduled for this location yet.</p>'}
        </div>
      </section>
    </div>`;

  countdownNodes.length = 0;
  document.querySelectorAll('.community-countdown').forEach((node) => countdownNodes.push(node));
  refreshCountdowns();
}

async function load() {
  try {
    const locationRes = await fetch(`/api/locations/${slug}`);
    if (locationRes.status === 404) {
      window.location.replace('/404.html');
      return;
    }
    if (!locationRes.ok) throw new Error('Could not fetch location');

    const location = await locationRes.json();

    const eventsRes = await fetch(`/api/events?locationSlug=${encodeURIComponent(slug)}&sort=soon`);
    if (!eventsRes.ok) throw new Error('Could not fetch events');

    const events = await eventsRes.json();
    render(location, events);

    setInterval(refreshCountdowns, 60000);
  } catch (err) {
    content.innerHTML = `
      <div class="container page-content">
        <div class="not-found">
          <h1>Oops</h1>
          <p>Could not load this location right now.</p>
          <a href="/" role="button">Back to Home</a>
        </div>
      </div>`;
    console.error(err);
  }
}

load();
