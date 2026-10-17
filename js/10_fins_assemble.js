// @@PART js/10_fins_assemble.js (lines 1356-1699 of the original <script>) -- stripped by build.mjs
/* ============ assemble all fins: returns [{geo, spines?, tex, kind}] ============ */
function buildFins(sp, body, seed) {
  const out = [], F = sp.fins, fc = sp.fc, pal = sp.skin.pal, rnd = mulberry32(seed + 77);
  const common = (kind, base, extra) => Object.assign({ mem: fc.mem, ray: fc.ray, tip: fc.tip, alpha: fc.alpha, base, seed: seed + kind.length * 13, dark: fc.dark, darkA: .25, solid: fc.solid, rayA: fc.rayA }, extra);
  const add = (kind, rays, nrm, texO, flut) => {
    const geo = fanGeo(rays, { nrm, flutter: flut === undefined ? 1 : flut }).build();
    const tex = paintFin(Object.assign({ nR: rays.length }, texO));
    const sg = rays.some(r => r.spine) ? spineTubes(rays, [0, 0, .4]).build() : null;
    out.push({ kind, geo, tex, spines: sg, spineCol: mixc(fc.ray, '#d8ccb0', .35), alpha: texO.alpha });
  };
  const extras = (f) => {
    const e = {};
    if (fc.spotted) { e.spots = 70; e.spotCol = fc.dark; }
    if (fc.rimBlack) { e.rim = '#0b0b0b'; e.rimW = .12; }
    if (fc.barsFin) e.vbands = [.3, .7];
    if (fc.bands) e.bandsR = fc.bands;
    if (f && f.yellow) { e.mem = '#d9cc3e'; }
    return e;
  };
  (F.dorsal || []).forEach((f, k) => { const R = medianRays(body, f, 1); add('dorsal', R, [0, 0, 1], common('dorsal', mixc(pal.d, pal.m, .3), Object.assign({ nsp: f.nsp || 0, notch: f.notch, sheath: .22 }, extras(f))), 1); });
  (F.anal || []).forEach(f => { const R = medianRays(body, f, -1); add('anal', R, [0, 0, 1], common('anal', mixc(pal.b, pal.m, .3), Object.assign({ nsp: f.nsp || 0, notch: f.notch, sheath: .2 }, extras(f))), 1); });
  add('caudal', caudalRays(sp, body), [0, 0, 1], common('caudal', mixc(pal.m, pal.d, .3), Object.assign({ notch: F.caud.type === 'trunc' || F.caud.type === 'shark' ? .04 : .09, sheath: .16, dark: fc.dark, darkA: .18 }, extras())), F.caud.type === 'veil' ? 3.4 : 1.3);
  for (const side of [1, -1]) {
    if (F.pect) { const pr = pectoralRays(sp, body, side);
      add('pect', pr, n3([0, .2, side]), common('pect', mixc(pal.m, pal.b, .4), Object.assign({ nsp: F.pect.spine ? 1 : 0, notch: .08, sheath: .12, dark: null }, extras())), 1.6); }
    if (F.pelv) { const pv = pelvicRays(sp, body, side);
      add('pelv', pv, n3([0, .2, side]), common('pelv', pal.b, Object.assign({ nsp: F.pelv.spine ? 1 : 0, notch: .1, sheath: .1, dark: fc.dark, darkA: .22 }, extras())), 1.4); }
  }
  // adipose fin
  if (F.adipose) {
    const a = F.adipose, x = a.x, q = body.sec(x), g = new THREE.SphereGeometry(1, 16, 12);
    g.scale(a.w * .5, a.h * .6, .0045); g.translate(x + a.w * .1, q.T + a.h * .18, 0);
    g.setAttribute('aW', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3));
    out.push({ kind: 'adipose', geo: g, tex: null, color: mixc(fc.mem, fc.dark, .5) });
  }
  // finlets (tuna)
  if (F.finlets) {
    const fl = F.finlets, G = new Geo();
    for (const sign of [1, -1]) for (let i = 0; i < fl.n; i++) {
      const t = i / (fl.n - 1), x = lerp(sign > 0 ? fl.dorsalX0 : fl.analX0, sign > 0 ? fl.dorsalX1 : fl.analX1, t), q = body.sec(x), y = sign > 0 ? q.T - .002 : q.B + .002, hh = fl.h * (1 - .2 * t), w = .016;
      const a = G.v(x, y, 0, 0, 0, 0, 0, 0), b = G.v(x + w, y, 0, 1, 0, 0, 0, 0), c = G.v(x + w * .95, y + sign * hh, 0, 1, 1, 0, 0, .8);
      G.tri(a, b, c); G.tri(a, c, b);
    }
    out.push({ kind: 'finlets', geo: G.build(), tex: null, color: [225, 210, 60] });
  }
  return out;
}

