// @@PART js/02_species_a.js (lines 132-409 of the original <script>) -- stripped by build.mjs
/* ============================ species ============================ */
/* body profile: total height H(x) (SL units) + dorsal share; x = 0 snout tip … 1 end of caudal peduncle */
function profile(o) {
  const D = o.D, xD = o.xD, ped = o.ped;
  const sn = o.sn === undefined ? .45 : o.sn, hh = o.hh === undefined ? .78 : o.hh, mid = o.mid === undefined ? .5 : o.mid;
  const midx = lerp(xD, .88, .5);
  const H = pchip([[0, 0], [.014, .5 * sn * D], [.04, sn * D], [.09, lerp(sn, hh, .55) * D], [.14, hh * D], [Math.max(xD, .2), D], [midx, ped + (D - ped) * mid], [.88, ped * 1.12], [.95, ped], [1, ped * .82]]);
  const tsH = o.tsH === undefined ? .55 : o.tsH, tsM = o.tsM === undefined ? .55 : o.tsM;
  const ts = pchip([[0, .5 + (o.tip || 0)], [.13, tsH], [Math.max(xD, .2), tsM], [.88, .5], [1, .5]]);
  const wH = o.wH === undefined ? .62 : o.wH, wM = o.wM === undefined ? .58 : o.wM, wP = o.wP === undefined ? .42 : o.wP;
  const wr = pchip([[0, .75], [.03, wH * .92], [.07, wH], [.14, wH], [Math.max(xD, .2), wM], [.7, wM * .84], [.92, wP], [1, wP * .3]]);
  return { top: x => H(x) * ts(x), bot: x => -H(x) * (1 - ts(x)), wr, D };
}

/* fin colour presets */
const FC = {
  clear: (t, r) => ({ mem: t || '#c9d3c8', ray: r || '#5a5f52', alpha: .34, tip: t || '#d6dccf', edge: .0 }),
};

/* ---------- species factories: (rnd) => spec ---------- */
const SPECIES = {};
const V = (r, a, amt) => a * (1 + (r() - .5) * 2 * amt);

/* ===== Largemouth bass ===== */
SPECIES.bass = r => {
  const p = profile({ D: V(r, .27, .06), xD: .36, sn: .52, hh: .82, ped: V(r, .098, .06), mid: .52, tsH: .55, tsM: .57, wH: .62, wM: .6, wP: .38 });
  const green = jitterHex('#7c8b3f', r, .02, .05, .03);
  return {
    key: 'bass', common: 'Largemouth bass', latin: 'Micropterus salmoides', family: 'Sunfish family (Centrarchidae)',
    ...p, nT: 2.15, nB: 2.3, xc: .028, tipY: .004,
    head: {
      xr: V(r, .165, .05), mT: .1, mR: -.04, lipT: .0055, gillX: .305, gillB: .026, hOp: .0055,
      eye: { x: .094, m: .34, r: .0195, iris: '#c79a3a', ring: '#3a3b1c' }, nostril: { x: .05, m: .62 },
      teeth: { kind: 'villiform', len: .0024 }, barbels: [], mouthCol: '#d9b7a4', tongueCol: '#e5d0c4', maxilla: true, maxH: .022, open: .5
    },
    fins: {
      dorsal: [{ x0: .375, x1: .555, h: .07, nsp: 10, n: 10, shape: 'spiny', rake0: 8, rake1: 42, notch: .22 },
      { x0: .562, x1: .765, h: .085, nsp: 0, n: 13, shape: 'lobe', rake0: 30, rake1: 58, notch: .12 }],
      anal: [{ x0: .625, x1: .77, h: .075, nsp: 3, n: 11, shape: 'lobe', rake0: 30, rake1: 55, notch: .12, hs: .05 }],
      pect: { x: .318, m: -.18, len: .165, w: .05, n: 15, shape: 'round', tilt: 26 },
      pelv: { x: .345, len: .105, w: .03, n: 6, spine: true },
      caud: { type: 'trunc', len: .2, n: 24 }
    },
    skin: {
      pal: { d: '#33401a', m: green, b: '#e9e5c6' }, silver: .12, scale: { size: .0165, kind: 'ctenoid' }, sheen: .5,
      pats: [{ k: 'mottle', col: '#1a2410', a: .75, sc: 16, v0: 0, v1: .62 }, { k: 'lband', v: .38, w: .1, col: '#10150a', a: 1, x0: .1, x1: .98, blot: .5 },
      { k: 'stripe', v: .33, w: .022, col: '#1a2009', a: .8, x0: .0, x1: .2 }, { k: 'blotch', x: .255, v: .38, rx: .022, ry: .05, col: '#20260d', a: .5 }],
      ll: { v: .4, col: '#dfe4b8', a: .25 }
    },
    fc: { mem: '#7d8a45', ray: '#2f3a17', alpha: .5, tip: '#98a35a', dark: '#39441a' }
  };
};

