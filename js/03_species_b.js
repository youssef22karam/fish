// @@PART js/03_species_b.js (lines 410-657 of the original <script>) -- stripped by build.mjs
/* ===== Northern pike (duckbill, canines, far-back fins) ===== */
SPECIES.pike = r => {
  const p = profile({ D: V(r, .15, .06), xD: .62, sn: .5, hh: .68, ped: .075, mid: .5, tsH: .5, tsM: .56, wH: .6, wM: .62, wP: .42 });
  return {
    key: 'pike', common: 'Northern pike', latin: 'Esox lucius', family: 'Pike family (Esocidae)',
    ...p, nT: 2.15, nB: 2.25, xc: .026, tipY: -.004,
    head: {
      xr: .2, mT: -.02, mR: -.1, lipT: .0055, gillX: .3, gillB: .022, hOp: .005,
      eye: { x: .142, m: .55, r: .0128, iris: '#d8c060', ring: '#20281a' }, nostril: { x: .07, m: .7 },
      teeth: { kind: 'canine', len: .0068 }, barbels: [], mouthCol: '#d6b6a6', tongueCol: '#cfa8a0', maxilla: true, maxH: .018, open: .5
    },
    fins: {
      dorsal: [{ x0: .67, x1: .82, h: .085, nsp: 0, n: 16, shape: 'lobe', rake0: 25, rake1: 60, notch: .1 }],
      anal: [{ x0: .69, x1: .82, h: .07, nsp: 0, n: 15, shape: 'lobe', rake0: 25, rake1: 60, notch: .1 }],
      pect: { x: .315, m: -.5, len: .1, w: .03, n: 15, shape: 'round', tilt: 26 },
      pelv: { x: .55, len: .075, w: .026, n: 9, spine: false },
      caud: { type: 'fork', len: .2, n: 26 }
    },
    skin: {
      pal: { d: '#2e3d20', m: '#66763a', b: '#e6e3c6' }, silver: .1, scale: { size: .0088, kind: 'cycloid' }, sheen: .4,
      pats: [{ k: 'spots', col: '#d6d187', a: .78, r: [.003, .0068], n: 380, v0: .12, v1: .68, x0: .1, x1: .98, bean: true }, { k: 'mottle', col: '#1f2b14', a: .3, sc: 20, v0: 0, v1: .4 }],
      ll: { v: .4, col: '#e3ddb0', a: .2 }
    },
    fc: { mem: '#b38a3a', ray: '#5a3a14', alpha: .42, tip: '#c4682c', dark: '#2e3d20', spotted: true }
  };
};

/* ===== Great barracuda ===== */
SPECIES.barracuda = r => {
  const p = profile({ D: V(r, .125, .06), xD: .5, sn: .5, hh: .72, ped: .052, mid: .45, tsH: .5, tsM: .55, wH: .68, wM: .7, wP: .5 });
  return {
    key: 'barracuda', common: 'Great barracuda', latin: 'Sphyraena barracuda', family: 'Barracuda family (Sphyraenidae)',
    ...p, nT: 2.1, nB: 2.2, xc: .022, tipY: -.006,
    head: {
      xr: .162, mT: -.06, mR: -.12, lipT: .0045, gillX: .285, gillB: .02, hOp: .005,
      eye: { x: .11, m: .45, r: .0105, iris: '#d5c89a', ring: '#20262a' }, nostril: { x: .07, m: .7 },
      teeth: { kind: 'canine', len: .0075 }, barbels: [], mouthCol: '#cbb4a9', tongueCol: '#c9a49c', maxilla: true, maxH: .014, open: .45
    },
    fins: {
      dorsal: [{ x0: .5, x1: .565, h: .05, nsp: 5, n: 5, shape: 'spiny', rake0: 10, rake1: 40, notch: .2 },
      { x0: .72, x1: .79, h: .058, nsp: 1, n: 9, shape: 'lobe', rake0: 30, rake1: 58, notch: .1 }],
      anal: [{ x0: .73, x1: .8, h: .05, nsp: 1, n: 9, shape: 'lobe', rake0: 30, rake1: 58, notch: .1 }],
      pect: { x: .3, m: -.4, len: .085, w: .028, n: 14, shape: 'round', tilt: 28 },
      pelv: { x: .47, len: .07, w: .022, n: 6, spine: true },
      caud: { type: 'fork', len: .2, n: 26 }
    },
    skin: {
      pal: { d: '#3a4a52', m: '#aab7bb', b: '#f2f1ea' }, silver: .9, scale: { size: .0078, kind: 'cycloid' }, sheen: 1,
      pats: [{ k: 'vbars', xs: [.3, .36, .42, .48, .54, .6, .66, .72, .78], w: .014, col: '#1a2226', a: .55, v0: 0, v1: .5, soft: 1 }, { k: 'spots', col: '#1e262a', a: .6, r: [.0015, .0035], n: 90, v0: .55, v1: .85, x0: .5, x1: .95 }],
      ll: { v: .34, col: '#3a464c', a: .3 }
    },
    fc: { mem: '#a8b0ac', ray: '#4a5254', alpha: .38, tip: '#8e979a', dark: '#3a4a52' }
  };
};

