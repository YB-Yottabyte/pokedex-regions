const express = require('express');
const router = express.Router();
const pool = require('../config/db');

function toClient(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    generation: row.generation,
    games: row.games,
    description: row.description,
    starters: row.starters,
    legendary: row.legendary,
    gymCount: row.gym_count,
    trialCount: row.trial_count,
    color: row.color,
    introduced: row.introduced,
    notableLocations: row.notable_locations,
    pokemonCount: row.pokemon_count,
    professor: row.professor,
    villain: row.villain,
  };
}

// GET /api/regions?search=query
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    let result;
    if (search && search.trim()) {
      result = await pool.query(
        `SELECT * FROM regions
         WHERE name ILIKE $1 OR professor ILIKE $1 OR villain ILIKE $1
            OR generation::text = $2
         ORDER BY generation`,
        [`%${search.trim()}%`, search.trim()]
      );
    } else {
      result = await pool.query('SELECT * FROM regions ORDER BY generation');
    }
    res.json(result.rows.map(toClient));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/regions/:slug
router.get('/:slug', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM regions WHERE slug = $1',
      [req.params.slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Region not found' });
    }
    res.json(toClient(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
