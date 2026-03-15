require('dotenv').config();
const pool = require('./community-db');

async function seedDatabase() {
  const client = await pool.connect();
  try {
    // Create locations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
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
    `);

    // Clear existing data
    await client.query('TRUNCATE TABLE events CASCADE');
    await client.query('TRUNCATE TABLE locations CASCADE');

    // Seed locations
    const locations = [
      {
        name: 'Central Park',
        slug: 'central-park',
        description: 'A large public urban park in the middle of Manhattan. Perfect for outdoor activities, concerts, and community gatherings.',
        image_url: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500',
        latitude: 40.7829,
        longitude: -73.9654
      },
      {
        name: 'The Brooklyn Bridge Park',
        slug: 'brooklyn-bridge-park',
        description: 'A scenic waterfront park offering stunning views of Manhattan skyline. Popular for art installations and community events.',
        image_url: 'https://images.unsplash.com/photo-1478359866661-c4f86dbee5b4?w=500',
        latitude: 40.7061,
        longitude: -73.9969
      },
      {
        name: 'Williamsburg Community Center',
        slug: 'williamsburg-community-center',
        description: 'A multi-purpose community space hosting workshops, support groups, and cultural events for all ages.',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        latitude: 40.7081,
        longitude: -73.9576
      },
      {
        name: 'Astoria Park',
        slug: 'astoria-park',
        description: 'Queens largest park featuring athletic facilities, nature trails, and regular community programming.',
        image_url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=500',
        latitude: 40.7614,
        longitude: -73.9776
      },
      {
        name: 'The High Line',
        slug: 'the-high-line',
        description: 'An innovative public space built on a historic freight rail line. Known for art, culture, and urban renewal.',
        image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500',
        latitude: 40.7480,
        longitude: -74.0048
      }
    ];

    const locationIds = {};
    for (const loc of locations) {
      const result = await client.query(
        `INSERT INTO locations (name, slug, description, image_url, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [loc.name, loc.slug, loc.description, loc.image_url, loc.latitude, loc.longitude]
      );
      locationIds[loc.slug] = result.rows[0].id;
    }

    // Seed events
    const events = [
      {
        title: 'Summer Concert Series',
        description: 'Free live music performances featuring local and national artists. Bring blankets and picnic supplies!',
        location_slug: 'central-park',
        event_date: '2026-06-15 19:00:00',
        event_time: '7:00 PM',
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        capacity: 500,
        organizer: 'Parks & Rec',
        category: 'Music'
      },
      {
        title: 'Community Yoga Session',
        description: 'Outdoor yoga session for all levels. Free mats provided. Arrive 15 minutes early.',
        location_slug: 'central-park',
        event_date: '2026-03-22 08:00:00',
        event_time: '8:00 AM',
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500',
        capacity: 100,
        organizer: 'Wellness NYC',
        category: 'Health & Wellness'
      },
      {
        title: 'Brooklyn Film Festival',
        description: 'Indie and international short films screened with Q&A from filmmakers.',
        location_slug: 'brooklyn-bridge-park',
        event_date: '2026-04-10 18:00:00',
        event_time: '6:00 PM',
        image_url: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500',
        capacity: 200,
        organizer: 'Brooklyn Arts Collective',
        category: 'Art & Culture'
      },
      {
        title: 'LGBTQ+ Support Group',
        description: 'Safe space for LGBTQ+ individuals and allies. Coffee provided. No experience necessary.',
        location_slug: 'williamsburg-community-center',
        event_date: '2026-03-20 19:00:00',
        event_time: '7:00 PM',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        capacity: 50,
        organizer: 'Pride NYC',
        category: 'Community Support'
      },
      {
        title: 'Tech Workshop: React Basics',
        description: 'Learn React fundamentals. Bring your laptop. Basic JS knowledge required.',
        location_slug: 'williamsburg-community-center',
        event_date: '2026-03-25 18:30:00',
        event_time: '6:30 PM',
        image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
        capacity: 30,
        organizer: 'Code Academy NYC',
        category: 'Education'
      },
      {
        title: 'Queens Food Festival',
        description: 'Celebrate diverse cuisines from around the world. Food vendors, live music, family activities.',
        location_slug: 'astoria-park',
        event_date: '2026-05-20 11:00:00',
        event_time: '11:00 AM',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=500',
        capacity: 1000,
        organizer: 'Queens Tourism Board',
        category: 'Food & Culture'
      },
      {
        title: 'Climate Action March',
        description: 'Join us in advocating for climate action. Signs provided. March starts at 12 PM.',
        location_slug: 'astoria-park',
        event_date: '2026-04-22 12:00:00',
        event_time: '12:00 PM',
        image_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=500',
        capacity: 500,
        organizer: 'Climate Coalition',
        category: 'Activism'
      },
      {
        title: 'Art Installation Opening',
        description: 'New exhibit featuring local artists. Opening reception with light refreshments and artist talks.',
        location_slug: 'the-high-line',
        event_date: '2026-03-30 17:00:00',
        event_time: '5:00 PM',
        image_url: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=500',
        capacity: 150,
        organizer: 'High Line Arts',
        category: 'Art & Culture'
      },
      {
        title: 'Dog Park Meetup',
        description: 'Bring your pup to socialize. All sizes and temperaments welcome. Water stations available.',
        location_slug: 'central-park',
        event_date: '2026-03-23 14:00:00',
        event_time: '2:00 PM',
        image_url: 'https://images.unsplash.com/photo-1633722715463-d30628519adf?w=500',
        capacity: 200,
        organizer: 'Dog Lovers NYC',
        category: 'Social'
      },
      {
        title: 'Night Market & Street Fair',
        description: 'Local vendors, street food, live performances, and shopping. Come celebrate our community!',
        location_slug: 'brooklyn-bridge-park',
        event_date: '2026-06-10 18:00:00',
        event_time: '6:00 PM',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=500',
        capacity: 800,
        organizer: 'Brooklyn Community Board',
        category: 'Community Event'
      }
    ];

    for (const event of events) {
      await client.query(
        `INSERT INTO events (title, description, location_id, event_date, event_time, image_url, capacity, organizer, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          event.title,
          event.description,
          locationIds[event.location_slug],
          event.event_date,
          event.event_time,
          event.image_url,
          event.capacity,
          event.organizer,
          event.category
        ]
      );
    }

    console.log('✅ Database seeded successfully with locations and events!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
