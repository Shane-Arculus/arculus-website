const P=await figma.getNodeByIdAsync('461:2'); await figma.setCurrentPageAsync(P);
const u32=(b,i)=>(b[i]<<24|b[i+1]<<16|b[i+2]<<8|b[i+3])>>>0;
const utf8=a=>{let s='',i=0,parts=[];while(i<a.length){const c=a[i++];if(c<128)s+=String.fromCharCode(c);else if(c<224)s+=String.fromCharCode((c&31)<<6|a[i++]&63);else if(c<240)s+=String.fromCharCode((c&15)<<12|(a[i++]&63)<<6|a[i++]&63);else{const cp=((c&7)<<18|(a[i++]&63)<<12|(a[i++]&63)<<6|a[i++]&63)-0x10000;s+=String.fromCharCode(0xD800+(cp>>10),0xDC00+(cp&1023));}if(s.length>8192){parts.push(s);s='';}}parts.push(s);return parts.join('');};
async function load(hash){const b=await figma.getImageByHash(hash).getBytesAsync();let p=8,W=0,idat=[];
  while(p<b.length){const len=u32(b,p),t=String.fromCharCode(b[p+4],b[p+5],b[p+6],b[p+7]);if(t==='IHDR')W=u32(b,p+8);if(t==='IDAT')idat.push(b.subarray(p+8,p+8+len));p+=12+len;}
  const z=new Uint8Array(idat.reduce((a,c)=>a+c.length,0));{let o=0;for(const c of idat){z.set(c,o);o+=c.length;}}
  let q=2;const raw=[];while(true){const fin=z[q]&1;q+=1;const len=z[q]|z[q+1]<<8;q+=4;raw.push(z.subarray(q,q+len));q+=len;if(fin)break;}
  const r=new Uint8Array(raw.reduce((a,c)=>a+c.length,0));{let o=0;for(const c of raw){r.set(c,o);o+=c.length;}}
  const rows=r.length/(W+1);const out=new Uint8Array(rows*W);for(let i=0;i<rows;i++)out.set(r.subarray(i*(W+1)+1,(i+1)*(W+1)),i*W);
  const n=u32(out,0);return JSON.parse(utf8(out.subarray(4,4+n)));}
const hx=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255,a:h.length>7?parseInt(h.slice(7,9),16)/255:1});
const sol=h=>{const c=hx(h);return {type:'SOLID',color:{r:c.r,g:c.g,b:c.b},opacity:c.a};};
const ok=new Set();for(const f of ['Regular','Medium','SemiBold','Bold','Italic','Medium Italic','Light','ExtraBold']){try{await figma.loadFontAsync({family:'Fira Sans',style:f});ok.add(f);}catch(e){}}
const fn=f=>({family:'Fira Sans',style:ok.has(f)?f:'Regular'});
const report=[];
for(const job of JOBS){
  const D=await load(job.h);const F=await figma.getNodeByIdAsync(job.f);if(!F){report.push({f:job.f,err:'no frame'});continue;}
  for(const c of F.children.slice())c.remove();
  let made=0;const errs=[];
  for(const s of D.s){
    const S=figma.createFrame();S.name=s.nm;F.appendChild(S);S.x=s.x;S.y=s.y;S.resize(Math.max(1,s.w),Math.max(1,s.h));S.fills=[];S.clipsContent=false;
    for(const n of s.n){try{
      let N;
      if(n.k==='r'){N=figma.createRectangle();N.resize(Math.max(.01,n.w),Math.max(.01,n.h));N.fills=n.fl?[sol(n.fl)]:[];
        if(n.br){N.topLeftRadius=n.br[0];N.topRightRadius=n.br[1];N.bottomRightRadius=n.br[2];N.bottomLeftRadius=n.br[3];}
        if(n.bw){N.strokes=[sol(n.bc)];N.strokeAlign='INSIDE';N.strokeTopWeight=n.bw[0];N.strokeRightWeight=n.bw[1];N.strokeBottomWeight=n.bw[2];N.strokeLeftWeight=n.bw[3];}
        N.name=n.nm||'box';}
      else if(n.k==='i'){N=figma.createRectangle();N.resize(Math.max(.01,n.w),Math.max(.01,n.h));N.fills=[{type:'IMAGE',imageHash:n.ih,scaleMode:'FILL'}];N.name=n.nm||'image';}
      else if(n.k==='s'){N=figma.createNodeFromSvg(D.v[n.v]);N.name='icon';N.resize(Math.max(.01,n.w),Math.max(.01,n.h));}
      else if(n.k==='t'){N=figma.createText();const r0=n.rs[0];N.fontName=fn(r0.f);N.characters=n.t;N.fontSize=r0.s;N.fills=[sol(r0.c)];
        N.lineHeight={unit:'PIXELS',value:n.lh};if(n.ls)N.letterSpacing={unit:'PIXELS',value:n.ls};N.textAlignHorizontal=n.al||'LEFT';
        if(n.rs.length>1||r0.u)for(const r of n.rs){const a=r.a||0,b=r.b==null?n.t.length:r.b;if(b<=a||b>n.t.length)continue;N.setRangeFontName(a,b,fn(r.f));N.setRangeFontSize(a,b,r.s);N.setRangeFills(a,b,[sol(r.c)]);if(r.u)N.setRangeTextDecoration(a,b,'UNDERLINE');}
        const single=!n.t.includes('\n')&&n.h<=n.lh*1.5;
        if(single){N.textAutoResize='WIDTH_AND_HEIGHT';}else{N.resize(Math.max(1,n.w),Math.max(1,n.h));N.textAutoResize='HEIGHT';}}
      S.appendChild(N);
      let x=n.x;if(n.k==='t'&&N.textAutoResize==='WIDTH_AND_HEIGHT'){if(n.al==='CENTER')x=n.x+(n.w-2-N.width)/2;else if(n.al==='RIGHT')x=n.x+(n.w-2-N.width);}
      N.x=x;N.y=n.y;if(n.o!=null&&n.o<1)N.opacity=n.o;made++;
    }catch(e){errs.push(n.k+':'+String(e.message||e).slice(0,60));}}
  }
  report.push({f:job.f,made,nerr:errs.length,errs:errs.slice(0,3)});
}
return report;
