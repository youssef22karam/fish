// @@PART js/11_genome_adapter_a.js (lines 1700-1789 of the original <script>) -- stripped by build.mjs
/* ===== Procedural Fish Genome → FishDraw 3D adapter (v8) =====
   Every number comes from the generator's Genome; x is remapped so snouts (bill/needle/tube) live inside the 0..1 body axis. */
const GEN_ARCH = FGEN.ARCHETYPES;
const GEN_WIDTH = { Perciform: [.6, .58, .4], Scombrid: [.62, .7, .6], Shark: [.8, .8, .5], Moray: [.9, .9, .7], Catfish: [1.1, .8, .38], Anglerfish: [.85, .8, .4], Dragonfish: [.55, .5, .4], Pufferfish: [.8, .78, .5], Cichlid: [.5, .5, .4], Cyprinid: [.58, .58, .4], Gar: [.8, .8, .6], Billfish: [.6, .65, .6], Sturgeon: [.85, .85, .5], Pike: [.6, .62, .5], Grouper: [.62, .62, .4], Parrotfish: [.6, .6, .4], Piranha: [.42, .42, .3], Pipefish: [.9, .9, .8], Salmonid: [.55, .55, .45], Goby: [.9, .75, .4] };
const GEN_ALIAS = { eel: 'Moray', marlin: 'Billfish', sailfish: 'Billfish', swordfish: 'Billfish', tuna: 'Scombrid', mackerel: 'Scombrid', trout: 'Salmonid', salmon: 'Salmonid', carp: 'Cyprinid', koi: 'Cyprinid', barb: 'Cyprinid', puffer: 'Pufferfish', angler: 'Anglerfish', bass: 'Perciform', perch: 'Perciform', dragon: 'Dragonfish', pipe: 'Pipefish', parrot: 'Parrotfish', cat: 'Catfish', gobi: 'Goby', sturg: 'Sturgeon' };
function genArchFromText(q) { q = q.toLowerCase(); for (const a of GEN_ARCH) if (q.includes(a.toLowerCase().replace('fish', ''))) return a; for (const k in GEN_ALIAS) if (q.includes(k)) return GEN_ALIAS[k]; return undefined; }
const hslHex = s => { const m = s.match(/-?[\d.]+/g).map(Number); return toHex(hsl2rgb(m[0] / 360, m[1] / 100, m[2] / 100)); };

function g2prof(g) {
  const N = 220, vent = ['inferior', 'shark', 'sucker'].includes(g.mouth.type), aB = g.aBot * (vent ? 1.35 : 1);
  const raw = a => { const b = a * (1 - g.p) / g.p, arr = new Float32Array(N + 1); let m = 0; for (let i = 0; i <= N; i++) { const x = i / N; arr[i] = Math.pow(x, a) * Math.pow(1 - x, b); m = Math.max(m, arr[i]); } for (let i = 0; i <= N; i++) { const x = i / N, f = arr[i] / m, pd = g.ped * sst(.3, 1, x); arr[i] = Math.sqrt(f * f + pd * pd); } return arr; };
  const T = raw(g.aTop), B = raw(aB);
  for (let i = 0; i <= N; i++) {
    const x = i / N, mod = Math.max(.35, 1 + g.hump * Math.exp(-(((x - g.humpX) / .09) ** 2)) - g.concave * Math.exp(-(((x - g.hl * .5) / (g.hl * .4)) ** 2)));
    T[i] = g.D * g.topFrac * T[i] * mod; B[i] = g.D * (1 - g.topFrac) * B[i] * (g.bellyFlat ? 1 - g.bellyFlat * .35 * Math.exp(-(((x - g.hl * .4) / (g.hl * .5)) ** 2)) : 1);
  }
  const L = (a, x) => { const f = clamp(x, 0, 1) * N, i = f | 0, j = Math.min(N, i + 1); return a[i] + (a[j] - a[i]) * (f - i); };
  return { T: x => L(T, x), B: x => L(B, x) };
}

