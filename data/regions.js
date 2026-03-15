const regions = [
  {
    name: "Kanto",
    slug: "kanto",
    generation: 1,
    games: ["Pokémon Red & Blue", "Pokémon Yellow", "FireRed & LeafGreen", "Let's Go Pikachu & Eevee"],
    description: "The original Pokémon region, based on Japan's Kantō region. Kanto is where every trainer's journey began in 1996. From the humble Pallet Town to the bustling Celadon City, Kanto offers diverse terrain including forests, caves, and oceans. It's home to the first 151 Pokémon and iconic locations like the S.S. Anne, Pokémon Tower, and Silph Co.",
    starters: [
      { name: "Bulbasaur", type: "Grass/Poison", id: 1, image: "/assets/kanto/grass.png" },
      { name: "Charmander", type: "Fire", id: 4 },
      { name: "Squirtle", type: "Water", id: 7 }
    ],
    legendary: { name: "Mewtwo", id: 150 },
    gymCount: 8,
    trialCount: 0,
    color: "#C62828",
    introduced: 1996,
    notableLocations: ["Pallet Town", "Mt. Moon", "Lavender Town", "Cinnabar Island", "Victory Road"],
    pokemonCount: 151,
    professor: "Professor Oak",
    villain: "Team Rocket"
  },
  {
    name: "Johto",
    slug: "johto",
    generation: 2,
    games: ["Pokémon Gold & Silver", "Pokémon Crystal", "HeartGold & SoulSilver"],
    description: "Located west of Kanto, Johto is steeped in tradition and mystery. With ancient ruins, sacred shrines, and the iconic Bell Tower, Johto balances history with adventure. It introduced 100 new Pokémon and the concepts of held items, Pokémon breeding, and day/night cycles. Completing its Pokédex even grants access to Kanto.",
    starters: [
      { name: "Chikorita", type: "Grass", id: 152 },
      { name: "Cyndaquil", type: "Fire", id: 155 },
      { name: "Totodile", type: "Water", id: 158 }
    ],
    legendary: { name: "Ho-Oh", id: 250 },
    gymCount: 8,
    trialCount: 0,
    color: "#F9A825",
    introduced: 1999,
    notableLocations: ["New Bark Town", "Ecruteak City", "Bell Tower", "Mt. Silver", "Whirl Islands"],
    pokemonCount: 100,
    professor: "Professor Elm",
    villain: "Team Rocket"
  },
  {
    name: "Hoenn",
    slug: "hoenn",
    generation: 3,
    games: ["Pokémon Ruby & Sapphire", "Pokémon Emerald", "Omega Ruby & Alpha Sapphire"],
    description: "A tropical region with a vast ocean covering most of its surface, Hoenn is inspired by Japan's Kyushu island. It introduced double battles, abilities, and natures. The legendary clash between Kyogre and Groudon over the balance of sea and land defines Hoenn's grand narrative, with Rayquaza standing as the sky's guardian.",
    starters: [
      { name: "Treecko", type: "Grass", id: 252 },
      { name: "Torchic", type: "Fire", id: 255 },
      { name: "Mudkip", type: "Water", id: 258 }
    ],
    legendary: { name: "Rayquaza", id: 384 },
    gymCount: 8,
    trialCount: 0,
    color: "#00695C",
    introduced: 2002,
    notableLocations: ["Littleroot Town", "Sky Pillar", "Sootopolis City", "Safari Zone", "Mirage Tower"],
    pokemonCount: 135,
    professor: "Professor Birch",
    villain: "Team Aqua / Team Magma"
  },
  {
    name: "Sinnoh",
    slug: "sinnoh",
    generation: 4,
    games: ["Pokémon Diamond & Pearl", "Pokémon Platinum", "Brilliant Diamond & Shining Pearl", "Legends: Arceus"],
    description: "A snowy northern region based on Hokkaido, Sinnoh is bisected by Mt. Coronet. Its mythology revolves around the creation of the entire universe by the god Pokémon Arceus, and the legendary trio of Dialga, Palkia, and Giratina who govern time, space, and antimatter. It introduced the Physical/Special split.",
    starters: [
      { name: "Turtwig", type: "Grass", id: 387 },
      { name: "Chimchar", type: "Fire", id: 390 },
      { name: "Piplup", type: "Water", id: 393 }
    ],
    legendary: { name: "Arceus", id: 493 },
    gymCount: 8,
    trialCount: 0,
    color: "#1565C0",
    introduced: 2006,
    notableLocations: ["Twinleaf Town", "Mt. Coronet", "Spear Pillar", "Distortion World", "Lake Trio"],
    pokemonCount: 107,
    professor: "Professor Rowan",
    villain: "Team Galactic"
  },
  {
    name: "Unova",
    slug: "unova",
    generation: 5,
    games: ["Pokémon Black & White", "Pokémon Black 2 & White 2"],
    description: "Inspired by New York City, Unova is a large, bustling region far from the others. It launched with an entirely new Pokédex and explored deep themes of truth vs. ideals through Reshiram and Zekrom. Praised for its storytelling and diverse cast, Unova features the largest city in any Pokémon game: Castelia City.",
    starters: [
      { name: "Snivy", type: "Grass", id: 495 },
      { name: "Tepig", type: "Fire", id: 498 },
      { name: "Oshawott", type: "Water", id: 501 }
    ],
    legendary: { name: "Reshiram", id: 643 },
    gymCount: 8,
    trialCount: 0,
    color: "#37474F",
    introduced: 2010,
    notableLocations: ["Nuvema Town", "Castelia City", "Nimbasa City", "Giant Chasm", "N's Castle"],
    pokemonCount: 156,
    professor: "Professor Juniper",
    villain: "Team Plasma"
  },
  {
    name: "Kalos",
    slug: "kalos",
    generation: 6,
    games: ["Pokémon X & Y"],
    description: "Inspired by France, Kalos is a star-shaped region renowned for its beauty, fashion, and cuisine. It introduced Mega Evolution and the first fully 3D mainline Pokémon games. Xerneas and Yveltal represent the cycle of life and destruction, while the legendary AZ and his ultimate weapon form the emotional core of the story.",
    starters: [
      { name: "Chespin", type: "Grass", id: 650 },
      { name: "Fennekin", type: "Fire", id: 653 },
      { name: "Froakie", type: "Water", id: 656 }
    ],
    legendary: { name: "Xerneas", id: 716 },
    gymCount: 8,
    trialCount: 0,
    color: "#6A1B9A",
    introduced: 2013,
    notableLocations: ["Vaniville Town", "Lumiose City", "Glittering Cave", "Pokémon Village", "Team Flare's Lab"],
    pokemonCount: 72,
    professor: "Professor Sycamore",
    villain: "Team Flare"
  },
  {
    name: "Alola",
    slug: "alola",
    generation: 7,
    games: ["Pokémon Sun & Moon", "Pokémon Ultra Sun & Ultra Moon"],
    description: "Based on Hawaii, Alola is a tropical archipelago of four main islands. Instead of traditional gyms, trainers complete Island Trials and Totem Pokémon battles. It introduced Z-Moves, Alolan Regional Forms of classic Pokémon, and the Ultra Wormholes. Guardian deities called Tapus protect each of the four islands.",
    starters: [
      { name: "Rowlet", type: "Grass/Flying", id: 722 },
      { name: "Litten", type: "Fire", id: 725 },
      { name: "Popplio", type: "Water", id: 728 }
    ],
    legendary: { name: "Solgaleo", id: 791 },
    gymCount: 0,
    trialCount: 7,
    color: "#E65100",
    introduced: 2016,
    notableLocations: ["Melemele Island", "Akala Island", "Ula'ula Island", "Poni Island", "Aether Paradise"],
    pokemonCount: 88,
    professor: "Professor Kukui",
    villain: "Team Skull / Aether Foundation"
  },
  {
    name: "Galar",
    slug: "galar",
    generation: 8,
    games: ["Pokémon Sword & Shield"],
    description: "Inspired by Great Britain, Galar is a long vertical region where Pokémon battles are the national sport. The Dynamax phenomenon allows Pokémon to grow to enormous size in special locations. The Wild Area provides open-world exploration, and the DLC expansions add the Isle of Armor and Crown Tundra.",
    starters: [
      { name: "Grookey", type: "Grass", id: 810 },
      { name: "Scorbunny", type: "Fire", id: 813 },
      { name: "Sobble", type: "Water", id: 816 }
    ],
    legendary: { name: "Zacian", id: 888 },
    gymCount: 8,
    trialCount: 0,
    color: "#558B2F",
    introduced: 2019,
    notableLocations: ["Postwick", "Motostoke", "Hammerlocke", "Crown Tundra", "Isle of Armor"],
    pokemonCount: 96,
    professor: "Professor Magnolia",
    villain: "Team Yell / Macro Cosmos"
  },
  {
    name: "Paldea",
    slug: "paldea",
    generation: 9,
    games: ["Pokémon Scarlet & Violet"],
    description: "Inspired by the Iberian Peninsula (Spain and Portugal), Paldea is the first fully open-world Pokémon region. Players can explore in any order across three storylines: the Gym Challenge, Starfall Street (Team Star), and Path of Legends (Titan Pokémon). Area Zero at its center hides a world-changing secret.",
    starters: [
      { name: "Sprigatito", type: "Grass", id: 906 },
      { name: "Fuecoco", type: "Fire", id: 909 },
      { name: "Quaxly", type: "Water", id: 912 }
    ],
    legendary: { name: "Koraidon", id: 1007 },
    gymCount: 8,
    trialCount: 0,
    color: "#B71C1C",
    introduced: 2022,
    notableLocations: ["Cabo Poco", "Mesagoza", "Area Zero", "Medali", "Glaseado Mountain"],
    pokemonCount: 103,
    professor: "Professor Sada / Professor Turo",
    villain: "Team Star"
  }
  ,
  {
    name: "Winds & Waves",
    slug: "winds-and-waves",
    generation: 10,
    games: ["Pokémon Winds", "Pokémon Waves"],
    description: "The newest announced Pokémon region, set in a world shaped by powerful ocean currents and sweeping coastal winds. Details are still being revealed, but the region promises lush clifftop grasslands, deep-sea caverns, and storm-swept harbors. Three starter Pokémon have been officially revealed ahead of launch.",
    starters: [
      { name: "Browt",  type: "Grass", id: null, image: "/assets/Browt.png"  },
      { name: "Pombon", type: "Fire",  id: null, image: "/assets/Pombon.png" },
      { name: "Gecqua", type: "Water", id: null, image: "/assets/Gecqua.png" }
    ],
    legendary: { name: "???", id: null },
    gymCount: 0,
    trialCount: 0,
    color: "#0277BD",
    introduced: "TBA",
    notableLocations: ["TBA"],
    pokemonCount: "TBA",
    professor: "TBA",
    villain: "TBA"
  }
];

module.exports = regions;