/* ===== Angelfish (disc-shaped, tall trailing fins) ===== */
SPECIES.angelfish = r => {
  const p = profile({ D: V(r, .58, .05), xD: .46, sn: .3, hh: .56, ped: .13, mid: .3, tsH: .62, tsM: .5, wH: .22, wM: .17, wP: .16 });
  return {
    key: 'angelfish', common: 'Freshwater angelfish', latin: 'Pterophyllum scalare', family: 'Cichlid family (Cichlidae)',
    ...p, nT: 2.2, nB: 2.2, xc: .026, tipY: .01,
    head: {
      xr: .062, mT: .35, mR: .15, lipT: .0035, gillX: .245, gillB: .02, hOp: .004,
      eye: { x: .094, m: .18, r: .0245, iris: '#c8321e', ring: '#20130f' }, nostril: { x: .05, m: .7 },
      teeth: { kind: 'villiform', len: .001 }, barbels: [], mouthCol: '#e3b4a4', tongueCol: '#eec8ba', maxilla: false, lipCol: '#d9a794', open: .3
    },
    fins: {
      dorsal: [{ x0: .4, x1: .88, h: .4, nsp: 0, n: 26, shape: 'angel', rake0: 30, rake1: 66, notch: .03 }],
      anal: [{ x0: .45, x1: .9, h: .38, nsp: 0, n: 26, shape: 'angel', rake0: 30, rake1: 66, notch: .03 }],
      pect: { x: .28, m: -.05, len: .11, w: .03, n: 11, shape: 'round', tilt: 20 },
      pelv: { x: .3, len: .42, w: .016, n: 3, spine: false, filament: true },
      caud: { type: 'angel', len: .3, n: 28 }
    },
    skin: {
      pal: { d: '#8a9298', m: '#d8dcd6', b: '#f4f2e8' }, silver: .75, scale: { size: .011, kind: 'cycloid' }, sheen: 1,
      pats: [{ k: 'vbars', xs: [.08, .3, .5, .72, .93], w: .03, col: '#151515', a: .92, v0: -.1, v1: 1.1, soft: .5, wob: .3 }],
      ll: { v: .4, col: '#e9eae4', a: .1 }
    },
    fc: { mem: '#d8dcd6', ray: '#454a48', alpha: .38, tip: '#e6e8e2', dark: '#151515', barsFin: true }
  };
};

