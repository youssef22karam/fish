// @@PART js/07_body.js (lines 912-996 of the original <script>) -- stripped by build.mjs
/* ============================ headless fish body ============================ */
function makeSection(sp) {
  const eps = sp.eps || .02, xcap = .978;
  const cap = x => x > xcap ? Math.sqrt(Math.max(0, 1 - ((x - xcap) / (1 - xcap)) ** 2)) : 1;
  return x => {
    const T0 = sp.top(x), B0 = sp.bot(x);
    return { T: T0, B: B0, w: sp.wr(x) * (T0 - B0) * .5 * cap(x) };
  };
}
function ringTable(s, nT, nB, NJ) {
  const Y = new Float32Array(NJ + 1), Z = new Float32Array(NJ + 1), C = new Float32Array(NJ + 1);
  for (let j = 0; j <= NJ; j++) {
    const th = PI * j / NJ, c = Math.cos(th), sn = Math.sin(th), up = c >= 0, e = 2 / (up ? nT : nB);
    Y[j] = up ? s.T * Math.pow(c, e) : s.B * Math.pow(-c, e);
    Z[j] = s.w * Math.pow(Math.abs(sn), e);
    if (j) C[j] = C[j - 1] + Math.hypot(Y[j] - Y[j - 1], Z[j] - Z[j - 1]);
  }
  return { Y, Z, C, L: C[NJ], NJ };
}
function arcPt(t, cum) {
  const C = t.C; let lo = 0, hi = C.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (C[m] <= cum) lo = m; else hi = m; }
  const k = (cum - C[lo]) / Math.max(1e-9, C[hi] - C[lo]);
  return [lerp(t.Y[lo], t.Y[hi], k), lerp(t.Z[lo], t.Z[hi], k)];
}

function buildBody(sp) {
  const xCut = (sp.head && sp.head.gillX) ? sp.head.gillX : .25;
  const sec = makeSection(sp), nT = sp.nT, nB = sp.nB;
  const xs = [xCut];
  for (let x = xCut + .003; x < .36; x += .0028) xs.push(x);
  for (let x = Math.max(xCut + .003, .36); x < .999; x += .0075) xs.push(x);
  xs.push(1);
  const N = xs.length;
  const G = new Geo(), tabs = [], HA = new Float32Array(N);
  const HALF = 40, RING = HALF * 2;

  for (let i = 0; i < N; i++) {
    const x = xs[i], s = sec(x), tab = ringTable(s, nT, nB, 180);
    tabs.push(tab); HA[i] = tab.L;
    for (let k = 0; k <= HALF; k++) {
      const cum = tab.L * k / HALF;
      const [y, z0] = arcPt(tab, cum);
      G.v(x, y, z0, x, cum / tab.L, 0, 0, 0);
    }
    for (let k = 1; k < HALF; k++) {
      const m = HALF - k;
      const cum = tab.L * m / HALF;
      const [y, z0] = arcPt(tab, cum);
      G.v(x, y, -z0, x, cum / tab.L, 0, 0, 0);
    }
  }

  // Quads between body rings
  for (let i = 0; i < N - 1; i++) {
    const b0 = i * RING, b1 = (i + 1) * RING;
    for (let p = 0; p < RING; p++) {
      const q = (p + 1) % RING;
      G.tri(b0 + p, b0 + q, b1 + p);
      G.tri(b0 + q, b1 + q, b1 + p);
    }
  }

  // Front cut cap (neck cut surface)
  const sCut = sec(xCut);
  const cIdx = G.v(xCut, (sCut.T + sCut.B) * .5, 0, xCut, .5, 0, 0, 0);
  for (let p = 0; p < RING; p++) {
    const q = (p + 1) % RING;
    G.tri(cIdx, q, p);
  }

  const geo = G.build();
  geo.computeVertexNormals();

  return {
    geo, xs, HA, tabs, sec, N, xCut,
    opercle: { cx: xCut, ax: .05, cf: 0, af: .5 },
    haAt(x) { let i = 0; while (i < N - 2 && xs[i + 1] < x) i++; const t = clamp((x - xs[i]) / Math.max(1e-6, xs[i + 1] - xs[i]), 0, 1); return lerp(HA[i], HA[i + 1], t); },
    sOfY(x, y) { let i = 0; while (i < N - 2 && xs[i + 1] < x) i++; const t = tabs[i]; if (t.L < 1e-7) return .5; for (let j = 1; j <= t.NJ; j++) if (t.Y[j] <= y) { const k = (t.Y[j - 1] - y) / Math.max(1e-9, t.Y[j - 1] - t.Y[j]); return lerp(t.C[j - 1], t.C[j], k) / t.L; } return 1; },
    surf(x, y, s) { const q = sec(x); const c = y >= 0 ? q.T : -q.B, n = y >= 0 ? nT : nB; if (c < 1e-6) return 0; const r = clamp(Math.abs(y) / c, 0, .9999); return q.w * Math.pow(1 - Math.pow(r, n), 1 / n); },
    yAtF(x, f) { const q = sec(x); return q.B + (q.T - q.B) * (f + 1) / 2; }
  };
}

'use strict';
