// @@PART js/05_genus_b.js (lines 725-870 of the original <script>) -- stripped by build.mjs
/* ---------- palette / patterns ---------- */
function makePalette(r, hab) {
  let d, m, b, acc, acc2, silver;
  switch (hab) {
    case 'sea': { const h = GR(r, .5, .62); d = hsx(h, GR(r, .45, .8), GR(r, .12, .26)); m = hsx(h + .01, GR(r, .08, .3), GR(r, .6, .78)); b = hsx(.55, .06, .93); acc = hsx(GP(r, [.13, .16, .5, .33]), .85, .55); acc2 = hsx(.12, .9, .6); silver = GR(r, .6, .95); break; }
    case 'reef': { const h = r(); d = hsx(h, GR(r, .6, .95), GR(r, .3, .48)); m = hsx(h + GR(r, -.08, .08), GR(r, .6, .95), GR(r, .45, .6)); b = hsx(h + GR(r, -.1, .1), GR(r, .4, .9), GR(r, .62, .8)); acc = hsx(h + .5, .85, .55); acc2 = hsx(h + GR(r, .15, .35), .9, .6); silver = GR(r, .05, .35); break; }
    case 'river': { const h = GR(r, .06, .2); d = hsx(h, GR(r, .25, .55), GR(r, .16, .28)); m = hsx(h + .01, GR(r, .2, .5), GR(r, .4, .6)); b = hsx(h, GR(r, .15, .4), GR(r, .78, .9)); acc = hsx(GP(r, [.02, .08, .98]), .7, .5); acc2 = hsx(.1, .6, .6); silver = GR(r, .15, .6); break; }
    case 'lake': { const h = GR(r, .14, .34); d = hsx(h, GR(r, .3, .55), GR(r, .14, .26)); m = hsx(h + .02, GR(r, .25, .5), GR(r, .42, .6)); b = hsx(h, GR(r, .2, .4), GR(r, .8, .9)); acc = hsx(GP(r, [.06, .1, .0]), .75, .52); acc2 = hsx(.14, .7, .6); silver = GR(r, .1, .5); break; }
    case 'deep': { const h = GP(r, [0, .75, .85, .08]); d = hsx(h, GR(r, .2, .5), GR(r, .03, .09)); m = hsx(h, GR(r, .2, .5), GR(r, .06, .14)); b = hsx(h, GR(r, .15, .4), GR(r, .08, .2)); acc = hsx(GP(r, [.5, .45, .33, .6]), .9, .6); acc2 = hsx(GP(r, [.0, .12, .85]), .9, .55); silver = GR(r, 0, .1); break; }
    default: { const h = r(); d = hsx(h, .8, .25); m = hsx(h + .15, .85, .5); b = hsx(h + .3, .7, .75); acc = hsx(h + .5, .95, .6); acc2 = hsx(h + .7, .95, .6); silver = GR(r, .3, .9); }
  }
  return { d, m, b, acc, acc2, silver };
}
function makePats(r, hab, pal, P) {
  const pats = [], dark = dk(pal.d, .45), a1 = pal.acc, ln = { v: .4, col: lt(pal.m, .4), a: .2 };
  if (hab !== 'fantasy' && GC(r, .7)) pats.push({ k: 'mottle', col: dark, a: GR(r, .25, .55), sc: GR(r, 14, 34), v0: 0, v1: GR(r, .4, .7) });
  const opts = hab === 'reef' ? ['bars', 'stripes', 'spots', 'clown', 'ocellus', 'lband', 'bars'] : (hab === 'river' || hab === 'lake') ? ['lband', 'spots', 'bars', 'mottle', 'stripes', 'none'] : hab === 'sea' ? ['none', 'wave', 'lband', 'spots', 'vbars'] : hab === 'deep' ? ['none', 'none', 'spots'] : ['stripes', 'bars', 'patches', 'spots', 'gradient', 'lband', 'clown', 'ocellus', 'gradient'];
  const kind = GP(r, opts), n = 1 + (GC(r, .35) ? 1 : 0);
  for (let q = 0; q < n; q++) {
    const kd = q ? GP(r, opts) : kind, col = GC(r, .55) ? dark : GP(r, [a1, pal.acc2, '#f4f0e6']);
    switch (kd) {
      case 'lband': pats.push({ k: 'lband', v: GR(r, .34, .42), w: GR(r, .03, .1), col, a: GR(r, .6, .95), x0: .1, x1: .98, blot: GC(r, .5) ? GR(r, .2, .6) : 0, soft: GC(r, .4) ? 1 : 0 }); break;
      case 'stripes': { const k = 2 + ((r() * 4) | 0); for (let i = 0; i < k; i++) pats.push({ k: 'lband', v: lerp(.16, .64, i / (k - 1)), w: GR(r, .012, .022), col, a: GR(r, .6, .9), x0: .1, x1: .97, blot: 0 }); break; }
      case 'bars': { const k = 3 + ((r() * 6) | 0), s0 = GR(r, .3, .4), xs = []; for (let i = 0; i < k; i++) xs.push(lerp(s0, .86, i / (k - 1))); pats.push({ k: 'bars', xs, w: GR(r, .014, .04), col, a: GR(r, .4, .9), v0: -.05, v1: GR(r, .7, 1.05), wob: .3 }); break; }
      case 'clown': { const xs = GP(r, [[.14, .5, .94], [.16, .55], [.5]]); pats.push({ k: 'vbars', xs, w: GR(r, .03, .05), col: '#f7f4ee', a: 1, v0: -.1, v1: 1.1, soft: .3, edge: '#0b0b0b', edgeW: .01 }); break; }
      case 'vbars': { const xs = []; for (let i = 0; i < 8; i++) xs.push(.3 + i * .07); pats.push({ k: 'vbars', xs, w: .005, col: '#f4f4d8', a: .3, v0: .66, v1: .96 }); break; }
      case 'spots': pats.push({ k: 'spots', col, a: GR(r, .6, .85), r: [.0016, GR(r, .004, .008)], n: (GR(r, 80, 700)) | 0, v0: .04, v1: GR(r, .55, .9), x0: .1, x1: .98, bean: GC(r, .2) }); break;
      case 'patches': pats.push({ k: 'patches', cols: [GP(r, [pal.acc, '#e2401c', pal.acc2]), '#141414'], sc: GR(r, 5, 11), th: GR(r, .52, .62), v0: 0, v1: .85 }); break;
      case 'wave': pats.push({ k: 'wave', v0: 0, v1: .3, col: dark, a: .35 }); break;
      case 'gradient': pats.push({ k: 'gradient', cols: [pal.acc, pal.acc2, pal.m, pal.acc], a: .8, v0: -.1, v1: 1.1 }); break;
      case 'ocellus': pats.push({ k: 'blotch', x: GR(r, .78, .88), v: GR(r, .28, .4), rx: .05, ry: .07, col: '#f2ecd0', a: .9 }, { k: 'blotch', x: 0, v: 0, rx: 0, ry: 0, col: '#000', a: 0 }); { const q0 = pats[pats.length - 2]; pats[pats.length - 1] = { k: 'blotch', x: q0.x, v: q0.v, rx: .03, ry: .045, col: '#0a0a0a', a: .95 }; } break;
      default: if (kd === 'mottle') pats.push({ k: 'mottle', col: dark, a: .5, sc: GR(r, 16, 30), v0: 0, v1: .6 });
    }
  }
  return { pats, ll: { v: GR(r, .32, .44), col: lt(pal.m, .5), a: GR(r, .15, .35), arc: GC(r, .3) } };
}