function g2spec(g, rnd) {
  const M = g.mouth, t = M.type, s = M.snout || 0, Ls = 1 + s, mx = x => (x + s) / Ls, ml = v => v / Ls;   // 2D x → 3D x; lengths → 3D units
  const P = g2prof(g), c0 = M.tipY * g.D, cc = x => x < 0 ? c0 : M.tipY * g.D * Math.pow(Math.max(0, 1 - x / g.hl), 2), cn = x => .25 * cc(x);   // cn: calm outline centre-line, cc: exact 2D mouth level
  const xb = g.hl * (t === 'bill' ? .32 : t === 'tube' ? .5 : .38), th0 = g.D * (t === 'tube' ? .09 : t === 'bill' ? .035 : .042);
  const bill = x => s > 0 ? th0 * Math.sqrt(clamp((x + s) / (xb + s), 0, 1)) * (1 - sst(xb, xb * 1.9, x)) : 0;
  const Tt = x => Math.max(x < 0 ? 0 : P.T(x), bill(x)), Bb = x => Math.max(x < 0 ? 0 : P.B(x), bill(x));
  const f = (x, ym) => { const tt = Tt(x), bb = Bb(x); return clamp(1 - 2 * (ym - (cn(x) - tt)) / Math.max(1e-5, tt + bb), -.92, .92); };
  const top = x => (Tt(x * Ls - s) - cn(x * Ls - s)) / Ls, bot = x => -(Bb(x * Ls - s) + cn(x * Ls - s)) / Ls;
  const W = GEN_WIDTH[g.archetype] || [.6, .58, .4], xD = mx(g.p), wr = pchip([[0, .75], [.03, W[0] * .92], [.07, W[0]], [.14, W[0]], [Math.max(xD, .2), W[1]], [.7, W[1] * .84], [.92, W[2]], [1, W[2] * .3]]);
  const hl = g.hl, vent = ['inferior', 'shark', 'sucker'].includes(t), snouted = s > 0, std = ['terminal', 'superior', 'underbite', 'gape', 'protrusible'].includes(t);
  const K = { terminal: .12, superior: .35, underbite: .3, gape: .5, protrusible: .04 }[t];
  let xr, mT, mR, under = 0, yy0, yy1;
  if (std) { xr = mx(M.len); mT = f(.015, c0); mR = f(M.len, cn(M.len) + Bb(M.len) * K); under = clamp(ml(M.prot) * (t === 'gape' ? .45 : 1) * .4, -.008, .012); yy0 = -ml(c0); yy1 = -ml(cn(M.len) + Bb(M.len) * K); }
  else if (t === 'needle') { xr = mx(M.len); mT = .05; mR = -.08; under = ml(M.prot); }
  else if (t === 'bill') { xr = mx(M.len * 1.2); mT = .1; mR = -.22; under = -ml(Math.max(0, s - .04)); }
  else if (t === 'tube') { xr = mx(.012); mT = 0; mR = 0; }
  else if (t === 'beak') { xr = mx(M.len); mT = f(.01, c0); mR = f(M.len, c0); }
  else { xr = mx(.012); mT = -.7; mR = -.7; }                      // ventral mouths get dedicated lips (see ventralParts)
  const ex = g.eye.x * hl, ett = Tt(ex), ebb = Bb(ex), eyeR = Math.min(ml(g.eye.r), ml((ett + ebb) * .33));
  const kind = { none: 'none', small: 'villiform', cardiform: 'villiform', fangs: 'canine', serrated: 'razor', plates: 'beak', rows: 'razor' }[M.teeth];
  const tsz = Math.max(.003, g.D * .025) * (M.teeth === 'fangs' ? 1.3 : 1) / Ls;
  const dark = hslHex(g.col.dorsal), mid = hslHex(g.col.flank), bel = hslHex(g.col.belly), acc = hslHex(g.col.accent), acc2 = hslHex(g.col.accent2), fin_ = hslHex(g.col.fin);
  const mouthCol = g.archetype === 'Shark' || t === 'gape' ? '#8a3a3a' : '#d9b7a4';
  const beakCol = g.archetype === 'Parrotfish' || g.col.hue > 140 ? hslHex(`hsl(${g.col.hue + 20} 55% 78%)`) : '#ece6d4';
  /* barbels */
  const barbels = [];
  for (let i = 0; i < M.barbels; i++) { if (i < 2) barbels.push({ x: xr * .95, m: mR, len: ml(M.barbelLen), dir: [-.5, -.45 + i * .25, 1] }); else barbels.push({ x: xr * (.55 - .1 * (i % 2)), m: -.95, len: ml(M.barbelLen) * .55, dir: [-.3, -1, (i % 2 ? .5 : -.5)] }); }
  if (M.chinBarbel) barbels.push({ x: xr * .5, m: -1, len: ml(M.barbelLen) * 2.2, dir: [-.2, -1, 0] });
  /* fins */
  const SH = { triangular: f_ => f_.spiny ? 'spiny' : 'lobe', falcate: () => 'sickle', rounded: () => 'lobe', sail: () => 'cichlid', long: f_ => f_.spiny ? 'cichlid' : 'flat', square: () => 'lobe' };
  const mkF = fn => { const e = Object.assign({}, fn); return fin(mx(fn.sx), mx(fn.ex), ml(fn.h), clamp(fn.rays || 9, 6, 60), SH[fn.shape](fn), { nsp: fn.spiny ? Math.min(14, Math.round((fn.rays || 10) * .4)) : 0, hs: ml(fn.h) * .2 }); };
  const CT = { forked: 'fork', lunate: 'lunate', truncate: 'trunc', emarginate: 'emarg', rounded: 'round', heterocercal: 'shark', pointed: 'round', confluent: 'round', lyre: 'lyre' };
  const cd = g.caudal, pc = g.pectoral, ptx = mx(hl * 1.04);
  const F = { dorsal: g.dorsal.map(mkF), anal: g.anal.map(mkF), caud: { type: CT[cd.type], len: ml(cd.type === 'confluent' ? .05 : cd.len + (cd.type === 'lunate' ? .02 : 0)), n: 26, span: ml(cd.span) },
    pect: { x: ptx, m: .1 - pc.y * 1.2, len: ml(pc.len), w: ml(pc.w), n: 15, shape: g.archetype === 'Shark' ? 'falcate' : 'round', tilt: clamp(pc.angle * 57, 16, 38) },
    pelv: g.pelvic.present ? { x: mx(Math.max(g.pelvic.x, hl * 1.1)), len: ml(g.pelvic.len), w: .03, n: 6, spine: g.dorsal.some(d => d.spiny) } : null };
  if (g.adipose) F.adipose = { x: mx(.83), w: .035, h: .02 };
  if (g.finlets) F.finlets = { n: g.finlets, dorsalX0: mx(.66), dorsalX1: mx(.9), analX0: mx(.68), analX1: mx(.9), h: .022 };
  if (g.dorsal.length === 1 && g.dorsal[0].shape === 'long' && g.caudal.type === 'confluent') { F.dorsal[0].notch = .05; F.anal.forEach(a => a.notch = .05); }
  /* skin & patterns */
  const sk = { pal: { d: dark, m: mid, b: bel }, silver: clamp(g.irid * 2, 0, 1), sheen: .35 + g.irid, ll: { v: .4, col: lt(mid, .5), a: .22 }, pats: [] };
  sk.scale = { size: g.scale === 'none' || g.scale === 'placoid' || g.scale === 'scutes' ? 0 : g.scaleSize, kind: g.scale === 'cycloid' ? 'cycloid' : 'ctenoid' };
  const mk = g.marks, v3 = v => (v + 1) / 2, aD = dk(acc, .5);
  switch (g.pattern) {
    case 'bars': case 'saddles': case 'tiger': sk.pats.push({ k: 'bars', xs: mk.map(m => mx(m.u)), w: g.pattern === 'tiger' ? .014 : .028, col: aD, a: .8, v0: g.pattern === 'saddles' ? -.05 : -.05, v1: g.pattern === 'saddles' ? .45 : 1.05, wob: g.pattern === 'tiger' ? .55 : .3 }); break;
    case 'clown': sk.pats.push({ k: 'vbars', xs: mk.map(m => mx(m.u)), w: .03, col: '#f7f4ee', a: 1, v0: -.1, v1: 1.1, soft: .3, edge: '#0b0b0b', edgeW: .01 }); break;
    case 'stripes': mk.forEach((m, i) => sk.pats.push({ k: 'lband', v: lerp(.2, .66, i / Math.max(1, mk.length - 1)), w: .018, col: aD, a: .8, x0: .1, x1: .97, blot: 0 })); break;
    case 'band': sk.pats.push({ k: 'lband', v: .4, w: .07, col: aD, a: .85, x0: .1, x1: .98, blot: .3 }); break;
    case 'spots': case 'leopard': sk.pats.push({ k: 'spots', col: aD, a: .8, r: [.0016, mk.reduce((a, m) => a + m.r, 0) / mk.length * .5 + .002], n: mk.length * 5, v0: .04, v1: .85, x0: .1, x1: .98 }); break;
    case 'ocelli': mk.forEach(m => { sk.pats.push({ k: 'blotch', x: mx(m.u), v: v3(m.v) * .7 + .1, rx: .045, ry: .06, col: '#f2ecd0', a: .9 }, { k: 'blotch', x: mx(m.u), v: v3(m.v) * .7 + .1, rx: .026, ry: .04, col: '#0a0a0a', a: .95 }); }); break;
    case 'reticulated': sk.pats.push({ k: 'mottle', col: aD, a: .75, sc: 26, v0: 0, v1: .9 }); break;
    case 'marbled': sk.pats.push({ k: 'mottle', col: aD, a: .6, sc: 14, v0: 0, v1: .85 }, { k: 'patches', cols: [acc2, aD], sc: 7, th: .58, v0: 0, v1: .8 }); break;
  }
  const fcDark = dk(dark, .2), fa = g.col.finAlpha;
  const sp = { key: g.archetype.toLowerCase(), common: g.common, latin: g.name, family: g.archetype + ' · ' + g.habitat + ' (' + g.depthRange + ')', D: g.D / Ls, top, bot, wr, nT: g.archetype === 'Cichlid' || g.archetype === 'Piranha' ? 2.3 : 2.1, nB: 2.3, xc: .03, eps: snouted ? .012 : .02,
    head: { xr, mT, mR, y0: yy0, y1: yy1, lipT: M.lip, gillX: mx(hl), gillB: .024, hOp: g.gill.type === 'operculum' ? .0055 * Math.sqrt(hl / .3) : .0004, gills: g.gill.type === 'slits' ? g.gill.n : 0,
      eye: { x: mx(ex), m: clamp(1 - 2 * ett * (1 - g.eye.y) / Math.max(1e-5, ett + ebb), -.9, .9), r: eyeR, iris: hslHex(g.eye.color), ring: dk(dark, .6) }, nostril: { x: mx(hl * .17), m: .62 },
      teeth: { kind, len: tsz }, barbels, mouthCol, tongueCol: lt(mouthCol, .15), maxilla: std && t !== 'protrusible', maxH: ml(hl * .075), lipCol: t === 'beak' ? beakCol : (t === 'protrusible' || g.archetype === 'Grouper' ? lt(dark, .1) : undefined), open: t === 'gape' ? .7 : .45, under: clamp(under, -.2, .025), noCavity: snouted,
      ventral: vent ? { type: t, x: mx(t === 'shark' ? hl * .28 : hl * .32), len: ml(M.len), lip: M.lip, D: g.D / Ls } : null },
    fins: F, skin: sk, fc: { mem: lt(fin_, .2), ray: dk(fin_, .45), alpha: clamp(fa * .65, .26, .65), tip: lt(fin_, .4), dark: fcDark, solid: g.archetype === 'Shark', rayA: g.archetype === 'Shark' ? 0 : undefined },
    swim: [1, 6.2], cm: g.sizeCm, arch: g.archetype, hab: g.habitat, mutations: [], genome: g };
  if (t === 'beak' && sp.head.teeth.kind !== 'beak') sp.head.teeth.kind = 'beak';
  if (g.lure) { applyMut('lure', sp, rnd); sp.mutations.push('lure'); }
  if (g.photophores) { applyMut('glow', sp, rnd); sp.mutations.push('glow'); }
  return sp;
}



'use strict';
