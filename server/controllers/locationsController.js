const pool = require('../config/community-db');

// Get all locations
async function getAllLocations(req, res) {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
}

// Get single location by ID
async function getLocationById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM locations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
}

// Get location by slug
async function getLocationBySlug(req, res) {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM locations WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
}

module.exports = {
  getAllLocations,
  getLocationById,
  getLocationBySlug
};