/* ---------- mutations: fish that don't exist ---------- */
const MUTS = ['horn', 'sail', 'wings', 'crest', 'whiskers', 'lure', 'glow', 'veil', 'spikes', 'armor'];
function applyMut(name, sp, r) {
  const F = sp.fins, hd = sp.head, D = sp.D;
  switch (name) {
    case 'horn': hd.horn = { len: GR(r, .12, .3), base: GR(r, .018, .03) }; break;
    case 'sail': F.dorsal = [fin(.22, GR(r, .72, .86), GR(r, .28, .46), 30, 'angel', { notch: .04 })]; break;
    case 'wings': F.pect = Object.assign({}, F.pect || { x: hd.gillX * 1.05, m: -.1, w: .06, tilt: 26 }, { len: GR(r, .34, .55), n: 22, shape: 'falcate', w: .09, m: -.05 }); break;
    case 'crest': if (F.dorsal.length) { const f0 = F.dorsal[0]; f0.x0 = GR(r, .04, .1); f0.n = Math.max(f0.n, 18); f0.h = Math.max(f0.h, D * .45); f0.shape = f0.shape === 'spiny' ? 'spiny' : 'lobe'; } break;
    case 'whiskers': { const L = GR(r, .2, .5); hd.barbels = (hd.barbels || []).concat([{ x: hd.xr * .3, m: -.2, len: L, dir: [-.6, -.5, .9] }, { x: hd.xr * .5, m: -.4, len: L * .8, dir: [-.3, -.9, .8] }]); break; }
    case 'lure': hd.lure = { len: GR(r, .14, .3) }; break;
    case 'glow': sp.skin.glow = { col: GP(r, ['#5ff2ff', '#8dff7a', '#ff6ad5', '#ffd35a', '#7aa0ff']), n: (GR(r, 60, 240)) | 0, neon: GC(r, .6) }; break;
    case 'veil': F.caud = { type: 'veil', len: GR(r, .5, .85), n: 34 }; break;
    case 'spikes': sp.spikes = { n: (GR(r, 8, 24)) | 0, h: GR(r, .02, .055) }; break;
    case 'armor': sp.skin.scale = { size: GR(r, .05, .078), kind: 'cycloid' }; sp.skin.sheen = .7; break;
  }
}