/* ===== European sea bass (silver perciform) ===== */
SPECIES.seabass = r => {
  const p = profile({ D: V(r, .255, .06), xD: .34, sn: .46, hh: .78, ped: .086, mid: .5, tsH: .56, tsM: .56, wH: .55, wM: .52, wP: .36 });
  return {
    key: 'seabass', common: 'European sea bass', latin: 'Dicentrarchus labrax', family: 'Temperate bass family (Moronidae)',
    ...p, nT: 2.2, nB: 2.35, xc: .026, tipY: .002,
    head: {
      xr: .152, mT: .08, mR: -.05, lipT: .0045, gillX: .285, gillB: .024, hOp: .005,
      eye: { x: .086, m: .34, r: .0175, iris: '#d6c589', ring: '#2a2f33' }, nostril: { x: .05, m: .62 },
      teeth: { kind: 'villiform', len: .0018 }, barbels: [], mouthCol: '#cbb5ac', tongueCol: '#d8c8c0', maxilla: true, maxH: .02, open: .45
    },
    fins: {
      dorsal: [{ x0: .33, x1: .5, h: .062, nsp: 8, n: 8, shape: 'spiny', rake0: 6, rake1: 40, notch: .22 },
      { x0: .555, x1: .69, h: .07, nsp: 1, n: 13, shape: 'lobe', rake0: 30, rake1: 55, notch: .12 }],
      anal: [{ x0: .63, x1: .76, h: .06, nsp: 3, n: 10, shape: 'lobe', rake0: 30, rake1: 55, notch: .12, hs: .045 }],
      pect: { x: .29, m: -.12, len: .14, w: .046, n: 15, shape: 'round', tilt: 24 },
      pelv: { x: .31, len: .095, w: .028, n: 6, spine: true },
      caud: { type: 'emarg', len: .2, n: 26 }
    },
    skin: {
      pal: { d: '#3a4a58', m: '#aebbc3', b: '#f0f0ec' }, silver: .85, scale: { size: .0135, kind: 'ctenoid' }, sheen: 1,
      pats: [{ k: 'mottle', col: '#22303a', a: .35, sc: 26, v0: 0, v1: .32 }, { k: 'blotch', x: .268, v: .2, rx: .01, ry: .026, col: '#181c1e', a: .8 }],
      ll: { v: .3, col: '#4a5860', a: .35 }
    },
    fc: { mem: '#b8c1c4', ray: '#5b666b', alpha: .3, tip: '#c9d0d0', dark: '#4a5a66' }
  };
};

