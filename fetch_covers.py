import os
import sys
import re
import time
import shutil
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# 1. Configuration
API_KEY = "de08592d5f974fcdb5037abd6357042d" # Make sure your real key is here
OUTPUT_DIR = "game_covers"      # Primary output directory
PUBLIC_DIR = "public/covers"    # Public directory for frontend access

# 2. Complete target game titles across KDex Catalog
GAMES = [
    # Top Featured & Core Titles
    {"name": "Grand Theft Auto V", "seed": "gta-v", "filename": "grand-theft-auto-v.jpg"},
    {"name": "Cyberpunk 2077", "seed": "cyberpunk-2077", "filename": "cyberpunk-2077.jpg"},
    {"name": "Elden Ring", "seed": "elden-ring", "filename": "elden-ring.jpg"},
    {"name": "Red Dead Redemption 2", "seed": "red-dead-redemption-2", "filename": "red-dead-redemption-2.jpg"},
    {"name": "The Witcher 3: Wild Hunt", "seed": "the-witcher-3-wild-hunt", "filename": "the-witcher-3-wild-hunt.jpg"},
    {"name": "Valorant", "seed": "valorant", "filename": "valorant.jpg"},
    {"name": "Forza Horizon 5", "seed": "forza-horizon-5", "filename": "forza-horizon-5.jpg"},

    # PC Catalog Titles
    {"name": "Hogwarts Legacy", "seed": "hogwarts-legacy", "filename": "hogwarts-legacy.jpg"},
    {"name": "Black Myth: Wukong", "seed": "black-myth-wukong", "filename": "black-myth-wukong.jpg"},
    {"name": "Baldur's Gate 3", "seed": "baldurs-gate-3", "filename": "baldurs-gate-3.jpg"},
    {"name": "Resident Evil 4", "seed": "resident-evil-4", "filename": "resident-evil-4.jpg"},
    {"name": "God of War Ragnarök", "seed": "god-of-war-ragnarok", "filename": "god-of-war-ragnarok.jpg"},
    {"name": "The Last of Us Part I", "seed": "the-last-of-us-part-i", "filename": "the-last-of-us-part-i.jpg"},
    {"name": "Minecraft", "seed": "minecraft", "filename": "minecraft.jpg"},
    {"name": "EA Sports FC 24", "seed": "ea-sports-fc-26", "filename": "ea-sports-fc-26.jpg"},
    {"name": "Assassin's Creed Shadows", "fallback": "Assassin's Creed Mirage", "seed": "assassins-creed-shadows", "filename": "assassins-creed-shadows.jpg"},
    {"name": "Call of Duty: Black Ops 6", "fallback": "Call of Duty", "seed": "call-of-duty-black-ops-7", "filename": "call-of-duty-black-ops-7.jpg"},

    # PlayStation Exclusives & Classics
    {"name": "Marvel's Spider-Man 2", "seed": "spider-man-2", "filename": "spider-man-2.jpg"},
    {"name": "Ghost of Tsushima", "seed": "ghost-of-tsushima", "filename": "ghost-of-tsushima.jpg"},
    {"name": "Horizon Forbidden West", "seed": "horizon-forbidden-west", "filename": "horizon-forbidden-west.jpg"},
    {"name": "Stellar Blade", "seed": "stellar-blade", "filename": "stellar-blade.jpg"},
    {"name": "Demon's Souls", "seed": "demons-souls", "filename": "demons-souls.jpg"},
    {"name": "Astro Bot", "seed": "astro-bot", "filename": "astro-bot.jpg"},
    {"name": "The Last of Us Part II Remastered", "fallback": "The Last of Us Part II", "seed": "the-last-of-us-part-ii", "filename": "the-last-of-us-part-ii.jpg"},
    {"name": "Death Stranding 2", "fallback": "Death Stranding", "seed": "death-stranding-2", "filename": "death-stranding-2.jpg"},
    {"name": "Gran Turismo 7", "seed": "gran-turismo-7", "filename": "gran-turismo-7.jpg"},

    # Xbox Highlights
    {"name": "Halo Infinite", "seed": "halo-infinite", "filename": "halo-infinite.jpg"},
    {"name": "NBA 2K24", "seed": "nba-2k26", "filename": "nba-2k26.jpg"},
    {"name": "Mortal Kombat 1", "seed": "mortal-kombat-1", "filename": "mortal-kombat-1.jpg"},

    # Pre-Orders & Upcoming
    {"name": "Grand Theft Auto VI", "seed": "gta-vi", "filename": "gta-vi.jpg"},
    {"name": "Forza Horizon 5", "seed": "forza-horizon-6", "filename": "forza-horizon-6.jpg"},
    {"name": "Marvel's Wolverine", "seed": "marvels-wolverine", "filename": "marvels-wolverine.jpg"},
    {"name": "Call of Duty: Modern Warfare III", "seed": "cod-modern-warfare-4", "filename": "cod-modern-warfare-4.jpg"},
    {"name": "Project 007", "fallback": "GoldenEye 007", "seed": "007-first-light", "filename": "007-first-light.jpg"},
    {"name": "Ace Combat 7: Skies Unknown", "seed": "ace-combat-8", "filename": "ace-combat-8.jpg"},
    {"name": "Star Wars Episode I: Racer", "fallback": "Star Wars Outlaws", "seed": "star-wars-galactic-racer", "filename": "star-wars-galactic-racer.jpg"},
    {"name": "Star Wars Outlaws", "seed": "star-wars-zero-company", "filename": "star-wars-zero-company.jpg"},
    {"name": "EA Sports FC 25", "fallback": "EA Sports FC 24", "seed": "ea-sports-fc-27", "filename": "ea-sports-fc-27.jpg"},
    {"name": "Vampyr", "seed": "the-blood-of-dawnwalker", "filename": "the-blood-of-dawnwalker.jpg"},
    {"name": "Marvel vs. Capcom: Infinite", "seed": "marvel-tokon", "filename": "marvel-tokon.jpg"},

    # DLCs & Expansions
    {"name": "Cyberpunk 2077: Phantom Liberty", "seed": "cyberpunk-phantom-liberty", "filename": "cyberpunk-phantom-liberty.jpg"},
    {"name": "Elden Ring Shadow of the Erdtree", "fallback": "Elden Ring", "seed": "elden-ring-erdtree", "filename": "elden-ring-erdtree.jpg"}
]

