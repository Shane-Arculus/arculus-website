// Figma use_figma script that built the Performance chart v2 frames (23 Sep 2026). Replace the D = {...} series (months, bars from workbook column AC, RY/YTM/BBSW) and the axis constants, run via the Figma MCP, export at 2x. Kept here as the regeneration recipe for docs/MONTHLY.md Step 2.
const D = {"months":["Dec 2022","Jan 2023","Feb 2023","Mar 2023","Apr 2023","May 2023","Jun 2023","Jul 2023","Aug 2023","Sep 2023","Oct 2023","Nov 2023","Dec 2023","Jan 2024","Feb 2024","Mar 2024","Apr 2024","May 2024","Jun 2024","Jul 2024","Aug 2024","Sep 2024","Oct 2024","Nov 2024","Dec 2024","Jan 2025","Feb 2025","Mar 2025","Apr 2025","May 2025","Jun 2025","Jul 2025","Aug 2025","Sep 2025","Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026"],"bars":[-0.51,0.86,1.83,2.33,3.85,3.88,5.55,5.46,5.26,6.05,5.95,5.69,6.32,5.69,5.71,6.37,5.82,7.12,6.44,6.85,6.79,7.47,7.62,7.44,6.3,6.26,6.38,6.12,6.34,5.92,6.36,5.71,5.8,4.95,4.94,4.71,3.79,3.82,3.53,2.89,3.36,3.88,3.86],"RY":[5.68,5.57,5.68,6.06,6.24,6.31,6.65,6.59,6.47,6.58,6.38,6.54,6.94,6.91,6.93,6.99,6.67,6.72,6.68,6.82,6.85,7.09,7.18,7.32,7.36,7.31,7.34,7.53,7.13,6.89,6.75,6.92,5.98,5.28,5.97,6.72,6.52,6.53,6.18,6.88,6.9,7.19,7.18],"YTM":[6.35,6.01,6.16,6.95,6.85,7.15,7.42,6.75,8.1,9.65,13.74,7.96,8.62,8.99,9.17,9.68,9.45,9.5,8.06,8.87,7.82,7.92,7.87,8.04,8.16,8.17,9.71,9.44,7.47,7.27,7.85,7.18,8.44,8.46,7.48,7.23,7.95,7.37,6.97,7.51,7.59,9.63,7.99],"BBSW":[1.25,1.51,1.75,2.03,2.36,2.63,2.88,3.14,3.36,3.55,3.65,3.74,3.87,3.99,4.1,4.17,4.23,4.31,4.36,4.36,4.38,4.4,4.44,4.46,4.46,4.48,4.47,4.46,4.46,4.42,4.38,4.32,4.25,4.18,4.11,4.03,3.96,3.88,3.83,3.8,3.78,3.78,3.86]};
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('74:3'));
const SB = {family:'Fira Sans',style:'SemiBold'}, RG = {family:'Fira Sans',style:'Regular'}, MD={family:'Fira Sans',style:'Medium'};
await figma.loadFontAsync(SB); await figma.loadFontAsync(RG); await figma.loadFontAsync(MD);
const hex = h => ({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const C = {navyMid:'#0B2545', body:'#57626D', line:'#EBE5DE', bar:'#DFC6AD', ry:'#B6432F', ytm:'#EC7826', bbsw:'#1E355E', axis:'#D2D5D9'};
const solid = h => [{type:'SOLID',color:hex(h)}];
// placement: right of everything on the page
let maxX = -Infinity, pifY = 0; for (const c of figma.currentPage.children){ maxX=Math.max(maxX,c.x+c.width); if (c.name.includes('Preferred') || c.name.includes('PIF')) pifY = c.y; }
const W=664, H=440;
const root = figma.createFrame(); root.name='Performance chart v2 · PIF (Jun 2026)'; root.resize(W,H); root.fills=[]; root.x=Math.round(maxX+200); root.y=Math.round(pifY||0); figma.currentPage.appendChild(root);
const txt = (chars, font, size, color, x, y, w, align) => { const t=figma.createText(); t.fontName=font; t.characters=chars; t.fontSize=size; t.fills=solid(color); t.textAutoResize='WIDTH_AND_HEIGHT'; root.appendChild(t); if (w!==undefined){ t.textAutoResize='HEIGHT'; t.resize(w, t.height); t.textAlignHorizontal=align||'LEFT'; } t.x=x; t.y=y; return t; };
txt('Performance Comparison', SB, 16, C.navyMid, 0, 0);
// plot geometry
const L=44, R=44, top=40, plotH=250, plotW=W-L-R, bottom=top+plotH;
const yL = v => top + (16 - v)/20*plotH;   // left axis: yields, 16 .. -4
const yR = v => top + (12 - v)/16*plotH;   // right axis: 1-year return, 12 .. -4
// gridlines + left labels every 4%, right labels at their own values
const gridG = figma.createFrame(); gridG.name='Grid'; gridG.fills=[]; gridG.resize(W,H); gridG.x=0; gridG.y=0; root.appendChild(gridG); gridG.clipsContent=false;
for (const v of [16,12,8,4,0,-4]) { const l=figma.createRectangle(); l.resize(plotW,1); l.x=L; l.y=Math.round(yL(v)); l.fills=solid(v===0?C.axis:C.line); gridG.appendChild(l); const t=txt(`${v}%`,RG,11,C.body,0,yL(v)-7,L-8,'RIGHT'); }
for (const v of [12,8,4,0,-4]) { txt(`${v}%`,RG,11,C.body,W-R+8,yR(v)-7,R-8,'LEFT'); }
// bars
const n=D.months.length, slot=plotW/n, bw=Math.max(6,Math.floor(slot*0.6));
const barsG = figma.createFrame(); barsG.name='Bars · 1-year total return'; barsG.fills=[]; barsG.resize(W,H); barsG.x=0; barsG.y=0; barsG.clipsContent=false; root.appendChild(barsG);
D.bars.forEach((v,i)=>{ const r=figma.createRectangle(); const y0=yR(0), y1=yR(v); r.resize(bw, Math.max(1,Math.abs(y1-y0))); r.x=L+i*slot+(slot-bw)/2; r.y=Math.min(y0,y1); r.fills=solid(C.bar); r.name=`${D.months[i]} ${v}%`; barsG.appendChild(r); });
// lines
const cx = i => L + i*slot + slot/2;
const line = (name, vals, color) => { const v=figma.createVector(); v.name=name; root.appendChild(v); let d=''; vals.forEach((val,i)=>{ if(val===null) return; d += (d?' L ':'M ') + cx(i).toFixed(2)+' '+yL(val).toFixed(2); }); v.vectorPaths=[{windingRule:'NONE',data:d}]; v.strokes=solid(color); v.strokeWeight=2; v.strokeCap='ROUND'; v.strokeJoin='ROUND'; v.fills=[]; v.x=0; v.y=0; return v.id; };
const ids=[line('Running yield',D.RY,C.ry), line('Yield to maturity',D.YTM,C.ytm), line('90-day BBSW',D.BBSW,C.bbsw)];
// x labels every 6 months
D.months.forEach((m,i)=>{ if(i%6===0){ const [mon,yr]=m.split(' '); txt(`${mon} ${yr.slice(2)}`,RG,11,C.body,cx(i)-24,bottom+10,48,'CENTER'); } });
// axis captions
txt('Yields and BBSW',RG,10,C.body,0,top-22); txt('1-year total return',RG,10,C.body,W-90,top-22,90,'RIGHT');
// legend
const leg = figma.createAutoLayout('HORIZONTAL',{name:'Legend',itemSpacing:24}); leg.fills=[]; root.appendChild(leg);
const item=(label,color,isBar)=>{ const it=figma.createAutoLayout('HORIZONTAL',{itemSpacing:8}); it.fills=[]; it.counterAxisAlignItems='CENTER'; const sw=figma.createRectangle(); sw.resize(isBar?16:16, isBar?12:3); sw.fills=solid(color); sw.cornerRadius=isBar?2:1.5; it.appendChild(sw); const t=figma.createText(); t.fontName=RG; t.characters=label; t.fontSize=12; t.fills=solid(C.body); it.appendChild(t); leg.appendChild(it); };
item('1-year total return',C.bar,true); item('Running yield',C.ry); item('Yield to maturity',C.ytm); item('90-day BBSW',C.bbsw);
leg.x=Math.round((W-leg.width)/2); leg.y=bottom+40;
const note=txt('Source: Arculus. Bars from the fund performance workbook (1-year total return, right axis). Yield lines traced from the June 2026 report chart pending Renny\'s series (left axis).',RG,9,C.body,0,bottom+72,W);
note.name='_note (delete before export)';
return {rootId:root.id, x:root.x, y:root.y, lineIds:ids, bars:D.bars.length, screenshot: await root.screenshot({scale:1})};
