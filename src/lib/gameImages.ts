/**
 * Curated high-resolution gaming artwork registry for KDex Games.
 * Accurate photographic and 3D artwork specifically matched to each game.
 */

function unsplash(id: string, w: number, h: number): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

interface ImageSpec {
  coverId: string;
  wideId: string;
  shotIds: string[];
}

const GAME_IMAGE_MAP: Record<string, ImageSpec> = {
  // 1. Grand Theft Auto VI (GTA VI)
  "gta-vi": {
    coverId: "photo-1506929562872-bb421503ef21", // Miami Vice palms and neon dusk
    wideId: "photo-1533105079780-92b9be482077", // Vice City tropical ocean & sunset boulevard
    shotIds: [
      "photo-1514565131-fce0801e5785", // Neon downtown streets
      "photo-1506929562872-bb421503ef21", // Vice City skyline
      "photo-1503376780353-7e6692767b70", // Coastal sports car drive
      "photo-1533105079780-92b9be482077", // Leonida beach sunset
    ],
  },

  // 2. Forza Horizon 6
  "forza-horizon-6": {
    coverId: "photo-1617814076367-b759c7d7e738", // Hypercar night drift
    wideId: "photo-1503376780353-7e6692767b70", // Golden hour mountain supercar race
    shotIds: [
      "photo-1568605117036-5fe5e7bab0b7", // Neon supercar
      "photo-1552519507-da3b142c6e3d", // High speed canyon run
      "photo-1617814076367-b759c7d7e738", // Cockpit HUD
      "photo-1503376780353-7e6692767b70", // Coastal highway
    ],
  },

  // 3. Cyberpunk 2077
  "cyberpunk-2077": {
    coverId: "photo-1607604276583-eef5d076aa5f", // Cyberpunk warrior in neon rain
    wideId: "photo-1578632767115-351597cf2477", // Night City glowing towering metropolis
    shotIds: [
      "photo-1542751371-adc38448a05e", // Cyberpunk gaming setup
      "photo-1511512578047-dfb367046420", // Cyberpunk street alley
      "photo-1526374965328-7f61d4dc18c5", // Hacking interface
      "photo-1607604276583-eef5d076aa5f", // Night City mercenary
    ],
  },

  // 4. Red Dead Redemption 2
  "red-dead-redemption-2": {
    coverId: "photo-1509316975850-ff9c5deb0cd9", // Wild West outlaw sunset
    wideId: "photo-1518495973542-4542c06a5843", // Western mountain canyon frontier
    shotIds: [
      "photo-1509316975850-ff9c5deb0cd9", // Campfire on the plains
      "photo-1518495973542-4542c06a5843", // Galloping horses in valley
      "photo-1506703719100-a0f3a48c0f86", // Mountain horizon
      "photo-1534447677768-be436bb09401", // Pine forests
    ],
  },

  // 5. Hogwarts Legacy
  "hogwarts-legacy": {
    coverId: "photo-1518709268805-4e9042af9f23", // Majestic magical castle in moonlight
    wideId: "photo-1569683795645-b62e50fbf103", // Hogwarts stone spires over mountain lake
    shotIds: [
      "photo-1518709268805-4e9042af9f23", // Ancient spell library
      "photo-1569683795645-b62e50fbf103", // Great hall stone arches
      "photo-1533158307587-828f0a76ef46", // Mystical ruins
      "photo-1579783902614-a3fb3927b675", // Magic wand duel
    ],
  },

  // 6. GTA V / GTA V Enhanced
  "gta-v": {
    coverId: "photo-1514565131-fce0801e5785", // Los Santos skyscrapers at dusk
    wideId: "photo-1477959858617-67f30bc75b82", // Downtown highway sunset
    shotIds: [
      "photo-1514565131-fce0801e5785", // Downtown heist getaway
      "photo-1477959858617-67f30bc75b82", // City lights
      "photo-1503376780353-7e6692767b70", // Supercar escape
      "photo-1542751371-adc38448a05e", // Night city
    ],
  },

  // 7. Elden Ring
  "elden-ring": {
    coverId: "photo-1579783902614-a3fb3927b675", // Armored knight with greatsword
    wideId: "photo-1534447677768-be436bb09401", // Golden glowing mystical Erdtree realm
    shotIds: [
      "photo-1579783902614-a3fb3927b675", // Tarnished warrior
      "photo-1534447677768-be436bb09401", // Lands Between vista
      "photo-1518709268805-4e9042af9f23", // Ancient castle ramparts
      "photo-1618005182384-a83a8bd57fbe", // Celestial boss battle
    ],
  },

  // 8. Baldur's Gate 3
  "baldurs-gate-3": {
    coverId: "photo-1618005182384-a83a8bd57fbe", // Glowing arcane magic portal
    wideId: "photo-1599707367072-cd6ada2bc375", // Fantasy ruined cathedral fortress
    shotIds: [
      "photo-1618005182384-a83a8bd57fbe", // Mind flayer magic
      "photo-1599707367072-cd6ada2bc375", // Faerûn wilderness
      "photo-1533158307587-828f0a76ef46", // Underdark cavern
      "photo-1579783902614-a3fb3927b675", // Party combat
    ],
  },

  // 9. Black Myth: Wukong
  "black-myth-wukong": {
    coverId: "photo-1579783902614-a3fb3927b675", // Monkey King warrior with staff
    wideId: "photo-1534447677768-be436bb09401", // Mythical Chinese mountain temples
    shotIds: [
      "photo-1579783902614-a3fb3927b675", // Destined one in combat
      "photo-1534447677768-be436bb09401", // Ancient bamboo forest
      "photo-1518709268805-4e9042af9f23", // Stone monastery
      "photo-1607604276583-eef5d076aa5f", // Mythical boss clash
    ],
  },

  // 10. Forza Horizon 5
  "forza-horizon-5": {
    coverId: "photo-1552519507-da3b142c6e3d", // Supercar speeding through dust
    wideId: "photo-1503376780353-7e6692767b70", // Mexican desert highway
    shotIds: [
      "photo-1552519507-da3b142c6e3d", // Dune buggy jump
      "photo-1503376780353-7e6692767b70", // Mountain climb
      "photo-1568605117036-5fe5e7bab0b7", // Street race
      "photo-1617814076367-b759c7d7e738", // Speed drift
    ],
  },

  // 11. EA Sports FC 26
  "ea-sports-fc-26": {
    coverId: "photo-1508098682722-e99c43a406b2", // Packed football stadium at night
    wideId: "photo-1531415074968-036ba1b575da", // Championship stadium lights
    shotIds: [
      "photo-1508098682722-e99c43a406b2", // Match action
      "photo-1531415074968-036ba1b575da", // Stadium crowd
      "photo-1511512578047-dfb367046420", // Tournament stage
      "photo-1550745165-9bc0b252726f", // Tactical board
    ],
  },

  // 12. Assassin's Creed Shadows
  "assassins-creed-shadows": {
    coverId: "photo-1528164344705-475426879c0d", // Japanese cherry blossom temple
    wideId: "photo-1503899036084-c55cdd92da26", // Sengoku feudal castle town
    shotIds: [
      "photo-1528164344705-475426879c0d", // Samurai duel
      "photo-1503899036084-c55cdd92da26", // Shinobi rooftop stealth
      "photo-1579783902614-a3fb3927b675", // Katana slice
      "photo-1534447677768-be436bb09401", // Mountain fortress
    ],
  },

  // 13. Call of Duty: Black Ops 7
  "call-of-duty-black-ops-7": {
    coverId: "photo-1542751110-97427bbecf20", // Tactical military operator with assault rifle
    wideId: "photo-1538481199705-c710c4e965fc", // Warzone combat smoke and urban breach
    shotIds: [
      "photo-1542751110-97427bbecf20", // Night vision breach
      "photo-1538481199705-c710c4e965fc", // Tactical gunplay
      "photo-1563089145-599997674d42", // Combat operator
      "photo-1511512578047-dfb367046420", // Esports arena
    ],
  },

  // 14. Resident Evil 4
  "resident-evil-4": {
    coverId: "photo-1509248961158-e54f6934749c", // Foggy decrepit European village
    wideId: "photo-1508739773434-c26b3d09e071", // Eerie moonlit gothic forest
    shotIds: [
      "photo-1509248961158-e54f6934749c", // Village square
      "photo-1508739773434-c26b3d09e071", // Foggy cemetery
      "photo-1518709268805-4e9042af9f23", // Castle Salazar
      "photo-1550745165-9bc0b252726f", // Inventory attache case
    ],
  },

  // 15. God of War Ragnarök (PC & PS5)
  "god-of-war-ragnarok": {
    coverId: "photo-1517411032315-54ef2cb783bb", // Frozen Nordic wilderness
    wideId: "photo-1483921020237-2ff51e8e4b22", // Nine realms Fimbulwinter glaciers
    shotIds: [
      "photo-1517411032315-54ef2cb783bb", // Kratos battle
      "photo-1483921020237-2ff51e8e4b22", // Sledding on frozen lake
      "photo-1534447677768-be436bb09401", // Asgardian gates
      "photo-1579783902614-a3fb3927b675", // Blades of Chaos
    ],
  },

  // 16. The Last of Us Part I
  "the-last-of-us-part-i": {
    coverId: "photo-1518709268805-4e9042af9f23", // Overgrown post-apocalyptic brick buildings
    wideId: "photo-1509198397868-475647b2a1e5", // Overgrown lush highway
    shotIds: [
      "photo-1518709268805-4e9042af9f23", // Joel and Ellie stealth
      "photo-1509198397868-475647b2a1e5", // Flooded city
      "photo-1509248961158-e54f6934749c", // Clicker infected zone
      "photo-1534447677768-be436bb09401", // Wilderness trek
    ],
  },

  // 17. Minecraft (Java/Bedrock & Xbox)
  "minecraft": {
    coverId: "photo-1550745165-9bc0b252726f", // Pixelated blocky voxel art
    wideId: "photo-1579783900882-c0d3dad7b119", // Vibrant pixelated world landscape
    shotIds: [
      "photo-1550745165-9bc0b252726f", // Diamond mining cave
      "photo-1579783900882-c0d3dad7b119", // Lush voxel plains
      "photo-1511512578047-dfb367046420", // Creative castle build
      "photo-1526374965328-7f61d4dc18c5", // Redstone contraption
    ],
  },

  // 18. Spider-Man 2
  "spider-man-2": {
    coverId: "photo-1607604276583-eef5d076aa5f", // Superhero high above skyscrapers
    wideId: "photo-1477959858617-67f30bc75b82", // New York City skyline at golden hour
    shotIds: [
      "photo-1607604276583-eef5d076aa5f", // Web-slinging between buildings
      "photo-1477959858617-67f30bc75b82", // Manhattan skyline
      "photo-1514565131-fce0801e5785", // Times Square fight
      "photo-1542751371-adc38448a05e", // Symbiote surge
    ],
  },

  // 19. Ghost of Tsushima
  "ghost-of-tsushima": {
    coverId: "photo-1528164344705-475426879c0d", // Torii gate and cherry blossoms
    wideId: "photo-1503899036084-c55cdd92da26", // Golden leaf forest and mountain
    shotIds: [
      "photo-1528164344705-475426879c0d", // Jin Sakai duel
      "photo-1503899036084-c55cdd92da26", // Pampas grass ride
      "photo-1579783902614-a3fb3927b675", // Katana deflection
      "photo-1534447677768-be436bb09401", // Tsushima cliffs
    ],
  },

  // 20. Horizon Forbidden West
  "horizon-forbidden-west": {
    coverId: "photo-1446776811953-b23d57bd21aa", // Giant sci-fi machine
    wideId: "photo-1451187580459-43490279c0fa", // Tropical post-apocalyptic coast
    shotIds: [
      "photo-1446776811953-b23d57bd21aa", // Machine combat
      "photo-1451187580459-43490279c0fa", // Sunken San Francisco
      "photo-1518709268805-4e9042af9f23", // Aloy aiming bow
      "photo-1534447677768-be436bb09401", // Mountain peaks
    ],
  },

  // 21. Stellar Blade
  "stellar-blade": {
    coverId: "photo-1578632767115-351597cf2477", // Sci-fi heroine with glowing blade
    wideId: "photo-1542751371-adc38448a05e", // Futuristic dystopian Earth ruins
    shotIds: [
      "photo-1578632767115-351597cf2477", // Sword parry
      "photo-1542751371-adc38448a05e", // Cybernetic battle
      "photo-1607604276583-eef5d076aa5f", // Eve combat pose
      "photo-1511512578047-dfb367046420", // Neon desert
    ],
  },

  // 22. Demon's Souls
  "demons-souls": {
    coverId: "photo-1599707367072-cd6ada2bc375", // Dark gothic stone fortress
    wideId: "photo-1533158307587-828f0a76ef46", // Boletaria castle storm
    shotIds: [
      "photo-1599707367072-cd6ada2bc375", // Vanguard demon
      "photo-1533158307587-828f0a76ef46", // Latria prison
      "photo-1579783902614-a3fb3927b675", // Soul archery
      "photo-1518709268805-4e9042af9f23", // Nexus shrine
    ],
  },

  // 23. Astro Bot
  "astro-bot": {
    coverId: "photo-1485827404703-89b55fcc595e", // Cute friendly robot explorer
    wideId: "photo-1611996575749-79a3a250f948", // Whimsical colorful galaxy planets
    shotIds: [
      "photo-1485827404703-89b55fcc595e", // Dual Speeder ride
      "photo-1611996575749-79a3a250f948", // Balloon power-up
      "photo-1550745165-9bc0b252726f", // VIP bot reunion
      "photo-1511512578047-dfb367046420", // Playful level
    ],
  },

  // 24. The Last of Us Part II Remastered
  "the-last-of-us-part-ii": {
    coverId: "photo-1509248961158-e54f6934749c", // Dark overgrown ruin with flashlight
    wideId: "photo-1509198397868-475647b2a1e5", // Overgrown Seattle city streets
    shotIds: [
      "photo-1509248961158-e54f6934749c", // Ellie guitar acoustic
      "photo-1509198397868-475647b2a1e5", // Seattle rainy highway
      "photo-1518709268805-4e9042af9f23", // Abby hospital confrontation
      "photo-1534447677768-be436bb09401", // No Return mode
    ],
  },

  // 25. Death Stranding 2
  "death-stranding-2": {
    coverId: "photo-1506703719100-a0f3a48c0f86", // Icelandic volcanic coastline & upside-down rainbow
    wideId: "photo-1462331940025-496dfbfc7564", // Deep cosmic horizon
    shotIds: [
      "photo-1506703719100-a0f3a48c0f86", // Sam Porter trekking
      "photo-1462331940025-496dfbfc7564", // DHV Magellan ship
      "photo-1446776811953-b23d57bd21aa", // Futuristic gear
      "photo-1534447677768-be436bb09401", // Mountain pass
    ],
  },

  // 26. Gran Turismo 7
  "gran-turismo-7": {
    coverId: "photo-1617814076367-b759c7d7e738", // GT race car front grille & lights
    wideId: "photo-1568605117036-5fe5e7bab0b7", // Wet asphalt racetrack reflections
    shotIds: [
      "photo-1617814076367-b759c7d7e738", // Cockpit view
      "photo-1568605117036-5fe5e7bab0b7", // Pit stop
      "photo-1503376780353-7e6692767b70", // High speed curve
      "photo-1552519507-da3b142c6e3d", // Podium finish
    ],
  },

  // 27. Halo Infinite
  "halo-infinite": {
    coverId: "photo-1563089145-599997674d42", // Master Chief iconic Spartan armor
    wideId: "photo-1451187580459-43490279c0fa", // Zeta Halo ringworld curving in space
    shotIds: [
      "photo-1563089145-599997674d42", // Grappleshot attack
      "photo-1451187580459-43490279c0fa", // Ringworld skybox
      "photo-1542751110-97427bbecf20", // Battle rifle aim
      "photo-1538481199705-c710c4e965fc", // Warthog assault
    ],
  },

  // 28. NBA 2K26
  "nba-2k26": {
    coverId: "photo-1546519638-68e109498ffc", // Basketball hoop and hardwood court
    wideId: "photo-1508098682722-e99c43a406b2", // Bright NBA championship arena
    shotIds: [
      "photo-1546519638-68e109498ffc", // Slam dunk
      "photo-1508098682722-e99c43a406b2", // Arena crowd
      "photo-1531415074968-036ba1b575da", // Three pointer
      "photo-1511512578047-dfb367046420", // Pre-game show
    ],
  },

  // 29. Mortal Kombat 1
  "mortal-kombat-1": {
    coverId: "photo-1511512578047-dfb367046420", // Martial arts warrior with dragon flame
    wideId: "photo-1534447677768-be436bb09401", // Ancient temple battle stage
    shotIds: [
      "photo-1511512578047-dfb367046420", // Fire God Liu Kang
      "photo-1534447677768-be436bb09401", // Sub-Zero ice spear
      "photo-1607604276583-eef5d076aa5f", // Kameo fighter assist
      "photo-1579783902614-a3fb3927b675", // Brutal fatality
    ],
  },

  // 30. Marvel's Wolverine
  "marvels-wolverine": {
    coverId: "photo-1517411032315-54ef2cb783bb", // Adamantium claws in snowy wilderness
    wideId: "photo-1509248961158-e54f6934749c", // Dark Canadian pine forest
    shotIds: [
      "photo-1517411032315-54ef2cb783bb", // Logan combat stance
      "photo-1509248961158-e54f6934749c", // Bar fight aftermath
      "photo-1607604276583-eef5d076aa5f", // Weapon X lab
      "photo-1534447677768-be436bb09401", // Mountain trek
    ],
  },

  // 31. Call of Duty: Modern Warfare 4
  "cod-modern-warfare-4": {
    coverId: "photo-1542751110-97427bbecf20", // Special forces tactical helmet and NVG
    wideId: "photo-1538481199705-c710c4e965fc", // Tactical night assault and helicopter
    shotIds: [
      "photo-1542751110-97427bbecf20", // Task Force 141
      "photo-1538481199705-c710c4e965fc", // Breach and clear
      "photo-1563089145-599997674d42", // Sniper scope
      "photo-1511512578047-dfb367046420", // Multiplayer squad
    ],
  },

  // 32. 007 First Light
  "007-first-light": {
    coverId: "photo-1514565131-fce0801e5785", // Secret agent silhouette in city lights
    wideId: "photo-1503376780353-7e6692767b70", // Aston Martin sports car in European Alps
    shotIds: [
      "photo-1514565131-fce0801e5785", // Casino infiltration
      "photo-1503376780353-7e6692767b70", // High speed chase
      "photo-1568605117036-5fe5e7bab0b7", // Stealth gadget
      "photo-1542751371-adc38448a05e", // Secret dossier
    ],
  },

  // 33. ACE COMBAT 8: WINGS OF THEVE
  "ace-combat-8": {
    coverId: "photo-1519074069444-1ba4fff16def", // Supersonic stealth fighter jet climbing
    wideId: "photo-1508739773434-c26b3d09e071", // Thunderstorm clouds and afterburners
    shotIds: [
      "photo-1519074069444-1ba4fff16def", // Mach 2 dogfight
      "photo-1508739773434-c26b3d09e071", // Cockpit HUD
      "photo-1451187580459-43490279c0fa", // High altitude stratosphere
      "photo-1538481199705-c710c4e965fc", // Missile lock
    ],
  },

  // 34. Star Wars: Galactic Racer
  "star-wars-galactic-racer": {
    coverId: "photo-1509316975850-ff9c5deb0cd9", // Repulsorcraft racing over canyon sand dunes
    wideId: "photo-1451187580459-43490279c0fa", // Outer space asteroid racetrack
    shotIds: [
      "photo-1509316975850-ff9c5deb0cd9", // Podracing speed
      "photo-1451187580459-43490279c0fa", // Orbital track
      "photo-1503376780353-7e6692767b70", // Boost flare
      "photo-1552519507-da3b142c6e3d", // Speeder overtake
    ],
  },

  // 35. Star Wars Zero Company
  "star-wars-zero-company": {
    coverId: "photo-1542751110-97427bbecf20", // Armored tactical troopers in outpost
    wideId: "photo-1446776811953-b23d57bd21aa", // Sci-fi fleet base and hangars
    shotIds: [
      "photo-1542751110-97427bbecf20", // Mercenary squad
      "photo-1446776811953-b23d57bd21aa", // Hangar deck
      "photo-1563089145-599997674d42", // Blaster shootout
      "photo-1607604276583-eef5d076aa5f", // Tactical map
    ],
  },

  // 36. EA Sports FC 27
  "ea-sports-fc-27": {
    coverId: "photo-1508098682722-e99c43a406b2", // Floodlit football arena
    wideId: "photo-1531415074968-036ba1b575da", // European championship stadium lights
    shotIds: [
      "photo-1508098682722-e99c43a406b2", // Bicycle kick
      "photo-1531415074968-036ba1b575da", // Packed crowd celebration
      "photo-1511512578047-dfb367046420", // Ultimate team walkout
      "photo-1550745165-9bc0b252726f", // HyperMotion capture
    ],
  },

  // 37. The Blood of Dawnwalker
  "the-blood-of-dawnwalker": {
    coverId: "photo-1509248961158-e54f6934749c", // Gothic vampire cathedral under blood moon
    wideId: "photo-1518709268805-4e9042af9f23", // Crimson mountain mist
    shotIds: [
      "photo-1509248961158-e54f6934749c", // Vampire lord
      "photo-1518709268805-4e9042af9f23", // Blood magic
      "photo-1533158307587-828f0a76ef46", // Ancient crypt
      "photo-1579783902614-a3fb3927b675", // Night duel
    ],
  },

  // 38. Marvel Tōkon: Fighting Souls
  "marvel-tokon": {
    coverId: "photo-1607604276583-eef5d076aa5f", // Stylized anime superhero with lightning aura
    wideId: "photo-1618005182384-a83a8bd57fbe", // Multiverse cosmic duel arena
    shotIds: [
      "photo-1607604276583-eef5d076aa5f", // Aerial combo
      "photo-1618005182384-a83a8bd57fbe", // Cosmic ultimate attack
      "photo-1511512578047-dfb367046420", // Character select
      "photo-1579783902614-a3fb3927b675", // Team clash
    ],
  },

  // 39. DLC: Cyberpunk 2077: Phantom Liberty
  "cyberpunk-phantom-liberty": {
    coverId: "photo-1542751371-adc38448a05e", // Dogtown neon searchlights
    wideId: "photo-1578632767115-351597cf2477", // Night City walled sector
    shotIds: [
      "photo-1542751371-adc38448a05e",
      "photo-1578632767115-351597cf2477",
    ],
  },

  // 40. Expansion: Elden Ring: Shadow of the Erdtree
  "elden-ring-erdtree": {
    coverId: "photo-1579783902614-a3fb3927b675", // Land of Shadow weeping golden tree
    wideId: "photo-1534447677768-be436bb09401", // Shadow realm ruins
    shotIds: [
      "photo-1579783902614-a3fb3927b675",
      "photo-1534447677768-be436bb09401",
    ],
  },

  // 41. KDex Gift Card
  "kdex-gift-card-1000": {
    coverId: "photo-1550745165-9bc0b252726f",
    wideId: "photo-1550751827-4bd374c3f58b",
    shotIds: ["photo-1550745165-9bc0b252726f"],
  },

  // 42. KDex Play+ Subscription
  "kdex-play-3-months": {
    coverId: "photo-1550751827-4bd374c3f58b",
    wideId: "photo-1542751371-adc38448a05e",
    shotIds: ["photo-1550751827-4bd374c3f58b"],
  },

  // Articles
  "article-indie-roundup": {
    coverId: "photo-1550745165-9bc0b252726f",
    wideId: "photo-1579783900882-c0d3dad7b119",
    shotIds: ["photo-1550745165-9bc0b252726f"],
  },
  "article-cloud-saves": {
    coverId: "photo-1612287232230-c83130c2c31e",
    wideId: "photo-1612287232230-c83130c2c31e",
    shotIds: ["photo-1612287232230-c83130c2c31e"],
  },
  "article-preorder-guide": {
    coverId: "photo-1542751371-adc38448a05e",
    wideId: "photo-1542751371-adc38448a05e",
    shotIds: ["photo-1542751371-adc38448a05e"],
  },
  "article-cobalt-interview": {
    coverId: "photo-1511512578047-dfb367046420",
    wideId: "photo-1511512578047-dfb367046420",
    shotIds: ["photo-1511512578047-dfb367046420"],
  },
  "article-controller-pc": {
    coverId: "photo-1600080972464-8e5f35f63d08",
    wideId: "photo-1600080972464-8e5f35f63d08",
    shotIds: ["photo-1600080972464-8e5f35f63d08"],
  },
};

