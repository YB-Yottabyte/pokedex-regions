require('dotenv').config();
const pool = require('./community-db');

async function seedDatabase() {
  const client = await pool.connect();
  try {
    // Create locations table (will store Pokemon regions)
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

    // Seed POKEMON REGIONS as locations
    const locations = [
      {
        name: 'Kanto Region',
        slug: 'kanto',
        description: 'The original Pokémon region where trainers begin their journey. Perfect for Pokémon trainer meetups and grass-type competitions.',
        image_url: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500',
        latitude: 40.7829,
        longitude: -73.9654
      },
      {
        name: 'Johto Region',
        slug: 'johto',
        description: 'A region steeped in tradition with ancient shrines. Host to the legendary Ho-Oh and home to classic Pokémon battles.',
        image_url: 'https://images.unsplash.com/photo-1485579149c01123123?w=500',
        latitude: 40.7061,
        longitude: -73.9969
      },
      {
        name: 'Hoenn Region',
        slug: 'hoenn',
        description: 'A tropical region with vast oceans. Famous for double battles and the clash between Kyogre and Groudon.',
        image_url: 'https://images.unsplash.com/photo-1478359866661-c4f86dbee5b4?w=500',
        latitude: 40.7081,
        longitude: -73.9576
      },
      {
        name: 'Sinnoh Region',
        slug: 'sinnoh',
        description: 'A snowy northern region dominated by Mt. Coronet. Home to the legendary trio: Dialga, Palkia, and Giratina.',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        latitude: 40.7614,
        longitude: -73.9776
      },
      {
        name: 'Unova Region',
        slug: 'unova',
        description: 'A bustling region inspired by New York City. Features the largest city in Pokémon and innovative trainer challenges.',
        image_url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=500',
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

    // Seed POKEMON-THEMED EVENTS
    const events = [
      {
        title: 'Regional Pokémon League Tournament',
        description: 'Annual tournament where trainers battle for badges. Only the strongest trainers can compete!',
        location_slug: 'kanto',
        event_date: '2026-04-15 18:00:00',
        event_time: '6:00 PM',
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        capacity: 256,
        organizer: 'Pokémon League',
        category: 'Battle Tournament'
      },
      {
        title: 'Starter Pokémon Selection Day',
        description: 'New trainers choose their starter Pokémon! Bulbasaur, Charmander, or Squirtle awaits.',
        location_slug: 'kanto',
        event_date: '2026-03-22 10:00:00',
        event_time: '10:00 AM',
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500',
        capacity: 100,
        organizer: 'Professor Oak',
        category: 'Training'
      },
      {
        title: 'Pokémon Type Mastery Workshop - Water Types',
        description: 'Learn strategies for Water-type Pokémon. Featuring Lapras, Blastoise, and Gyarados expertise.',
        location_slug: 'johto',
        event_date: '2026-04-10 15:00:00',
        event_time: '3:00 PM',
        image_url: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500',
        capacity: 50,
        organizer: 'Water Pokémon Expert',
        category: 'Workshop'
      },
      {
        title: 'Double Battle Championship',
        description: 'Showcase your best 2v2 Pokémon battles! Team synergy wins this event.',
        location_slug: 'hoenn',
        event_date: '2026-03-20 19:00:00',
        event_time: '7:00 PM',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        capacity: 64,
        organizer: 'Hoenn Battle Federation',
        category: 'Battle Tournament'
      },
      {
        title: 'Pokédex Completion Challenge',
        description: 'Bring your Pokémon and get them officially registered! Prizes for completion milestones.',
        location_slug: 'sinnoh',
        event_date: '2026-03-25 11:00:00',
        event_time: '11:00 AM',
        image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
        capacity: 200,
        organizer: 'Pokédex Commission',
        category: 'Registration'
      },
      {
        title: 'Legendary Pokémon Documentary Screening',
        description: 'Watch exclusive footage of legendary Pokémon sightings. Q&A with trainers afterward.',
        location_slug: 'unova',
        event_date: '2026-05-20 18:00:00',
        event_time: '6:00 PM',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=500',
        capacity: 150,
        organizer: 'Pokémon Historical Society',
        category: 'Documentary'
      },
      {
        title: 'Gym Leader Exhibition Matches',
        description: 'Watch elite Gym Leaders battle! See how champions battle with their signature Pokémon.',
        location_slug: 'kanto',
        event_date: '2026-04-22 16:00:00',
        event_time: '4:00 PM',
        image_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=500',
        capacity: 300,
        organizer: 'Pokémon League',
        category: 'Exhibition'
      },
      {
        title: 'Shiny Pokémon Hunt Expedition',
        description: 'Join trainers on a quest to find rare Shiny Pokémon! Expert hunters will guide you.',
        location_slug: 'hoenn',
        event_date: '2026-03-30 07:00:00',
        event_time: '7:00 AM',
        image_url: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=500',
        capacity: 30,
        organizer: 'Shiny Hunters Guild',
        category: 'Adventure'
      },
      {
        title: 'Pokémon Evolution Festival',
        description: 'Celebrate evolution! Trade Pokémon, witness evolutions, and marvel at beautiful transformations.',
        location_slug: 'johto',
        event_date: '2026-03-23 12:00:00',
        event_time: '12:00 PM',
        image_url: 'https://images.unsplash.com/photo-1633722715463-d30628519adf?w=500',
        capacity: 500,
        organizer: 'Evolution Research Center',
        category: 'Festival'
      },
      {
        title: 'Elite Four Trial Challenge',
        description: 'Test your skills against simulated Elite Four trainers! Only 4 victories wins you the prize.',
        location_slug: 'sinnoh',
        event_date: '2026-06-10 14:00:00',
        event_time: '2:00 PM',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=500',
        capacity: 128,
        organizer: 'Sinnoh League',
        category: 'Challenge'
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

    console.log('✅ Database seeded successfully with Pokémon regions and events!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
