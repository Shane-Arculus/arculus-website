"""POST queued images to Figma upload URLs.
usage: post.py urls.json   (urls.json = [{"file":..., "url":...}, ...]) → appends to hashes.json"""
import json, os, sys, subprocess, concurrent.futures as cf
OUT = os.path.dirname(os.path.abspath(__file__))
jobs = json.load(open(sys.argv[1]))
hp = os.path.join(OUT, 'hashes.json')
hashes = json.load(open(hp)) if os.path.exists(hp) else {}
def go(j):
    f = os.path.join(OUT, j['file']) if j['file'].startswith('payload/') else os.path.join(OUT, 'img', j['file'])
    ct = 'image/png' if f.endswith('.png') else 'image/jpeg'
    r = subprocess.run(['curl', '-sS', '-X', 'POST', '-F', f'file=@{f};type={ct}', j['url']], capture_output=True, text=True, timeout=120)
    try: return j['file'], json.loads(r.stdout)['imageHash']
    except Exception: return j['file'], None
with cf.ThreadPoolExecutor(8) as ex:
    for f, h in ex.map(go, jobs):
        if h: hashes[f] = h
        else: print('FAILED', f)
json.dump(hashes, open(hp, 'w'), indent=0)
print('hashes', len(hashes))
