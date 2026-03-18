# Pokémon Regions Explorer – Virtual Community Space

An interactive web app for exploring Pokémon regions and attending community events at regional locations. Built with **React**, **Node.js/Express**, and **PostgreSQL**.

## Live Demo

Visit: https://pokedex-regions.vercel.app/

## GIF Walkthrough

![Project 3 Walkthrough](./assets/P3.gif)

## Description

This is a virtual community space where users explore Pokémon regions, browse locations within each region, and view events happening at those locations. The app demonstrates a full-stack architecture with a React frontend consuming REST APIs backed by PostgreSQL.

**User Experience Flow:**
1. Home page displays all Pokémon regions with visual cards
2. Click a region to see its locations and community details
3. Click a location to see all events at that location
4. Visit the Events page (React) to view all events, filter by location/type, and see live countdowns
5. Legacy forum page shows live community discussions powered by PokeAPI

## Tech Stack

- **Frontend:** React 18 (via CDN + Babel), HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **APIs:** RESTful backend; optional live data from PokeAPI
- **Deployment:** Vercel (frontend) + Render (database)

## Required Features Checklist

- [x] The web app uses React to display data from an API.
- [x] The web app is connected to a PostgreSQL database with regions, locations, and events tables.
- [x] Front page of web app is functional and appropriately styled.
- [x] Each list item has a corresponding detail page.

## Stretch Features Checklist

- [x] The app includes an additional Events page (React-based).
- [x] Each event includes a countdown to when the event will occur.

**Bonus Features:**
- [x] Event type filtering
- [x] Location-based filtering
- [x] Sort by date
- [x] Dynamic status styling (live/upcoming/past)
- [x] Live community forum with PokeAPI data
- [x] 404 error page with recovery links

## Rubric Coverage

| Feature | Points | Evidence |
|---------|--------|----------|
| Uses React to display API data | 1 | [events-react.jsx](client/src/js/events-react.jsx) + `/api/events`, `/api/locations` |
| Connected to PostgreSQL | 5 | [seed.js](server/config/seed.js), [db.js](server/config/db.js), tables: regions, locations, events |
| Front page functional & styled | 5 | [index.html](client/src/index.html), [style.css](client/src/css/style.css) |
| Each list item has detail page | 5 | `/regions/:slug`, `/locations/:slug` with unique content |
| **Stretch: Additional Events page** | 2 | `/events` (React) and `/events-legacy` |
| **Stretch: Countdown to event** | 2 | Live countdown logic, dynamic status formatting |
| **Total** | **16 + 4** | **All implemented** |

## API Endpoints

### Regions
- `GET /api/regions` – All regions
- `GET /api/regions/:slug` – One region by slug

### Locations
- `GET /api/locations` – All locations
- `GET /api/locations?regionSlug=<slug>` – Filter by region
- `GET /api/locations/:slug` – One location by slug

### Events
- `GET /api/events` – All events
- `GET /api/events?locationSlug=<slug>` – Filter by location
- `GET /api/events?locationSlug=<slug>&sort=soon|latest` – Sort by date

### Live (Bonus)
- `GET /api/live/pokemon-feed?limit=12&sort=dex|exp&refresh=1` – Live PokeAPI data for forum

## Project Structure

```text
client/src/
  index.html
  region.html
  location.html
  events.html              # React mount point
  events-legacy.html       # Previous forum version
  404.html
  css/style.css
  js/
    index.js
    region.js
    location.js
    events.js              # Legacy forum logic
    events-react.jsx       # React component

server/
  server.js
  config/
    db.js
    seed.js
  routes/
    regions.js
    locations.js
    events.js
    live.js                # PokeAPI live feed

assets/
  P3.gif                   # Walkthrough GIF
```

## Setup & Running

### Prerequisites
- Node.js 14+
- PostgreSQL (local or Render)
- `.env` file with database credentials

### Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure `.env`:**
   ```env
   PGUSER=your_user
   PGPASSWORD=your_password
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=pokedex_regions
   PORT=3000
   ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```

4. **Start the app:**
   ```bash
   npm run start
   ```

5. **Open browser:**
   - http://localhost:3000

### Deployment (Vercel + Render)

1. Create PostgreSQL database on Render
2. Copy connection details to `.env`
3. Deploy server to Render or host of choice
4. Deploy frontend to Vercel
5. Update API base URL in frontend if needed

## Navigation

From any page, use the navbar to navigate:
- **Home** – Return to region browser
- **Community Events** – React events page with filters and countdown
- **Legacy Forum** – Previous implementation with live PokeAPI forum
- **Test 404** – Intentional broken link to show 404 page

## Key Pages

### Home (`/`)
- Browse all Pokémon regions
- Click region card to open detail page

### Region Detail (`/regions/:slug`)
- Region info: games, starters, legendary Pokémon, professor, villain
- Location cards for that region
- Click location to see events

### Location Detail (`/locations/:slug`)
- Location name and description
- All events at this location
- Countdown timers showing time until each event
- Visual formatting for live/passed events

### Events (React) (`/events`)
- **Filter by location** – Dropdown with all locations
- **Filter by event type** – Dynamic list based on data
- **Sort by date** – Soonest first or latest first
- **Live countdown** – Updates every minute
- **Event status** – Visual styling for scheduled/live/passed
- Link to location detail page from each event

### Legacy Forum (`/events-legacy`)
- Community forum threads powered by live PokeAPI data
- Sort live feed by Dex number or base experience
- Refresh button to load different Pokémon set
- Forum-style cards with pseudo-usernames and metadata

### 404 Page (`/route-not-found-demo`)
- Ditto artwork
- Recovery links to Home, Events, and Legacy Forum

## Search & Filter Examples

**Home page search:**
- "Kanto" – Find Kanto region
- "Oak" – Find regions with Professor Oak
- "Rocket" – Find regions with Team Rocket
- "1" – Find regions from Generation 1

**Events page filters:**
- Filter by: Kanto, Johto, Hoenn, Sinnoh, etc.
- Filter by: Battle Meetup, Workshop, Tournament, Casual Gathering, etc.
- Sort by: Soonest First or Latest First

## Styling & UX

- **Dark theme** with Pokémon-inspired accents (yellow)
- **Responsive design** for mobile and desktop
- **Skeleton loading states** while fetching data
- **Hover effects** on interactive elements
- **Status badges** for live/upcoming/past events
- **Countdown timers** that tick every minute

## Notes for Grading

- React is clearly used on the `/events` page consuming `/api/events` and `/api/locations` APIs
- PostgreSQL database is seeded with Pokémon regions, official locations, and sample events
- All required and stretch features are implemented and visible during walkthrough
- The app demonstrates full-stack capability: frontend rendering, backend routing, database querying
- Previous vanilla JS implementation is preserved at `/events-legacy` for reference

## Author

Sai Rithwik Kukunuri

© 2026 All rights reserved.
