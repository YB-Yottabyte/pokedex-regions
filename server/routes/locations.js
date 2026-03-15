const express = require('express');
const router = express.Router();
const { getAllLocations, getLocationById, getLocationBySlug } = require('../controllers/locationsController');

// GET all locations
router.get('/', getAllLocations);

// GET location by ID
router.get('/id/:id', getLocationById);

// GET location by slug
router.get('/:slug', getLocationBySlug);

module.exports = router;