/* ---------- names ---------- */
const HUE_NAMES = [[0, 'Crimson'], [.03, 'Scarlet'], [.07, 'Amber'], [.11, 'Golden'], [.16, 'Lemon'], [.25, 'Olive'], [.33, 'Emerald'], [.45, 'Teal'], [.53, 'Azure'], [.62, 'Cobalt'], [.72, 'Violet'], [.82, 'Magenta'], [.92, 'Rose'], [1, 'Crimson']];
function hueName(hexc) { const [R, G, B] = hex(hexc).map(v => v / 255), mx = Math.max(R, G, B), mn = Math.min(R, G, B), l = (mx + mn) / 2; if (mx - mn < .08) return l > .7 ? 'Silver' : l < .2 ? 'Sooty' : 'Ashen'; let h = mx === R ? ((G - B) / (mx - mn) + (G < B ? 6 : 0)) / 6 : mx === G ? ((B - R) / (mx - mn) + 2) / 6 : ((R - G) / (mx - mn) + 4) / 6; for (let i = 0; i < HUE_NAMES.length - 1; i++) if (h < HUE_NAMES[i + 1][0]) return (l < .22 ? 'Dusky ' : '') + HUE_NAMES[i][1]; return 'Crimson'; }
const PAT_W = { lband: ['striped', 'lined'], stripes: ['striped', 'lined'], bars: ['banded', 'barred'], clown: ['banded'], vbars: ['banded'], spots: ['spotted', 'freckled', 'speckled'], patches: ['marbled', 'blotched'], wave: ['marbled'], gradient: ['prismatic', 'rainbow'], ocellus: ['eyespot', 'ocellated'], mottle: ['mottled', 'marbled'] };
const PAT_L = { lband: 'lineatus', stripes: 'vittatus', bars: 'fasciatus', clown: 'cinctus', vbars: 'fasciatus', spots: 'maculatus', patches: 'marmoratus', wave: 'undulatus', gradient: 'iridescens', ocellus: 'ocellatus', mottle: 'marmoratus' };
const COL_L = { Crimson: 'rubr', Scarlet: 'coccin', Amber: 'fulv', Golden: 'aur', Lemon: 'flav', Olive: 'oliv', Emerald: 'viridi', Teal: 'cyan', Azure: 'azur', Cobalt: 'cyan', Violet: 'violac', Magenta: 'purpur', Rose: 'rosae', Silver: 'argent', Sooty: 'nigr', Ashen: 'cinere', 'Dusky Crimson': 'nigr' };
const PLACE = { reef: ['Reef', 'Coral', 'Lagoon'], river: ['River', 'Creek', 'Torrent'], lake: ['Lake', 'Pond', 'Mere'], sea: ['Ocean', 'Pelagic', 'Blue-water'], deep: ['Abyssal', 'Midnight', 'Deep-sea'], fantasy: ['Phantom', 'Aurora', 'Ember', 'Crystal', 'Storm', 'Void', 'Mythic', 'Astral'] };
function nameFish(r, sp, ar, hab, pats, muts) {
  const P = Object.assign({}, DEF, AR[ar]), col = hueName((hab === 'reef' || hab === 'fantasy') ? sp.skin.pal.m : sp.skin.pal.d), pk = pats.find(p => PAT_W[p.k] && p.k !== 'mottle') || pats[0], pw = pk ? GP(r, PAT_W[pk.k] || ['plain']) : null;
  const noun = muts.includes('lure') ? 'Anglerfish' : muts.includes('sail') ? 'Sailfin' : GP(r, P.noun || ['Fish']);
  const pre = muts.includes('glow') ? 'Lantern' : muts.includes('horn') ? 'Unicorn' : muts.includes('veil') ? 'Veiltail' : muts.includes('spikes') ? 'Thorn' : muts.includes('armor') ? 'Plated' : null;
  let title;
  if (hab === 'fantasy') title = GP(r, PLACE.fantasy) + ' ' + (pre ? pre + ' ' : '') + noun; else title = (pw ? col + '-' + pw + ' ' : col + ' ') + (GC(r, .5) ? GP(r, PLACE[hab]) + ' ' : '') + (pre ? pre + ' ' : '') + noun;
  title = title.replace(/-([a-z])/, (m, c) => '-' + c);
  const cl = COL_L[col.replace('Dusky ', '')] || 'pallid', latin = P.stem + ' ' + cl + (pk && PAT_L[pk.k] ? PAT_L[pk.k] : 'us');
  return { common: title.replace(/  +/g, ' '), latin };
}

