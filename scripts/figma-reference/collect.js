// Runs in the page. Returns {w,h,sections:[{name,y,h,nodes}], rasters:[{id,x,y,w,h,mode}]}
(() => {
  const sy = window.scrollY, sx = window.scrollX;
  const docW = document.documentElement.clientWidth;
  const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  const px = v => parseFloat(v) || 0;
  const parseColor = c => {
    const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);
    const a = p.length > 3 ? p[3] : 1; if (a === 0) return null;
    return [p[0] / 255, p[1] / 255, p[2] / 255, a];
  };
  const r2 = n => Math.round(n * 10) / 10;
  const visible = (el, cs) => {
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect(); if (r.width < 0.5 || r.height < 0.5) return false;
    return true;
  };
  const effOpacity = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
  const isHiddenAncestor = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || parseFloat(cs.opacity) === 0) return true; } return false; };
  const box = el => { const r = el.getBoundingClientRect(); return { x: r2(r.left + sx), y: r2(r.top + sy), w: r2(r.width), h: r2(r.height) }; };
  const INLINE_TAGS = new Set(['A', 'SPAN', 'STRONG', 'EM', 'B', 'I', 'U', 'SMALL', 'SUP', 'SUB', 'BR', 'ABBR', 'TIME', 'MARK', 'CODE', 'LABEL', 'S']);
  const inlineOnly = el => {
    for (const c of el.childNodes) {
      if (c.nodeType === 3) continue;
      if (c.nodeType !== 1) continue;
      if (!INLINE_TAGS.has(c.tagName)) return false;
      const cs = getComputedStyle(c);
      if (cs.display === 'none') continue;
      if (!(cs.display.startsWith('inline') || c.tagName === 'BR')) return false;
      if (!inlineOnly(c)) return false;
    }
    return true;
  };
  const hasText = el => /\S/.test(el.textContent || '');
  const weightStyle = (w, it) => { w = parseInt(w); const n = w >= 800 ? 'ExtraBold' : w >= 700 ? 'Bold' : w >= 600 ? 'SemiBold' : w >= 500 ? 'Medium' : w >= 300 ? 'Regular' : 'Light'; return it ? (n === 'Regular' ? 'Italic' : n + ' Italic') : n; };
  const tf = (s, t) => t === 'uppercase' ? s.toUpperCase() : t === 'lowercase' ? s.toLowerCase() : t === 'capitalize' ? s.replace(/\b\w/g, c => c.toUpperCase()) : s;
  const styleOf = cs => ({ f: weightStyle(cs.fontWeight, cs.fontStyle === 'italic'), s: r2(px(cs.fontSize)), c: parseColor(cs.color) || [0, 0, 0, 1], u: cs.textDecorationLine.includes('underline') ? 1 : 0 });
  const lh = cs => cs.lineHeight === 'normal' ? r2(px(cs.fontSize) * 1.2) : r2(px(cs.lineHeight));
  const ls = cs => cs.letterSpacing === 'normal' ? 0 : r2(px(cs.letterSpacing));

  const srHidden = (el, stop) => { for (let e = el; e && e.nodeType === 1 && e !== stop.parentElement; e = e.parentElement) { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); if (r.width <= 2 && r.height <= 2 && cs.overflow !== 'visible') return true; if (cs.clip && cs.clip !== 'auto' && /rect\(0/.test(cs.clip)) return true; } return false; };
  const rasters = []; let rid = 0;
  const sectionsEls = [];
  const hdr = document.querySelector('[data-pagefind-ignore] header, body > div > div:first-child header') || document.querySelector('header');
  const main = document.getElementById('main');
  const ftr = document.querySelector('footer');
  if (hdr) sectionsEls.push(hdr);
  if (main) for (const c of main.children) { const cs = getComputedStyle(c); if (cs.display !== 'none' && c.tagName !== 'SCRIPT' && c.tagName !== 'DIALOG' && c.getBoundingClientRect().height > 0) sectionsEls.push(c); }
  if (ftr) sectionsEls.push(ftr);

  const nameFor = (el, i) => {
    const h = el.querySelector('h1,h2,h3');
    const t = h ? h.textContent.trim().replace(/\s+/g, ' ').slice(0, 48) : '';
    const tag = el === hdr ? 'Header' : el === ftr ? 'Footer' : (el.getAttribute('aria-label') || el.tagName.toLowerCase());
    return `${String(i).padStart(2, '0')} · ${t || tag}`;
  };

  const sections = sectionsEls.map((sel, i) => {
    const sb = box(sel);
    const nodes = [];
    const walk = (el, inTextBlock) => {
      if (el.nodeType !== 1) return;
      const cs = getComputedStyle(el);
      if (!visible(el, cs)) { if (cs.display === 'none') return; }
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'DIALOG', 'META', 'LINK'].includes(el.tagName)) return;
      if (el.closest('dialog:not([open])')) return;
      if (srHidden(el, sel)) return;
      const op = effOpacity(el);
      if (op < 0.02) return;
      const b = box(el);
      const tag = el.tagName;
      // media → raster (element and descendants only)
      if (tag === 'IMG' || tag === 'PICTURE' || tag === 'VIDEO' || tag === 'CANVAS') {
        if (b.w > 0.5 && b.h > 0.5) { const id = 'r' + (rid++); el.setAttribute('data-ras', id); rasters.push({ id, ...b, mode: 'self' }); nodes.push({ k: 'i', id, ...b, n: el.getAttribute('alt') || tag.toLowerCase() }); }
        return;
      }
      if (tag === 'IFRAME') { nodes.push({ k: 'r', ...b, fill: [0.96, 0.96, 0.96, 1], n: 'Embedded PDF viewer', br: [8, 8, 8, 8] }); return; }
      if (tag === 'svg' || tag === 'SVG') {
        const dashed = [el, ...el.querySelectorAll('*')].some(e => { const d = getComputedStyle(e).strokeDasharray; return d && d !== 'none'; });
        if (dashed && b.w > 0.5 && b.h > 0.5) { const id = 'r' + (rid++); el.setAttribute('data-ras', id); rasters.push({ id, ...b, mode: 'self' }); nodes.push({ k: 'i', id, ...b, n: el.getAttribute('aria-label') || 'chart' }); return; }
        if (b.w > 0.5 && b.h > 0.5) {
          const clone = el.cloneNode(true);
          const fix = (src, dst) => { const s = getComputedStyle(src); if (src.nodeType === 1) { const st = s.stroke, fi = s.fill; if (st && st !== 'none') dst.setAttribute('stroke', st); if (fi && fi !== 'none') dst.setAttribute('fill', fi); else if (fi === 'none') dst.setAttribute('fill', 'none'); if (s.strokeWidth) dst.setAttribute('stroke-width', s.strokeWidth); if (s.strokeDasharray && s.strokeDasharray !== 'none') dst.setAttribute('stroke-dasharray', s.strokeDasharray); if (s.strokeDashoffset && s.strokeDashoffset !== '0px') dst.setAttribute('stroke-dashoffset', s.strokeDashoffset); if (s.strokeLinecap && s.strokeLinecap !== 'butt') dst.setAttribute('stroke-linecap', s.strokeLinecap); if (s.opacity && s.opacity !== '1') dst.setAttribute('opacity', s.opacity); if (s.fillOpacity && s.fillOpacity !== '1') dst.setAttribute('fill-opacity', s.fillOpacity); } for (let k = 0; k < src.children.length; k++) fix(src.children[k], dst.children[k]); };
          fix(el, clone);
          clone.setAttribute('width', b.w); clone.setAttribute('height', b.h);
          if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${b.w} ${b.h}`);
          clone.removeAttribute('class'); clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          nodes.push({ k: 's', ...b, svg: clone.outerHTML, o: r2(op) });
        }
        return;
      }
      // box
      if (!inTextBlock && b.w > 0.5 && b.h > 0.5) {
        const bg = parseColor(cs.backgroundColor);
        const bt = [px(cs.borderTopWidth), px(cs.borderRightWidth), px(cs.borderBottomWidth), px(cs.borderLeftWidth)];
        const bcol = parseColor(cs.borderTopColor) || parseColor(cs.borderLeftColor) || parseColor(cs.borderBottomColor);
        const hasBorder = !!(bcol && bt.some(x => x > 0));
        const br = [px(cs.borderTopLeftRadius), px(cs.borderTopRightRadius), px(cs.borderBottomRightRadius), px(cs.borderBottomLeftRadius)];
        const bgi = cs.backgroundImage && cs.backgroundImage !== 'none';
        const shadow = cs.boxShadow && cs.boxShadow !== 'none';
        if (bgi) {
          const id = 'r' + (rid++); el.setAttribute('data-ras', id); rasters.push({ id, ...b, mode: 'bg' });
          nodes.push({ k: 'i', id, ...b, n: 'background', br });
        } else if (bg || hasBorder) {
          nodes.push({ k: 'r', ...b, fill: bg, br, bw: hasBorder ? bt : null, bc: hasBorder ? bcol : null, o: r2(op), sh: shadow ? 1 : 0, n: el.getAttribute('aria-label') || (tag.toLowerCase() + (el.className && typeof el.className === 'string' ? '' : '')) });
        }
      }
      if (tag === 'SELECT') {
        const opt = el.options[el.selectedIndex]; const t = opt ? opt.text.trim() : '';
        if (t) { const pl = px(cs.paddingLeft) + px(cs.borderLeftWidth); nodes.push({ k: 't', x: r2(b.x + pl), y: r2(b.y + (b.h - lh(cs)) / 2), w: r2(b.w - pl), h: lh(cs), t, lh: lh(cs), ls: ls(cs), al: 'LEFT', o: r2(op), rs: [{ a: 0, b: t.length, ...styleOf(cs) }] }); }
        return;
      }
      if ((tag === 'INPUT' || tag === 'TEXTAREA') && !el.value && el.placeholder) {
        const pcs = getComputedStyle(el, '::placeholder'); const t = el.placeholder; const pl = px(cs.paddingLeft) + px(cs.borderLeftWidth);
        const y = tag === 'TEXTAREA' ? b.y + px(cs.paddingTop) + px(cs.borderTopWidth) : b.y + (b.h - lh(cs)) / 2;
        nodes.push({ k: 't', x: r2(b.x + pl), y: r2(y), w: r2(b.w - pl), h: lh(cs), t, lh: lh(cs), ls: ls(cs), al: 'LEFT', o: r2(op), rs: [{ a: 0, b: t.length, ...styleOf(pcs) }] });
        return;
      }
      // text
      if (!inTextBlock && hasText(el) && inlineOnly(el) && cs.display !== 'inline') {
        // build characters + ranges
        let chars = ''; const ranges = [];
        const ws = cs.whiteSpace;
        const add = (node, pcs) => {
          if (node.nodeType === 3) {
            let t = node.data; if (!/pre/.test(pcs.whiteSpace)) t = t.replace(/\s+/g, ' ');
            t = tf(t, pcs.textTransform);
            if (!t) return;
            if (chars.endsWith(' ') && t.startsWith(' ')) t = t.slice(1);
            if (!chars && t.startsWith(' ')) t = t.slice(1);
            const st = chars.length; chars += t; ranges.push({ a: st, b: chars.length, ...styleOf(pcs) });
          } else if (node.nodeType === 1) {
            const ccs = getComputedStyle(node);
            if (ccs.display === 'none') return;
            if (node.tagName === 'BR') { chars = chars.replace(/ $/, '') + '\n'; return; }
            for (const c of node.childNodes) add(c, ccs);
          }
        };
        for (const c of el.childNodes) add(c, cs);
        // trim trailing
        while (chars.endsWith(' ') || chars.endsWith('\n')) { chars = chars.slice(0, -1); }
        if (chars.trim()) {
          const pl = px(cs.paddingLeft) + px(cs.borderLeftWidth), pt = px(cs.paddingTop) + px(cs.borderTopWidth), pr = px(cs.paddingRight) + px(cs.borderRightWidth), pb = px(cs.paddingBottom) + px(cs.borderBottomWidth);
          const rng = document.createRange(); rng.selectNodeContents(el); const rr = rng.getBoundingClientRect();
          const cw = b.w - pl - pr;
          let x = b.x + pl, w = cw, y = rr.top + sy;
          const ta = cs.textAlign;
          // single-line shrink-to-fit for inline-ish content in flex rows
          const lines = rng.getClientRects().length;
          if (ta === 'center' || ta === 'right' || ta === 'end') { /* keep content box */ }
          else if (rr.width < cw && lines <= 1) { w = rr.width; x = rr.left + sx; }
          ranges.forEach(r => { r.b = Math.min(r.b, chars.length); });
          nodes.push({ k: 't', x: r2(x), y: r2(y), w: r2(w + 2), h: r2(rr.height), t: chars, lh: lh(cs), ls: ls(cs), al: ta === 'center' ? 'CENTER' : (ta === 'right' || ta === 'end') ? 'RIGHT' : 'LEFT', o: r2(op), rs: ranges.filter(r => r.b > r.a) });
        }
        // children rendered as part of block; still walk element children for boxes/svgs? inline-only → no
        return;
      }
      // direct text nodes in non-inline-only elements
      if (!inTextBlock) {
        for (const c of el.childNodes) {
          if (c.nodeType === 3 && /\S/.test(c.data)) {
            const rng = document.createRange(); rng.selectNodeContents(c); const rr = rng.getBoundingClientRect();
            if (rr.width < 0.5) continue;
            let t = tf(c.data.replace(/\s+/g, ' ').trim(), cs.textTransform);
            nodes.push({ k: 't', x: r2(rr.left + sx), y: r2(rr.top + sy), w: r2(rr.width + 2), h: r2(rr.height), t, lh: lh(cs), ls: ls(cs), al: 'LEFT', o: r2(op), rs: [{ a: 0, b: t.length, ...styleOf(cs) }] });
          }
        }
      }
      for (const c of el.children) walk(c, false);
    };
    walk(sel, false);
    // section background colour (for frame fill) comes from box nodes; positions relative
    nodes.forEach(n => { n.x = r2(n.x - sb.x); n.y = r2(n.y - sb.y); });
    return { name: nameFor(sel, i + 1), x: sb.x, y: sb.y, w: sb.w, h: sb.h, nodes };
  });
  return { w: docW, h: docH, sections, rasters };
})()
