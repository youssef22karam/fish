// @@PART js/09_fins.js (lines 1195-1355 of the original <script>) -- stripped by build.mjs
/* ============================ fins ============================ */
const rad = d => d * PI / 180;
const n3 = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const l3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/* rays: [{p:[x,y,z], d:[..], L, cv:[..], spine}] -> sheet geometry with corrugation */
function fanGeo(rays, o) {
  const G = new Geo(), nR = rays.length, S = o.S || 3, C = (nR - 1) * S + 1, rows = o.rows || 12, nrm = o.nrm || [0, 0, 1];
  for (let c = 0; c < C; c++) {
    const i = Math.min(nR - 2, Math.floor(c / S)), f = c / S - i, a = rays[i], b = rays[i + 1];
    const P = l3(a.p, b.p, f), D = n3(l3(a.d, b.d, f)), L = lerp(a.L, b.L, f), cv = l3(a.cv, b.cv, f);
    const sgn = (i & 1) ? 1 : -1, pl = (o.pleat === undefined ? .0007 : o.pleat) * Math.sin(PI * f) * sgn;
    for (let k = 0; k <= rows; k++) {
      const r = k / rows, lr = L * r, ple = pl * (.25 + r);
      G.v(P[0] + D[0] * lr + cv[0] * lr * lr + nrm[0] * ple, P[1] + D[1] * lr + cv[1] * lr * lr + nrm[1] * ple, P[2] + D[2] * lr + cv[2] * lr * lr + nrm[2] * ple,
        c / (C - 1), r, 0, 0, (o.flutter === undefined ? 1 : o.flutter) * Math.pow(r, 1.4));
    }
  }
  for (let c = 0; c < C - 1; c++) for (let k = 0; k < rows; k++) { const a = c * (rows + 1) + k, b = a + rows + 1; G.tri(a, a + 1, b); G.tri(a + 1, b + 1, b); }
  return G;
}
function spineTubes(rays, w, r0) {
  const G = new Geo();
  rays.forEach(R => { if (!R.spine) return; addTube(G, t => [R.p[0] + R.d[0] * R.L * t + R.cv[0] * (R.L * t) ** 2, R.p[1] + R.d[1] * R.L * t + R.cv[1] * (R.L * t) ** 2, R.p[2] + R.d[2] * R.L * t + R.cv[2] * (R.L * t) ** 2], r0 || .0011, .00018, 6, 5, w || [0, 0, .5]); });
  return G;
}

/* ---- ray length profiles for dorsal / anal fins ---- */
function medianLen(f, t, i, n) {
  const h = f.h, hs = f.hs || h * .7, nsp = f.nsp || 0, sp = i < nsp;
  const jj = n - nsp - 1, tt = jj > 0 ? (i - nsp) / jj : 0;
  switch (f.shape) {
    case 'spiny': return h * (.42 + .58 * Math.sin(PI * clamp(.06 + .86 * t, 0, 1)));
    case 'sickle': return h * (.1 + .9 * Math.pow(1 - t, .9));
    case 'flat': return h * (.85 + .15 * Math.sin(PI * t));
    case 'flat': return h * (.86 + .14 * Math.sin(PI * t));
    case 'angel': return h * (t < .42 ? .28 + .72 * Math.pow(t / .42, 1.1) : 1 - .93 * Math.pow((t - .42) / .58, 1.25));
    default: {
      if (sp) return hs * (.55 + .45 * (nsp > 1 ? i / (nsp - 1) : 1));
      const soft = tt < .18 ? .78 + .22 * sst(0, .18, tt) : 1 - .58 * Math.pow(sst(.18, 1, tt), 1.25);
      return h * soft * (f.shape === 'cichlid' ? 1 + .12 * sst(.7, 1, tt) : 1);
    }
  }
}
function medianRays(body, f, sign) {
  const n = f.n, R = [];
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0, x = lerp(f.x0, f.x1, t), q = body.sec(x), yb = sign > 0 ? q.T - .005 : q.B + .005;
    const a = rad(lerp(f.rake0, f.rake1, Math.pow(t, .85))), L = medianLen(f, t, i, n), cf = f.shape === 'sickle' ? .55 : f.shape === 'spiny' ? .02 : f.shape === 'angel' ? .1 : .22;
    R.push({ p: [x, yb, 0], d: [Math.sin(a) * .98, sign * Math.cos(a), 0], L, cv: [cf / Math.max(L, .01), 0, 0], spine: i < (f.nsp || 0) });
  }
  return R;
}