/* ===== Atlantic cod ===== */
SPECIES.cod = r => {
  const p = profile({ D: V(r, .245, .06), xD: .27, sn: .5, hh: .84, ped: .075, mid: .42, tsH: .56, tsM: .55, wH: .6, wM: .58, wP: .34 });
  return {
    key: 'cod', common: 'Atlantic cod', latin: 'Gadus morhua', family: 'Cod family (Gadidae)',
    ...p, nT: 2.15, nB: 2.3, xc: .03, tipY: .006,
    head: {
      xr: .135, mT: -.04, mR: -.1, lipT: .0045, gillX: .27, gillB: .026, hOp: .006,
      eye: { x: .078, m: .38, r: .0165, iris: '#b9b58a', ring: '#3a3324' }, nostril: { x: .04, m: .66 },
      teeth: { kind: 'villiform', len: .0018 },
      barbels: [{ x: .036, m: -.7, len: .075, dir: [-.25, -1, 0] }],
      mouthCol: '#d4b9a8', tongueCol: '#e0cfc4', maxilla: true, maxH: .018, open: .5
    },
    fins: {
      dorsal: [{ x0: .215, x1: .32, h: .075, nsp: 0, n: 13, shape: 'lobe', rake0: 20, rake1: 50, notch: .1 },
      { x0: .345, x1: .49, h: .085, nsp: 0, n: 19, shape: 'lobe', rake0: 22, rake1: 50, notch: .1 },
      { x0: .515, x1: .64, h: .07, nsp: 0, n: 17, shape: 'lobe', rake0: 22, rake1: 55, notch: .1 }],
      anal: [{ x0: .42, x1: .55, h: .075, nsp: 0, n: 18, shape: 'lobe', rake0: 22, rake1: 50, notch: .1 },
      { x0: .565, x1: .69, h: .065, nsp: 0, n: 17, shape: 'lobe', rake0: 22, rake1: 55, notch: .1 }],
      pect: { x: .29, m: -.05, len: .15, w: .06, n: 16, shape: 'round', tilt: 28 },
      pelv: { x: .255, len: .09, w: .022, n: 6, spine: false, filament: true },
      caud: { type: 'trunc', len: .19, n: 26 }
    },
    skin: {
      pal: { d: '#4a4223', m: '#8a7a45', b: '#efe9d8' }, silver: .15, scale: { size: .0105, kind: 'cycloid' }, sheen: .35,
      pats: [{ k: 'mottle', col: '#3a4a2a', a: .5, sc: 30, v0: 0, v1: .62 }, { k: 'spots', col: '#2a2418', a: .55, r: [.0022, .0055], n: 260, v0: .05, v1: .6, x0: .1, x1: .96 },
      { k: 'mottle', col: '#b59a52', a: .32, sc: 18, v0: .1, v1: .55 }],
      ll: { v: .38, col: '#f0e6c4', a: .75, arc: true }
    },
    fc: { mem: '#8b7c4a', ray: '#3a3220', alpha: .5, tip: '#7a6b3e', dark: '#4a4223' }
  };
};

/* ===== Tilapia / cichlid (deep-bodied, thick lips) ===== */
SPECIES.tilapia = r => {
  const p = profile({ D: V(r, .4, .06), xD: .38, sn: .48, hh: .82, ped: .13, mid: .52, tsH: .56, tsM: .56, wH: .55, wM: .5, wP: .34 });
  const gold = r() < .5;
  return {
    key: 'tilapia', common: gold ? 'Golden tilapia' : 'Nile tilapia', latin: gold ? 'Oreochromis aureus' : 'Oreochromis niloticus', family: 'Cichlid family (Cichlidae)',
    ...p, nT: 2.1, nB: 2.2, xc: .034, tipY: .004,
    head: {
      xr: .092, mT: .05, mR: -.06, lipT: .0085, gillX: .285, gillB: .03, hOp: .006,
      eye: { x: .088, m: .4, r: .02, iris: '#d3a13a', ring: '#3a2a10' }, nostril: { x: .058, m: .6 },
      teeth: { kind: 'villiform', len: .0016 }, barbels: [], mouthCol: '#d6a08a', tongueCol: '#e3b8a4', maxilla: false, lipCol: '#d9a58c', open: .42
    },
    fins: {
      dorsal: [{ x0: .32, x1: .86, h: .1, hs: .07, nsp: 16, n: 30, shape: 'cichlid', rake0: 6, rake1: 64, notch: .16 }],
      anal: [{ x0: .62, x1: .84, h: .085, nsp: 3, n: 13, shape: 'lobe', rake0: 30, rake1: 62, notch: .12, hs: .05 }],
      pect: { x: .3, m: -.2, len: .2, w: .06, n: 15, shape: 'round', tilt: 26 },
      pelv: { x: .34, len: .15, w: .04, n: 6, spine: true },
      caud: { type: 'round', len: .21, n: 26 }
    },
    skin: gold ? {
      pal: { d: '#8a5e22', m: '#e6a93a', b: '#f6d27c' }, silver: .2, scale: { size: .0185, kind: 'cycloid' }, sheen: .9,
      pats: [{ k: 'mottle', col: '#c4551c', a: .35, sc: 18, v0: 0, v1: .5 }, { k: 'mottle', col: '#fff0b0', a: .25, sc: 22, v0: .3, v1: .8 }],
      ll: { v: .33, col: '#fff2b8', a: .2 }
    } : {
      pal: { d: '#4e5a4a', m: '#a9a58e', b: '#ded9c2' }, silver: .45, scale: { size: .0185, kind: 'cycloid' }, sheen: .8,
      pats: [{ k: 'bars', xs: [.36, .42, .48, .55, .62, .7], w: .022, col: '#2a3025', a: .3, v0: 0, v1: .62, wob: .3 }, { k: 'mottle', col: '#2e3a2c', a: .3, sc: 24, v0: 0, v1: .4 }],
      ll: { v: .33, col: '#e5e0c4', a: .2 }
    },
    fc: gold ? { mem: '#e8823a', ray: '#a0431a', alpha: .5, tip: '#e2552a', dark: '#c4551c' } : { mem: '#8b8f78', ray: '#3a3f30', alpha: .4, tip: '#c24b3a', dark: '#4e5a4a' }
  };
};

