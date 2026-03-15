# Virtual Community Space - Project 3

A React-based community event discovery platform that allows users to explore events by location. Built with React, Express, PostgreSQL, and styled with modern CSS.

## 🌍 Live Demo

Coming soon! Deploy to Vercel/Railway with database connection.

## 📖 GIF Walkthrough

Add your walkthrough GIF here:
- Record: Browse locations → Click location → View events → Click "All Events" page
- Placeholder: `![Walkthrough](./assets/project-walkthrough.gif)`

## 📝 Description

Virtual Community Space is a social discovery platform where users can:
- **Browse locations** on the interactive home page
- **Explore events** occurring at specific locations
- **View all community events** across the platform
- **Search and filter events** by location or category
- **See countdown timers** showing when events occur
- **Identify past events** with visual indicators

The app connects to a PostgreSQL database to serve real event data through a REST API, and features a responsive React frontend.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios (HTTP client)
- Vite (build tool)
- CSS3 (no framework)

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- pg (database driver)

**Database:**
- PostgreSQL (Render or Railway)
- 2 tables: locations, events

## ✅ Required Features Checklist

- [x] **The web app uses React to display data from an API**
  - All pages built with React components
  - Data fetched via `/api/locations` and `/api/events` endpoints

- [x] **The web app is connected to a PostgreSQL database**
  - Database configured in `server/config/community-db.js`
  - Tables created with schema in `server/config/community-seed.js`

- [x] **Front page of web app is functional and appropriately styled**
  - Home page (`/src/pages/Home.jsx`) displays all locations
  - Grid layout with image cards and event counts
  - Responsive design for mobile and desktop

- [x] **Each list item has a corresponding page**
  - Location detail pages at `/location/:slug`
  - Each page shows location info and associated events

- [x] **Location pages display events from the database**
  - Events fetched via API and filtered by location
  - EventCard component displays event details

## 🎨 Stretch Features Checklist

- [x] **An additional page shows all possible events**
  - `/events` page displays all events across all locations
  - Implements search/filter and sort functionality

- [x] **Users can sort or filter events by location**
  - `AllEvents` page includes location filter dropdown
  - Includes sort by: date, location, or category

- [x] **Countdown timer showing time to event**
  - `EventCard` component calculates and displays countdown
  - Updates every minute
  - Shows "Event has passed" for past events
  - Different styling for past events (opacity, visual indicators)

## 📁 Project Structure

```
server/
├── config/
│   ├── community-db.js          # Database connection
│   └── community-seed.js        # Database schema & seed data
├── controllers/
│   ├── locationsController.js   # Location queries
│   └── eventsController.js      # Event queries
├── routes/
│   ├── locations.js             # Location API routes
│   └── events.js                # Event API routes
└── server.js                    # Express server setup

client/src/
├── pages/
│   ├── Home.jsx                 # Location listing
│   ├── LocationDetail.jsx       # Location detail & events
│   └── AllEvents.jsx            # All events page (stretch)
├── components/
│   ├── LocationCard.jsx         # Location card component
│   └── EventCard.jsx            # Event card with countdown
├── services/
│   └── api.js                   # API call functions
├── App.jsx                      # Main app component
├── main.jsx                     # React entry point
└── index.css                    # Global styling

index.html                       # Vite HTML template
vite.config.js                  # Vite configuration
package.json                    # Dependencies & scripts
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# PostgreSQL Connection (from Render)
DATABASE_URL=postgresql://user:password@hostname.render.com:5432/database

# Server PORT
PORT=3000
```