/* ===== Clownfish ===== */
SPECIES.clownfish = r => {
  const p = profile({ D: V(r, .44, .05), xD: .4, sn: .48, hh: .82, ped: .15, mid: .5, tsH: .56, tsM: .56, wH: .62, wM: .56, wP: .4 });
  return {
    key: 'clownfish', common: 'Clownfish', latin: 'Amphiprion ocellaris', family: 'Damselfish family (Pomacentridae)',
    ...p, nT: 2.1, nB: 2.2, xc: .034, tipY: .003,
    head: {
      xr: .07, mT: .05, mR: -.05, lipT: .0065, gillX: .255, gillB: .022, hOp: .005,
      eye: { x: .092, m: .3, r: .0225, iris: '#e9a53a', ring: '#1a1008' }, nostril: { x: .055, m: .55 },
      teeth: { kind: 'villiform', len: .0014 }, barbels: [], mouthCol: '#e2a08a', tongueCol: '#eeb7a3', maxilla: false, lipCol: '#e08b52', open: .36
    },
    fins: {
      dorsal: [{ x0: .3, x1: .82, h: .11, hs: .075, nsp: 10, n: 26, shape: 'cichlid', rake0: 6, rake1: 60, notch: .12 }],
      anal: [{ x0: .62, x1: .82, h: .085, nsp: 2, n: 12, shape: 'lobe', rake0: 30, rake1: 60, notch: .1, hs: .05 }],
      pect: { x: .27, m: -.2, len: .16, w: .05, n: 14, shape: 'round', tilt: 26 },
      pelv: { x: .3, len: .12, w: .035, n: 6, spine: true },
      caud: { type: 'round', len: .2, n: 26 }
    },
    skin: {
      pal: { d: '#e5601a', m: '#f27a1c', b: '#f58f2c' }, silver: .05, scale: { size: .0088, kind: 'cycloid' }, sheen: .8,
      pats: [{ k: 'vbars', xs: [.13, .5, .94], w: .05, col: '#f7f4ee', a: 1, v0: -.1, v1: 1.1, soft: .3, edge: '#0b0b0b', edgeW: .012 }],
      ll: { v: .4, col: '#f58f2c', a: .05 }
    },
    fc: { mem: '#f27a1c', ray: '#c9490e', alpha: .55, tip: '#f7f4ee', dark: '#0b0b0b', rimBlack: true }
  };
};

/* ===== Parrotfish (fused beak, big scales) ===== */
SPECIES.parrotfish = r => {
  const p = profile({ D: V(r, .33, .05), xD: .4, sn: .5, hh: .88, ped: .12, mid: .55, tsH: .6, tsM: .55, wH: .6, wM: .55, wP: .38 });
  const teal = r() < .5;
  return {
    key: 'parrotfish', common: 'Parrotfish', latin: 'Scarus quoyi', family: 'Parrotfish family (Scaridae)',
    ...p, nT: 2.1, nB: 2.2, xc: .03, tipY: -.004,
    head: {
      xr: .07, mT: -.05, mR: -.12, lipT: .006, gillX: .265, gillB: .024, hOp: .006,
      eye: { x: .1, m: .38, r: .0165, iris: '#7a2a18', ring: '#12201c' }, nostril: { x: .06, m: .7 },
      teeth: { kind: 'beak', len: .006 }, barbels: [], mouthCol: '#d5aaa0', tongueCol: '#e2bcb2', maxilla: false, lipCol: '#5aa89a', open: .34
    },
    fins: {
      dorsal: [{ x0: .3, x1: .8, h: .1, hs: .08, nsp: 9, n: 24, shape: 'lobe', rake0: 6, rake1: 60, notch: .06 }],
      anal: [{ x0: .56, x1: .8, h: .085, nsp: 3, n: 12, shape: 'lobe', rake0: 20, rake1: 58, notch: .08, hs: .06 }],
      pect: { x: .29, m: -.12, len: .17, w: .05, n: 14, shape: 'round', tilt: 26 },
      pelv: { x: .34, len: .11, w: .035, n: 6, spine: true },
      caud: { type: 'lyre', len: .24, n: 26 }
    },
    skin: teal ? {
      pal: { d: '#0e6d78', m: '#2aa590', b: '#7fd0b5' }, silver: .25, scale: { size: .03, kind: 'cycloid' }, sheen: 1,
      pats: [{ k: 'mottle', col: '#e0568a', a: .5, sc: 10, v0: .3, v1: 1 }, { k: 'mottle', col: '#0a4a5c', a: .35, sc: 14, v0: 0, v1: .4 }],
      ll: { v: .4, col: '#8fe0c8', a: .1 }
    } : {
      pal: { d: '#4a3aa0', m: '#3a86c4', b: '#8fd0d6' }, silver: .25, scale: { size: .03, kind: 'cycloid' }, sheen: 1,
      pats: [{ k: 'mottle', col: '#f0a0c8', a: .5, sc: 10, v0: .35, v1: 1 }, { k: 'mottle', col: '#2a1f70', a: .35, sc: 14, v0: 0, v1: .4 }],
      ll: { v: .4, col: '#a8e0e6', a: .1 }
    },
    fc: teal ? { mem: '#2aa590', ray: '#0a5a56', alpha: .55, tip: '#e0568a', dark: '#0e6d78' } : { mem: '#3a86c4', ray: '#243f8a', alpha: .55, tip: '#f0a0c8', dark: '#4a3aa0' }
  };
};

