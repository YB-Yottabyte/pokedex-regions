const express = require('express');
const router = express.Router();
const pool = require('../config/db');

function toClient(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    spotlight: row.spotlight,
    cardColor: row.card_color,
    regionId: row.region_id,
    regionName: row.region_name,
    regionSlug: row.region_slug,
    eventCount: Number(row.event_count || 0),
  };
}

// GET /api/locations?regionSlug=kanto
router.get('/', async (req, res) => {
  const regionSlug = (req.query.regionSlug || req.query.region || '').trim();
  try {
    const values = [];
    let whereClause = '';

    if (regionSlug) {
      values.push(regionSlug);
      whereClause = 'WHERE r.slug = $1';
    }

    const result = await pool.query(
      `SELECT
        l.*,
        r.name AS region_name,
        r.slug AS region_slug,
        COUNT(e.id)::int AS event_count
       FROM locations l
       INNER JOIN regions r ON r.id = l.region_id
       LEFT JOIN events e ON e.location_id = l.id
       ${whereClause}
       GROUP BY l.id, r.name, r.slug
       ORDER BY r.slug, l.name`,
      values
    );

    res.json(result.rows.map(toClient));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/locations/:slug
router.get('/:slug', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        l.*,
        r.name AS region_name,
        r.slug AS region_slug,
        COUNT(e.id)::int AS event_count
       FROM locations l
       INNER JOIN regions r ON r.id = l.region_id
       LEFT JOIN events e ON e.location_id = l.id
       WHERE l.slug = $1
       GROUP BY l.id, r.name, r.slug`,
      [req.params.slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(toClient(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
