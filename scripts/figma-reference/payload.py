"""Build one packed PNG payload per data file → payload/<key>.png (needs hashes.json, frames.json)."""
import json, os, glob, sys
from pack import pack
OUT = os.path.dirname(os.path.abspath(__file__))
hashes = json.load(open(os.path.join(OUT, 'hashes.json')))
os.makedirs(os.path.join(OUT, 'payload'), exist_ok=True)
GENERIC = {'div', 'section', 'li', 'a', 'span', 'ul', 'nav', 'header', 'footer', 'article', 'p', 'aside', 'form', 'fieldset', 'label', 'button', 'input', 'select', 'textarea', 'main', 'figure', 'blockquote', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'details', 'summary', 'h1', 'h2', 'h3', 'h4', 'ol', 'dl', 'dt', 'dd', 'time'}
def hx(c):
    if not c: return None
    r, g, b, a = c
    s = '#%02x%02x%02x' % (round(r * 255), round(g * 255), round(b * 255))
    return s if a >= 0.999 else s + '%02x' % round(a * 255)
missing = set()
for f in sorted(glob.glob(os.path.join(OUT, 'data', '*.json'))):
    key = os.path.basename(f)[:-5]
    if sys.argv[1:] and key not in sys.argv[1:]: continue
    d = json.load(open(f)); svgs = []; sidx = {}
    secs = []
    for s in d['sections']:
        ns = []
        for n in s['nodes']:
            k = n['k']; o = {'k': k, 'x': n['x'], 'y': n['y'], 'w': n['w'], 'h': n['h']}
            if n.get('o') is not None and n['o'] < 0.999: o['o'] = n['o']
            if k == 'r':
                o['fl'] = hx(n.get('fill'))
                if n.get('br') and any(n['br']): m = min(n['w'], n['h']) / 2; o['br'] = [round(min(v, m), 1) for v in n['br']]
                if n.get('bw'): o['bw'] = n['bw']; o['bc'] = hx(n['bc'])
                nm = n.get('n') or ''
                if nm and nm not in GENERIC: o['nm'] = nm[:60]
                elif nm == 'a' or nm == 'button': o['nm'] = 'button'
                elif nm == 'li' or nm == 'article': o['nm'] = 'card'
            elif k == 'i':
                if n['file'] not in hashes: missing.add(n['file']); continue
                o['ih'] = hashes[n['file']]; o['nm'] = (n.get('n') or 'image')[:60]
            elif k == 's':
                if n['svg'] not in sidx: sidx[n['svg']] = len(svgs); svgs.append(n['svg'])
                o['v'] = sidx[n['svg']]
            elif k == 't':
                rs = []
                for r in n['rs']:
                    rr = {'f': r['f'], 's': r['s'], 'c': hx(r['c'])}
                    if r.get('u'): rr['u'] = 1
                    if len(n['rs']) > 1: rr['a'] = r['a']; rr['b'] = r['b']
                    rs.append(rr)
                o.update({'t': n['t'], 'lh': n['lh'], 'al': n['al'], 'rs': rs})
                if n.get('ls'): o['ls'] = n['ls']
            ns.append(o)
        secs.append({'nm': s['name'], 'x': 0, 'y': round(s['y'], 1), 'w': s['w'], 'h': s['h'], 'n': ns})
    payload = json.dumps({'v': svgs, 's': secs}, separators=(',', ':'), ensure_ascii=False).encode()
    pack(payload, os.path.join(OUT, 'payload', f'{key}.png'))
    print(key, len(payload))
if missing: print('MISSING IMAGES', len(missing))
