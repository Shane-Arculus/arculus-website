// Figma use_figma script: builds a "Performance chart v2" frame from data. Replace D (months: bars = workbook
// column AC as %, optional bars2 = column BH (1-year return incl. franking, PIF only), RY/YTM/BBSW from Renny's
// series or the report), set P (fund, label, axes, tickEvery), run through the Figma
// MCP on page "04 · V1 Layouts", then export at 2x PNG with the _note layer hidden, trim below the legend (360px @1x),
// WebP q90 -> public/charts/<fund>-<yyyy-mm>.webp. See docs/MONTHLY.md stage 1.
const D = __DATA__;
const P = __PARAMS__; // {fund:'PIF', label:'Aug 2026', Lmax:12, Lmin:0, Rmax:8, Rmin:0, leftTicks:[12,9,6,3,0], rightTicks:[8,6,4,2,0], tickEvery:3, belowId:'346:9503'}
// AFI (43 months, one bar series): Lmax:8, Lmin:0, Rmax:8, Rmin:-4, leftTicks:[8,6,4,2,0], rightTicks:[8,4,0,-4], tickEvery:6
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('74:3'));
const SB={family:'Fira Sans',style:'SemiBold'}, RG={family:'Fira Sans',style:'Regular'};
await figma.loadFontAsync(SB); await figma.loadFontAsync(RG);
const hex=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const C={navyMid:'#0B2545',body:'#57626D',line:'#EBE5DE',bar:'#DFC6AD',bar2:'#8D93AC',ry:'#B6432F',ytm:'#EC7826',bbsw:'#1E355E',axis:'#D2D5D9'};
const solid=h=>[{type:'SOLID',color:hex(h)}];
const W=664,H=440;
const anchor=await figma.getNodeByIdAsync(P.belowId);
const root=figma.createFrame(); root.name=`Performance chart v2 · ${P.fund} (${P.label})`; root.resize(W,H); root.fills=[]; root.x=anchor?anchor.x+W+120:0; root.y=anchor?anchor.y:0; figma.currentPage.appendChild(root);
const txt=(chars,font,size,color,x,y,w,align)=>{const t=figma.createText(); t.fontName=font; t.characters=chars; t.fontSize=size; t.fills=solid(color); t.textAutoResize='WIDTH_AND_HEIGHT'; root.appendChild(t); if(w!==undefined){t.textAutoResize='HEIGHT'; t.resize(w,t.height); t.textAlignHorizontal=align||'LEFT';} t.x=x; t.y=y; return t;};
txt('Performance Comparison',SB,16,C.navyMid,0,0);
const L=44,R=44,top=40,plotH=250,plotW=W-L-R,bottom=top+plotH;
const yL=v=>top+(P.Lmax-v)/(P.Lmax-P.Lmin)*plotH, yR=v=>top+(P.Rmax-v)/(P.Rmax-P.Rmin)*plotH;
const gridG=figma.createFrame(); gridG.name='Grid'; gridG.fills=[]; gridG.resize(W,H); gridG.x=0; gridG.y=0; gridG.clipsContent=false; root.appendChild(gridG);
for (const v of P.leftTicks){ const l=figma.createRectangle(); l.resize(plotW,1); l.x=L; l.y=Math.round(yL(v)); l.fills=solid(C.line); gridG.appendChild(l); txt(`${v}%`,RG,11,C.body,0,yL(v)-7,L-8,'RIGHT'); }
const z=figma.createRectangle(); z.resize(plotW,1); z.x=L; z.y=Math.round(yR(0)); z.fills=solid(C.axis); z.name='zero (right axis)'; gridG.appendChild(z);
for (const v of P.rightTicks) txt(`${v}%`,RG,11,C.body,W-R+8,yR(v)-7,R-8,'LEFT');
const n=D.months.length, slot=plotW/n, grouped=Array.isArray(D.bars2), gap=2;
const bw=grouped?Math.max(4,Math.floor((slot*0.72-gap)/2)):Math.max(6,Math.floor(slot*0.6));
const drawBars=(name,vals,color,offset)=>{const g=figma.createFrame(); g.name=name; g.fills=[]; g.resize(W,H); g.x=0; g.y=0; g.clipsContent=false; root.appendChild(g);
 vals.forEach((v,i)=>{const r=figma.createRectangle(); const y0=yR(0),y1=yR(v); r.resize(bw,Math.max(1,Math.abs(y1-y0))); r.x=L+i*slot+offset; r.y=Math.min(y0,y1); r.fills=solid(color); r.name=`${D.months[i]} ${v}%`; g.appendChild(r);});};
