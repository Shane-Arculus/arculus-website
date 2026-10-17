"""make_jobs.py count            → print how many images still need uploading
   make_jobs.py uuids.txt        → pair the next pending files with these upload UUIDs → jobs.json
   make_jobs.py --payload uuids.txt → same for payload/*.png (data files), keyed 'payload/<key>.png'"""
import json, os, glob, sys
OUT = os.path.dirname(os.path.abspath(__file__))
hp = os.path.join(OUT, 'hashes.json')
hashes = json.load(open(hp)) if os.path.exists(hp) else {}
if sys.argv[1] == '--payload':
    pending = [('payload/' + os.path.basename(p)) for p in sorted(glob.glob(os.path.join(OUT, 'payload', '*.png')))]
    uu = sys.argv[2]
else:
    need = set()
    for f in glob.glob(os.path.join(OUT, 'data', '*.json')):
        for s in json.load(open(f))['sections']:
            for n in s['nodes']:
                if n['k'] == 'i': need.add(n['file'])
    pending = sorted(need - set(hashes))
    if sys.argv[1] == 'count': print(len(pending)); sys.exit()
    uu = sys.argv[1]
uuids = [l.strip() for l in open(uu) if l.strip()]
jobs = [{'file': f if f.startswith('payload/') else f, 'url': f'https://mcp.figma.com/mcp/upload/{u}/submit?scaleMode=FILL&currentPageId=461%3A2'} for f, u in zip(pending, uuids)]
json.dump(jobs, open(os.path.join(OUT, 'jobs.json'), 'w'))
print('jobs', len(jobs), 'of pending', len(pending))
