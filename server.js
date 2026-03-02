const express = require('express');
const path = require('path');
const regions = require('./data/regions');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ─── HTML Layout ────────────────────────────────────────────────────────────

function layout(title, content) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <!-- Decorative background pokeballs -->
  <div class="site-bg" aria-hidden="true"></div>
  <nav class="site-nav" aria-label="Main navigation">
    <div class="container nav-inner">
      <a href="/" class="nav-logo">&#9670; Pokémon Regions</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/pokedex">Pokédex</a></li>
        <li><a href="/favorites">Favorites</a></li>
      </ul>
    </div>
  </nav>
  <main>
    ${content}
  </main>
  <footer class="container">
    <span class="footer-ball" aria-hidden="true"></span>
    <p>&copy; 2026 Sai Rithwik Kukunuri. All rights reserved.</p>
  </footer>
  <script>
    window.onYouTubeIframeAPIReady = function () {
      const el = document.getElementById('yt-player');
      if (!el) return;
      new YT.Player('yt-player', {
        videoId: '38XHXMdDegg',
        playerVars: {
          autoplay: 1, mute: 1, controls: 0,
          showinfo: 0, rel: 0, modestbranding: 1,
          start: 10, end: 82,
          iv_load_policy: 3, disablekb: 1, fs: 0
        },
        events: {
          onReady: function(e) { e.target.playVideo(); },
          onStateChange: function(e) {
            // When clip ends, loop back to 0:10
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(10, true);
              e.target.playVideo();
            }
          }
        }
      });
    };
  </script>
  <script src="https://www.youtube.com/iframe_api" async></script>
</body>
</html>`;
}

// ─── Index Route ─────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  const cards = regions.map(region => `
    <article class="region-card" style="--rc: ${region.color}">
      <a href="/regions/${region.slug}" class="card-link">
        <div class="card-top">
          <h2>${region.name}</h2>
          <span class="gen-badge">Gen ${region.generation}</span>
        </div>
        <div class="card-body">
          <p class="card-games">${region.games.slice(0, 2).join(' · ')}</p>
          <p class="card-desc">${region.description.slice(0, 160)}…</p>
          <div class="starters-row">
            ${region.starters.map(s => s.image
              ? `<img src="${s.image}" alt="${s.name}" title="${s.name}" class="sprite-sm sprite-custom">`
              : s.id
                ? `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${s.id}.png" alt="${s.name}" title="${s.name}" class="sprite-sm">`
                : `<div class="sprite-sm sprite-placeholder" title="${s.name}">?</div>`
            ).join('')}
          </div>
          <div class="card-meta">
            <span>${region.pokemonCount} Pokémon</span>
            <span>${region.gymCount > 0 ? `${region.gymCount} Gyms` : `${region.trialCount} Trials`}</span>
            <span>Since ${region.introduced}</span>
          </div>
        </div>
      </a>
    </article>
  `).join('');

  const content = `
    <section class="hero">
      <div class="hero-video-bg">
        <div id="yt-player"></div>
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <p class="hero-eyebrow">&#9670;&nbsp; Pokémon Regions Explorer</p>
        <h1>Explore<br>Every <span>Region</span></h1>
        <p class="hero-sub">Dive into all ${regions.length} main-series regions &mdash; from the original Kanto to the open-world Paldea.</p>
        <a href="#regions" class="hero-cta">Browse Regions &#8595;</a>
      </div>
      <div class="scroll-hint">
        <span class="scroll-arrow">&#8595;</span>
        <span>scroll</span>
      </div>
    </section>
    <div id="regions" class="container">
      <p class="regions-section-label">All Regions</p>
      <div class="regions-grid">
        ${cards}
      </div>
    </div>
  `;

  res.send(layout('Pokémon Regions Explorer', content));
});

// ─── Region Detail Route ──────────────────────────────────────────────────────

app.get('/regions/:slug', (req, res) => {
  const region = regions.find(r => r.slug === req.params.slug);
  if (!region) return res.status(404).send(page404());

  const starterCards = region.starters.map(s => `
    <div class="starter-card">
      ${s.image
        ? `<img src="${s.image}" alt="${s.name}" class="starter-artwork starter-artwork--custom">`
        : s.id
          ? `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${s.id}.png" alt="${s.name}" class="starter-artwork">`
          : `<div class="artwork-placeholder">?</div>`}
      <strong>${s.name}</strong>
      <span class="type-badge type-${s.type.split('/')[0].toLowerCase()}">${s.type}</span>
    </div>
  `).join('');

  const content = `
    <div class="container page-content" style="--rc: ${region.color}">
    <a href="/" class="back-btn">&#8592; All Regions</a>

    <div class="region-hero" style="border-left: 6px solid ${region.color}">
      <hgroup>
        <h1 style="color: ${region.color}">${region.name}</h1>
        <p>Generation ${region.generation} &bull; Introduced ${region.introduced}</p>
      </hgroup>
      <div class="hero-stats">
        <div class="stat-box">
          <strong>${region.pokemonCount}</strong>
          <span>New Pokémon</span>
        </div>
        <div class="stat-box">
          <strong>${region.gymCount > 0 ? region.gymCount : region.trialCount}</strong>
          <span>${region.gymCount > 0 ? 'Gyms' : 'Trials'}</span>
        </div>
        <div class="stat-box">
          <strong>${region.generation}</strong>
          <span>Generation</span>
        </div>
        <div class="stat-box">
          <strong>${region.introduced}</strong>
          <span>Year</span>
        </div>
      </div>
    </div>

    <div class="detail-grid">

      <div class="detail-left">
        <article>
          <header><h3>About ${region.name}</h3></header>
          <p>${region.description}</p>
        </article>

        <article>
          <header><h3>Games</h3></header>
          <ul class="games-list">
            ${region.games.map(g => `<li>${g}</li>`).join('')}
          </ul>
        </article>

        <article>
          <header><h3>Notable Locations</h3></header>
          <div class="tags-wrap">
            ${region.notableLocations.map(loc => `<span class="tag">${loc}</span>`).join('')}
          </div>
        </article>

        <article>
          <header><h3>Professor &amp; Villain</h3></header>
          <p><strong>Professor:</strong> ${region.professor}</p>
          <p><strong>Villainous Team:</strong> ${region.villain}</p>
        </article>
      </div>

      <div class="detail-right">
        <article>
          <header><h3>Starter Pokémon</h3></header>
          <div class="starters-grid">
            ${starterCards}
          </div>
        </article>

        <article>
          <header><h3>Legendary Pokémon</h3></header>
          <div class="legendary-box">
            ${region.legendary.id
              ? `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${region.legendary.id}.png" alt="${region.legendary.name}" class="legendary-artwork">`
              : `<div class="artwork-placeholder artwork-placeholder--lg">?</div>`}
            <strong>${region.legendary.name}</strong>
          </div>
        </article>
      </div>

    </div>
    </div>
  `;

  res.send(layout(`${region.name} — Pokémon Regions`, content));
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

function page404() {
  return layout('404 — Not Found', `
    <div class="container page-content">
      <div class="not-found">
        <h1>404</h1>
        <p>Oops! This page fled like a wild Pokémon.</p>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png"
          alt="Ditto"
          class="ditto-img"
        >
        <br><br>
        <a href="/" role="button">Back to All Regions</a>
      </div>
    </div>
  `);
}

app.use((req, res) => {
  res.status(404).send(page404());
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Pokémon Regions Explorer running at http://localhost:${PORT}`);
});
