// @@PART js/06_geometry_helper.js (lines 871-911 of the original <script>) -- stripped by build.mjs
/* ============================ geometry helper ============================ */
class Geo {
  constructor() { this.p = []; this.n = []; this.uv = []; this.w = []; this.i = []; }
  get count() { return this.p.length / 3; }
  v(x, y, z, u, v, w0, w1, w2, nx, ny, nz) {
    this.p.push(x, y, z); this.uv.push(u || 0, v || 0); this.w.push(w0 || 0, w1 || 0, w2 || 0);
    this.n.push(nx || 0, ny || 0, nz || 0); return this.count - 1;
  }
  tri(a, b, c) { this.i.push(a, b, c); }
  quad(a, b, c, d) { this.i.push(a, b, c, b, d, c); }
  build(normals) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('aW', new THREE.Float32BufferAttribute(this.w, 3));
    g.setIndex(this.i);
    if (normals === false) g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3)); else g.computeVertexNormals();
    return g;
  }
}
/* tapered tube along a curve function c(t)->[x,y,z] */
function addTube(G, c, r0, r1, segs, sides, w) {
  const base = G.count, pts = [];
  for (let i = 0; i <= segs; i++) pts.push(c(i / segs));
  let prev = null;
  for (let i = 0; i <= segs; i++) {
    const p = pts[i], q = pts[Math.min(segs, i + 1)], o = pts[Math.max(0, i - 1)];
    let t = [q[0] - o[0], q[1] - o[1], q[2] - o[2]]; const tl = Math.hypot(...t) || 1; t = t.map(a => a / tl);
    let a = Math.abs(t[1]) < .9 ? [0, 1, 0] : [1, 0, 0];
    let b = [t[1] * a[2] - t[2] * a[1], t[2] * a[0] - t[0] * a[2], t[0] * a[1] - t[1] * a[0]]; const bl = Math.hypot(...b) || 1; b = b.map(v => v / bl);
    a = [b[1] * t[2] - b[2] * t[1], b[2] * t[0] - b[0] * t[2], b[0] * t[1] - b[1] * t[0]];
    const r = lerp(r0, r1, i / segs);
    for (let s = 0; s <= sides; s++) {
      const ang = TAU * s / sides, ca = Math.cos(ang), sa = Math.sin(ang);
      const n = [a[0] * ca + b[0] * sa, a[1] * ca + b[1] * sa, a[2] * ca + b[2] * sa];
      G.v(p[0] + n[0] * r, p[1] + n[1] * r, p[2] + n[2] * r, s / sides, i / segs, w ? w[0] : 0, w ? w[1] : 0, (w ? w[2] : 0) * (i / segs));
    }
  }
  for (let i = 0; i < segs; i++) for (let s = 0; s < sides; s++) { const a = base + i * (sides + 1) + s, b = a + sides + 1; G.tri(a, b, a + 1); G.tri(a + 1, b, b + 1); }
}