/* ===== Rainbow trout ===== */
SPECIES.trout = r => {
  const p = profile({ D: V(r, .225, .06), xD: .42, sn: .44, hh: .8, ped: .078, mid: .5, tsH: .55, tsM: .56, wH: .6, wM: .58, wP: .4 });
  return {
    key: 'trout', common: 'Rainbow trout', latin: 'Oncorhynchus mykiss', family: 'Salmon family (Salmonidae)',
    ...p, nT: 2.15, nB: 2.3, xc: .026, tipY: .002,
    head: {
      xr: .128, mT: .04, mR: -.06, lipT: .004, gillX: .235, gillB: .02, hOp: .005,
      eye: { x: .07, m: .32, r: .0148, iris: '#d9c98a', ring: '#20261a' }, nostril: { x: .04, m: .6 },
      teeth: { kind: 'conical', len: .0032 }, barbels: [], mouthCol: '#d7bcb0', tongueCol: '#e2cfc7', maxilla: true, maxH: .017, open: .5
    },
    fins: {
      dorsal: [{ x0: .385, x1: .475, h: .075, nsp: 3, n: 11, shape: 'lobe', rake0: 22, rake1: 55, notch: .12, hs: .05 }],
      anal: [{ x0: .685, x1: .77, h: .062, nsp: 3, n: 10, shape: 'lobe', rake0: 26, rake1: 55, notch: .12, hs: .04 }],
      pect: { x: .245, m: -.3, len: .125, w: .04, n: 14, shape: 'round', tilt: 24 },
      pelv: { x: .47, len: .085, w: .03, n: 9, spine: false },
      adipose: { x: .83, w: .035, h: .02 },
      caud: { type: 'emarg', len: .17, n: 26 }
    },
    skin: {
      pal: { d: '#3c5236', m: '#a9b79a', b: '#f2efe4' }, silver: .5, scale: { size: .0092, kind: 'cycloid' }, sheen: .8,
      pats: [{ k: 'lband', v: .38, w: .06, col: '#d0607a', a: .6, x0: .12, x1: .96, blot: 0, soft: 1 }, { k: 'spots', col: '#151a12', a: .8, r: [.0018, .0046], n: 700, v0: 0, v1: .58, x0: .1, x1: .98 }],
      ll: { v: .34, col: '#dfa0aa', a: .25 }
    },
    fc: { mem: '#b3b9a4', ray: '#4a5040', alpha: .3, tip: '#c7c9b6', dark: '#3c5236', spotted: true }
  };
};