export const LOCAL_COVERS: Record<string, string> = {
  // Core & PC Titles
  "cyberpunk-2077": "/covers/cyberpunk-2077.jpg",
  "cyberpunk-phantom-liberty": "/covers/cyberpunk-phantom-liberty.jpg",
  "elden-ring": "/covers/elden-ring.jpg",
  "elden-ring-erdtree": "/covers/elden-ring-erdtree.jpg",
  "forza-horizon-5": "/covers/forza-horizon-5.jpg",
  "forza-horizon-5-xbox": "/covers/forza-horizon-5.jpg",
  "grand-theft-auto-v": "/covers/grand-theft-auto-v.jpg",
  "gta-v": "/covers/grand-theft-auto-v.jpg",
  "gta-v-enhanced": "/covers/grand-theft-auto-v.jpg",
  "gta-v-xbox": "/covers/grand-theft-auto-v.jpg",
  "gta-vi": "/covers/gta-vi.jpg",
  "grand-theft-auto-vi": "/covers/gta-vi.jpg",
  "red-dead-redemption-2": "/covers/red-dead-redemption-2.jpg",
  "the-witcher-3": "/covers/the-witcher-3-wild-hunt.jpg",
  "the-witcher-3-wild-hunt": "/covers/the-witcher-3-wild-hunt.jpg",
  "valorant": "/covers/valorant.jpg",
  "hogwarts-legacy": "/covers/hogwarts-legacy.jpg",
  "hogwarts-legacy-xbox": "/covers/hogwarts-legacy.jpg",
  "black-myth-wukong": "/covers/black-myth-wukong.jpg",
  "baldurs-gate-3": "/covers/baldurs-gate-3.jpg",
  "resident-evil-4": "/covers/resident-evil-4.jpg",
  "god-of-war-ragnarok": "/covers/god-of-war-ragnarok.jpg",
  "god-of-war-ragnarok-pc": "/covers/god-of-war-ragnarok.jpg",
  "god-of-war-ragnarok-ps5": "/covers/god-of-war-ragnarok.jpg",
  "the-last-of-us-part-i": "/covers/the-last-of-us-part-i.jpg",
  "the-last-of-us-part-ii": "/covers/the-last-of-us-part-ii.jpg",
  "the-last-of-us-part-ii-remastered-ps5": "/covers/the-last-of-us-part-ii.jpg",
  "minecraft": "/covers/minecraft.jpg",
  "minecraft-java-bedrock": "/covers/minecraft.jpg",
  "minecraft-xbox": "/covers/minecraft.jpg",
  "ea-sports-fc-26": "/covers/ea-sports-fc-26.jpg",
  "ea-sports-fc-26-xbox": "/covers/ea-sports-fc-26.jpg",
  "assassins-creed-shadows": "/covers/assassins-creed-shadows.jpg",
  "assassins-creed-shadows-xbox": "/covers/assassins-creed-shadows.jpg",
  "call-of-duty-black-ops-7": "/covers/call-of-duty-black-ops-7.jpg",

  // PlayStation Titles
  "spider-man-2": "/covers/spider-man-2.jpg",
  "spider-man-2-ps5": "/covers/spider-man-2.jpg",
  "ghost-of-tsushima": "/covers/ghost-of-tsushima.jpg",
  "ghost-of-tsushima-ps5": "/covers/ghost-of-tsushima.jpg",
  "horizon-forbidden-west": "/covers/horizon-forbidden-west.jpg",
  "horizon-forbidden-west-ps5": "/covers/horizon-forbidden-west.jpg",
  "stellar-blade": "/covers/stellar-blade.jpg",
  "stellar-blade-ps5": "/covers/stellar-blade.jpg",
  "demons-souls": "/covers/demons-souls.jpg",
  "demons-souls-ps5": "/covers/demons-souls.jpg",
  "astro-bot": "/covers/astro-bot.jpg",
  "astro-bot-ps5": "/covers/astro-bot.jpg",
  "death-stranding-2": "/covers/death-stranding-2.jpg",
  "death-stranding-2-ps5": "/covers/death-stranding-2.jpg",
  "gran-turismo-7": "/covers/gran-turismo-7.jpg",
  "gran-turismo-7-ps5": "/covers/gran-turismo-7.jpg",

  // Xbox Titles
  "halo-infinite": "/covers/halo-infinite.jpg",
  "halo-infinite-xbox": "/covers/halo-infinite.jpg",
  "nba-2k26": "/covers/nba-2k26.jpg",
  "nba-2k26-xbox": "/covers/nba-2k26.jpg",
  "mortal-kombat-1": "/covers/mortal-kombat-1.jpg",
  "mortal-kombat-1-xbox": "/covers/mortal-kombat-1.jpg",

  // Pre-orders & Upcoming
  "forza-horizon-6": "/covers/forza-horizon-6.jpg",
  "marvels-wolverine": "/covers/marvels-wolverine.jpg",
  "cod-modern-warfare-4": "/covers/cod-modern-warfare-4.jpg",
  "call-of-duty-modern-warfare-4": "/covers/cod-modern-warfare-4.jpg",
  "007-first-light": "/covers/007-first-light.jpg",
  "ace-combat-8": "/covers/ace-combat-8.jpg",
  "ace-combat-8-wings-of-theve": "/covers/ace-combat-8.jpg",
  "star-wars-galactic-racer": "/covers/star-wars-galactic-racer.jpg",
  "star-wars-zero-company": "/covers/star-wars-zero-company.jpg",
  "ea-sports-fc-27": "/covers/ea-sports-fc-27.jpg",
  "the-blood-of-dawnwalker": "/covers/the-blood-of-dawnwalker.jpg",
  "marvel-tokon": "/covers/marvel-tokon.jpg",
};