/* ===== Piranha (blunt head, razor teeth, underbite) ===== */
SPECIES.piranha = r => {
  const p = profile({ D: V(r, .5, .05), xD: .4, sn: .5, hh: .86, ped: .11, mid: .5, tsH: .55, tsM: .55, wH: .5, wM: .42, wP: .36 });
  return {
    key: 'piranha', common: 'Red-bellied piranha', latin: 'Pygocentrus nattereri', family: 'Characin order (Serrasalmidae)',
    ...p, nT: 2.1, nB: 2.25, xc: .03, tipY: -.006,
    head: {
      xr: .118, mT: -.22, mR: -.22, lipT: .0035, gillX: .3, gillB: .025, hOp: .006,
      eye: { x: .1, m: .4, r: .019, iris: '#a02a1a', ring: '#141210' }, nostril: { x: .05, m: .65 },
      teeth: { kind: 'razor', len: .0085 }, barbels: [], mouthCol: '#c9a49a', tongueCol: '#b87c76', maxilla: true, maxH: .02, open: .5
    },
    fins: {
      dorsal: [{ x0: .34, x1: .5, h: .12, nsp: 2, n: 12, shape: 'lobe', rake0: 22, rake1: 58, notch: .08, hs: .06 }],
      anal: [{ x0: .48, x1: .8, h: .07, nsp: 2, n: 32, shape: 'lobe', rake0: 30, rake1: 58, notch: .08, hs: .05 }],
      adipose: { x: .62, w: .04, h: .022 },
      pect: { x: .3, m: -.25, len: .15, w: .05, n: 14, shape: 'round', tilt: 26 },
      pelv: { x: .44, len: .09, w: .03, n: 7, spine: false },
      caud: { type: 'trunc', len: .21, n: 26 }
    },
    skin: {
      pal: { d: '#33383e', m: '#98a4ac', b: '#d8492c' }, silver: .7, scale: { size: .011, kind: 'cycloid' }, sheen: 1,
      pats: [{ k: 'spots', col: '#14181c', a: .7, r: [.0016, .0034], n: 700, v0: 0, v1: .7, x0: .12, x1: .98 }, { k: 'blotch', x: .3, v: .32, rx: .012, ry: .04, col: '#20262c', a: .5 }],
      ll: { v: .4, col: '#c5ced2', a: .15 }
    },
    fc: { mem: '#8a7a78', ray: '#3a3230', alpha: .42, tip: '#c4402a', dark: '#33383e', dark2: '#0a0a0a' }
  };
};