/* ===== Yellowfin tuna ===== */
SPECIES.tuna = r => {
  const p = profile({ D: V(r, .29, .05), xD: .36, sn: .36, hh: .68, ped: .04, mid: .3, tsH: .55, tsM: .54, wH: .78, wM: .8, wP: .62 });
  return {
    key: 'tuna', common: 'Yellowfin tuna', latin: 'Thunnus albacares', family: 'Mackerel family (Scombridae)',
    ...p, nT: 2.05, nB: 2.1, xc: .032, tipY: 0,
    head: {
      xr: .112, mT: .04, mR: -.02, lipT: .0045, gillX: .285, gillB: .022, hOp: .005,
      eye: { x: .085, m: .3, r: .0215, iris: '#3a3020', ring: '#0d1a2a' }, nostril: { x: .05, m: .55 },
      teeth: { kind: 'villiform', len: .0022 }, barbels: [], mouthCol: '#c9b0a8', tongueCol: '#d8c6bf', maxilla: true, maxH: .018, open: .5
    },
    fins: {
      dorsal: [{ x0: .3, x1: .375, h: .062, nsp: 12, n: 12, shape: 'spiny', rake0: 30, rake1: 68, notch: .08 },
      { x0: .485, x1: .53, h: .19, nsp: 0, n: 14, shape: 'sickle', rake0: 34, rake1: 66, notch: .05, yellow: true }],
      anal: [{ x0: .56, x1: .6, h: .17, nsp: 0, n: 13, shape: 'sickle', rake0: 34, rake1: 66, notch: .05, yellow: true }],
      finlets: { n: 9, dorsalX0: .6, dorsalX1: .9, analX0: .63, analX1: .9, h: .026 },
      pect: { x: .285, m: -.12, len: .21, w: .05, n: 14, shape: 'falcate', tilt: 22 },
      pelv: { x: .29, len: .08, w: .028, n: 6, spine: true },
      caud: { type: 'lunate', len: .36, n: 30, span: 1.75 }
    },
    skin: {
      pal: { d: '#0c1f3d', m: '#5a7a96', b: '#e6e8e6' }, silver: .8, scale: { size: .0068, kind: 'cycloid' }, sheen: 1,
      pats: [{ k: 'lband', v: .34, w: .055, col: '#d9c64a', a: .85, x0: .18, x1: .97, blot: 0, soft: 1 }, { k: 'wave', v0: .0, v1: .28, col: '#04101f', a: .35, amp: .02, freq: 60 },
      { k: 'vbars', xs: [.34, .4, .46, .52, .58, .64, .7, .76], w: .004, col: '#f4f4d8', a: .3, v0: .66, v1: .96 }],
      ll: { v: .3, col: '#b5c9d8', a: .2 }
    },
    fc: { mem: '#d9cc3e', ray: '#7a6f22', alpha: .62, tip: '#e8dc4a', dark: '#0c1f3d' }
  };
};

/* ===== Common carp ===== */
SPECIES.carp = r => {
  const p = profile({ D: V(r, .37, .06), xD: .38, sn: .5, hh: .84, ped: .115, mid: .52, tsH: .55, tsM: .6, wH: .55, wM: .52, wP: .4 });
  return {
    key: 'carp', common: 'Common carp', latin: 'Cyprinus carpio', family: 'Carp family (Cyprinidae)',
    ...p, nT: 2.1, nB: 2.25, xc: .03, tipY: -.006,
    head: {
      xr: .07, mT: -.15, mR: -.28, lipT: .0095, gillX: .265, gillB: .024, hOp: .0055,
      eye: { x: .092, m: .32, r: .0135, iris: '#c9a34a', ring: '#3a2a14' }, nostril: { x: .052, m: .5 },
      teeth: { kind: 'none', len: 0 },
      barbels: [{ x: .03, m: -.18, len: .05, dir: [-.6, -.7, .1] }, { x: .06, m: -.22, len: .04, dir: [-.4, -.8, .2] }],
      mouthCol: '#d9a89a', tongueCol: '#e6bfb0', maxilla: false, lipCol: '#c98d76', open: .38, protrude: true
    },
    fins: {
      dorsal: [{ x0: .36, x1: .74, h: .12, hs: .1, nsp: 3, n: 20, shape: 'lobe', rake0: 12, rake1: 62, notch: .1 }],
      anal: [{ x0: .69, x1: .78, h: .09, nsp: 3, n: 8, shape: 'lobe', rake0: 30, rake1: 58, notch: .12, hs: .07 }],
      pect: { x: .28, m: -.28, len: .15, w: .05, n: 15, shape: 'round', tilt: 26 },
      pelv: { x: .47, len: .11, w: .035, n: 9, spine: false },
      caud: { type: 'fork', len: .24, n: 26 }
    },
    skin: {
      pal: { d: '#4b3d18', m: '#a8842c', b: '#e2cf88' }, silver: .35, scale: { size: .034, kind: 'cycloid' }, sheen: .9,
      pats: [{ k: 'mottle', col: '#33260c', a: .35, sc: 14, v0: 0, v1: .55 }],
      ll: { v: .4, col: '#e8d492', a: .25 }
    },
    fc: { mem: '#b9884a', ray: '#6a4a1e', alpha: .45, tip: '#c8843c', dark: '#4b3d18' }
  };
};

