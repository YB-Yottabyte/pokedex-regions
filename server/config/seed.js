require('dotenv').config();
const pool = require('./db');

const regions = [
  {
    name: 'Kanto',
    slug: 'kanto',
    generation: 1,
    games: ['Pokémon Red & Blue', 'Pokémon Yellow', 'FireRed & LeafGreen', "Let's Go Pikachu & Eevee"],
    description: "The original Pokémon region, based on Japan's Kantō region. Kanto is where every trainer's journey began in 1996. From the humble Pallet Town to the bustling Celadon City, Kanto offers diverse terrain including forests, caves, and oceans. It's home to the first 151 Pokémon and iconic locations like the S.S. Anne, Pokémon Tower, and Silph Co.",
    starters: [
      { name: 'Bulbasaur', type: 'Grass/Poison', id: 1 },
      { name: 'Charmander', type: 'Fire', id: 4 },
      { name: 'Squirtle', type: 'Water', id: 7 },
    ],
    legendary: { name: 'Mewtwo', id: 150 },
    gym_count: 8,
    trial_count: 0,
    color: '#C62828',
    introduced: '1996',
    notable_locations: ['Pallet Town', 'Mt. Moon', 'Lavender Town', 'Cinnabar Island', 'Victory Road'],
    pokemon_count: '151',
    professor: 'Professor Oak',
    villain: 'Team Rocket',
  },
  {
    name: 'Johto',
    slug: 'johto',
    generation: 2,
    games: ['Pokémon Gold & Silver', 'Pokémon Crystal', 'HeartGold & SoulSilver'],
    description: 'Located west of Kanto, Johto is steeped in tradition and mystery. With ancient ruins, sacred shrines, and the iconic Bell Tower, Johto balances history with adventure. It introduced 100 new Pokémon and the concepts of held items, Pokémon breeding, and day/night cycles. Completing its Pokédex even grants access to Kanto.',
    starters: [
      { name: 'Chikorita', type: 'Grass', id: 152 },
      { name: 'Cyndaquil', type: 'Fire', id: 155 },
      { name: 'Totodile', type: 'Water', id: 158 },
    ],
    legendary: { name: 'Ho-Oh', id: 250 },
    gym_count: 8,
    trial_count: 0,
    color: '#F9A825',
    introduced: '1999',
    notable_locations: ['New Bark Town', 'Ecruteak City', 'Bell Tower', 'Mt. Silver', 'Whirl Islands'],
    pokemon_count: '100',
    professor: 'Professor Elm',
    villain: 'Team Rocket',
  },
  {
    name: 'Hoenn',
    slug: 'hoenn',
    generation: 3,
    games: ['Pokémon Ruby & Sapphire', 'Pokémon Emerald', 'Omega Ruby & Alpha Sapphire'],
    description: "A tropical region with a vast ocean covering most of its surface, Hoenn is inspired by Japan's Kyushu island. It introduced double battles, abilities, and natures. The legendary clash between Kyogre and Groudon over the balance of sea and land defines Hoenn's grand narrative, with Rayquaza standing as the sky's guardian.",
    starters: [
      { name: 'Treecko', type: 'Grass', id: 252 },
      { name: 'Torchic', type: 'Fire', id: 255 },
      { name: 'Mudkip', type: 'Water', id: 258 },
    ],
    legendary: { name: 'Rayquaza', id: 384 },
    gym_count: 8,
    trial_count: 0,
    color: '#00695C',
    introduced: '2002',
    notable_locations: ['Littleroot Town', 'Sky Pillar', 'Sootopolis City', 'Safari Zone', 'Mirage Tower'],
    pokemon_count: '135',
    professor: 'Professor Birch',
    villain: 'Team Aqua / Team Magma',
  },
  {
    name: 'Sinnoh',
    slug: 'sinnoh',
    generation: 4,
    games: ['Pokémon Diamond & Pearl', 'Pokémon Platinum', 'Brilliant Diamond & Shining Pearl', 'Legends: Arceus'],
    description: 'A snowy northern region based on Hokkaido, Sinnoh is bisected by Mt. Coronet. Its mythology revolves around the creation of the entire universe by the god Pokémon Arceus, and the legendary trio of Dialga, Palkia, and Giratina who govern time, space, and antimatter. It introduced the Physical/Special split.',
    starters: [
      { name: 'Turtwig', type: 'Grass', id: 387 },
      { name: 'Chimchar', type: 'Fire', id: 390 },
      { name: 'Piplup', type: 'Water', id: 393 },
    ],
    legendary: { name: 'Arceus', id: 493 },
    gym_count: 8,
    trial_count: 0,
    color: '#1565C0',
    introduced: '2006',
    notable_locations: ['Twinleaf Town', 'Mt. Coronet', 'Spear Pillar', 'Distortion World', 'Lake Trio'],
    pokemon_count: '107',
    professor: 'Professor Rowan',
    villain: 'Team Galactic',
  },
  {
    name: 'Unova',
    slug: 'unova',
    generation: 5,
    games: ['Pokémon Black & White', 'Pokémon Black 2 & White 2'],
    description: 'Inspired by New York City, Unova is a large, bustling region far from the others. It launched with an entirely new Pokédex and explored deep themes of truth vs. ideals through Reshiram and Zekrom. Praised for its storytelling and diverse cast, Unova features the largest city in any Pokémon game: Castelia City.',
    starters: [
      { name: 'Snivy', type: 'Grass', id: 495 },
      { name: 'Tepig', type: 'Fire', id: 498 },
      { name: 'Oshawott', type: 'Water', id: 501 },
    ],
    legendary: { name: 'Reshiram', id: 643 },
    gym_count: 8,
    trial_count: 0,
    color: '#37474F',
    introduced: '2010',
    notable_locations: ['Nuvema Town', 'Castelia City', 'Nimbasa City', 'Giant Chasm', "N's Castle"],
    pokemon_count: '156',
    professor: 'Professor Juniper',
    villain: 'Team Plasma',
  },
  {
    name: 'Kalos',
    slug: 'kalos',
    generation: 6,
    games: ['Pokémon X & Y'],
    description: 'Inspired by France, Kalos is a star-shaped region renowned for its beauty, fashion, and cuisine. It introduced Mega Evolution and the first fully 3D mainline Pokémon games. Xerneas and Yveltal represent the cycle of life and destruction, while the legendary AZ and his ultimate weapon form the emotional core of the story.',
    starters: [
      { name: 'Chespin', type: 'Grass', id: 650 },
      { name: 'Fennekin', type: 'Fire', id: 653 },
      { name: 'Froakie', type: 'Water', id: 656 },
    ],
    legendary: { name: 'Xerneas', id: 716 },
    gym_count: 8,
    trial_count: 0,
    color: '#6A1B9A',
    introduced: '2013',
    notable_locations: ['Vaniville Town', 'Lumiose City', 'Glittering Cave', 'Pokémon Village', "Team Flare's Lab"],
    pokemon_count: '72',
    professor: 'Professor Sycamore',
    villain: 'Team Flare',
  },
  {
    name: 'Alola',
    slug: 'alola',
    generation: 7,
    games: ['Pokémon Sun & Moon', 'Pokémon Ultra Sun & Ultra Moon'],
    description: 'Based on Hawaii, Alola is a tropical archipelago of four main islands. Instead of traditional gyms, trainers complete Island Trials and Totem Pokémon battles. It introduced Z-Moves, Alolan Regional Forms of classic Pokémon, and the Ultra Wormholes. Guardian deities called Tapus protect each of the four islands.',
    starters: [
      { name: 'Rowlet', type: 'Grass/Flying', id: 722 },
      { name: 'Litten', type: 'Fire', id: 725 },
      { name: 'Popplio', type: 'Water', id: 728 },
    ],
    legendary: { name: 'Solgaleo', id: 791 },
    gym_count: 0,
    trial_count: 7,
    color: '#E65100',
    introduced: '2016',
    notable_locations: ['Melemele Island', 'Akala Island', "Ula'ula Island", 'Poni Island', 'Aether Paradise'],
    pokemon_count: '88',
    professor: 'Professor Kukui',
    villain: 'Team Skull / Aether Foundation',
  },
  {
    name: 'Galar',
    slug: 'galar',
    generation: 8,
    games: ['Pokémon Sword & Shield'],
    description: 'Inspired by Great Britain, Galar is a long vertical region where Pokémon battles are the national sport. The Dynamax phenomenon allows Pokémon to grow to enormous size in special locations. The Wild Area provides open-world exploration, and the DLC expansions add the Isle of Armor and Crown Tundra.',
    starters: [
      { name: 'Grookey', type: 'Grass', id: 810 },
      { name: 'Scorbunny', type: 'Fire', id: 813 },
      { name: 'Sobble', type: 'Water', id: 816 },
    ],
    legendary: { name: 'Zacian', id: 888 },
    gym_count: 8,
    trial_count: 0,
    color: '#558B2F',
    introduced: '2019',
    notable_locations: ['Postwick', 'Motostoke', 'Hammerlocke', 'Crown Tundra', 'Isle of Armor'],
    pokemon_count: '96',
    professor: 'Professor Magnolia',
    villain: 'Team Yell / Macro Cosmos',
  },
  {
    name: 'Paldea',
    slug: 'paldea',
    generation: 9,
    games: ['Pokémon Scarlet & Violet'],
    description: 'Inspired by the Iberian Peninsula (Spain and Portugal), Paldea is the first fully open-world Pokémon region. Players can explore in any order across three storylines: the Gym Challenge, Starfall Street (Team Star), and Path of Legends (Titan Pokémon). Area Zero at its center hides a world-changing secret.',
    starters: [
      { name: 'Sprigatito', type: 'Grass', id: 906 },
      { name: 'Fuecoco', type: 'Fire', id: 909 },
      { name: 'Quaxly', type: 'Water', id: 912 },
    ],
    legendary: { name: 'Koraidon', id: 1007 },
    gym_count: 8,
    trial_count: 0,
    color: '#B71C1C',
    introduced: '2022',
    notable_locations: ['Cabo Poco', 'Mesagoza', 'Area Zero', 'Medali', 'Glaseado Mountain'],
    pokemon_count: '103',
    professor: 'Professor Sada / Professor Turo',
    villain: 'Team Star',
  },
  {
    name: 'Winds & Waves',
    slug: 'winds-and-waves',
    generation: 10,
    games: ['Pokémon Winds', 'Pokémon Waves'],
    description: 'The newest announced Pokémon region, set in a world shaped by powerful ocean currents and sweeping coastal winds. Details are still being revealed, but the region promises lush clifftop grasslands, deep-sea caverns, and storm-swept harbors. Three starter Pokémon have been officially revealed ahead of launch.',
    starters: [
      { name: 'Browt',  type: 'Grass', id: null, image: '/assets/Browt.png' },
      { name: 'Pombon', type: 'Fire',  id: null, image: '/assets/Pombon.png' },
      { name: 'Gecqua', type: 'Water', id: null, image: '/assets/Gecqua.png' },
    ],
    legendary: { name: '???', id: null },
    gym_count: 0,
    trial_count: 0,
    color: '#0277BD',
    introduced: 'TBA',
    notable_locations: ['TBA'],
    pokemon_count: 'TBA',
    professor: 'TBA',
    villain: 'TBA',
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS regions (
        id               SERIAL PRIMARY KEY,
        name             VARCHAR(100) NOT NULL,
        slug             VARCHAR(100) NOT NULL UNIQUE,
        generation       INTEGER NOT NULL,
        games            TEXT[] NOT NULL,
        description      TEXT NOT NULL,
        starters         JSONB NOT NULL,
        legendary        JSONB,
        gym_count        INTEGER DEFAULT 0,
        trial_count      INTEGER DEFAULT 0,
        color            VARCHAR(7),
        introduced       VARCHAR(10),
        notable_locations TEXT[],
        pokemon_count    VARCHAR(20),
        professor        VARCHAR(200),
        villain          VARCHAR(200)
      )
    `);

    // Clear existing data before re-seeding
    await client.query('TRUNCATE TABLE regions RESTART IDENTITY');

    for (const r of regions) {
      await client.query(
        `INSERT INTO regions
          (name, slug, generation, games, description, starters, legendary,
           gym_count, trial_count, color, introduced, notable_locations,
           pokemon_count, professor, villain)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        [
          r.name, r.slug, r.generation, r.games, r.description,
          JSON.stringify(r.starters), JSON.stringify(r.legendary),
          r.gym_count, r.trial_count, r.color, r.introduced,
          r.notable_locations, r.pokemon_count, r.professor, r.villain,
        ]
      );
    }

    console.log(`Seeded ${regions.length} regions successfully.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
