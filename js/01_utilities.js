// @@PART js/01_utilities.js (lines 60-131 of the original <script>) -- stripped by build.mjs
'use strict';
/* ============================ utilities ============================ */
const PI = Math.PI, TAU = PI * 2;
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const sst = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const $ = id => document.getElementById(id);

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hstr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

function h2(x, y, s) {
  let n = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1274126177)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = h2(xi, yi, s), b = h2(xi + 1, yi, s), c = h2(xi, yi + 1, s), d = h2(xi + 1, yi + 1, s);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
function fbm(x, y, s, o) {
  o = o || 4; let a = .5, f = 1, r = 0, n = 0;
  for (let i = 0; i < o; i++) { r += a * vnoise(x * f, y * f, s + i * 17); n += a; f *= 2; a *= .5; }
  return r / n;
}

/* monotone cubic (PCHIP) through knots [[x,y],...] */
function pchip(kn) {
  const n = kn.length, X = kn.map(k => k[0]), Y = kn.map(k => k[1]), h = [], d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) { h[i] = X[i + 1] - X[i]; d[i] = (Y[i + 1] - Y[i]) / h[i]; }
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); }
  }
  return x => {
    if (x <= X[0]) return Y[0]; if (x >= X[n - 1]) return Y[n - 1];
    let i = 0; while (x > X[i + 1]) i++;
    const t = (x - X[i]) / h[i], t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * Y[i] + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * Y[i + 1] + (t3 - t2) * h[i] * m[i + 1];
  };
}

/* colour helpers (sRGB hex <-> [r,g,b] 0..255) */
function hex(c) { if (Array.isArray(c)) return c; const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mixc(a, b, t) { a = hex(a); b = hex(b); return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function rgb(c, k) { k = k === undefined ? 1 : k; return 'rgb(' + clamp(c[0] * k, 0, 255) + ',' + clamp(c[1] * k, 0, 255) + ',' + clamp(c[2] * k, 0, 255) + ')'; }
function rgba(c, a, k) { k = k === undefined ? 1 : k; c = hex(c); return 'rgba(' + (clamp(c[0] * k, 0, 255) | 0) + ',' + (clamp(c[1] * k, 0, 255) | 0) + ',' + (clamp(c[2] * k, 0, 255) | 0) + ',' + a + ')'; }
function hsl2rgb(h, s, l) {
  h = ((h % 1) + 1) % 1; const a = s * Math.min(l, 1 - l);
  const f = n => { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}
function toHex(c) { return '#' + c.map(v => (clamp(Math.round(v), 0, 255) | 0).toString(16).padStart(2, '0')).join(''); }
function jitterHex(c, r, dh, ds, dl) {
  const [R, G, B] = hex(c).map(v => v / 255); const mx = Math.max(R, G, B), mn = Math.min(R, G, B); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === R ? (G - B) / d + (G < B ? 6 : 0) : mx === G ? (B - R) / d + 2 : (R - G) / d + 4; h /= 6; }
  return toHex(hsl2rgb(h + (r() - .5) * 2 * dh, clamp(s + (r() - .5) * 2 * ds, 0, 1), clamp(l + (r() - .5) * 2 * dl, .02, .98)));
}

function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

'use strict';
