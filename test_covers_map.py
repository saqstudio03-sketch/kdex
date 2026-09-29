import json, glob, os, re

files = set(os.path.basename(f) for f in glob.glob('public/covers/*.jpg'))

games = json.load(open('unique_catalog_games.json', encoding='utf-8'))

with open('src/lib/gameImages.ts', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'"([^"]+)":\s*"([^"]+)"', text)
local_map = {k: v for k, v in matches}

missing_keys = []
for seed, g in games.items():
    if seed in ['kdex-gift-card-1000', 'kdex-play-3-months']:
        continue
    cleaned = seed.replace('-pc', '').replace('-ps5', '').replace('-xbox', '')
    found = seed in local_map or g['slug'] in local_map or cleaned in local_map
    if not found:
        missing_keys.append((seed, g['slug'], g['title']))

print('Games missing in LOCAL_COVERS:', missing_keys)
print(f'Total mapped keys in LOCAL_COVERS: {len(local_map)}')
