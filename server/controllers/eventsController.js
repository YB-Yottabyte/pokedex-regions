const pool = require('../config/community-db');

// Get all events
async function getAllEvents(req, res) {
  try {
    const result = await pool.query(`
      SELECT e.*, l.name as location_name, l.slug as location_slug
      FROM events e
      JOIN locations l ON e.location_id = l.id
      ORDER BY e.event_date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

// Get events by location ID
async function getEventsByLocation(req, res) {
  try {
    const { locationId } = req.params;
    const result = await pool.query(`
      SELECT e.*, l.name as location_name, l.slug as location_slug
      FROM events e
      JOIN locations l ON e.location_id = l.id
      WHERE e.location_id = $1
      ORDER BY e.event_date ASC
    `, [locationId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

// Get events by location slug
async function getEventsByLocationSlug(req, res) {
  try {
    const { slug } = req.params;
    const result = await pool.query(`
      SELECT e.*, l.name as location_name, l.slug as location_slug
      FROM events e
      JOIN locations l ON e.location_id = l.id
      WHERE l.slug = $1
      ORDER BY e.event_date ASC
    `, [slug]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

// Get single event by ID
async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT e.*, l.name as location_name, l.slug as location_slug
      FROM events e
      JOIN locations l ON e.location_id = l.id
      WHERE e.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
}

module.exports = {
  getAllEvents,
  getEventsByLocation,
  getEventsByLocationSlug,
  getEventById
};
