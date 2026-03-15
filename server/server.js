require('dotenv').config();
const express = require('express');
const path = require('path');
const regionsRouter = require('./routes/regions');
const locationsRouter = require('./routes/locations');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from client/src
app.use(express.static(path.join(__dirname, '../client/src')));

// API routes
app.use('/api/regions', regionsRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/events', eventsRouter);

// Region detail pages — serve region.html, JS reads slug from URL
app.get('/regions/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src/region.html'));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../client/src/404.html'));
});

app.listen(PORT, () => {
  console.log(`Pokémon Regions Explorer running at http://localhost:${PORT}`);
});
