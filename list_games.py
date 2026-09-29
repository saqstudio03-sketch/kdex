import glob
import re
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

games = []
for f in sorted(glob.glob('src/data/products.part*.ts')):
    content = open(f, encoding='utf-8').read()
    # Extract blocks
    blocks = re.findall(r'make\(\{\s*(.*?)\s*\}\)', content, re.DOTALL)
    for b in blocks:
        id_m = re.search(r'id:\s*["\'](.*?)["\']', b)
        title_m = re.search(r'title:\s*["\'](.*?)["\']', b)
        slug_m = re.search(r'slug:\s*["\'](.*?)["\']', b)
        seed_m = re.search(r'imageSeed:\s*["\'](.*?)["\']', b)
        if title_m and slug_m:
            games.append({
                "id": id_m.group(1) if id_m else "",
                "title": title_m.group(1),
                "slug": slug_m.group(1),
                "seed": seed_m.group(1) if seed_m else slug_m.group(1)
            })

with open("all_games.json", "w", encoding="utf-8") as out:
    json.dump(games, out, indent=2)

print(f"Total games saved: {len(games)}")
for g in games:
    print(f"{g['id']:<8} | {g['title']:<35} | {g['seed']}")