/* ---------- the generator ---------- */
function makeFish(r, o) {
  o = o || {};
  const hab = o.hab && HABS.includes(o.hab) ? o.hab : GP(r, ['reef', 'river', 'lake', 'sea', 'sea', 'deep', 'reef', 'river']);
  const fant = hab === 'fantasy', weird = clamp(o.weird === undefined ? (fant ? .75 : .18) : o.weird, 0, 1);
  const ar = o.arch && AR[o.arch] ? o.arch : (fant ? GP(r, Object.keys(AR)) : pickWeighted(r, HAB_W[hab]));
  const A = Object.assign({}, DEF, AR[ar]);
  const P = {}, RAW = ['tail', 'scale', 'noun', 'swim', 'cm']; for (const k in A) P[k] = Array.isArray(A[k]) && !RAW.includes(k) ? rg(r, A[k]) : A[k];
  P.tail = A.tail; P.scale = A.scale; P.HL = P.HL; P.xD = A.xD;
  const prof = profile({ D: P.D, xD: P.xD, sn: P.sn, hh: P.hh, ped: P.ped, mid: P.mid, tsH: P.tsH, tsM: P.tsM, wH: P.wH, wM: P.wM, wP: P.wP });
  const HL = P.HL, pal = makePalette(r, hab), F = layoutFins(P.lay, r, P);
  const cm0 = Math.exp(lerp(Math.log(A.cm[0]), Math.log(A.cm[1]), Math.pow(r(), o.size === 'small' ? 3 : o.size === 'large' ? .35 : 1))), cm = o.size === 'small' ? Math.min(cm0, A.cm[0] * 1.6) : o.size === 'large' ? Math.max(cm0, A.cm[1] * .7) : cm0;
  const tiny = clamp(1.5 - Math.log10(Math.max(cm, 2)) * .5, 1, 1.35);
  const tk = P.teeth, tl = rg(r, P.tlen), mouthCol = GP(r, ['#d9b7a4', '#d6a08a', '#cfae9f', '#c99a8e']), lipCol = (P.lipT > .006 || A.stem === 'Labrichthys') ? (hab === 'reef' || fant ? GP(r, [pal.acc, pal.acc2, pal.m]) : dk(pal.m, .2)) : undefined;
  const barbels = [];
  if (P.barb === 3) barbels.push({ x: HL * .2, m: .1, len: GR(r, .09, .16), dir: [-.5, .15, 1], nasal: true }, { x: HL * .14, m: -.5, len: GR(r, .07, .11), dir: [-.4, -.5, 1] }, { x: HL * .22, m: -.8, len: .06, dir: [-.2, -1, .6] });
  else if (P.barb === 2) barbels.push({ x: HL * .12, m: -.18, len: .05, dir: [-.6, -.7, .1] }, { x: HL * .24, m: -.22, len: .04, dir: [-.4, -.8, .2] });
  else if (P.barb === 1) barbels.push({ x: HL * .14, m: -.7, len: GR(r, .05, .08), dir: [-.25, -1, 0] });
  const gx = HL, eyeR = Math.min(HL * .15, HL * P.eyeK * tiny * (GC(r, .12) ? 1.35 : 1) * (hab === 'deep' && ar !== 'deep' ? 1.4 : 1));
  const irisC = GP(r, [pal.acc, '#c79a3a', '#d3a13a', '#d6c589', '#a02a1a', '#7a9a3a', '#3a5a9a']);
  const sp = {
    key: ar, common: '', latin: '', family: HAB_LABEL[hab] + ' · ' + A.fam, ...prof, nT: P.nT, nB: P.nB, xc: .03, tipY: 0,
    head: {
      xr: HL * P.mouthK, mT: P.mT, mR: P.mR, lipT: P.lipT, gillX: gx, gillB: .024, hOp: P.gills ? .0004 : .0055 * Math.sqrt(HL / .3),
      eye: { x: gx * (ar === 'disc' ? .38 : .31), m: P.eyeM, r: eyeR, iris: irisC, ring: dk(pal.d, .6) }, nostril: { x: HL * .17, m: .62 },
      teeth: { kind: tk, len: tl }, barbels, mouthCol, tongueCol: lt(mouthCol, .15), maxilla: P.maxilla, maxH: P.maxH || HL * .075, lipCol, open: P.open, under: P.under, gills: P.gills || 0
    },
    fins: F,
    skin: { pal: { d: pal.d, m: pal.m, b: pal.b }, silver: pal.silver, scale: { size: rg(r, A.scale[1]) * (A.scale[0] === 'none' ? 0 : 1), kind: A.scale[0] }, sheen: P.sheen, pats: [], ll: null },
    fc: {}, swim: P.swim, cm, arch: ar, hab, mutations: []
  };
  if (P.gills) { sp.head.eye.x = gx * .34; }
  const pt = makePats(r, hab, pal, P); sp.skin.pats = pt.pats; sp.skin.ll = pt.ll;
  /* fin colouring */
  const style = GP(r, hab === 'reef' || fant ? ['tint', 'tint', 'clear', 'dark'] : hab === 'deep' ? ['dark', 'dark', 'tint'] : ['clear', 'tint', 'dark', 'clear']);
  const acc = GP(r, [pal.acc, pal.acc2]);
  if (P.lay === 'shark') sp.fc = { mem: pal.d, ray: pal.d, alpha: .6, tip: dk(pal.d, .25), dark: dk(pal.d, .3), solid: true, rayA: 0 };
  else if (style === 'clear') sp.fc = { mem: lt(pal.m, .25), ray: dk(pal.d, .2), alpha: GR(r, .26, .42), tip: lt(pal.m, .45), dark: pal.d };
  else if (style === 'tint') sp.fc = { mem: acc, ray: dk(acc, .45), alpha: GR(r, .45, .65), tip: GP(r, [pal.acc2, lt(acc, .3)]), dark: dk(acc, .4) };
  else sp.fc = { mem: lt(pal.d, .15), ray: dk(pal.d, .3), alpha: GR(r, .45, .65), tip: pal.m, dark: dk(pal.d, .2) };
  if (GC(r, .18) && (hab === 'reef' || fant)) sp.fc.rimBlack = true;
  if (GC(r, .15) && sp.fc.dark) sp.fc.spotted = true;
  if (P.lay === 'eel' || P.lay === 'deep') { sp.fc.alpha = Math.min(sp.fc.alpha, .55); }
  /* mutations */
  const nMut = fant ? 2 + ((r() * 3) | 0) : Math.floor(weird * 3.2 * r());
  const pool = MUTS.slice(); const forced = (o.muts || []).slice();
  for (const m of forced) if (MUTS.includes(m) && !sp.mutations.includes(m)) { applyMut(m, sp, r); sp.mutations.push(m); }
  if (ar === 'deep' && GC(r, .6) && !sp.mutations.includes('lure')) { applyMut('lure', sp, r); sp.mutations.push('lure'); }
  if (hab === 'deep' && GC(r, .7) && !sp.mutations.includes('glow')) { applyMut('glow', sp, r); sp.mutations.push('glow'); }
  for (let i = 0; i < nMut; i++) { const m = pool.splice((r() * pool.length) | 0, 1)[0]; if (!m || sp.mutations.includes(m)) continue; if (m === 'crest' && (P.lay === 'eel' || P.lay === 'shark')) continue; applyMut(m, sp, r); sp.mutations.push(m); }
  if (sp.skin.glow) { sp.fc.glowCol = sp.skin.glow.col; }
  const nm = nameFish(r, sp, ar, hab, sp.skin.pats, sp.mutations); sp.common = nm.common; sp.latin = nm.latin;
  return sp;
}