/* ---- fin texture painter: u = across rays, v = along ray (0 base -> 1 tip) ---- */
function paintFin(o) {
  const nR = o.nR, W = clamp(nR * 34, 320, 1280), Hf = 512, seed = o.seed || 1, rnd = mulberry32(seed);
  const C = mkCanvas(W, Hf), c = C.getContext('2d'), B = mkCanvas(W, Hf), b = B.getContext('2d');
  b.fillStyle = 'rgb(120,120,120)'; b.fillRect(0, 0, W, Hf);
  const du = W / (nR - 1), notch = o.notch === undefined ? .12 : o.notch, al = o.solid ? .97 : clamp(o.alpha * 1.45, .25, .88), RA = o.rayA === undefined ? 1 : o.rayA, mem = hex(o.mem), ray = hex(o.ray), tip = hex(o.tip || o.mem);
  const rwid = clamp(du * .07, 1.2, 4);
  const edge = (f) => 1 - notch * Math.pow(Math.sin(PI * f), .8);
  /* membrane */
  const gr = c.createLinearGradient(0, 0, 0, Hf);
  gr.addColorStop(0, rgba(mixc(mem, o.base || mem, .5), Math.min(1, al * 1.2))); gr.addColorStop(.5, rgba(mem, al)); gr.addColorStop(.92, rgba(tip, al * .9)); gr.addColorStop(1, rgba(tip, al * .35));
  c.fillStyle = gr;
  for (let i = 0; i < nR - 1; i++) {
    const spi = o.nsp && i < o.nsp;
    c.beginPath(); c.moveTo(i * du, 0);
    for (let k = 0; k <= 12; k++) { const f = k / 12; c.lineTo((i + f) * du, edge(f) * Hf * (spi ? 1 : 1)); }
    c.lineTo((i + 1) * du, 0); c.closePath(); c.fill();
  }
  /* dark margin / bands / rim */
  if (o.rim) { c.globalCompositeOperation = 'source-atop'; const g = c.createLinearGradient(0, Hf * (1 - o.rimW), 0, Hf); g.addColorStop(0, rgba(o.rim, 0)); g.addColorStop(.3, rgba(o.rim, .95)); g.addColorStop(1, rgba(o.rim, 1)); c.fillStyle = g; c.fillRect(0, Hf * (1 - o.rimW), W, Hf * o.rimW); c.globalCompositeOperation = 'source-over'; }
  if (o.dark) { c.globalCompositeOperation = 'source-atop'; const g = c.createLinearGradient(0, Hf * .55, 0, Hf); g.addColorStop(0, rgba(o.dark, 0)); g.addColorStop(1, rgba(o.dark, o.darkA === undefined ? .35 : o.darkA)); c.fillStyle = g; c.fillRect(0, Hf * .55, W, Hf * .45); c.globalCompositeOperation = 'source-over'; }
  if (o.bandsR) { c.globalCompositeOperation = 'source-atop'; for (const r of o.bandsR) { const g = c.createLinearGradient(0, (r - .06) * Hf, 0, (r + .06) * Hf); g.addColorStop(0, 'rgba(30,25,20,0)'); g.addColorStop(.5, 'rgba(30,25,20,.42)'); g.addColorStop(1, 'rgba(30,25,20,0)'); c.fillStyle = g; c.fillRect(0, (r - .06) * Hf, W, .12 * Hf); } c.globalCompositeOperation = 'source-over'; }
  if (o.vbands) { c.globalCompositeOperation = 'source-atop'; for (const u of o.vbands) { const g = c.createLinearGradient((u - .06) * W, 0, (u + .06) * W, 0); g.addColorStop(0, 'rgba(12,12,12,0)'); g.addColorStop(.5, 'rgba(12,12,12,.9)'); g.addColorStop(1, 'rgba(12,12,12,0)'); c.fillStyle = g; c.fillRect((u - .06) * W, Hf * .06, .12 * W, Hf); } c.globalCompositeOperation = 'source-over'; }
  /* spots on the membrane */
  if (o.spots) { for (let i = 0; i < o.spots; i++) { const u = rnd() * W, r = .12 + .8 * rnd(), rr = 2 + rnd() * 5; c.fillStyle = rgba(o.spotCol || '#1a1a14', .55); c.beginPath(); c.ellipse(u, r * Hf, rr, rr * 1.5, 0, 0, TAU); c.fill(); } }
  /* rays: thick, branching towards the tip, segmented */
  for (let i = 0; i < nR; i++) {
    const x = i * du, spi = o.nsp && i < o.nsp;
    if (spi) {
      const g = c.createLinearGradient(0, 0, 0, Hf); g.addColorStop(0, rgba(mixc(ray, '#ffffff', .25), .95)); g.addColorStop(1, rgba(ray, .95));
      c.strokeStyle = g; c.lineWidth = rwid * 1.9; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, Hf); c.stroke();
      b.strokeStyle = 'rgb(235,235,235)'; b.lineWidth = rwid * 2.2; b.beginPath(); b.moveTo(x, 0); b.lineTo(x, Hf); b.stroke();
      continue;
    }
    const seg = (x0, r0, x1, r1, w, a) => { a *= RA; c.strokeStyle = rgba(ray, a); c.lineWidth = w; c.beginPath(); c.moveTo(x0, r0 * Hf); c.lineTo(x1, r1 * Hf); c.stroke(); b.strokeStyle = 'rgba(225,225,225,' + Math.min(1, a) + ')'; b.lineWidth = w * 1.2; b.beginPath(); b.moveTo(x0, r0 * Hf); b.lineTo(x1, r1 * Hf); b.stroke(); };
    const sp1 = .5 + (rnd() - .5) * .08, sp2 = .76 + (rnd() - .5) * .06, d1 = du * .27, d2 = du * .13;
    seg(x, 0, x, sp1, rwid * 1.1, .55); seg(x, sp1, x - d1, .995, rwid * .75, .5); seg(x, sp1, x + d1, .995, rwid * .75, .5);
    seg(x - d1, sp2, x - d1 - d2, .999, rwid * .5, .38); seg(x + d1, sp2, x + d1 + d2, .999, rwid * .5, .38);
    for (let r = .07; RA >= .05 && r < .98; r += .038 + rnd() * .012) { const w = (r < sp1 ? rwid * 1.7 : rwid * 1.3); c.strokeStyle = rgba(ray, .13 * RA); c.lineWidth = 1; c.beginPath(); c.moveTo(x - w * .5, r * Hf); c.lineTo(x + w * .5, r * Hf); c.stroke(); b.strokeStyle = 'rgba(90,90,90,.7)'; b.lineWidth = 1.4; b.beginPath(); b.moveTo(x - w * .6, r * Hf); c && b.lineTo(x + w * .6, r * Hf); b.stroke(); }
  }
  /* scaled sheath at the base (fin root merges with the body skin) */
  if (o.sheath) {
    const sr = o.sheath; c.globalCompositeOperation = 'source-over';
    const g = c.createLinearGradient(0, 0, 0, sr * Hf); g.addColorStop(0, rgba(o.base, 1)); g.addColorStop(.7, rgba(o.base, .92)); g.addColorStop(1, rgba(o.base, 0));
    c.fillStyle = g; c.fillRect(0, 0, W, sr * Hf);
    const sz = Math.max(9, du * .55);
    for (let rr = 0; rr < sr * Hf; rr += sz * .7) for (let x = ((rr / (sz * .7)) & 1 ? sz * .5 : 0); x < W + sz; x += sz) {
      const a = 1 - rr / (sr * Hf); c.strokeStyle = 'rgba(0,0,0,' + .16 * a + ')'; c.lineWidth = 1.3; c.beginPath(); c.arc(x, rr + sz * .3, sz * .55, -.9, .9); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,' + .2 * a + ')'; c.beginPath(); c.arc(x, rr + sz * .3, sz * .5, -.85, .85); c.stroke();
      b.strokeStyle = 'rgba(210,210,210,' + .7 * a + ')'; b.lineWidth = 1.4; b.beginPath(); b.arc(x, rr + sz * .3, sz * .5, -.85, .85); b.stroke();
    }
  }
  const mk = (cv, s) => { const t = new THREE.CanvasTexture(cv); t.flipY = false; t.anisotropy = 8; if (s) t.encoding = THREE.sRGBEncoding; t.needsUpdate = true; return t; };
  return { map: mk(C, true), bump: mk(B, false) };
}

