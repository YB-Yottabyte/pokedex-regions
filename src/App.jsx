import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegionDetail from './pages/RegionDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import './index.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1><a href="/">🌍 Pokémon Regions Explorer</a></h1>
            <nav className="main-nav">
              <a href="/">Regions</a>
              <a href="/events">Community Events</a>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/region/:slug" element={<RegionDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:locationSlug" element={<EventDetail />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Pokémon Regions Explorer. Explore regions and community events!</p>
        </footer>
      </div>
    </Router>
  );
}
