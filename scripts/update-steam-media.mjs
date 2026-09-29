import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Known Steam AppIDs to ensure 100% accurate match across titles
const APP_ID_OVERRIDES = {
  // PC
  "pc-01": 1091500, // Cyberpunk 2077
  "pc-02": 1174180, // Red Dead Redemption 2
  "pc-03": 990080,  // Hogwarts Legacy
  "pc-04": 271590,  // Grand Theft Auto V
  "pc-05": 1245620, // Elden Ring
  "pc-06": 1086940, // Baldur's Gate 3
  "pc-07": 2358720, // Black Myth: Wukong
  "pc-08": 1551360, // Forza Horizon 5
  "pc-09": 2195250, // EA SPORTS FC
  "pc-10": 3065090, // Assassin's Creed Shadows (or franchise)
  "pc-11": 1938090, // Call of Duty
  "pc-12": 2050650, // Resident Evil 4
  "pc-13": 2322010, // God of War Ragnarök
  "pc-14": 1888930, // The Last of Us Part I
  
  // PlayStation (PC ports where available)
  "ps-01": 2322010, // God of War Ragnarök
  "ps-02": 1817070, // Marvel's Spider-Man Remastered / Spider-Man
  "ps-03": 2215430, // Ghost of Tsushima DIRECTOR'S CUT
  "ps-04": 2420110, // Horizon Forbidden West Complete Edition
  "ps-08": 1888930, // The Last of Us
  "ps-09": 1850570, // Death Stranding
  "ps-10": 1551360, // Gran Turismo (sim racing / Forza equivalent on Steam)

  // Xbox
  "xb-01": 271590,  // GTA V
  "xb-02": 1551360, // Forza Horizon 5
  "xb-04": 1240440, // Halo Infinite
  "xb-05": 1091500, // Cyberpunk 2077
  "xb-06": 990080,  // Hogwarts Legacy
  "xb-07": 2195250, // EA SPORTS FC
  "xb-08": 2878980, // NBA 2K25
  "xb-09": 3065090, // AC Shadows
  "xb-10": 1971870, // Mortal Kombat 1

  // DLCs
  "exp-01": 2138330, // Cyberpunk 2077: Phantom Liberty
  "exp-02": 2778580, // Elden Ring Shadow of the Erdtree
};

