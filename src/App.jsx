import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LocationDetail from './pages/LocationDetail';
import AllEvents from './pages/AllEvents';
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
            <Route path="/location/:slug" element={<LocationDetail />} />
            <Route path="/events" element={<AllEvents />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Pokémon Regions Explorer. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}