/* ===== Koi (ornamental carp; painted patches) ===== */
SPECIES.koi = r => {
  const c = SPECIES.carp(r);
  const patch = r() < .5;
  return {
    ...c, key: 'koi', common: patch ? 'Koi (Kohaku)' : 'Koi (Sanke)', latin: 'Cyprinus rubrofuscus', family: 'Carp family (Cyprinidae)',
    skin: {
      pal: { d: '#f4f1ea', m: '#f7f4ee', b: '#fbf8f2' }, silver: .25, scale: { size: .034, kind: 'cycloid' }, sheen: .9,
      pats: [{ k: 'patches', cols: ['#e2401c', '#d7371a'], sc: 7, th: .56, v0: 0, v1: .8 }].concat(patch ? [] : [{ k: 'patches', cols: ['#141414'], sc: 11, th: .64, v0: 0, v1: .6, seed: 9 }]),
      ll: { v: .4, col: '#ffffff', a: .2 }
    },
    fc: { mem: '#f0ece4', ray: '#c9c2b0', alpha: .4, tip: '#f4efe4', dark: '#e2401c' }
  };
};

/* ===== Channel catfish (scaleless, barbels, adipose) ===== */
SPECIES.catfish = r => {
  const p = profile({ D: V(r, .2, .06), xD: .26, sn: .5, hh: 1.0, ped: .065, mid: .4, tsH: .62, tsM: .58, wH: 1.15, wM: .8, wP: .38 });
  return {
    key: 'catfish', common: 'Channel catfish', latin: 'Ictalurus punctatus', family: 'Bullhead catfish family (Ictaluridae)',
    ...p, nT: 2.0, nB: 2.5, xc: .04, tipY: -.004,
    head: {
      xr: .118, mT: -.15, mR: -.2, lipT: .0075, gillX: .235, gillB: .02, hOp: .005,
      eye: { x: .076, m: .5, r: .0105, iris: '#3a2a12', ring: '#1e2226' }, nostril: { x: .045, m: .75 },
      teeth: { kind: 'villiform', len: .0016 },
      barbels: [{ x: .05, m: .1, len: .12, dir: [-.5, .15, 1], nasal: true }, { x: .036, m: -.5, len: .085, dir: [-.4, -.5, 1] }, { x: .06, m: -.8, len: .06, dir: [-.2, -1, .6] }],
      mouthCol: '#d0aea0', tongueCol: '#dcc0b4', maxilla: false, lipCol: '#a89a94', open: .42
    },
    fins: {
      dorsal: [{ x0: .235, x1: .3, h: .085, nsp: 1, n: 7, shape: 'lobe', rake0: 20, rake1: 50, notch: .1, hs: .07 }],
      anal: [{ x0: .555, x1: .8, h: .065, nsp: 0, n: 24, shape: 'lobe', rake0: 25, rake1: 55, notch: .12 }],
      pect: { x: .235, m: -.55, len: .12, w: .04, n: 8, shape: 'round', tilt: 34, spine: true },
      pelv: { x: .44, len: .08, w: .03, n: 8, spine: false },
      adipose: { x: .68, w: .085, h: .022 },
      caud: { type: 'fork', len: .24, n: 28 }
    },
    skin: {
      pal: { d: '#4a5058', m: '#8b969c', b: '#e8e8e0' }, silver: .25, scale: { size: 0, kind: 'none' }, sheen: .8, matte: .0,
      pats: [{ k: 'spots', col: '#1e2226', a: .55, r: [.0022, .0052], n: 170, v0: .1, v1: .62, x0: .2, x1: .96 }, { k: 'mottle', col: '#30363c', a: .3, sc: 22, v0: 0, v1: .4 }],
      ll: { v: .42, col: '#c0c8cc', a: .25 }
    },
    fc: { mem: '#7f8a90', ray: '#30363c', alpha: .55, tip: '#6a747a', dark: '#4a5058' }
  };
};

