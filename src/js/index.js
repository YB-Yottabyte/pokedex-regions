const grid = document.getElementById('regions-grid');
const sectionLabel = document.getElementById('section-label');
const heroSub = document.getElementById('hero-sub');
const searchInput = document.getElementById('search-input');

function starterImg(s) {
  if (s.image) {
    return `<img src="${s.image}" alt="${s.name}" title="${s.name}" class="sprite-sm sprite-custom">`;
  }
  if (s.id) {
    return `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${s.id}.png" alt="${s.name}" title="${s.name}" class="sprite-sm">`;
  }
  return `<div class="sprite-sm sprite-placeholder" title="${s.name}">?</div>`;
}

function renderCards(regions) {
  if (regions.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <span>&#128123;</span>
        No regions found. Try a different search.
      </div>`;
    return;
  }

  grid.innerHTML = regions.map(r => `
    <article class="region-card" style="--rc: ${r.color}">
      <a href="/regions/${r.slug}" class="card-link">
        <div class="card-top">
          <h2>${r.name}</h2>
          <span class="gen-badge">Gen ${r.generation}</span>
        </div>
        <div class="card-body">
          <p class="card-games">${r.games.slice(0, 2).join(' · ')}</p>
          <p class="card-desc">${r.description.slice(0, 160)}&hellip;</p>
          <div class="starters-row">
            ${r.starters.map(starterImg).join('')}
          </div>
          <div class="card-meta">
            <span>${r.pokemonCount} Pok&eacute;mon</span>
            <span>${r.gymCount > 0 ? `${r.gymCount} Gyms` : `${r.trialCount} Trials`}</span>
            <span>Since ${r.introduced}</span>
          </div>
        </div>
      </a>
    </article>
  `).join('');
}

async function fetchRegions(search = '') {
  const url = search ? `/api/regions?search=${encodeURIComponent(search)}` : '/api/regions';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch regions');
  return res.json();
}

async function load(search = '') {
  try {
    const regions = await fetchRegions(search);
    renderCards(regions);

    if (!search) {
      sectionLabel.textContent = `All Regions`;
      heroSub.textContent = `Dive into all ${regions.length} main-series regions \u2014 from the original Kanto to the open-world Paldea.`;
    } else {
      sectionLabel.textContent = `${regions.length} result${regions.length !== 1 ? 's' : ''} for "${search}"`;
    }
  } catch (err) {
    grid.innerHTML = `<div class="no-results"><span>&#9888;</span>Could not load regions. Is the server running?</div>`;
    console.error(err);
  }
}

// Debounce search
let debounceTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => load(searchInput.value.trim()), 300);
});

// Initial load
load();
