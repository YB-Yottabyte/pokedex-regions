const express = require('express');
const router = express.Router();
const { 
  getAllEvents, 
  getEventsByLocation, 
  getEventsByLocationSlug, 
  getEventById 
} = require('../controllers/eventsController');

// GET all events
router.get('/', getAllEvents);

// GET events by location ID
router.get('/location/:locationId', getEventsByLocation);

// GET events by location slug
router.get('/location-slug/:slug', getEventsByLocationSlug);

// GET single event by ID
router.get('/:id', getEventById);

module.exports = router;
