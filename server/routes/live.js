const express = require('express');
const router = express.Router();

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const CACHE_TTL_MS = 15 * 60 * 1000;
const POKEAPI_MAX_OFFSET = 1300;

const feedCache = new Map();

function pickOffset({ limit, refresh }) {
  const maxOffset = Math.max(0, POKEAPI_MAX_OFFSET - limit);

  if (refresh) {
    return Math.floor(Math.random() * (maxOffset + 1));
  }

  const now = new Date();
  const hourBucket = Math.floor(now.getUTCHours() / 3);
  const rollingSeed = Number(
    `${now.getUTCFullYear()}${now.getUTCMonth() + 1}${now.getUTCDate()}${hourBucket}`
  );

  return rollingSeed % (maxOffset + 1);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed for ${url}: ${res.status}`);
  }
  return res.json();
}

function englishFlavorText(entries) {
  if (!Array.isArray(entries)) return null;
  const english = entries.find((entry) => entry.language?.name === 'en');
  if (!english?.flavor_text) return null;
  return english.flavor_text.replace(/\s+/g, ' ').trim();
}

function sortItems(items, sortBy) {
  const copy = [...items];

  if (sortBy === 'dex-desc') {
    return copy.sort((a, b) => b.id - a.id);
  }

  if (sortBy === 'exp') {
    return copy.sort((a, b) => (b.baseExperience || 0) - (a.baseExperience || 0));
  }

  return copy.sort((a, b) => a.id - b.id);
}

function summarizeFeed(items) {
  const typeCount = {};
  let totalExp = 0;

  for (const item of items) {
    totalExp += item.baseExperience || 0;
    for (const type of item.types || []) {
      typeCount[type] = (typeCount[type] || 0) + 1;
    }
  }

  const dominantTypes = Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([type, count]) => ({ type, count }));

  const averageExp = items.length ? Math.round(totalExp / items.length) : 0;

  return {
    totalPokemon: items.length,
    averageExperience: averageExp,
    dominantTypes,
  };
}

async function fetchLivePokemonFeed({ limit, sortBy, refresh }) {
  const offset = pickOffset({ limit, refresh });
  const list = await fetchJson(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);

  const details = await Promise.all(
    list.results.map((item) => fetchJson(item.url))
  );

  const feed = details.map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default,
    types: pokemon.types.map((t) => t.type.name),
    baseExperience: pokemon.base_experience,
    height: pokemon.height,
    weight: pokemon.weight,
    sourceUrl: `${POKEAPI_BASE}/pokemon/${pokemon.id}`,
    speciesUrl: pokemon.species?.url,
  }));

  const sortedFeed = sortItems(feed, sortBy);
  const summary = summarizeFeed(sortedFeed);

  const spotlightBase = [...sortedFeed].sort(
    (a, b) => (b.baseExperience || 0) - (a.baseExperience || 0)
  )[0];

  let spotlight = null;
  if (spotlightBase?.speciesUrl) {
    const species = await fetchJson(spotlightBase.speciesUrl);
    spotlight = {
      ...spotlightBase,
      flavorText: englishFlavorText(species.flavor_text_entries),
      habitat: species.habitat?.name || null,
      generation: species.generation?.name || null,
    };
  }

  return {
    source: 'PokeAPI',
    fetchedAt: new Date().toISOString(),
    summary,
    spotlight,
    items: sortedFeed,
  };
}

// GET /api/live/pokemon-feed?limit=12&sort=exp&refresh=1
router.get('/pokemon-feed', async (req, res) => {
  try {
    const limitRaw = Number(req.query.limit || 8);
    const limit = Number.isFinite(limitRaw) ? Math.min(20, Math.max(6, Math.floor(limitRaw))) : 8;
    const sortBy = ['dex', 'dex-desc', 'exp'].includes(req.query.sort) ? req.query.sort : 'dex';
    const refresh = String(req.query.refresh || '').toLowerCase() === '1';

    const cacheKey = `${limit}:${sortBy}`;
    const now = Date.now();
    const cached = feedCache.get(cacheKey);

    if (!refresh && cached && now < cached.expiresAt) {
      return res.json({ ...cached.payload, cached: true });
    }

    const feed = await fetchLivePokemonFeed({ limit, sortBy, refresh });

    feedCache.set(cacheKey, {
      payload: feed,
      expiresAt: now + CACHE_TTL_MS,
    });

    res.json({ ...feed, cached: false });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to fetch live web data from PokeAPI' });
  }
});

module.exports = router;