def sanitize_filename(name: str) -> str:
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    return name.lower().replace(" ", "-")

def download_cover(game_item, output_folder: str, api_key: str):
    if isinstance(game_item, str):
        game_name = game_item
        file_name = f"{sanitize_filename(game_name)}.jpg"
        fallback_name = None
    else:
        game_name = game_item["name"]
        file_name = game_item.get("filename", f"{sanitize_filename(game_name)}.jpg")
        fallback_name = game_item.get("fallback")

    target_path = os.path.join(output_folder, file_name)
    public_path = os.path.join(PUBLIC_DIR, file_name)

    # Check if already downloaded
    if os.path.exists(target_path) and os.path.getsize(target_path) > 10000:
        if not os.path.exists(public_path):
            shutil.copy2(target_path, public_path)
        print(f"[EXISTS] {file_name} already present ({round(os.path.getsize(target_path)/1024, 1)} KB)")
        return

    search_url = "https://api.rawg.io/api/games"
    params = {
        "key": api_key,
        "search": game_name,
        "search_precise": "false",
        "page_size": 5
    }
    headers = {
        "User-Agent": "GameCoverDownloader/1.0"
    }

    try:
        response = requests.get(search_url, params=params, headers=headers, timeout=12)
        
        if response.status_code == 429:
            print(f"[!] Rate limited on '{game_name}'. Waiting 6 seconds before retrying...")
            time.sleep(6)
            return download_cover(game_item, output_folder, api_key)

        response.raise_for_status()
        data = response.json()
        results = data.get("results", [])

        # If not found and fallback exists, try fallback
        if not results and fallback_name:
            print(f"[~] Trying fallback '{fallback_name}' for '{game_name}'...")
            params["search"] = fallback_name
            response = requests.get(search_url, params=params, headers=headers, timeout=12)
            results = response.json().get("results", [])

        if not results:
            print(f"[x] Not found on RAWG: '{game_name}' (Check spelling)")
            return

        # Find the first entry that actually has an image URL
        image_url = None
        matched_title = ""
        for res in results:
            if res.get("background_image"):
                image_url = res.get("background_image")
                matched_title = res.get("name", game_name)
                break

        if not image_url:
            print(f"[x] No cover image found on RAWG for: '{game_name}'")
            return

        # Download the image
        img_res = requests.get(image_url, stream=True, timeout=15)
        img_res.raise_for_status()

        with open(target_path, "wb") as f:
            for chunk in img_res.iter_content(chunk_size=8192):
                f.write(chunk)

        # Copy to public/covers
        shutil.copy2(target_path, public_path)

        print(f"[OK] Downloaded: {file_name} (Matched: '{matched_title}')")

    except requests.exceptions.RequestException as e:
        print(f"[x] Network error on '{game_name}': {e}")
    except Exception as e:
        print(f"[x] Unexpected error on '{game_name}': {e}")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    if not os.path.exists(PUBLIC_DIR):
        os.makedirs(PUBLIC_DIR)

    print(f"Checking and downloading covers for {len(GAMES)} games...\n")
    for game in GAMES:
        download_cover(game, OUTPUT_DIR, API_KEY)
        time.sleep(1) # respectful pause to avoid rate limiting
    print("\nProcess finished! All covers synced to", OUTPUT_DIR, "and", PUBLIC_DIR)

if __name__ == "__main__":
    main()