import json, sys, hashlib, io, os
from playwright.sync_api import sync_playwright
from PIL import Image
BASE='http://localhost:4324'
OUT=os.path.dirname(os.path.abspath(__file__))
ROUTES=[('01 Home','/'),('02 Fixed Income Fund','/funds/arculus-fixed-income-fund/'),('03 Preferred Income Fund','/funds/arculus-preferred-income-fund/'),
('04 Wholesale','/wholesale/'),('05 Wholesale A- SMA','/wholesale/a-minus-sma/'),('06 Wholesale BBB SMA','/wholesale/bbb-sma/'),('07 Wholesale PEP','/wholesale/protected-equity-portfolio/'),
('08 Investment Management','/investment-management/'),('09 About Our approach','/about/our-approach/'),('10 About Governance','/about/governance-and-oversight/'),('11 About Team','/about/team/'),('12 About ESG','/about/esg/'),
('13 Insights hub','/insights/'),('14 Insight article','/insights/japan-at-the-turn/'),('15 Contact','/contact/'),('16 Document library','/documents/'),
('17 Terms','/terms/'),('18 Privacy','/privacy/'),('19 Cookies','/cookies/'),('20 Disclosure','/disclosure/'),('21 Search','/search/'),('22 404','/404.html')]
only=sys.argv[1:]
skip=set(os.listdir(os.path.join(OUT,'data'))) if os.environ.get('RESUME') else set()
JS=open(os.path.join(OUT,'collect.js')).read()
os.makedirs(os.path.join(OUT,'img'),exist_ok=True); os.makedirs(os.path.join(OUT,'data'),exist_ok=True)
index=json.load(open(os.path.join(OUT,'images.json'))) if os.path.exists(os.path.join(OUT,'images.json')) else {}
with sync_playwright() as p:
    b=p.chromium.launch()
    for vw,tag in [(1440,'D'),(390,'M')]:
        ctx=b.new_context(viewport={'width':vw,'height':900},device_scale_factor=2)
        ctx.add_init_script("try{sessionStorage.setItem('arculus-wholesale-attested','1')}catch(e){}")
        for name,path in ROUTES:
            if only and not any(o in name for o in only): continue
            if f'{name.split()[0]}{tag}.json' in skip: continue
            pg=ctx.new_page(); pg.goto(BASE+path,wait_until='networkidle')
            pg.evaluate("document.fonts.ready")
            h=pg.evaluate("document.documentElement.scrollHeight")
            for yy in range(0,h,700): pg.evaluate(f"window.scrollTo(0,{yy})"); pg.wait_for_timeout(60)
            pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(300)
            try: pg.wait_for_function("Array.from(document.images).every(i=>i.complete)",timeout=15000)
            except Exception: print('  (images still loading, continuing)',flush=True)
            data=pg.evaluate(JS)
            for r in data['rasters']:
                css="*{visibility:hidden!important;transition:none!important;animation:none!important;caret-color:transparent!important}html,body{background:transparent!important}clipPath,clipPath *,mask,mask *,defs,defs *{visibility:visible!important}"+f'[data-ras="{r["id"]}"]{{visibility:visible!important}}'
                if r['mode']=='self': css+=f'[data-ras="{r["id"]}"] *{{visibility:visible!important}}'
                h_=pg.add_style_tag(content=css)
                clip={'x':max(0,r['x']),'y':max(0,r['y']),'width':max(1,min(r['w'],vw-max(0,r['x']))),'height':max(1,r['h'])}
                png=pg.screenshot(full_page=True,clip=clip,omit_background=True)
                h_.evaluate("e=>e.remove()")
                im=Image.open(io.BytesIO(png)).convert('RGBA')
                alpha=im.getchannel('A').getextrema()
                if alpha==(0,0): r['empty']=1; continue
                buf=io.BytesIO()
                if alpha[0]==255: im.convert('RGB').save(buf,'JPEG',quality=86); ext='jpg'
                else: im.save(buf,'PNG',optimize=True); ext='png'
                byts=buf.getvalue(); hsh=hashlib.sha1(byts).hexdigest()[:16]
                fn=f'{hsh}.{ext}'
                if not os.path.exists(os.path.join(OUT,'img',fn)): open(os.path.join(OUT,'img',fn),'wb').write(byts)
                r['file']=fn
            # attach file to nodes; drop empty rasters
            rmap={r['id']:r for r in data['rasters']}
            for s in data['sections']:
                s['nodes']=[n for n in s['nodes'] if not (n['k']=='i' and (rmap[n['id']].get('empty') or 'file' not in rmap[n['id']]))]
                for n in s['nodes']:
                    if n['k']=='i': n['file']=rmap[n['id']]['file']; del n['id']
            del data['rasters']
            data['name']=f'{name} — {"Desktop" if tag=="D" else "Mobile"}'; data['path']=path; data['vp']=tag
            json.dump(data,open(os.path.join(OUT,'data',f'{name.split()[0]}{tag}.json'),'w'))
            print(name,tag,'sections',len(data['sections']),'nodes',sum(len(s['nodes']) for s in data['sections']),'h',data['h'],flush=True)
            pg.close()
        ctx.close()
    b.close()