For Render PostgreSQL:
1. Create a free PostgreSQL database on [Render](https://render.com)
2. Copy connection details from "Connections" section
3. Paste into your `.env` file

### 3. Seed the Database

```bash
npm run seed
```

This creates the `locations` and `events` tables and populates them with sample data.

### 4. Run Development Servers

**Terminal 1 - Backend (Express server on port 3000):**
```bash
npm run dev-server
```

**Terminal 2 - Frontend (Vite dev server on port 5173):**
```bash
npm run dev-client
```

Or run both simultaneously:
```bash
npm run dev
```

### 5. Open in Browser

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api

## 📡 API Endpoints

All endpoints return JSON data.

### Locations

- `GET /api/locations` - Get all locations
- `GET /api/locations/:slug` - Get location by slug
- `GET /api/locations/id/:id` - Get location by ID

**Response:**
```json
{
  "id": 1,
  "name": "Central Park",
  "slug": "central-park",
  "description": "...",
  "image_url": "https://...",
  "latitude": 40.7829,
  "longitude": -73.9654
}
```

### Events

- `GET /api/events` - Get all events
- `GET /api/events/location-slug/:slug` - Get events by location slug
- `GET /api/events/location/:locationId` - Get events by location ID
- `GET /api/events/:id` - Get single event by ID

**Response:**
```json
{
  "id": 1,
  "title": "Summer Concert Series",
  "description": "...",
  "location_id": 1,
  "location_name": "Central Park",
  "location_slug": "central-park",
  "event_date": "2026-06-15T19:00:00",
  "event_time": "7:00 PM",
  "image_url": "https://...",
  "capacity": 500,
  "organizer": "Parks & Rec",
  "category": "Music"
}
```

## 🗄️ Database Schema

### Locations Table

```sql
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Events Table

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  event_date TIMESTAMP NOT NULL,
  event_time VARCHAR(20),
  image_url VARCHAR(255),
  capacity INTEGER,
  organizer VARCHAR(255),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 💡 Features Explained

### Location Cards
- Display location image, name, and description
- Show count of events at that location
- Click to navigate to location detail page
- Responsive grid layout

### Event Countdown Timer
- Calculates time remaining until event
- Updates every minute
- Shows formats like "3d 5h away" or "45m away"
- Past events show "Event has passed" with reduced opacity

### Event Filtering & Sorting
- Filter events by specific location
- Sort by: Date, Location name, or Category
- Real-time filtering without page reload

### Responsive Design
- Mobile-first CSS approach
- Breakpoints for tablet (768px) and mobile (480px)
- Touch-friendly button sizes
- Flexible grid layouts

## 🔧 Available Scripts

```bash
npm run dev-server    # Start Express backend (port 3000)
npm run dev-client    # Start Vite frontend (port 5173)
npm run dev           # Run both simultaneously (requires concurrently)
npm run build         # Build for production
npm run seed          # Seed database with sample data
npm start             # Start production server
```

## 📸 sample Data

The database seeds with:
- **5 Locations:** Central Park, Brooklyn Bridge Park, Williamsburg Community Center, Astoria Park, The High Line
- **10 Events:** Music events, workshops, support groups, festivals, climate action, and more

Event categories: Music, Health & Wellness, Art & Culture, Community Support, Education, Food & Culture, Activism, Social, Community Event

## 🚢 Deployment

### Frontend (Vite build)
```bash
npm run build
# Outputs to dist/
```

### Backend (Express)
Deploy `server/` folder with environment variables set on your hosting platform.

### Database
Use Render or Railway for PostgreSQL hosting.

## 🐛 Troubleshooting

**Events not showing?**
- Verify DATABASE_URL in `.env`
- Run `npm run seed` to populate tables
- Check browser console for API errors

**Port already in use?**
- Change PORT in `.env`
- Or kill process: `lsof -i :3000` then `kill -9 <PID>`

**Vite proxy not working?**
- Ensure backend is running on port 3000
- Check `vite.config.js` proxy settings

## 📝 Notes

- Images sourced from Unsplash (free to use)
- Countdown timers auto-update every minute
- Past events remain visible with visual distinction
- Database uses CASCADING deletes (remove location = remove its events)
- All user-facing text uses semantic HTML for accessibility

## 📅 Submission Checklist

Before submitting:
- [ ] All required features implemented and checked above
- [ ] Stretch features completed (countdown, all events page, filter/sort)
- [ ] README includes GIF walkthrough
- [ ] README includes database connection proof (screenshot)
- [ ] Code committed to git with meaningful commit messages
- [ ] App tested on mobile and desktop
- [ ] No console errors or warnings
- [ ] Performance acceptable (load times < 3s)

## 🎉 Complete!

Project 3 is ready for submission. All required and stretch features are implemented.