/* ---- caudal ---- */
function caudalRays(sp, body) {
  const cd = sp.fins.caud, n = cd.n, len = cd.len, x0 = .985, hb = body.sec(.97).T - body.sec(.97).B, R = [], ty = cd.type;
  const hs = cd.span || len * ({ trunc: .44, emarg: .5, fork: .56, lunate: .52, round: .4, lyre: .6, angel: .5, veil: .55, shark: .6 }[ty] || .5);
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) * 2 - 1 : 0, at = Math.abs(t);
    let ex;
    switch (ty) {
      case 'trunc': ex = len * (.93 + .07 * Math.pow(at, 2.5)) * (1 - .05 * (1 - at * at)); break;
      case 'emarg': ex = len * (.8 + .2 * Math.pow(at, 1.4)); break;
      case 'fork': ex = len * (.5 + .5 * Math.pow(at, 1.25)); break;
      case 'lunate': ex = len * (.28 + .72 * Math.pow(at, 1.5)); break;
      case 'round': ex = len * (1 - .74 * Math.pow(at, 2.2)); break;
      case 'shark': ex = t > 0 ? len * (.32 + .68 * Math.pow(at, 1.4)) : len * (.26 + .34 * Math.pow(at, 1.2)); break;
      case 'veil': ex = len * (1 - .45 * Math.pow(at, 1.3)) + len * .12 * Math.sin(at * 5); break;
      case 'lyre': ex = len * (.58 + .42 * Math.pow(at, 1.15)) + len * .28 * Math.pow(at, 9); break;
      case 'shark': ex = t > 0 ? len * (.32 + .68 * Math.pow(t, 1.3)) : len * (.26 + .4 * Math.pow(at, 1.2)); break;
      case 'veil': ex = len * (1 - .5 * Math.pow(at, 1.3)) + len * (t < 0 ? .12 * at : 0); break;
      default: ex = len * (.5 + .5 * Math.pow(at, 1.5));
    }
    const P = [x0, t * hb * .42, 0], E = [x0 + ex, (ty === 'shark' ? (t > 0 ? t * len * .8 : t * len * .3) : ty === 'veil' ? t * hs - .12 * len * at : t * hs), 0], D = [E[0] - P[0], E[1] - P[1], 0], L = Math.hypot(D[0], D[1]);
    const bend = ty === 'veil' ? .38 : ty === 'shark' ? .14 : ty === 'lunate' ? .5 : ty === 'fork' || ty === 'lyre' ? .16 : .05;
    R.push({ p: P, d: n3(D), L, cv: [0, -Math.sign(t) * bend / Math.max(L, .01) * .5, 0], spine: false, edgeT: at });
  }
  return R;
}