/* ===== Grouper (huge gape, lower jaw protrusion) ===== */
SPECIES.grouper = r => {
  const p = profile({ D: V(r, .33, .05), xD: .36, sn: .54, hh: .9, ped: .13, mid: .55, tsH: .58, tsM: .57, wH: .62, wM: .58, wP: .42 });
  const hue = r();
  return {
    key: 'grouper', common: 'Grouper', latin: 'Epinephelus fuscoguttatus', family: 'Sea bass family (Serranidae)',
    ...p, nT: 2.15, nB: 2.3, xc: .03, tipY: -.004,
    head: {
      xr: .175, mT: .04, mR: -.08, lipT: .007, gillX: .34, gillB: .03, hOp: .007,
      eye: { x: .1, m: .4, r: .0175, iris: '#a67a2a', ring: '#20180d' }, nostril: { x: .055, m: .68 },
      teeth: { kind: 'conical', len: .0042 }, barbels: [], mouthCol: '#d9b0a2', tongueCol: '#e3c3b8', maxilla: true, maxH: .03, open: .55
    },
    fins: {
      dorsal: [{ x0: .3, x1: .52, h: .09, nsp: 11, n: 11, shape: 'spiny', rake0: 6, rake1: 40, notch: .25 },
      { x0: .525, x1: .73, h: .1, nsp: 0, n: 15, shape: 'lobe', rake0: 30, rake1: 60, notch: .1 }],
      anal: [{ x0: .6, x1: .75, h: .085, nsp: 3, n: 11, shape: 'lobe', rake0: 30, rake1: 58, notch: .1, hs: .06 }],
      pect: { x: .33, m: -.22, len: .19, w: .06, n: 16, shape: 'round', tilt: 26 },
      pelv: { x: .34, len: .12, w: .04, n: 6, spine: true },
      caud: { type: 'round', len: .22, n: 28 }
    },
    skin: {
      pal: { d: '#5c4632', m: '#a2836a', b: '#e2d0b8' }, silver: .12, scale: { size: .0145, kind: 'ctenoid' }, sheen: .5,
      pats: [{ k: 'bars', xs: [.34, .45, .56, .67, .78], w: .045, col: '#3a2a1c', a: .45, v0: 0, v1: .7, wob: .5 }, { k: 'spots', col: '#2a1c12', a: .78, r: [.0024, .006], n: 340, v0: .02, v1: .95, x0: .04, x1: .98 }],
      ll: { v: .38, col: '#d8c4a4', a: .15 }
    },
    fc: { mem: '#8a6a50', ray: '#3a2a1c', alpha: .45, tip: '#9a7658', dark: '#5c4632', spotted: true }
  };
};

/* ===== Goldfish ===== */
SPECIES.goldfish = r => {
  const p = profile({ D: V(r, .42, .06), xD: .4, sn: .5, hh: .84, ped: .13, mid: .5, tsH: .58, tsM: .58, wH: .55, wM: .55, wP: .4 });
  return {
    key: 'goldfish', common: 'Goldfish', latin: 'Carassius auratus', family: 'Carp family (Cyprinidae)',
    ...p, nT: 2.1, nB: 2.2, xc: .034, tipY: -.002,
    head: {
      xr: .07, mT: .0, mR: -.12, lipT: .006, gillX: .265, gillB: .024, hOp: .005,
      eye: { x: .09, m: .36, r: .0195, iris: '#e6a338', ring: '#402a10' }, nostril: { x: .055, m: .55 },
      teeth: { kind: 'none', len: 0 }, barbels: [], mouthCol: '#e6a58a', tongueCol: '#efbba6', maxilla: false, lipCol: '#e8853a', open: .34
    },
    fins: {
      dorsal: [{ x0: .32, x1: .68, h: .14, hs: .12, nsp: 3, n: 20, shape: 'lobe', rake0: 12, rake1: 62, notch: .12 }],
      anal: [{ x0: .68, x1: .76, h: .1, nsp: 3, n: 8, shape: 'lobe', rake0: 30, rake1: 60, notch: .12, hs: .08 }],
      pect: { x: .27, m: -.28, len: .16, w: .05, n: 15, shape: 'round', tilt: 26 },
      pelv: { x: .46, len: .12, w: .035, n: 9, spine: false },
      caud: { type: 'fork', len: .26, n: 28 }
    },
    skin: {
      pal: { d: '#e0561a', m: '#f0801e', b: '#f8b048' }, silver: .2, scale: { size: .028, kind: 'cycloid' }, sheen: 1,
      pats: [{ k: 'mottle', col: '#fff0c0', a: .22, sc: 12, v0: .2, v1: .9 }],
      ll: { v: .4, col: '#ffd090', a: .1 }
    },
    fc: { mem: '#f0801e', ray: '#c9490e', alpha: .48, tip: '#f8a13a', dark: '#e0561a' }
  };
};