if(grouped){ const groupW=bw*2+gap, x0=(slot-groupW)/2; drawBars('Bars · 1-year return incl. franking',D.bars2,C.bar2,x0); drawBars('Bars · 1-year total return',D.bars,C.bar,x0+bw+gap); }
else drawBars('Bars · 1-year total return',D.bars,C.bar,(slot-bw)/2);
const cx=i=>L+i*slot+slot/2;
const line=(name,vals,color)=>{const v=figma.createVector(); v.name=name; root.appendChild(v); let d='',minX=Infinity,minY=Infinity; vals.forEach((val,i)=>{ if(val===null) return; const X=cx(i),Y=yL(val); minX=Math.min(minX,X); minY=Math.min(minY,Y); d+=(d?' L ':'M ')+X.toFixed(2)+' '+Y.toFixed(2);}); v.vectorPaths=[{windingRule:'NONE',data:d}]; v.strokes=solid(color); v.strokeWeight=2; v.strokeCap='ROUND'; v.strokeJoin='ROUND'; v.fills=[]; v.x=minX-1; v.y=minY-1; return v.id;};
line('Running yield',D.RY,C.ry); line('Yield to maturity',D.YTM,C.ytm); line('90-day BBSW',D.BBSW,C.bbsw);
const every=P.tickEvery||6;
const phase=(D.months.length-1)%every; // labels anchored so the last month is always labelled
D.months.forEach((m,i)=>{ if(i%every===phase){ const [mon,yr]=m.split(' '); txt(`${mon} ${yr.slice(2)}`,RG,11,C.body,cx(i)-24,bottom+10,48,'CENTER'); } });
txt('Yields and BBSW',RG,10,C.body,0,top-22); txt(grouped?'1-year return':'1-year total return',RG,10,C.body,W-90,top-22,90,'RIGHT');
const leg=figma.createAutoLayout('HORIZONTAL',{name:'Legend',itemSpacing:grouped?16:24}); const legSize=grouped?11:12; leg.fills=[]; root.appendChild(leg);
const item=(label,color,isBar)=>{const it=figma.createAutoLayout('HORIZONTAL',{itemSpacing:8}); it.fills=[]; it.counterAxisAlignItems='CENTER'; const sw=figma.createRectangle(); sw.resize(16,isBar?12:3); sw.fills=solid(color); sw.cornerRadius=isBar?2:1.5; it.appendChild(sw); const t=figma.createText(); t.fontName=RG; t.characters=label; t.fontSize=legSize; t.fills=solid(C.body); it.appendChild(t); leg.appendChild(it);};
if(grouped) item('1-year return + franking',C.bar2,true);
item('1-year total return',C.bar,true); item('Running yield',C.ry); item('Yield to maturity',C.ytm); item('90-day BBSW',C.bbsw);
leg.x=Math.round((W-leg.width)/2); leg.y=bottom+40;
const note=txt(`_note: ${D._source||''}`,RG,9,C.body,0,bottom+72,W); note.name='_note (hide before export)'; note.visible=false;
root.exportSettings=[{format:'PNG',constraint:{type:'SCALE',value:2}}];
return {rootId:root.id,x:root.x,y:root.y,legendWidth:leg.width,screenshot:await root.screenshot({scale:1})};