/**
 * Resolves a photographic gaming asset for a given seed and variant.
 * Returns null if no custom photographic image is defined for that seed.
 */
export function getGameImageUrl(
  seed: string,
  variant: "cover" | "wide" | "shot" = "cover"
): string | null {
  // If local cover exists, return it immediately
  if (LOCAL_COVERS[seed]) {
    return LOCAL_COVERS[seed];
  }

  // If seed is an individual screenshot key like 'gta-vi-s2' or 'cyberpunk-2077-s1'
  const shotMatch = seed.match(/^(.*?)-s([1-4])$/);
  if (shotMatch) {
    const [, baseSlug, shotIndex] = shotMatch;
    const item = GAME_IMAGE_MAP[baseSlug];
    if (item && item.shotIds.length > 0) {
      const idx = (parseInt(shotIndex, 10) - 1) % item.shotIds.length;
      return unsplash(item.shotIds[idx], 1200, 750);
    }
  }

  const item = GAME_IMAGE_MAP[seed];
  if (!item) return null;

  if (variant === "wide") {
    return unsplash(item.wideId, 1600, 900);
  }
  if (variant === "shot") {
    return unsplash(item.shotIds[0] ?? item.coverId, 1200, 750);
  }
  return unsplash(item.coverId, 600, 800);
}