/* ---- pectoral / pelvic ---- */
function pectoralRays(sp, body, side) {
  const pc = sp.fins.pect, n = pc.n, R = [], yc = body.yAtF(pc.x, pc.m), tilt = rad(pc.tilt);
  const top = yc + pc.w * .5, bot = yc - pc.w * .5;
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0, y = lerp(top, bot, t), z = side * (body.surf(pc.x, y) - .004), ph = rad(lerp(48, -58, t)) + rad(-16);
    let L;
    if (pc.shape === 'falcate') L = pc.len * (1 - .62 * t); else L = pc.len * (.64 + .36 * Math.cos(PI * (t - .32) * .85));
    const dx = Math.cos(ph), dy = Math.sin(ph);
    R.push({ p: [pc.x + .002 * t, y, z], d: n3([dx * Math.cos(tilt), dy, side * (Math.abs(dx) * Math.sin(tilt) + .05)]), L, cv: [.35 / L * (pc.shape === 'falcate' ? .5 : .3), -.1 / L, side * .12 / L], spine: !!pc.spine && i === 0 });
  }
  return R;
}
function pelvicRays(sp, body, side) {
  const pv = sp.fins.pelv, n = pv.n, R = [], q = body.sec(pv.x + pv.w * .5);
  const zoff = side * Math.min(q.w * .5, pv.w * 1.1 + .006);
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0, x = pv.x + t * pv.w * .9, qq = body.sec(x), a = rad(lerp(24, 68, t));
    let L = pv.len * (1 - .38 * Math.pow(t, 1.2)); if (pv.filament) L = i === 0 ? pv.len : pv.len * .32;
    R.push({ p: [x, qq.B + .004, zoff], d: n3([Math.sin(a), -Math.cos(a), side * .28]), L, cv: [.22 / L, 0, side * .08 / L], spine: !!pv.spine && i === 0 });
  }
  return R;
}

