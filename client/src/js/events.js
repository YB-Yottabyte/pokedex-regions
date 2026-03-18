const liveFeedGrid = document.getElementById('live-feed-grid');
const liveFeedMeta = document.getElementById('live-feed-meta');
const liveSpotlight = document.getElementById('live-spotlight');
const liveSummary = document.getElementById('live-summary');
const liveSort = document.getElementById('live-sort');
const liveRefresh = document.getElementById('live-refresh');
const forumList = document.getElementById('forum-list');

function titleCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function renderLiveCard(item) {
  return `
    <article class="live-feed-card">
      <img src="${item.sprite || ''}" alt="${titleCase(item.name)} artwork" class="live-feed-art" loading="lazy">
      <div class="live-feed-body">
        <h3>#${item.id} ${titleCase(item.name)}</h3>
        <p>${item.types.map(titleCase).join(' / ')}</p>
        <div class="live-feed-meta-row">
          <span>EXP ${item.baseExperience ?? '-'}</span>
          <span>HT ${item.height ?? '-'}</span>
          <span>WT ${item.weight ?? '-'}</span>
        </div>
      </div>
    </article>`;
}

function renderSpotlight(item) {
  if (!liveSpotlight) return;

  if (!item) {
    liveSpotlight.innerHTML = '<p class="community-empty">No spotlight data available.</p>';
    return;
  }

  liveSpotlight.innerHTML = `
    <article class="live-spotlight-card">
      <img src="${item.sprite || ''}" alt="${titleCase(item.name)} artwork" class="live-spotlight-art" loading="lazy">
      <div class="live-spotlight-body">
        <p class="live-spotlight-label">Community Spotlight</p>
        <h3>#${item.id} ${titleCase(item.name)}</h3>
        <p class="live-spotlight-types">${item.types.map(titleCase).join(' / ')}</p>
        <p class="live-spotlight-text">${item.flavorText || 'Flavor text unavailable from source right now.'}</p>
        <div class="live-feed-meta-row">
          <span>EXP ${item.baseExperience ?? '-'}</span>
          <span>Habitat ${item.habitat ? titleCase(item.habitat) : 'Unknown'}</span>
          <span>${item.generation ? titleCase(item.generation) : 'Unknown Generation'}</span>
        </div>
      </div>
    </article>`;
}

function pseudoTime(index) {
  const minutes = (index + 1) * 6;
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function userHandle(name, index) {
  return `${name.slice(0, 4).toLowerCase()}_trainer_${(index % 9) + 1}`;
}

function renderForum(payload) {
  if (!forumList) return;

  const items = payload?.items || [];
  if (!items.length) {
    forumList.innerHTML = '<p class="community-empty">No forum threads available right now.</p>';
    return;
  }

  const spotlightName = payload?.spotlight?.name ? titleCase(payload.spotlight.name) : null;

  const threads = items.slice(0, 12).map((item, index) => {
    const displayName = titleCase(item.name);
    const typeLine = item.types.map(titleCase).join(' / ');
    const title = spotlightName && index === 0
      ? `Hot Topic: Is ${spotlightName} the strongest in today's feed?`
      : `Build Advice: Best ${typeLine} setup for ${displayName}?`;

    const replies = 8 + ((item.id + index) % 33);
    const likes = 10 + ((item.baseExperience || 0) % 48);
    const body = `Dex #${item.id} has base EXP ${item.baseExperience}. Community members are sharing move combos, counters, and lineup ideas for ${displayName}.`;

    return `
      <article class="forum-thread-card">
        <img src="${item.sprite || ''}" alt="${displayName}" class="forum-avatar" loading="lazy">
        <div class="forum-thread-main">
          <header>
            <h4>${title}</h4>
            <span>${pseudoTime(index)}</span>
          </header>
          <p>${body}</p>
          <div class="forum-thread-meta">
            <span>@${userHandle(item.name, index)}</span>
            <span>${typeLine}</span>
            <span>${replies} replies</span>
            <span>${likes} likes</span>
          </div>
          <div class="forum-thread-actions">
            <button type="button" class="forum-action-btn">Join Thread</button>
            <button type="button" class="forum-action-btn">Save</button>
          </div>
        </div>
      </article>`;
  });

  forumList.innerHTML = threads.join('');
}

function renderSummary(summaryPayload) {
  if (!liveSummary) return;

  if (!summaryPayload) {
    liveSummary.innerHTML = '<p class="community-empty">No summary data available.</p>';
    return;
  }

  const chips = (summaryPayload.dominantTypes || [])
    .map((entry) => `<span class="live-type-chip">${titleCase(entry.type)} • ${entry.count}</span>`)
    .join('');

  liveSummary.innerHTML = `
    <article class="live-summary-card">
      <strong>${summaryPayload.totalPokemon}</strong>
      <span>Pokemon in feed</span>
    </article>
    <article class="live-summary-card">
      <strong>${summaryPayload.averageExperience}</strong>
      <span>Avg base EXP</span>
    </article>
    <article class="live-summary-card live-summary-types">
      <strong>Dominant Types</strong>
      <div class="live-type-row">${chips || '<span class="live-type-chip">No data</span>'}</div>
    </article>`;
}

function renderLiveFeed(payload) {
  if (!liveFeedGrid || !liveFeedMeta) return;

  const fetchedAt = new Date(payload.fetchedAt).toLocaleString();
  liveFeedMeta.textContent = `${payload.source} • fetched ${fetchedAt}${payload.cached ? ' • cached' : ''}`;

  if (!payload.items || !payload.items.length) {
    liveFeedGrid.innerHTML = '<p class="community-empty">No live web data available right now.</p>';
    renderSpotlight(null);
    renderSummary(null);
    return;
  }

  renderSpotlight(payload.spotlight);
  renderSummary(payload.summary);
  renderForum(payload);
  liveFeedGrid.innerHTML = payload.items.map(renderLiveCard).join('');
}

async function loadLiveFeed({ forceRefresh = false } = {}) {
  if (!liveFeedGrid || !liveFeedMeta) return;

  try {
    const params = new URLSearchParams();
    params.set('limit', '12');
    params.set('sort', liveSort?.value || 'dex');
    if (forceRefresh) params.set('refresh', '1');

    const res = await fetch(`/api/live/pokemon-feed?${params.toString()}`);
    if (!res.ok) throw new Error('Could not fetch live web data');
    const payload = await res.json();
    renderLiveFeed(payload);
  } catch (err) {
    liveFeedMeta.textContent = 'Live web data is temporarily unavailable.';
    liveFeedGrid.innerHTML = '<p class="community-empty">Could not load live feed right now.</p>';
    if (liveSpotlight) liveSpotlight.innerHTML = '';
    if (liveSummary) liveSummary.innerHTML = '';
    if (forumList) forumList.innerHTML = '<p class="community-empty">Forum is unavailable right now.</p>';
    console.error(err);
  }
}

async function init() {
  await loadLiveFeed();

  if (liveSort) {
    liveSort.addEventListener('change', () => {
      loadLiveFeed();
    });
  }

  if (liveRefresh) {
    liveRefresh.addEventListener('click', () => {
      loadLiveFeed({ forceRefresh: true });
    });
  }
}

init();
