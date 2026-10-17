"""Print a use_figma script that creates one frame per data file, laid out in pairs (desktop | mobile) per page."""
import json, os, glob
OUT = os.path.dirname(os.path.abspath(__file__))
items = []
for f in sorted(glob.glob(os.path.join(OUT, 'data', '*.json'))):
    d = json.load(open(f)); key = os.path.basename(f)[:-5]
    items.append({'k': key, 'n': d['name'], 'p': d['path'], 'w': d['w'], 'h': d['h'], 'vp': d['vp']})
pages = sorted({i['k'][:-1] for i in items})
col = 1440 + 120 + 390 + 400
for i in items:
    idx = pages.index(i['k'][:-1])
    i['x'] = idx * col + (0 if i['vp'] == 'D' else 1440 + 120); i['y'] = 0
print('const L=' + json.dumps(items, separators=(',', ':')) + ''';
const P=await figma.getNodeByIdAsync('461:2'); await figma.setCurrentPageAsync(P);
for(const c of P.children.slice()) c.remove();
await figma.loadFontAsync({family:'Fira Sans',style:'Medium'});await figma.loadFontAsync({family:'Fira Sans',style:'Regular'});
const out={};
for(const it of L){
  const F=figma.createFrame(); F.name=it.n; F.x=it.x; F.y=it.y; F.resize(it.w,it.h); F.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}]; F.clipsContent=true; out[it.k]=F.id;
  const lab=figma.createText(); lab.fontName={family:'Fira Sans',style:'Medium'}; lab.characters=it.n+'   '+it.p; lab.fontSize=28; lab.x=it.x; lab.y=-70; lab.fills=[{type:'SOLID',color:{r:0.12,g:0.21,b:0.37}}]; P.appendChild(lab);
}
const note=figma.createText(); note.fontName={family:'Fira Sans',style:'Regular'}; note.fontSize=20; note.x=0; note.y=-170; note.characters='Build reference — captured from the preview build (git '+GIT+') on '+WHEN+'. Text, boxes and icons are live layers; photos and gradient bands are image fills. Rebuild from the code, not this page.'; note.fills=[{type:'SOLID',color:{r:0.34,g:0.38,b:0.43}}];
return out;''')
