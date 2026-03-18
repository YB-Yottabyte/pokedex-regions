const express = require('express');
const router = express.Router();
const pool = require('../config/db');

function toClient(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    eventType: row.event_type,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    capacity: row.capacity,
    attendeeCount: row.attendee_count,
    status: row.status,
    locationId: row.location_id,
    locationName: row.location_name,
    locationSlug: row.location_slug,
    regionName: row.region_name,
    regionSlug: row.region_slug,
  };
}

// GET /api/events?locationSlug=kanto-pallet-town&sort=soon
router.get('/', async (req, res) => {
  const locationSlug = (req.query.locationSlug || req.query.location || '').trim();
  const regionSlug = (req.query.regionSlug || req.query.region || '').trim();
  const sort = (req.query.sort || 'soon').trim().toLowerCase();

  try {
    const params = [];
    const whereParts = [];

    if (locationSlug) {
      params.push(locationSlug);
      whereParts.push(`l.slug = $${params.length}`);
    }

    if (regionSlug) {
      params.push(regionSlug);
      whereParts.push(`r.slug = $${params.length}`);
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';
    const orderClause = sort === 'latest' ? 'ORDER BY e.starts_at DESC' : 'ORDER BY e.starts_at ASC';

    const result = await pool.query(
      `SELECT
         e.*,
         l.name AS location_name,
         l.slug AS location_slug,
         r.name AS region_name,
         r.slug AS region_slug
       FROM events e
       INNER JOIN locations l ON l.id = e.location_id
       INNER JOIN regions r ON r.id = l.region_id
       ${whereClause}
       ${orderClause}`,
      params
    );

    res.json(result.rows.map(toClient));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid event id' });
  }

  try {
    const result = await pool.query(
      `SELECT
         e.*,
         l.name AS location_name,
         l.slug AS location_slug,
         r.name AS region_name,
         r.slug AS region_slug
       FROM events e
       INNER JOIN locations l ON l.id = e.location_id
       INNER JOIN regions r ON r.id = l.region_id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(toClient(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