/* ---------- catalogue order & search aliases ---------- */
const SP_LIST = ['bass', 'seabass', 'cod', 'tilapia', 'trout', 'tuna', 'carp', 'koi', 'catfish', 'pike', 'barracuda', 'angelfish', 'clownfish', 'parrotfish', 'piranha', 'grouper', 'goldfish'];
const SP_ALIAS = {
  bass: ['bass', 'largemouth', 'micropterus', 'perch', 'sunfish', 'bluegill', 'crappie', 'walleye', 'pikeperch'], seabass: ['seabass', 'sea bass', 'branzino', 'dicentrarchus', 'snapper', 'sea bream', 'bream', 'mullet'],
  cod: ['cod', 'gadus', 'haddock', 'pollock', 'hake', 'ling'], tilapia: ['tilapia', 'cichlid', 'oreochromis', 'oscar', 'jack dempsey', 'convict', 'tilap'],
  trout: ['trout', 'salmon', 'char', 'oncorhynchus', 'salmo', 'grayling', 'whitefish'], tuna: ['tuna', 'thunnus', 'mackerel', 'bonito', 'skipjack', 'albacore', 'wahoo', 'kingfish'],
  carp: ['carp', 'cyprinus', 'barbel', 'tench', 'bream', 'roach', 'chub'], koi: ['koi', 'nishikigoi', 'kohaku'], catfish: ['catfish', 'cat fish', 'ictalurus', 'pangasius', 'bullhead', 'clarias', 'silurus'],
  pike: ['pike', 'esox', 'muskie', 'muskellunge', 'pickerel', 'gar', 'needlefish'], barracuda: ['barracuda', 'sphyraena', 'snake mackerel', 'lizardfish'], angelfish: ['angel', 'pterophyllum', 'discus', 'butterflyfish', 'moorish', 'scalare'],
  clownfish: ['clown', 'amphiprion', 'nemo', 'damsel', 'anemonefish', 'chromis'], parrotfish: ['parrot', 'scarus', 'wrasse', 'humphead', 'napoleon', 'labrus'], piranha: ['piranha', 'pacu', 'pygocentrus', 'tetra', 'serrasalmus'],
  grouper: ['grouper', 'epinephelus', 'cod hind', 'coral trout', 'sea trout', 'rockfish', 'sculpin'], goldfish: ['goldfish', 'carassius', 'gold fish']
};
function matchSpecies(q) {
  q = q.toLowerCase();
  for (const k of ['koi', 'goldfish', 'clownfish', 'piranha', 'barracuda', 'seabass', 'angelfish', 'parrotfish', 'catfish', 'tuna', 'tilapia', 'trout', 'grouper', 'cod', 'pike', 'carp', 'bass'])
    if (SP_ALIAS[k].some(a => q.includes(a))) return k;
  return null;
}

/* ---------- procedural naming ---------- */
const SYL = { g1: ['Ery', 'Lepo', 'Sarc', 'Chae', 'Tilo', 'Poly', 'Ambly', 'Cyphi', 'Neo', 'Halo', 'Pelag', 'Lutj', 'Gymno', 'Chromi', 'Rhino', 'Oxy'], g2: ['pterus', 'dus', 'stomus', 'notus', 'gaster', 'chromis', 'ops', 'ichthys', 'nema', 'lepis', 'odon', 'cephalus'], s1: ['macr', 'aur', 'argent', 'nigr', 'pict', 'fulv', 'cyan', 'rubr', 'ocell', 'stria', 'maru', 'ventr'], s2: ['ops', 'atus', 'ensis', 'oides', 'ifer', 'aria', 'ipinnis', 'ura', 'ianus'] };
function binomial(r) { const p = a => a[(r() * a.length) | 0]; return p(SYL.g1) + p(SYL.g2) + ' ' + p(SYL.s1) + p(SYL.s2); }

'use strict';
