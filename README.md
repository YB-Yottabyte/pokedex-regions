# Pokemon Regions Explorer

An interactive Pokemon Regions web app that serves region data from a PostgreSQL database with a vanilla HTML/CSS/JavaScript frontend.

## Live Demo

Visit the live app: https://pokedex-regions.vercel.app/

## Description

This project is a refactor of my Unit 1 listicle app. Instead of reading static data directly in the frontend, the app now fetches region data from a PostgreSQL database via API routes.

Users can:

- Browse all Pokemon regions on the home page.
- Open a dedicated detail page for each region.
- Search regions by specific attributes.

## Tech Stack

- Frontend: HTML, CSS, JavaScript (no frontend framework)
- Backend: Node.js, Express
- Database: PostgreSQL (Railway/local compatible)
- Database client: `pg`

## Required Features Checklist

- [x] The web app uses only HTML, CSS, and JavaScript without a frontend framework.
- [x] The web app is connected to a PostgreSQL database, with an appropriately structured database table for the list items.
- [x] The PostgreSQL database includes a table that matches the data displayed in the web app.

## Stretch Features Checklist

- [x] The user can search for items with a specific attribute.

## Database Evidence

![Railway Database](./assets/railway-db.png)

![Regions Table Schema](./assets/regions-schema.png)

![Regions Table Data](./assets/regions-data.png)

## API Endpoints

- `GET /api/regions`
  - Returns all regions.
- `GET /api/regions?search=<query>`
  - Filters regions by name, professor, villain, or exact generation value.
- `GET /api/regions/:slug`
  - Returns one region by slug.

## Project Structure

```text
client/src/
	index.html
	region.html
	css/style.css
	js/index.js
	js/region.js

server/
	server.js
	config/db.js
	config/seed.js
	routes/regions.js
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=3000
```

For Railway/hosted Postgres, SSL is enabled automatically in production-like environments.

3. Seed the database:

```bash
npm run seed
```

4. Start the app:

```bash
npm run dev
```

5. Open:

- `http://localhost:3000`

## Search Feature

Search is available on the homepage. Users can search by:

- Region name (example: `Kanto`)
- Professor (example: `Oak`)
- Villain team (example: `Rocket`)
- Generation number (example: `1`)

## Notes

- Database records are created in `server/config/seed.js`.
- The table is created automatically if it does not already exist.
- Data from PostgreSQL is transformed to frontend-friendly keys in `server/routes/regions.js`.
