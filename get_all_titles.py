import glob
import re
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

unique_games = {}
for f in sorted(glob.glob('src/data/products.part*.ts')):
    content = open(f, encoding='utf-8').read()
    blocks = content.split("make({")
    for b in blocks[1:]:
        # Find title
        t_match = re.search(r'title:\s*"([^"]+)"', b)
        s_match = re.search(r'slug:\s*"([^"]+)"', b)
        seed_match = re.search(r'imageSeed:\s*"([^"]+)"', b)
        id_match = re.search(r'id:\s*"([^"]+)"', b)
        if t_match and s_match:
            title = t_match.group(1)
            slug = s_match.group(1)
            seed = seed_match.group(1) if seed_match else slug
            gid = id_match.group(1) if id_match else ''
            if seed not in unique_games:
                unique_games[seed] = {
                    "title": title,
                    "slug": slug,
                    "seed": seed,
                    "id": gid
                }

print(f"Total unique game seeds: {len(unique_games)}")
with open("unique_catalog_games.json", "w", encoding="utf-8") as out:
    json.dump(unique_games, out, indent=2)

for s, g in sorted(unique_games.items()):
    print(f"{s:<30} -> {g['title']}")
