const slug = window.location.pathname.replace('/regions/', '').replace(/\/$/, '');

function typeBadge(type) {
  return type.split('/').map(t =>
    `<span class="type-badge type-${t.trim().toLowerCase()}">${t.trim()}</span>`
  ).join(' ');
}

function starterCard(s) {
  let art;
  if (s.image) {
    art = `<img src="${s.image}" alt="${s.name}" class="starter-artwork starter-artwork--custom">`;
  } else if (s.id) {
    art = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${s.id}.png" alt="${s.name}" class="starter-artwork">`;
  } else {
    art = `<div class="artwork-placeholder">?</div>`;
  }
  return `
    <div class="starter-card">
      ${art}
      <strong>${s.name}</strong>
      ${typeBadge(s.type)}
    </div>`;
}

function render(r) {
  document.title = `${r.name} \u2014 Pok\u00e9mon Regions`;

  const legendaryArt = r.legendary.id
    ? `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${r.legendary.id}.png" alt="${r.legendary.name}" class="legendary-artwork">`
    : `<div class="artwork-placeholder artwork-placeholder--lg">?</div>`;

  document.getElementById('region-content').innerHTML = `
    <div class="container page-content" style="--rc: ${r.color}">
      <a href="/" class="back-btn">&#8592; All Regions</a>

      <div class="region-hero" style="border-left: 6px solid ${r.color}">
        <hgroup>
          <h1 style="color: ${r.color}">${r.name}</h1>
          <p>Generation ${r.generation} &bull; Introduced ${r.introduced}</p>
        </hgroup>
        <div class="hero-stats">
          <div class="stat-box">
            <strong>${r.pokemonCount}</strong>
            <span>New Pok&eacute;mon</span>
          </div>
          <div class="stat-box">
            <strong>${r.gymCount > 0 ? r.gymCount : r.trialCount}</strong>
            <span>${r.gymCount > 0 ? 'Gyms' : 'Trials'}</span>
          </div>
          <div class="stat-box">
            <strong>${r.generation}</strong>
            <span>Generation</span>
          </div>
          <div class="stat-box">
            <strong>${r.introduced}</strong>
            <span>Year</span>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-left">
          <article>
            <header><h3>About ${r.name}</h3></header>
            <p>${r.description}</p>
          </article>
          <article>
            <header><h3>Games</h3></header>
            <ul class="games-list">
              ${r.games.map(g => `<li>${g}</li>`).join('')}
            </ul>
          </article>
          <article>
            <header><h3>Notable Locations</h3></header>
            <div class="tags-wrap">
              ${r.notableLocations.map(loc => `<span class="tag">${loc}</span>`).join('')}
            </div>
          </article>
          <article>
            <header><h3>Professor &amp; Villain</h3></header>
            <p><strong>Professor:</strong> ${r.professor}</p>
            <p><strong>Villainous Team:</strong> ${r.villain}</p>
          </article>
        </div>

        <div class="detail-right">
          <article>
            <header><h3>Starter Pok&eacute;mon</h3></header>
            <div class="starters-grid">
              ${r.starters.map(starterCard).join('')}
            </div>
          </article>
          <article>
            <header><h3>Legendary Pok&eacute;mon</h3></header>
            <div class="legendary-box">
              ${legendaryArt}
              <strong>${r.legendary.name}</strong>
            </div>
          </article>
        </div>
      </div>
    </div>`;
}

async function load() {
  try {
    const res = await fetch(`/api/regions/${slug}`);
    if (res.status === 404) {
      window.location.replace('/404.html');
      return;
    }
    if (!res.ok) throw new Error('Server error');
    const region = await res.json();
    render(region);
  } catch (err) {
    document.getElementById('region-content').innerHTML = `
      <div class="container page-content">
        <div class="not-found">
          <h1>Oops</h1>
          <p>Could not load region data.</p>
          <a href="/" role="button">Back to All Regions</a>
        </div>
      </div>`;
    console.error(err);
  }
}

load();