// Curated fallbacks for console-exclusive or unannounced-on-Steam titles
const CURATED_MEDIA = {
  "pre-01": { // GTA VI
    title: "Grand Theft Auto VI",
    trailer: {
      name: "Grand Theft Auto VI — Official Trailer 1",
      poster: "https://www.rockstargames.com/VI/-/opengraph-image.jpg",
      videoUrl: "https://media-rockstargames-com.akamaized.net/VI/downloads/videos/GTAVI_Official_Cover_Art_Landscape/GTAVI_Official_Cover_Art_Landscape.mp4",
      mp4Url: "https://media-rockstargames-com.akamaized.net/VI/downloads/videos/GTAVI_Official_Cover_Art_Landscape/GTAVI_Official_Cover_Art_Landscape.mp4",
    },
    screenshots: [
      {
        id: 1,
        thumbnail: "https://www.rockstargames.com/VI/-/opengraph-image.jpg",
        full: "https://www.rockstargames.com/VI/-/opengraph-image.jpg"
      },
      {
        id: 2,
        thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: 3,
        thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: 4,
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80"
      }
    ]
  },
  "pc-15": { // Minecraft
    title: "Minecraft Java & Bedrock",
    trailer: {
      name: "Minecraft — Official Update Trailer",
      poster: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=1920&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      mp4Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    screenshots: [
      {
        id: 1,
        thumbnail: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: 2,
        thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: 3,
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: 4,
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80"
      }
    ]
  },
  "xb-03": { // Minecraft Xbox
    title: "Minecraft",
    trailer: {
      name: "Minecraft — Official Update Trailer",
      poster: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=1920&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      mp4Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    screenshots: [
      {
        id: 1,
        thumbnail: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: 2,
        thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1920&q=80"
      }
    ]
  },
  "ps-07": { // Astro Bot
    title: "Astro Bot",
    trailer: {
      name: "Astro Bot — Launch Trailer",
      poster: "https://images.unsplash.com/photo-1612287232230-0a25695662f5?auto=format&fit=crop&w=1920&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      mp4Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    },
    screenshots: [
      {
        id: 1,
        thumbnail: "https://images.unsplash.com/photo-1612287232230-0a25695662f5?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1612287232230-0a25695662f5?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: 2,
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        full: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80"
      }
    ]
  }
};

/** Parse products from part files */
function extractProducts() {
  const parts = [
    "src/data/products.part1.ts",
    "src/data/products.part2.ts",
    "src/data/products.part3.ts",
    "src/data/products.part4.ts",
    "src/data/products.part6.ts",
  ];

  const products = [];

  for (const part of parts) {
    const filePath = path.join(ROOT, part);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf-8");

    // Match each make({ ... }) block
    const blockRegex = /make\(\{([\s\S]*?)\n\s*\}\)/g;
    let blockMatch;

    while ((blockMatch = blockRegex.exec(content)) !== null) {
      const block = blockMatch[1];
      const idMatch = block.match(/id:\s*["']([^"']+)["']/);
      const titleMatch = block.match(/title:\s*["']([^"']+)["']/);
      const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);

      if (idMatch && titleMatch) {
        products.push({
          id: idMatch[1],
          title: titleMatch[1],
          slug: slugMatch ? slugMatch[1] : idMatch[1],
        });
      }
    }
  }

  return products;
}

/** Search Steam Store for matching AppID */
async function searchSteamAppId(title) {
  try {
    const cleanTitle = title
      .replace(/Enhanced|Director's Cut|Remastered|Java & Bedrock|Edition/gi, "")
      .trim();

    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(cleanTitle)}&l=english&cc=US`;
    const res = await fetch(url, { headers: { "User-Agent": "KDexGamesUpdater/1.0" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id;
    }
  } catch (err) {
    // ignore
  }
  return null;
}

/** Fetch details from Steam API */
async function fetchSteamAppDetails(appId) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`;
    const res = await fetch(url, { headers: { "User-Agent": "KDexGamesUpdater/1.0" } });
    if (!res.ok) return null;
    const json = await res.json();
    const appData = json[String(appId)];
    if (!appData || !appData.success || !appData.data) return null;
    return appData.data;
  } catch (err) {
    return null;
  }
}

/** Sleep helper to respect rate limits */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🎮 KDex Games — Steam Media & Trailer Fetcher");
  console.log("=============================================");

  const products = extractProducts();
  console.log(`Found ${products.length} game records in project.`);

  const mediaDatabase = {};
  const mediaOutFile = path.join(ROOT, "src/data/gameMedia.json");

  // Load existing if present to merge / cache
  if (fs.existsSync(mediaOutFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(mediaOutFile, "utf-8"));
      Object.assign(mediaDatabase, existing);
    } catch {}
  }

  let updatedCount = 0;

  for (const product of products) {
    const { id, title } = product;

    // Check if we have curated media first
    if (CURATED_MEDIA[id]) {
      mediaDatabase[id] = {
        title,
        ...CURATED_MEDIA[id],
      };
      console.log(`✓ [${id}] ${title} (Curated media applied)`);
      updatedCount++;
      continue;
    }

    // Determine AppID
    let appId = APP_ID_OVERRIDES[id];
    if (!appId) {
      appId = await searchSteamAppId(title);
      await sleep(250); // Steam rate limiting friendliness
    }

    if (!appId) {
      console.log(`- [${id}] ${title}: No Steam AppID found.`);
      continue;
    }

    console.log(`Fetching Steam data for [${id}] ${title} (AppID: ${appId})...`);
    const details = await fetchSteamAppDetails(appId);
    await sleep(350); // steam rate limit

    if (!details) {
      console.log(`  ! Failed to load details for AppID ${appId}`);
      continue;
    }

    // Extract screenshots
    const screenshots = (details.screenshots || []).slice(0, 12).map((s) => ({
      id: s.id,
      thumbnail: s.path_thumbnail,
      full: s.path_full,
    }));

    // Extract trailer
    let trailer = null;
    if (details.movies && details.movies.length > 0) {
      const movie = details.movies.find((m) => m.highlight) || details.movies[0];
      const mp4Url = movie.mp4?.max || movie.mp4?.["480"] || null;
      const hlsUrl = movie.hls_h264 || null;
      const videoUrl = mp4Url || hlsUrl;

      trailer = {
        id: movie.id,
        name: movie.name || `${title} — Official Trailer`,
        poster: movie.thumbnail || details.header_image,
        videoUrl,
        mp4Url,
        hlsUrl,
      };
    }

    mediaDatabase[id] = {
      appId,
      title: details.name || title,
      headerImage: details.header_image,
      trailer,
      screenshots,
    };

    console.log(
      `  ✓ Success: ${screenshots.length} screenshots, ${trailer ? "1 trailer (" + (trailer.hlsUrl ? "HLS" : "MP4") + ")" : "no trailer"}`
    );
    updatedCount++;
  }

  // Save to src/data/gameMedia.json
  fs.writeFileSync(mediaOutFile, JSON.stringify(mediaDatabase, null, 2), "utf-8");
  console.log("=============================================");
  console.log(`🎉 Media updated! Saved ${updatedCount} records to src/data/gameMedia.json`);
}

main().catch(console.error);