'use strict';
const FGEN=(function(){const exports={};"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARCHETYPES = exports.Rng = void 0;
exports.generate = generate;
class Rng {
    constructor(seed) { this.s = seed >>> 0; }
    r() {
        let t = (this.s = (this.s + 0x6d2b79f5) | 0);
        t = Math.imul(t ^ (t >>> 15), 1 | t);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    range(a, b) { return a + (b - a) * this.r(); }
    int(a, b) { return Math.floor(this.range(a, b + 1)); }
    pick(a) { return a[Math.floor(this.r() * a.length)]; }
    chance(p) { return this.r() < p; }
}
exports.Rng = Rng;
const ARCH = {
    Perciform: { D: [.26, .36], p: [.3, .4], ped: [.22, .32], hl: [.26, .31], head: ['rounded', 'pointed', 'steep'], mouth: ['terminal', 'superior'], teeth: ['small', 'cardiform'], dorsal: 'spinysoft', caudal: ['emarginate', 'truncate', 'forked'], scale: 'ctenoid', hab: ['Lake', 'River', 'Coral reef', 'Coastal'], size: [8, 90], pattern: ['bars', 'plain', 'band', 'spots'] },
    Scombrid: { D: [.2, .27], p: [.36, .45], ped: [.06, .09], hl: [.22, .26], head: ['conical'], mouth: ['terminal'], teeth: ['small'], dorsal: 'tuna', caudal: ['lunate'], scale: 'cycloid', ss: [.008, .012], hab: ['Open ocean'], size: [40, 400], pattern: ['plain', 'tiger', 'band'], finlets: [5, 9], pal: 'pelagic' },
    Shark: { D: [.15, .21], p: [.3, .38], ped: [.1, .16], hl: [.24, .3], head: ['conical', 'pointed'], mouth: ['shark'], teeth: ['rows'], dorsal: 'shark', caudal: ['heterocercal'], scale: 'placoid', gill: 'slits', hab: ['Open ocean', 'Coastal', 'Coral reef'], size: [60, 1200], pattern: ['plain', 'plain', 'spots', 'saddles'], pal: 'shark' },
    Moray: { D: [.06, .1], p: [.18, .3], ped: [.25, .4], hl: [.13, .17], head: ['rounded', 'pointed', 'blunt'], mouth: ['terminal', 'superior'], teeth: ['fangs'], dorsal: 'eel', caudal: ['confluent'], scale: 'none', gill: 'pore', hab: ['Coral reef', 'Coastal', 'River'], size: [30, 300], pattern: ['reticulated', 'leopard', 'marbled', 'plain'], noPelvic: true },
    Catfish: { D: [.18, .26], p: [.22, .32], ped: [.16, .24], hl: [.22, .28], head: ['flat'], mouth: ['terminal'], teeth: ['cardiform'], dorsal: 'catfish', caudal: ['rounded', 'truncate', 'forked'], scale: 'none', hab: ['River', 'Lake', 'Swamp'], size: [10, 300], pattern: ['plain', 'spots', 'marbled'], barbels: [4, 8], adipose: true, pal: 'fresh' },
    Anglerfish: { D: [.42, .62], p: [.28, .36], ped: [.18, .26], hl: [.4, .48], head: ['bulbous'], mouth: ['gape'], teeth: ['fangs'], dorsal: 'small', caudal: ['rounded', 'truncate'], scale: 'none', hab: ['Deep sea', 'Abyssal'], size: [5, 100], pattern: ['plain', 'marbled'], lure: true, pal: 'deep' },
    Dragonfish: { D: [.09, .13], p: [.3, .4], ped: [.2, .3], hl: [.18, .22], head: ['blunt', 'rounded'], mouth: ['gape'], teeth: ['fangs'], dorsal: 'rear', caudal: ['forked', 'emarginate'], scale: 'none', hab: ['Deep sea', 'Abyssal'], size: [8, 40], pattern: ['plain'], photo: true, chin: true, pal: 'deep' },
    Pufferfish: { D: [.45, .6], p: [.35, .45], ped: [.12, .18], hl: [.3, .36], head: ['bulbous', 'blunt'], mouth: ['beak'], teeth: ['plates'], dorsal: 'rearsmall', caudal: ['rounded', 'truncate'], scale: 'none', hab: ['Coral reef', 'Coastal', 'River'], size: [4, 60], pattern: ['spots', 'leopard', 'reticulated', 'saddles'], noPelvic: true },
    Cichlid: { D: [.55, .9], p: [.35, .45], ped: [.1, .16], hl: [.24, .3], head: ['steep', 'humped'], mouth: ['protrusible', 'terminal'], teeth: ['small'], dorsal: 'sail', caudal: ['truncate', 'rounded', 'lyre'], scale: 'ctenoid', hab: ['River', 'Lake', 'Coral reef'], size: [4, 40], pattern: ['bars', 'stripes', 'clown', 'band', 'ocelli'], pal: 'vivid' },
    Cyprinid: { D: [.26, .36], p: [.35, .45], ped: [.18, .24], hl: [.22, .26], head: ['rounded'], mouth: ['protrusible', 'inferior', 'terminal'], teeth: ['none'], dorsal: 'single', caudal: ['forked', 'emarginate'], scale: 'cycloid', ss: [.03, .045], hab: ['River', 'Lake', 'Pond'], size: [3, 120], pattern: ['plain', 'marbled', 'band'], barbels: [0, 4], pal: 'fresh' },
    Gar: { D: [.08, .12], p: [.45, .55], ped: [.3, .4], hl: [.2, .26], head: ['pointed'], mouth: ['needle'], teeth: ['small'], dorsal: 'rear', caudal: ['rounded', 'forked'], scale: 'ganoid', hab: ['River', 'Coastal', 'Open ocean'], size: [30, 300], pattern: ['spots', 'plain'], snout: [.15, .32] },
    Billfish: { D: [.18, .24], p: [.3, .4], ped: [.05, .08], hl: [.22, .26], head: ['conical'], mouth: ['bill'], teeth: ['none'], dorsal: 'billsail', caudal: ['lunate'], scale: 'cycloid', ss: [.008, .012], hab: ['Open ocean'], size: [150, 450], pattern: ['bars', 'plain'], snout: [.25, .45], pal: 'pelagic' },
    Sturgeon: { D: [.14, .19], p: [.3, .38], ped: [.1, .15], hl: [.25, .3], head: ['conical'], mouth: ['inferior', 'sucker'], teeth: ['none'], dorsal: 'rear', caudal: ['heterocercal'], scale: 'scutes', hab: ['River', 'Lake', 'Coastal'], size: [60, 600], pattern: ['plain'], barbels: [4, 4], pal: 'fresh' },
    Pike: { D: [.13, .18], p: [.5, .6], ped: [.28, .36], hl: [.26, .32], head: ['concave'], mouth: ['superior', 'terminal', 'underbite'], teeth: ['fangs'], dorsal: 'rear', caudal: ['forked', 'emarginate'], scale: 'cycloid', hab: ['River', 'Lake', 'Coastal'], size: [30, 180], pattern: ['bars', 'spots', 'band'] },
    Grouper: { D: [.32, .4], p: [.35, .45], ped: [.22, .3], hl: [.3, .36], head: ['humped', 'rounded', 'concave'], mouth: ['superior', 'underbite'], teeth: ['cardiform'], dorsal: 'spinysoft', caudal: ['rounded', 'truncate'], scale: 'ctenoid', hab: ['Coral reef', 'Coastal'], size: [20, 270], pattern: ['spots', 'marbled', 'saddles', 'leopard'], lip: true },
    Parrotfish: { D: [.3, .4], p: [.35, .45], ped: [.2, .28], hl: [.24, .3], head: ['steep', 'rounded', 'humped'], mouth: ['beak'], teeth: ['plates'], dorsal: 'long', caudal: ['lunate', 'truncate', 'lyre'], scale: 'cycloid', ss: [.035, .05], hab: ['Coral reef'], size: [20, 130], pattern: ['plain', 'band', 'reticulated'], pal: 'vivid' },
    Piranha: { D: [.45, .58], p: [.35, .45], ped: [.14, .2], hl: [.28, .32], head: ['steep', 'blunt'], mouth: ['underbite'], teeth: ['serrated'], dorsal: 'single', caudal: ['forked', 'emarginate'], scale: 'cycloid', ss: [.01, .016], hab: ['River'], size: [12, 50], pattern: ['plain', 'spots'], adipose: true },
    Pipefish: { D: [.06, .09], p: [.3, .5], ped: [.25, .35], hl: [.24, .3], head: ['pointed'], mouth: ['tube'], teeth: ['none'], dorsal: 'mid', caudal: ['rounded', 'pointed', 'forked'], scale: 'scutes', hab: ['Coral reef', 'Coastal', 'Seagrass'], size: [5, 100], pattern: ['bars', 'plain', 'band'], snout: [.1, .22], noPelvic: true },
    Salmonid: { D: [.22, .28], p: [.35, .45], ped: [.18, .24], hl: [.22, .26], head: ['rounded', 'pointed'], mouth: ['terminal', 'superior'], teeth: ['small'], dorsal: 'single', caudal: ['truncate', 'emarginate', 'forked'], scale: 'cycloid', ss: [.01, .015], hab: ['River', 'Lake', 'Coastal'], size: [15, 150], pattern: ['spots', 'band', 'leopard'], adipose: true, pal: 'fresh' },
    Goby: { D: [.17, .23], p: [.2, .3], ped: [.3, .4], hl: [.26, .3], head: ['blunt', 'bulbous'], mouth: ['terminal', 'inferior'], teeth: ['small'], dorsal: 'goby', caudal: ['rounded'], scale: 'ctenoid', hab: ['Coral reef', 'Coastal', 'River', 'Tidepool'], size: [2, 30], pattern: ['spots', 'saddles', 'marbled', 'band'], eyeTop: true },
};
exports.ARCHETYPES = Object.keys(ARCH);
const HEAD = {
    // aTop, aBot, hump, humpX, concave, bellyFlat
    rounded: [.55, .6, 0, 0, 0, 0], blunt: [.32, .38, 0, 0, 0, 0], pointed: [.85, .8, 0, 0, 0, 0],
    conical: [1.05, .95, 0, 0, 0, 0], steep: [.34, .6, .22, .1, 0, 0], humped: [.5, .6, .35, .13, 0, 0],
    concave: [.95, .8, 0, 0, .3, 0], flat: [.75, .38, 0, 0, .38, .5], bulbous: [.3, .3, .1, .12, 0, 0],
};
const MOUTH = {
    terminal: { tip: [-.05, .05], len: [.07, .12], open: [0, .01], prot: [0, .005] },
    superior: { tip: [-.38, -.22], len: [.08, .14], open: [.004, .018], prot: [.008, .025] },
    underbite: { tip: [-.3, -.18], len: [.08, .12], open: [.004, .012], prot: [.015, .03] },
    gape: { tip: [-.35, -.2], len: [.2, .34], open: [.03, .09], prot: [.01, .035] },
    inferior: { tip: [-.12, 0], len: [.04, .07], open: [0, 0], prot: [0, 0] },
    shark: { tip: [-.12, -.02], len: [.06, .1], open: [0, 0], prot: [0, 0] },
    sucker: { tip: [-.1, 0], len: [.05, .08], open: [0, 0], prot: [0, 0] },
    protrusible: { tip: [-.02, .08], len: [.035, .06], open: [.002, .008], prot: [0, .004] },
    beak: { tip: [-.05, .1], len: [.04, .065], open: [0, .004], prot: [0, 0] },
    bill: { tip: [-.05, .05], len: [.06, .09], open: [0, 0], prot: [0, 0] },
    needle: { tip: [-.05, .05], len: [.05, .08], open: [.001, .004], prot: [.005, .02] },
    tube: { tip: [-.1, 0], len: [.01, .02], open: [0, 0], prot: [0, 0] },
};
const ALL_MOUTHS = Object.keys(MOUTH);
const ALL_HEADS = Object.keys(HEAD);
const hsl = (h, s, l) => `hsl(${((h % 360) + 360) % 360} ${Math.max(0, Math.min(100, s))}% ${Math.max(0, Math.min(100, l))}%)`;
const SYL1 = ['Abr', 'Chrom', 'Pter', 'Ichth', 'Scor', 'Thal', 'Bathy', 'Neo', 'Mega', 'Micro', 'Xiph', 'Lamp', 'Cyan', 'Aur', 'Glypt', 'Tetr', 'Hypo', 'Rhin', 'Syn', 'Caulo', 'Osteo', 'Lepid', 'Chaeto', 'Poly', 'Myct', 'Sarg', 'Epin'];
const SYL2 = ['o', 'a', 'i', 'eo', 'y', 'ae'];
const SYL3 = ['odon', 'ichthys', 'ops', 'gnathus', 'soma', 'pterus', 'cephalus', 'stoma', 'lepis', 'urus', 'phorus', 'chromis', 'canthus', 'rhynchus'];
const SP = ['aureus', 'lucifer', 'maculatus', 'profundus', 'rex', 'vittatus', 'gigas', 'minimus', 'nocturnus', 'fluviatilis', 'marinus', 'ignotus', 'spectabilis', 'ferox', 'radiatus', 'abyssalis', 'pictus', 'serpentinus', 'barbatus', 'splendens'];
function generate(seed, archSel = 'Any', mutation = 0.15) {
    var _a;
    const R = new Rng(seed);
    const archetype = archSel === 'Any' ? R.pick(exports.ARCHETYPES) : archSel;
    const A = ARCH[archetype];
    const donor = ARCH[R.pick(exports.ARCHETYPES)]; // crossover donor
    const mut = () => R.chance(mutation);
    const val = (k, fallback) => {
        let src = A[k] !== undefined ? A[k] : fallback;
        if (mut() && donor[k] !== undefined)
            src = donor[k];
        if (Array.isArray(src)) {
            if (src.length === 2 && typeof src[0] === 'number')
                return R.range(src[0], src[1]);
            return R.pick(src);
        }
        return src;
    };
    const habitat = val('hab', ['Coastal']);
    const deep = /Deep|Abyssal/.test(habitat);
    let D = val('D', [.25, .35]);
    const hl = val('hl', [.25, .3]);
    let headShape = val('head', ['rounded']);
    if (mut())
        headShape = R.pick(ALL_HEADS);
    let mt = val('mouth', ['terminal']);
    if (mut())
        mt = R.pick(ALL_MOUTHS);
    const M = MOUTH[mt];
    const H = HEAD[headShape];
    const jit = (v, a = .12) => v * (1 + R.range(-a, a));
    let teeth = val('teeth', ['small']);
    if (mt === 'beak')
        teeth = 'plates';
    if (mt === 'shark')
        teeth = 'rows';
    if (mt === 'tube' || mt === 'sucker')
        teeth = 'none';
    if (mt === 'gape' && teeth !== 'fangs')
        teeth = R.chance(.7) ? 'fangs' : 'cardiform';
    // mouth geometry adapts to head
    let tipY = R.range(M.tip[0], M.tip[1]);
    if (headShape === 'flat' && mt === 'terminal')
        tipY += .12;
    let len = R.range(M.len[0], M.len[1]) * (hl / .27);
    if (archetype === 'Catfish' && mt === 'terminal')
        len *= 1.25;
    let prot = R.range(M.prot[0], M.prot[1]);
    if (mt === 'underbite')
        prot *= 1.4;
    const snout = mt === 'bill' || mt === 'needle' || mt === 'tube' ? val('snout', mt === 'bill' ? [.25, .42] : mt === 'needle' ? [.15, .3] : [.1, .2]) : 0;
    const bmin = A.barbels ? A.barbels[0] : 0, bmax = A.barbels ? A.barbels[1] : 0;
    let barbels = R.int(bmin, bmax);
    if (mut())
        barbels = R.int(0, 6);
    if (mt === 'bill' || mt === 'needle' || mt === 'tube')
        barbels = 0;
    // eye
    let eyeR = R.range(.022, .034) * Math.sqrt(D / .3);
    if (deep)
        eyeR *= R.range(1.2, 1.8);
    if (archetype === 'Catfish' || archetype === 'Moray')
        eyeR *= .6;
    if (archetype === 'Shark')
        eyeR *= .7;
    const eyeX = mt === 'gape' ? R.range(.32, .45) : mt === 'bill' || mt === 'needle' ? R.range(.35, .45) : R.range(.26, .4);
    const eyeY = A.eyeTop ? R.range(.7, .8) : headShape === 'flat' ? R.range(.65, .75) : mt === 'superior' || mt === 'gape' ? R.range(.45, .6) : R.range(.35, .5);
    // fins
    const mk = (sx, ex, h, sweep, shape, spiny = false, rays = 10) => ({ sx, ex, h, sweep, shape, spiny, rays });
    const dStyle = val('dorsal', 'single');
    const dorsal = [];
    const anal = [];
    const dh = Math.max(.05, D * .35);
    switch (dStyle) {
        case 'spinysoft':
            if (R.chance(.5)) {
                dorsal.push(mk(.3, .55, dh * R.range(.8, 1.1), .3, 'triangular', true, R.int(8, 12)));
                dorsal.push(mk(.56, .8, dh * R.range(.8, 1), .25, 'rounded', false, 14));
            }
            else
                dorsal.push(mk(.3, .8, dh * .9, .25, 'long', true, 20));
            anal.push(mk(.6, .8, dh * .8, .4, 'rounded', false, 10));
            break;
        case 'tuna':
            dorsal.push(mk(.3, .45, dh * 1.1, .8, 'triangular', true, 12));
            dorsal.push(mk(.52, .62, dh * 1.4, .9, 'falcate', false, 10));
            anal.push(mk(.56, .65, dh * 1.3, .9, 'falcate', false, 10));
            break;
        case 'shark':
            dorsal.push(mk(.35, .5, D * .8, 1, 'falcate', false, 0));
            dorsal.push(mk(.72, .78, D * .3, .7, 'falcate', false, 0));
            anal.push(mk(.73, .79, D * .28, .7, 'falcate', false, 0));
            break;
        case 'eel':
            dorsal.push(mk(R.range(.15, .35), 1, D * .35, .1, 'long', false, 60));
            anal.push(mk(R.range(.4, .55), 1, D * .3, .1, 'long', false, 50));
            break;
        case 'catfish':
            dorsal.push(mk(.3, .38, D * .8, .5, 'triangular', true, 7));
            anal.push(mk(.55, .85, D * .35, .2, 'long', false, 20));
            break;
        case 'small':
            dorsal.push(mk(.65, .8, D * .2, .3, 'rounded', false, 8));
            anal.push(mk(.68, .82, D * .18, .3, 'rounded', false, 8));
            break;
        case 'rear':
            dorsal.push(mk(.68, .82, D * .7, .4, 'rounded', false, 12));
            anal.push(mk(.7, .84, D * .6, .4, 'rounded', false, 12));
            break;
        case 'rearsmall':
            dorsal.push(mk(.7, .8, D * .3, .3, 'rounded', false, 10));
            anal.push(mk(.7, .8, D * .28, .3, 'rounded', false, 10));
            break;
        case 'sail':
            dorsal.push(mk(.28, .85, D * R.range(.35, .8), .5, 'sail', R.chance(.5), 26));
            anal.push(mk(.5, .85, D * R.range(.35, .8), .5, 'sail', false, 20));
            break;
        case 'single':
            dorsal.push(mk(.4, .56, D * .6, .35, 'triangular', false, 12));
            anal.push(mk(.66, .78, D * .45, .35, 'triangular', false, 10));
            break;
        case 'billsail':
            dorsal.push(mk(.22, .7, D * R.range(.8, 1.8), .2, R.chance(.5) ? 'sail' : 'falcate', false, 40));
            anal.push(mk(.62, .72, D * .5, .7, 'falcate', false, 10));
            break;
        case 'long':
            dorsal.push(mk(.28, .84, D * .3, .2, 'long', true, 28));
            anal.push(mk(.62, .84, D * .3, .3, 'long', false, 12));
            break;
        case 'mid':
            dorsal.push(mk(.45, .6, D * .6, .1, 'square', false, 20));
            break;
        case 'goby':
            dorsal.push(mk(.3, .44, D * .6, .3, 'rounded', true, 6));
            dorsal.push(mk(.5, .8, D * .5, .25, 'long', false, 14));
            anal.push(mk(.55, .8, D * .45, .25, 'long', false, 12));
            break;
    }
    if (mut())
        dorsal.forEach(f => { f.h *= R.range(.6, 2.2); f.shape = R.pick(['triangular', 'falcate', 'rounded', 'sail', 'long', 'square']); });
    let caudal = val('caudal', ['forked']);
    if (mut())
        caudal = R.pick(['forked', 'lunate', 'truncate', 'emarginate', 'rounded', 'heterocercal', 'pointed', 'lyre']);
    if (dStyle === 'eel')
        caudal = 'confluent';
    const cSpanBase = caudal === 'lunate' ? D * 1.3 : caudal === 'heterocercal' ? D * 1.1 : caudal === 'confluent' ? D * .5 : D * R.range(.7, 1.0);
    const cLen = caudal === 'confluent' ? .06 : caudal === 'lunate' ? R.range(.14, .2) : R.range(.14, .24);
    // colors
    const pal = (_a = A.pal) !== null && _a !== void 0 ? _a : (deep ? 'deep' : /reef/i.test(habitat) ? 'vivid' : /Open/.test(habitat) ? 'pelagic' : /River|Lake|Pond|Swamp/.test(habitat) ? 'fresh' : 'coastal');
    let hue = R.range(0, 360), sat = 60, lit = 50;
    let dorsalC, flank, belly, accent, accent2, finC;
    if (pal === 'deep') {
        hue = R.pick([0, 10, 240, 270, 300, 20]);
        sat = R.range(20, 50);
        lit = R.range(8, 18);
    }
    if (pal === 'pelagic') {
        hue = R.range(195, 235);
        sat = R.range(50, 80);
        lit = R.range(25, 38);
    }
    if (pal === 'shark') {
        hue = R.range(190, 220);
        sat = R.range(8, 25);
        lit = R.range(35, 50);
    }
    if (pal === 'fresh') {
        hue = R.range(30, 110);
        sat = R.range(20, 50);
        lit = R.range(30, 48);
    }
    if (pal === 'coastal') {
        hue = R.range(80, 220);
        sat = R.range(10, 40);
        lit = R.range(35, 55);
    }
    if (pal === 'vivid') {
        sat = R.range(65, 95);
        lit = R.range(42, 58);
    }
    dorsalC = hsl(hue, sat, lit * .75);
    flank = hsl(hue + R.range(-15, 15), sat, lit);
    belly = pal === 'deep' ? hsl(hue, sat, lit * 1.3) : pal === 'vivid' ? hsl(hue + R.range(-40, 40), sat * .8, Math.min(85, lit + 25)) : hsl(hue, sat * .3, R.range(78, 92));
    const ah = pal === 'vivid' ? hue + R.pick([180, 150, 210, 120]) : hue + R.range(-30, 30);
    accent = pal === 'vivid' ? hsl(ah, 90, R.pick([50, 92, 12])) : pal === 'deep' ? hsl(hue, 30, 4) : hsl(ah, sat, lit * .45);
    accent2 = hsl(ah + 40, 80, 60);
    finC = pal === 'vivid' ? hsl(R.chance(.5) ? ah : hue, sat, lit) : hsl(hue, sat * .8, lit * 1.05);
    const glow = hsl(R.pick([180, 190, 200, 60, 300, 120]), 100, 65);
    let pattern = val('pattern', ['plain']);
    if (mut())
        pattern = R.pick(['plain', 'stripes', 'bars', 'spots', 'ocelli', 'reticulated', 'marbled', 'saddles', 'band', 'clown', 'leopard', 'tiger']);
    const marks = [];
    const nm = pattern === 'spots' ? R.int(20, 90) : pattern === 'leopard' ? R.int(60, 140) : pattern === 'reticulated' ? R.int(70, 130) : pattern === 'marbled' ? R.int(25, 50) : pattern === 'ocelli' ? R.int(1, 4) : pattern === 'bars' || pattern === 'clown' || pattern === 'saddles' ? R.int(3, 7) : pattern === 'stripes' ? R.int(2, 6) : pattern === 'tiger' ? R.int(10, 22) : 1;
    const sr = pattern === 'reticulated' ? R.range(.022, .035) : R.range(.006, .018);
    for (let i = 0; i < nm; i++)
        marks.push({ u: R.range(.05, .98), v: R.range(-.95, .95), r: sr * R.range(.6, 1.4), k: R.r() });
    if (['bars', 'clown', 'saddles'].includes(pattern))
        marks.forEach((m, i) => (m.u = .12 + (.8 * (i + .5)) / nm + R.range(-.02, .02)));
    const scale = val('scale', 'cycloid');
    const nameG = R.pick(SYL1) + R.pick(SYL2) + R.pick(SYL3);
    const adj = ['Ghost', 'Crimson', 'Spotted', 'Lantern', 'Royal', 'Striped', 'Giant', 'Pygmy', 'Thunder', 'Velvet', 'Iron', 'Jewel', 'Shadow', 'Golden', 'Needle', 'Tiger', 'Mud', 'Glass', 'Ember', 'Moon'];
    const noun = { Perciform: 'Perch', Scombrid: 'Tuna', Shark: 'Shark', Moray: 'Moray', Catfish: 'Catfish', Anglerfish: 'Angler', Dragonfish: 'Dragonfish', Pufferfish: 'Puffer', Cichlid: 'Cichlid', Cyprinid: 'Barb', Gar: 'Gar', Billfish: 'Marlin', Sturgeon: 'Sturgeon', Pike: 'Pike', Grouper: 'Grouper', Parrotfish: 'Parrotfish', Piranha: 'Piranha', Pipefish: 'Pipefish', Salmonid: 'Trout', Goby: 'Goby' };
    const sizeCm = Math.round(val('size', [10, 80]));
    const diet = teeth === 'fangs' || teeth === 'rows' || teeth === 'serrated' || mt === 'gape' ? 'Carnivore — ambush/pursuit predator' : mt === 'beak' ? 'Corallivore / shell crusher' : mt === 'inferior' || mt === 'sucker' ? 'Benthic forager' : mt === 'tube' ? 'Suction feeder — plankton' : mt === 'protrusible' ? 'Omnivore — suction feeder' : 'Opportunistic omnivore';
    return {
        seed, archetype, habitat, sizeCm, diet,
        name: `${nameG} ${R.pick(SP)}`,
        common: `${R.pick(adj)} ${habitat.split(' ')[0]} ${noun[archetype]}`,
        depthRange: deep ? `${R.int(2, 6) * 200}–${R.int(7, 20) * 200} m` : /Open/.test(habitat) ? `0–${R.int(2, 8) * 50} m` : `0–${R.int(2, 30)} m`,
        D, topFrac: R.range(.5, .6), p: val('p', [.3, .4]),
        aTop: jit(H[0]), aBot: jit(H[1]), ped: val('ped', [.2, .3]), hl,
        headShape, hump: H[2] * R.range(.8, 1.3), humpX: H[3], concave: H[4] * R.range(.8, 1.2), bellyFlat: H[5],
        mouth: { type: mt, len, open: R.range(M.open[0], M.open[1]), prot, tipY, teeth, lip: A.lip || mt === 'protrusible' ? R.range(.006, .012) : R.range(.002, .005), barbels, barbelLen: R.range(.06, .2), chinBarbel: !!A.chin || (mut() && R.chance(.3)), snout },
        eye: { x: eyeX, y: eyeY, r: eyeR, color: deep ? hsl(R.pick([180, 50, 0]), 80, 50) : hsl(R.pick([45, 30, 0, 200, 60]), R.range(50, 90), R.range(40, 60)) },
        gill: { type: val('gill', 'operculum'), n: R.int(5, 7) },
        dorsal, anal, adipose: !!A.adipose || (mut() && R.chance(.5)), finlets: Math.round(val('finlets', [0, 0])),
        pectoral: { len: R.range(.1, .18) * (archetype === 'Shark' ? 1.5 : 1) * (mut() ? R.range(1, 2.5) : 1), w: R.range(.03, .06), angle: R.range(.2, .7), y: R.range(.1, .5) },
        pelvic: { present: !A.noPelvic, x: R.range(.3, .45), len: R.range(.06, .12) },
        caudal: { type: caudal, len: cLen, span: cSpanBase / 2 + .02, filament: caudal === 'lyre' || (mut() && R.chance(.3)) ? R.range(.06, .18) : 0 },
        col: { dorsal: dorsalC, flank, belly, fin: finC, accent, accent2, finAlpha: R.range(.45, .85), glow, hue },
        pattern, marks, scale, scaleSize: val('ss', [.016, .03]), irid: pal === 'pelagic' || scale === 'cycloid' ? R.range(.2, .5) : R.range(0, .2),
        photophores: A.photo || (deep && R.chance(.5)) ? R.int(8, 24) : 0, lure: !!A.lure || (deep && mut()),
        bg: deep ? 'deep' : /Open/.test(habitat) ? 'ocean' : /reef/i.test(habitat) ? 'reef' : /River|Lake|Pond|Swamp/.test(habitat) ? 'fresh' : 'coast',
    };
}

return exports})();
