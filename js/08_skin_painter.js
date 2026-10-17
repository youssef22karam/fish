// @@PART js/08_skin_painter.js (lines 997-1194 of the original <script>) -- stripped by build.mjs
/* ============================ skin painter ============================ */
function layerCanvas(W, H, fn) {
  const c = mkCanvas(W, H), g = c.getContext('2d'), im = g.createImageData(W, H), d = im.data;
  for (let j = 0; j < H; j++) {
    const s = (j + .5) / H;
    for (let i = 0; i < W; i++) {
      const r = fn((i + .5) / W, s); if (r) { const k = (j * W + i) * 4; d[k] = r[0]; d[k + 1] = r[1]; d[k + 2] = r[2]; d[k + 3] = clamp(r[3], 0, 1) * 255; }
    }
  }
  g.putImageData(im, 0, 0); return c;
}

function paintSkin(sp, body, seed, W, Hh) {
  const rnd = mulberry32(seed ^ 0x9e3779b9), sk = sp.skin, pal = sk.pal, hd = sp.head;
  const C = mkCanvas(W, Hh), c = C.getContext('2d'), Hc = mkCanvas(W, Hh), h = Hc.getContext('2d'), Mc = mkCanvas(W, Hh), m = Mc.getContext('2d');
  const NX = 1024, HAcol = new Float32Array(NX + 1); for (let i = 0; i <= NX; i++) HAcol[i] = body.haAt(i / NX);
  const HA = x => HAcol[clamp(Math.round(x * NX), 0, NX)], ky = x => Hh / Math.max(1e-4, HA(x));
  const phys = (g, x) => g.setTransform(W, 0, 0, ky(x), 0, 0);
  const pn = (x, s, f, sd, o) => fbm(x * f, s * HA(x) * f, sd + seed % 97, o || 4);
  c.imageSmoothingQuality = 'high';
  const silver = sk.silver, rough0 = clamp(.56 - .3 * (sk.sheen || .5), .24, .56), metalMax = clamp(silver * .78, 0, .8);

  /* --- 1. countershaded base, per-strip so the dorsal/ventral boundaries drift along the body --- */
  const strip = 8;
  for (let px = 0; px < W; px += strip) {
    const x = (px + strip / 2) / W, sh = .035 * Math.sin(x * 9 + 1) + .03 * (x - .5) - .03 * (1 - sst(0, .3, x));
    const g = c.createLinearGradient(0, 0, 0, Hh);
    const stops = [[0, pal.d], [.15 + sh, mixc(pal.d, pal.m, .18)], [.33 + sh, mixc(pal.d, pal.m, .78)], [.45 + sh, pal.m], [.6, pal.m], [.74, mixc(pal.m, pal.b, .7)], [.86, pal.b], [1, pal.b]];
    let last = -1; for (const [o, col] of stops) { const oo = clamp(Math.max(o, last + .001), 0, 1); g.addColorStop(oo, rgb(hex(col))); last = oo; }
    c.fillStyle = g; c.fillRect(px, 0, strip + 1, Hh);
  }
  h.fillStyle = 'rgb(128,128,128)'; h.fillRect(0, 0, W, Hh);
  { // metal / roughness base
    const g = m.createLinearGradient(0, 0, 0, Hh);
    const mv = k => 'rgb(0,' + ((rough0 + (1 - k) * .06) * 255 | 0) + ',' + (k * 255 | 0) + ')';
    g.addColorStop(0, mv(0)); g.addColorStop(.1, mv(metalMax * .25)); g.addColorStop(.32, mv(metalMax * .8)); g.addColorStop(.5, mv(metalMax)); g.addColorStop(.8, mv(metalMax * .9)); g.addColorStop(1, mv(metalMax * .6));
    m.fillStyle = g; m.fillRect(0, 0, W, Hh);
  }
  /* head is a little darker/duller on top */
  { const g = c.createLinearGradient(0, 0, W * hd.gillX, 0); g.addColorStop(0, 'rgba(0,0,0,.16)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W * hd.gillX, Hh * .5); }

  /* --- 2. patterns --- */
  const drawLayer = (fn, res) => { const lw = res ? res[0] : 640, lh = res ? res[1] : 160; c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(layerCanvas(lw, lh, fn), 0, 0, W, Hh); };
  const band = (s, v0, v1, e) => sst(v0 - e, v0 + e, s) * sst(v1 + e, v1 - e, s);
  for (const p of sk.pats) {
    const col = hex(p.col || '#000');
    if (p.k === 'mottle') drawLayer((x, s) => { const b = band(s, p.v0, p.v1, .07); if (b <= 0) return null; const n = pn(x, s, p.sc, 11, 4); const t = sst(.46, .7, n); return [col[0], col[1], col[2], p.a * t * b]; });
    else if (p.k === 'lband' || p.k === 'stripe') drawLayer((x, s) => {
      const x0 = p.x0 === undefined ? 0 : p.x0, x1 = p.x1 === undefined ? 1 : p.x1, f = sst(x0, x0 + .05, x) * sst(x1, x1 - .04, x); if (f <= 0) return null;
      const wob = (pn(x, s, 12, 3, 3) - .5) * .09, d = (s - p.v - wob) / p.w, g = Math.exp(-d * d * (p.soft ? .9 : 1.6)); if (g < .02) return null;
      let bl = 1; if (p.blot) { const n = pn(x, s, 32, 8, 3); bl = 1 - p.blot * (1 - sst(.32, .62, n)); }
      return [col[0], col[1], col[2], p.a * g * f * bl];
    }, [1024, 200]);
    else if (p.k === 'bars' || p.k === 'vbars') drawLayer((x, s) => {
      let a = 0, ea = 0; const edge = p.edge ? hex(p.edge) : null;
      for (const xb of p.xs) {
        const wob = (p.wob || .12) * (pn(x, s, 10, 5, 2) - .5) * .06 + (p.k === 'vbars' ? 0 : .015 * Math.sin(s * 9 + xb * 30));
        const dx = Math.abs(x - xb - wob), vf = band(s, p.v0, p.v1, p.soft ? .09 : .05);
        if (edge) { a = Math.max(a, sst(p.w + .002, p.w - .002, dx) * vf); ea = Math.max(ea, sst(p.w + p.edgeW + .002, p.w + p.edgeW - .002, dx) * vf); }
        else a = Math.max(a, Math.exp(-((dx / p.w) ** 2) * 1.4) * vf);
      }
      if (edge) return a > .02 ? [col[0], col[1], col[2], a * p.a] : (ea > .02 ? [edge[0], edge[1], edge[2], ea] : null);
      return a > .02 ? [col[0], col[1], col[2], a * p.a] : null;
    }, [1280, 200]);
    else if (p.k === 'patches') {
      const cols = p.cols.map(hex), sd = p.seed || 0;
      drawLayer((x, s) => { const b = band(s, p.v0, p.v1, .05); if (b <= 0) return null; const n = pn(x, s, p.sc, 21 + sd, 4), t = sst(p.th, p.th + .018, n) * b; if (t < .02) return null; const cc = cols[(pn(x, s, 3, 40 + sd, 2) * cols.length) | 0] || cols[0]; return [cc[0], cc[1], cc[2], t]; }, [1024, 256]);
    } else if (p.k === 'wave') drawLayer((x, s) => { const b = band(s, p.v0, p.v1, .05); if (b <= 0) return null; const t = Math.sin(s * 210 + 9 * pn(x, s, 9, 6, 2) + x * 20); const l = sst(.72, .9, t) * b; return l > .02 ? [col[0], col[1], col[2], l * p.a] : null; }, [900, 240]);
    else if (p.k === 'gradient') {
      const cs = p.cols.map(hex);
      drawLayer((x, s) => { const b = band(s, p.v0, p.v1, .05), t = clamp(x * 1.15 + (pn(x, s, 6, 51, 2) - .5) * .5, 0, .999) * (cs.length - 1), i = t | 0, f = t - i, c0 = cs[i], c1 = cs[i + 1]; return [lerp(c0[0], c1[0], f), lerp(c0[1], c1[1], f), lerp(c0[2], c1[2], f), p.a * .6 * b]; }, [512, 128]);
    }
    else if (p.k === 'spots') {
      const x0 = p.x0 === undefined ? .05 : p.x0, x1 = p.x1 === undefined ? .98 : p.x1;
      for (let i = 0; i < p.n; i++) {
        const x = lerp(x0, x1, rnd()), s = lerp(p.v0, p.v1, rnd()), a = s * HA(x), r = lerp(p.r[0], p.r[1], Math.pow(rnd(), 1.6));
        phys(c, x); const rx = r * (p.bean ? 1.9 : 1), ry = r * (p.bean ? .8 : 1), rot = p.bean ? (rnd() - .5) * .8 : 0;
        c.fillStyle = rgba(p.col, p.a * .35); c.beginPath(); c.ellipse(x, a, rx * 1.35, ry * 1.35, rot, 0, TAU); c.fill();
        c.fillStyle = rgba(p.col, p.a * (.75 + rnd() * .25)); c.beginPath(); c.ellipse(x, a, rx, ry, rot, 0, TAU); c.fill();
      }
    } else if (p.k === 'blotch') {
      const a = p.v * HA(p.x); phys(c, p.x); c.save(); c.translate(p.x, a); c.scale(1, p.ry / p.rx);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, p.rx); g.addColorStop(0, rgba(p.col, p.a)); g.addColorStop(.6, rgba(p.col, p.a * .8)); g.addColorStop(1, rgba(p.col, 0));
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, p.rx, 0, TAU); c.fill(); c.restore();
    }
  }
  { // head pigment: mottling, chromatophore speckle
    const dc = hex(mixc(pal.d, '#000000', .35)), lc = hex(mixc(pal.m, '#ffffff', .25));
    drawLayer((x, s) => { if (x > body.xCut + .03) return null; const n = pn(x, s, 46, 61, 4), t = sst(.5, .78, n) * sst(.6, .2, s); return t > .02 ? [dc[0], dc[1], dc[2], .5 * t * sst(hd.gillX + .03, hd.gillX - .04, x)] : null; }, [900, 220]);
    for (let i = 0; i < 1500; i++) { const x = rnd() * (hd.gillX + .02), s = rnd() * .62, a = s * HA(x); phys(c, x); const r = .0005 + rnd() * .0016; c.fillStyle = rnd() < .8 ? 'rgba(' + dc[0] + ',' + dc[1] + ',' + dc[2] + ',' + (.18 + rnd() * .28) + ')' : 'rgba(' + lc[0] + ',' + lc[1] + ',' + lc[2] + ',.4)'; c.beginPath(); c.ellipse(x, a, r * 1.4, r, 0, 0, TAU); c.fill(); }
    // fine pebbling of the head skin in the height map
    for (let i = 0; i < 26000; i++) { const x = rnd() * hd.gillX * W, y = rnd() * Hh, v = 100 + rnd() * 60 | 0; if (rnd() > sst(1, .55, x / (hd.gillX * W))) continue; h.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',.5)'; h.fillRect(x, y, 2 + rnd() * 3, 2 + rnd() * 3); }
  }
  c.setTransform(1, 0, 0, 1, 0, 0);

  /* --- 3. imbricated scales, drawn tail -> head so every scale overlaps the one behind it --- */
  const S = sk.scale, sz = S.size;
  const edgeCol = mixc(pal.d, '#000000', .3), K = clamp(sz / .012, .8, 1.5) * (S.kind === 'ctenoid' ? 1.1 : 1);
  const x0s = body.xCut, gx = body.xCut;
  if (sz > 0) {
    const cols = [], rowH = sz * .72, colW = sz * .96;
    for (let x = 1.02; x > x0s; x -= colW) cols.push(x);
    cols.forEach((xc, ci) => {
      const ha = HA(Math.min(xc, 1)), nRows = Math.ceil(ha / rowH) + 1, kyy = ky(Math.min(xc, 1));
      for (let r = -1; r < nRows; r++) {
        const jx = (rnd() - .5) * sz * .2, ja = (rnd() - .5) * sz * .16, x = xc + jx + (r & 1 ? colW * .5 : 0), a = (r + .5) * rowH + ja;
        if (x > 1.0 || a > ha + rowH * .5 || a < -rowH * .5) continue;
        // in the head/opercle area scales thin out towards the front
        const so = Math.min(1, ha > 0 ? a / ha : 0);
        let fh = sst(x0s, x0s + .05, x); if (fh < .04) continue;
        const jz = 1 + (rnd() - .5) * .16, rx = sz * .66 * jz, ry = sz * .54 * jz, vv = (rnd() - .5);
        // ----- colour canvas
        c.setTransform(W, 0, 0, kyy, 0, 0);
        const vr = (.05 + .1 * silver) * vv * 2;
        c.fillStyle = vr > 0 ? 'rgba(255,255,255,' + vr * fh + ')' : 'rgba(0,0,0,' + (-vr * fh) + ')';
        c.beginPath(); c.ellipse(x, a, rx, ry, 0, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(0,0,0,' + .10 * K * fh + ')'; c.lineWidth = sz * .13; c.beginPath(); c.ellipse(x + sz * .05, a, rx * 1.01, ry * 1.03, 0, -1.25, 1.25); c.stroke();
        const g = c.createLinearGradient(x - rx, 0, x + rx, 0);
        g.addColorStop(0, 'rgba(0,0,0,' + .10 * K * fh + ')'); g.addColorStop(.45, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(255,255,255,' + (.03 + .07 * silver) * fh + ')');
        c.fillStyle = g; c.beginPath(); c.ellipse(x, a, rx, ry, 0, 0, TAU); c.fill();
        c.strokeStyle = rgba(edgeCol, (.06 + .06 * (1 - silver)) * K * fh * (.4 + .6 * sst(.04, .34, so))); c.lineWidth = sz * .04; c.beginPath(); c.ellipse(x, a, rx * .98, ry * .98, 0, -1.22, 1.22); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,' + ((.04 + .2 * silver) * fh * (.6 + rnd() * .8)) + ')'; c.lineWidth = sz * .05; c.beginPath(); c.ellipse(x, a, rx * .88, ry * .88, 0, -1.1, 1.1); c.stroke();
        // ----- height canvas
        h.setTransform(W, 0, 0, kyy, 0, 0);
        const hg = h.createRadialGradient(x - rx * .35, a, 0, x - rx * .2, a, rx * 1.1); hg.addColorStop(0, 'rgb(150,150,150)'); hg.addColorStop(1, 'rgb(108,108,108)');
        h.globalAlpha = fh; h.fillStyle = hg; h.beginPath(); h.ellipse(x, a, rx, ry, 0, 0, TAU); h.fill(); h.globalAlpha = 1;
        h.strokeStyle = 'rgba(255,255,255,' + .55 * fh + ')'; h.lineWidth = sz * .07; h.beginPath(); h.ellipse(x, a, rx * .95, ry * .95, 0, -1.1, 1.1); h.stroke();
        // ----- material canvas: per-scale gloss variation, edges less metallic
        m.setTransform(W, 0, 0, kyy, 0, 0);
        const base = m.getImageData ? null : null;
        m.strokeStyle = 'rgba(0,' + (200 | 0) + ',20,' + (.35 * fh) + ')'; m.lineWidth = sz * .1; m.beginPath(); m.ellipse(x, a, rx * .97, ry * .97, 0, -1.2, 1.2); m.stroke();
        m.fillStyle = 'rgba(0,' + ((rough0 - .06 * vv) * 255 | 0) + ',' + (clamp(metalMax * (.7 + .5 * so * (1 - so) * 3 + vv * .4), 0, 1) * 255 | 0) + ',' + (.22 * fh) + ')'; m.beginPath(); m.ellipse(x, a, rx * .9, ry * .9, 0, 0, TAU); m.fill();
      }
    });
    [c, h, m].forEach(g => g.setTransform(1, 0, 0, 1, 0, 0));
  } else {
    // scaleless (catfish): smooth mottled skin with fine wrinkles
    for (let i = 0; i < 9000; i++) {
      const x = rnd(), s = rnd(), a = s * HA(x); phys(c, x); const r = .002 + rnd() * .004;
      c.fillStyle = rnd() < .5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'; c.beginPath(); c.ellipse(x, a, r * 1.6, r, 0, 0, TAU); c.fill();
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* --- front cut surface --- */
    {
      const cutX = body.xCut * W;
      const meatGrad = c.createRadialGradient(cutX * 0.7, Hh * 0.5, 2, cutX * 0.7, Hh * 0.5, Hh * 0.45);
      meatGrad.addColorStop(0, '#e8b8b0');
      meatGrad.addColorStop(0.12, '#ffffff');
      meatGrad.addColorStop(0.22, '#c04840');
      meatGrad.addColorStop(0.55, '#a03830');
      meatGrad.addColorStop(0.85, '#882820');
      meatGrad.addColorStop(1, '#601814');
      c.fillStyle = meatGrad; c.fillRect(0, 0, cutX, Hh);
      h.fillStyle = '#808080'; h.fillRect(0, 0, cutX, Hh);
      m.fillStyle = 'rgba(0,180,0,0.5)'; m.fillRect(0, 0, cutX, Hh);
    }
  { // lateral line
    const ll = sk.ll; if (ll) {
      const sy = x => ll.v + (ll.arc ? .13 * Math.pow(1 - sst(0, .38, x), 1.1) * (x > body.xCut ? 1 : 0) : (x < .45 ? .05 * (1 - x / .45) : 0)), xs0 = body.xCut + .008;
      c.beginPath(); h.beginPath();
      for (let x = xs0; x <= 1; x += .004) { const p = [x * W, sy(x) * Hh]; x === xs0 ? (c.moveTo(p[0], p[1]), h.moveTo(p[0], p[1])) : (c.lineTo(p[0], p[1]), h.lineTo(p[0], p[1])); }
      c.strokeStyle = rgba(ll.col, ll.a * .9); c.lineWidth = ll.arc ? 3.6 : 2; c.stroke(); h.strokeStyle = 'rgba(210,210,210,.55)'; h.lineWidth = 2.4; h.stroke();
      const step = Math.max(.008, sz > 0 ? sz * .96 : .012);
      for (let x = xs0 + .006; x < .985; x += step) { const p = [x * W, sy(x) * Hh]; c.fillStyle = rgba(ll.col, Math.min(1, ll.a * 1.6)); c.beginPath(); c.arc(p[0], p[1], 2.2, 0, TAU); c.fill(); h.fillStyle = 'rgb(235,235,235)'; h.beginPath(); h.arc(p[0], p[1], 2.4, 0, TAU); h.fill(); }
    }
  }
  /* fine noise / pigment freckling */
  for (let i = 0; i < 60000; i++) { const x = rnd() * W, y = rnd() * Hh; c.fillStyle = rnd() < .5 ? 'rgba(255,255,255,' + rnd() * .05 + ')' : 'rgba(0,0,0,' + rnd() * .06 + ')'; c.fillRect(x, y, 1 + rnd() * 2, 1 + rnd() * 1.4); }
  /* belly: paler, glossier */
  { const g = c.createLinearGradient(0, Hh * .78, 0, Hh); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.14)'); c.fillStyle = g; c.fillRect(0, Hh * .78, W, Hh * .22); }

  let emissive = null;
  if (sk.glow) {
    const gl = sk.glow, EW = W >> 1, EH = Hh >> 1, Ec = mkCanvas(EW, EH), e = Ec.getContext('2d'), col = gl.col; e.fillStyle = '#000'; e.fillRect(0, 0, EW, EH);
    const dot = (x, s, r, a) => { const ha = HA(x); e.setTransform(EW, 0, 0, EH / Math.max(1e-4, ha), 0, 0); const cy = s * ha, g = e.createRadialGradient(x, cy, 0, x, cy, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(.4, rgba(col, a * .5)); g.addColorStop(1, rgba(col, 0)); e.fillStyle = g; e.beginPath(); e.arc(x, cy, r, 0, TAU); e.fill(); };
    for (let i = 0; i < gl.n; i++) { const x = .12 + rnd() * .84, row = rnd(), s = row < .5 ? lerp(.62, .93, rnd()) : row < .75 ? lerp(.34, .46, rnd()) : rnd() * .9; dot(x, s, .0035 + rnd() * .004, .9); }
    for (let x = .2; x < .95; x += .022) dot(x, .58 + .1 * Math.sin(x * 20), .004, 1);
    
    if (gl.neon) { e.setTransform(1, 0, 0, 1, 0, 0); const sv = sk.ll ? sk.ll.v : .4, g = e.createLinearGradient(0, (sv - .05) * EH, 0, (sv + .05) * EH); g.addColorStop(0, rgba(col, 0)); g.addColorStop(.5, rgba(col, .9)); g.addColorStop(1, rgba(col, 0)); e.fillStyle = g; e.fillRect(.12 * EW, (sv - .05) * EH, .82 * EW, .1 * EH); }
    e.setTransform(1, 0, 0, 1, 0, 0); emissive = new THREE.CanvasTexture(Ec); emissive.flipY = false; emissive.encoding = THREE.sRGBEncoding; emissive.needsUpdate = true;
  }
  const mk = (cv, srgb) => { const t = new THREE.CanvasTexture(cv); t.flipY = false; t.anisotropy = 8; if (srgb) t.encoding = THREE.sRGBEncoding; t.needsUpdate = true; return t; };
  let emis = null;
  if (sk.glow) {
    const G = sk.glow, EW = W >> 1, EH = Hh >> 1, E = mkCanvas(EW, EH), e = E.getContext('2d'); e.fillStyle = '#000'; e.fillRect(0, 0, EW, EH);
    const dot = (x, s, r, a) => { const y = s * HA(x); e.setTransform(EW, 0, 0, ky(x) * .5, 0, 0); const g = e.createRadialGradient(x, y, 0, x, y, r * 2.4); g.addColorStop(0, rgba(G.col, a)); g.addColorStop(.35, rgba(G.col, a * .6)); g.addColorStop(1, rgba(G.col, 0)); e.fillStyle = g; e.beginPath(); e.arc(x, y, r * 2.4, 0, TAU); e.fill(); };
    for (let i = 0; i < G.n; i++) { const x = .08 + rnd() * .88, s = rnd() < .6 ? .55 + rnd() * .38 : .2 + rnd() * .3; dot(x, s, .0022 + rnd() * .0035, .7 + rnd() * .3); }
    for (let x = .14; x < .95; x += .022) { dot(x, .64, .0026, .95); dot(x, .38 + .03 * Math.sin(x * 12), .0018, .8); }
    e.setTransform(1, 0, 0, 1, 0, 0);
    if (G.neon) { const bands = sk.pats.filter(p => p.k === 'lband').map(p => [p.v, p.w, p.x0 || .1, p.x1 === undefined ? .97 : p.x1]); if (!bands.length) bands.push([sk.ll ? sk.ll.v : .4, .03, .12, .97]); for (const [v, w, x0, x1] of bands) { const gr = e.createLinearGradient(0, (v - w * 1.3) * EH, 0, (v + w * 1.3) * EH); gr.addColorStop(0, rgba(G.col, 0)); gr.addColorStop(.5, rgba(G.col, .9)); gr.addColorStop(1, rgba(G.col, 0)); e.fillStyle = gr; e.fillRect(x0 * EW, (v - w * 1.3) * EH, (x1 - x0) * EW, w * 2.6 * EH); } }
    emis = mk(E, true);
  }
  return { emissive, map: mk(C, true), bump: mk(Hc, false), mr: mk(Mc, false), emissive: emis, rough: rough0, metal: metalMax, canvases: { C, Hc, Mc } };
}

'use strict';