/* ---------- typed-name hints ---------- */
const HINT = {
  hab: { reef: 'reef', coral: 'reef', lagoon: 'reef', river: 'river', creek: 'river', stream: 'river', brook: 'river', lake: 'lake', pond: 'lake', ocean: 'sea', sea: 'sea', pelagic: 'sea', deep: 'deep', abyss: 'deep', abyssal: 'deep', dark: 'deep', midnight: 'deep', fantasy: 'fantasy', dragon: 'fantasy', mythic: 'fantasy', magic: 'fantasy', alien: 'fantasy', cosmic: 'fantasy', phantom: 'fantasy', crystal: 'fantasy', rainbow: 'fantasy', astral: 'fantasy', void: 'fantasy' },
  arch: { shark: 'shark', eel: 'eel', moray: 'eel', snake: 'eel', angler: 'deep', viper: 'deep', fangtooth: 'deep', gulper: 'deep', puffer: 'globe', globe: 'globe', box: 'globe', angel: 'disc', disc: 'disc', discus: 'disc', moon: 'disc', catfish: 'catfish', cod: 'cod', hake: 'cod', carp: 'carp', koi: 'carp', barb: 'carp', trout: 'salmon', salmon: 'salmon', char: 'salmon', cichlid: 'cichlid', tilapia: 'cichlid', scorpion: 'sculpin', stone: 'sculpin', sculpin: 'sculpin', lion: 'sculpin', pike: 'elongate', needle: 'elongate', gar: 'elongate', barracuda: 'elongate', tuna: 'fusiform', mackerel: 'fusiform', marlin: 'fusiform', jack: 'jack', pompano: 'jack', trevally: 'jack', wrasse: 'wrasse', parrot: 'wrasse', damsel: 'damsel', clown: 'damsel', tetra: 'tetra', minnow: 'tetra', guppy: 'tetra', bass: 'perch', perch: 'perch' },
  mut: { horn: 'horn', unicorn: 'horn', sail: 'sail', sailfish: 'sail', wing: 'wings', wings: 'wings', flying: 'wings', whisker: 'whiskers', whiskers: 'whiskers', barbel: 'whiskers', glow: 'glow', glowing: 'glow', neon: 'glow', lantern: 'glow', light: 'glow', bioluminescent: 'glow', veil: 'veil', betta: 'veil', fancy: 'veil', spike: 'spikes', spiky: 'spikes', spiny: 'spikes', thorn: 'spikes', armor: 'armor', armored: 'armor', plated: 'armor', crown: 'crest', crest: 'crest', lure: 'lure' },
  size: { tiny: 'small', small: 'small', mini: 'small', nano: 'small', baby: 'small', giant: 'large', huge: 'large', big: 'large', colossal: 'large', great: 'large', monster: 'large' }
};
function parseHints(q) {
  const w = q.toLowerCase().split(/[^a-z]+/).filter(Boolean), h = { muts: [] };
  for (const t of w) {
    if (HINT.hab[t] && !(h.hab && t === 'sea')) h.hab = HINT.hab[t]; if (HINT.arch[t]) h.arch = HINT.arch[t]; if (HINT.mut[t] && !h.muts.includes(HINT.mut[t])) h.muts.push(HINT.mut[t]); if (HINT.size[t]) h.size = HINT.size[t];
    if (['dragon', 'alien', 'cosmic', 'mythic', 'astral', 'void'].includes(t)) h.weird = .95;
  }
  h.any = !!(h.hab || h.arch || h.muts.length || h.size || h.weird);
  return h;
}

'use strict';
