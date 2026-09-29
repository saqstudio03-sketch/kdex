import type { CSSProperties } from "react";
import type { Product } from "@/types";

export interface GameTitleStyle {
  fontFamily: string;
  className: string;
  style?: CSSProperties;
  customPrefix?: string;
  customSuffix?: string;
}

/**
 * Maps game slugs and seeds to their official brand typographic aesthetics.
 * Grounded in official game promotional materials, cover art, and official studio websites.
 */
export function getGameTitleStyle(product: Product): GameTitleStyle {
  const seed = (product.imageSeed || product.slug || "").toLowerCase();
  const slug = (product.slug || "").toLowerCase();
  const title = product.title.toLowerCase();

  // 1. Grand Theft Auto VI (GTA VI) & GTA V
  if (slug.includes("gta-vi") || seed.includes("gta-vi") || title.includes("grand theft auto vi")) {
    return {
      fontFamily: "'Bungee', 'Impact', sans-serif",
      className:
        "uppercase tracking-normal font-normal text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-200 to-cyan-300 drop-shadow-[0_4px_24px_rgba(236,72,153,0.75)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }
  if (slug.includes("gta") || seed.includes("gta") || title.includes("grand theft auto")) {
    return {
      fontFamily: "'Bungee', 'Impact', sans-serif",
      className:
        "uppercase tracking-normal font-normal text-white drop-shadow-[0_4px_16px_rgba(34,197,94,0.6)] drop-shadow-[3px_3px_0px_#000] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 2. Cyberpunk 2077
  if (slug.includes("cyberpunk") || seed.includes("cyberpunk") || title.includes("cyberpunk")) {
    return {
      fontFamily: "'Orbitron', sans-serif",
      className:
        "uppercase italic font-black tracking-[0.12em] text-[#FCEE0A] drop-shadow-[0_0_28px_rgba(252,238,10,0.75)] drop-shadow-[3px_3px_0px_#00F0FF] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 3. Elden Ring
  if (slug.includes("elden-ring") || seed.includes("elden-ring") || title.includes("elden ring")) {
    return {
      fontFamily: "'Cinzel', 'Times New Roman', serif",
      className:
        "uppercase font-bold tracking-[0.24em] text-[#EAD39C] drop-shadow-[0_0_30px_rgba(234,211,156,0.7)] drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 4. Red Dead Redemption 2
  if (slug.includes("red-dead") || seed.includes("red-dead") || title.includes("red dead")) {
    return {
      fontFamily: "'Rye', 'Georgia', serif",
      className:
        "uppercase font-normal tracking-[0.06em] text-[#E11D48] drop-shadow-[0_0_24px_rgba(225,29,72,0.6)] drop-shadow-[3px_3px_0px_#111] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 5. God of War Ragnarök
  if (slug.includes("god-of-war") || seed.includes("god-of-war") || title.includes("god of war")) {
    return {
      fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
      className:
        "uppercase font-black tracking-[0.16em] text-[#F1F5F9] drop-shadow-[0_0_26px_rgba(96,165,250,0.65)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 6. Forza Horizon 5 & 6
  if (slug.includes("forza") || seed.includes("forza") || title.includes("forza")) {
    return {
      fontFamily: "'Russo One', 'Syne', sans-serif",
      className:
        "uppercase italic font-black tracking-wider text-white drop-shadow-[0_0_24px_rgba(245,158,11,0.65)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 7. Black Myth: Wukong
  if (slug.includes("wukong") || seed.includes("wukong") || title.includes("wukong")) {
    return {
      fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
      className:
        "uppercase font-black tracking-[0.2em] text-[#DFC38E] drop-shadow-[0_0_28px_rgba(223,195,142,0.7)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 8. Marvel's Spider-Man 2 / Wolverine
  if (slug.includes("spider-man") || slug.includes("wolverine") || title.includes("spider-man")) {
    return {
      fontFamily: "'Teko', 'Impact', sans-serif",
      className:
        "uppercase italic font-bold tracking-[0.06em] text-[#EF4444] drop-shadow-[2px_2px_0px_#FFFFFF] drop-shadow-[0_0_26px_rgba(239,68,68,0.7)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none",
    };
  }

  // 9. Call of Duty (MW4, Black Ops 6)
  if (slug.includes("cod") || slug.includes("call-of-duty") || title.includes("call of duty")) {
    return {
      fontFamily: "'Black Ops One', sans-serif",
      className:
        "uppercase font-normal tracking-[0.12em] text-[#F8FAFC] drop-shadow-[0_0_22px_rgba(34,197,94,0.6)] drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 10. Halo Infinite
  if (slug.includes("halo") || seed.includes("halo") || title.includes("halo")) {
    return {
      fontFamily: "'Audiowide', 'Orbitron', sans-serif",
      className:
        "uppercase font-normal tracking-[0.24em] text-[#E2E8F0] drop-shadow-[0_0_24px_rgba(56,189,248,0.75)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 11. Star Wars (Outlaws, Galactic Racer, Zero Company)
  if (slug.includes("star-wars") || title.includes("star wars")) {
    return {
      fontFamily: "'Audiowide', sans-serif",
      className:
        "uppercase font-normal tracking-[0.22em] text-[#FFE81F] drop-shadow-[0_0_28px_rgba(255,232,31,0.8)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 12. Baldur's Gate 3
  if (slug.includes("baldurs-gate") || title.includes("baldur's gate")) {
    return {
      fontFamily: "'MedievalSharp', 'Cinzel Decorative', serif",
      className:
        "uppercase font-normal tracking-[0.16em] text-[#C7D2FE] drop-shadow-[0_0_26px_rgba(168,85,247,0.7)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 13. Resident Evil 4 & Silent Hill 2
  if (slug.includes("resident-evil") || slug.includes("silent-hill") || title.includes("resident evil") || title.includes("silent hill")) {
    return {
      fontFamily: "'Cinzel', serif",
      className:
        "uppercase font-bold tracking-[0.2em] text-[#DC2626] drop-shadow-[0_0_26px_rgba(220,38,38,0.75)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 14. Hogwarts Legacy
  if (slug.includes("hogwarts") || title.includes("hogwarts")) {
    return {
      fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
      className:
        "uppercase font-black tracking-[0.2em] text-[#FDE047] drop-shadow-[0_0_28px_rgba(253,224,71,0.75)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 15. The Witcher 3
  if (slug.includes("witcher") || title.includes("witcher")) {
    return {
      fontFamily: "'MedievalSharp', serif",
      className:
        "uppercase font-normal tracking-[0.18em] text-[#F1F5F9] drop-shadow-[0_0_24px_rgba(239,68,68,0.65)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 16. Final Fantasy XVI
  if (slug.includes("final-fantasy") || title.includes("final fantasy")) {
    return {
      fontFamily: "'Cinzel', serif",
      className:
        "uppercase font-light tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-amber-100 to-indigo-200 drop-shadow-[0_0_30px_rgba(186,230,253,0.7)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 17. Ghost of Tsushima
  if (slug.includes("ghost-of-tsushima") || title.includes("tsushima")) {
    return {
      fontFamily: "'Cinzel', serif",
      className:
        "uppercase font-light tracking-[0.32em] text-[#F8FAFC] drop-shadow-[0_0_24px_rgba(239,68,68,0.6)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 18. Death Stranding 2
  if (slug.includes("death-stranding") || title.includes("death stranding")) {
    return {
      fontFamily: "'Orbitron', sans-serif",
      className:
        "uppercase font-light tracking-[0.32em] text-white drop-shadow-[0_0_22px_rgba(255,255,255,0.7)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 19. Minecraft
  if (slug.includes("minecraft") || title.includes("minecraft")) {
    return {
      fontFamily: "'Bungee', monospace, sans-serif",
      className:
        "tracking-wide font-normal text-[#5EEAD4] drop-shadow-[0_0_20px_rgba(94,234,212,0.6)] drop-shadow-[3px_3px_0px_#111] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // 20. EA Sports FC / NBA 2K
  if (slug.includes("ea-sports") || slug.includes("nba") || title.includes("ea sports") || title.includes("nba")) {
    return {
      fontFamily: "'Teko', 'Impact', sans-serif",
      className:
        "uppercase italic font-bold tracking-wider text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none",
    };
  }

  // Intelligent Genre & Platform fallbacks
  if (product.genre === "RPG" || product.genre === "Adventure") {
    return {
      fontFamily: "'Cinzel', serif",
      className:
        "uppercase font-bold tracking-[0.2em] text-[#EAD39C] drop-shadow-[0_0_24px_rgba(234,211,156,0.6)] drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  if (product.genre === "FPS" || product.genre === "Action") {
    return {
      fontFamily: "'Russo One', sans-serif",
      className:
        "uppercase font-normal tracking-wide text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  if (product.genre === "Racing" || product.genre === "Sports") {
    return {
      fontFamily: "'Russo One', sans-serif",
      className:
        "uppercase italic font-normal tracking-wider text-white drop-shadow-[0_0_22px_rgba(245,158,11,0.5)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    };
  }

  // Universal Default
  return {
    fontFamily: "'Space Grotesk', sans-serif",
    className:
      "font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
  };
}
