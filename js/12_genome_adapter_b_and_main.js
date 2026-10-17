// @@PART js/12_genome_adapter_b_and_main.js (lines 1790-1991 of the original <script>) -- stripped by build.mjs
(function () {
  onerror = (m, s, l) => { const e = $('inf'); if (e) e.textContent = 'Error: ' + m + ' (line ' + l + ')'; };
  const canvas = $('gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, .01, 40);
  const maxTex = renderer.capabilities.maxTextureSize, QS = new URLSearchParams(location.search), TEXW = QS.get('tex') ? +QS.get('tex') : (maxTex >= 4096 ? 4096 : 2048);

  /* ---------------- environments ---------------- */
  function envTexture(mode) {
    const W = 1024, H = 512, c = mkCanvas(W, H), g = c.getContext('2d');
    if (mode === 'water') {
      let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#f2fdff'); gr.addColorStop(.28, '#8fdcee'); gr.addColorStop(.5, '#2f9ab8'); gr.addColorStop(.75, '#0a4a66'); gr.addColorStop(1, '#03202e');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { const x = Math.random() * W, w = 8 + Math.random() * 40, gg = g.createLinearGradient(x, 0, x + 30, H * .8); gg.addColorStop(0, 'rgba(255,255,255,' + (.25 + Math.random() * .35) + ')'); gg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gg; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + w, 0); g.lineTo(x + w + 90, H * .8); g.lineTo(x + 60, H * .8); g.fill(); }
      const s = g.createRadialGradient(W * .3, H * .08, 0, W * .3, H * .08, 120); s.addColorStop(0, 'rgba(255,255,255,1)'); s.addColorStop(.3, 'rgba(255,255,240,.8)'); s.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = s; g.fillRect(0, 0, W, H);
    } else {
      let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.42, '#dfe5ea'); gr.addColorStop(.52, '#aab3bb'); gr.addColorStop(1, '#4b535b');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      const box = (x, y, w, h, a) => { g.fillStyle = 'rgba(255,255,255,' + a + ')'; g.fillRect(x, y, w, h); };
      box(W * .12, H * .1, W * .14, H * .3, 1); box(W * .62, H * .06, W * .18, H * .28, 1); box(W * .4, 0, W * .08, H * .16, 1); box(W * .9, H * .2, W * .04, H * .34, .9); box(0, H * .36, W, 6, .8);
    }
    const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.encoding = THREE.sRGBEncoding;
    const pm = new THREE.PMREMGenerator(renderer), rt = pm.fromEquirectangular(t); t.dispose(); pm.dispose(); return rt.texture;
  }
  const ENV = { water: envTexture('water'), studio: envTexture('studio') };
  let mode = 'water';
  const hemi = new THREE.HemisphereLight(0xcfeeff, 0x0a2a3a, .55), key = new THREE.DirectionalLight(0xfff4e0, 1.5), rim = new THREE.DirectionalLight(0x9fe8ff, .8), fill = new THREE.DirectionalLight(0xbfe0ff, .45);
  key.position.set(-1.2, 2.4, 2.2); rim.position.set(1.5, .6, -2.2); fill.position.set(2, -.5, 2);
  scene.add(hemi, key, rim, fill);
  function setMode(m) {
    mode = m; scene.environment = ENV[m]; document.body.dataset.mode = m;
    if (m === 'studio') { hemi.color.set(0xffffff); hemi.groundColor.set(0x8a9096); hemi.intensity = .7; key.color.set(0xffffff); key.intensity = 1.6; rim.color.set(0xffffff); rim.intensity = .6; }
    else { hemi.color.set(0xcfeeff); hemi.groundColor.set(0x0a2a3a); hemi.intensity = .55; key.color.set(0xfff4e0); key.intensity = 1.5; rim.color.set(0x9fe8ff); rim.intensity = .8; }
    $('studio').classList.toggle('on', m === 'studio');
  }

  /* ---------------- bubbles ---------------- */
  const bub = (() => {
    const n = 90, p = new Float32Array(n * 3), sp = new Float32Array(n);
    for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * 5; p[i * 3 + 1] = (Math.random() - .5) * 3; p[i * 3 + 2] = -Math.random() * 3 - .3; sp[i] = .03 + Math.random() * .06; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const c = mkCanvas(32, 32), x = c.getContext('2d'), gr = x.createRadialGradient(16, 16, 2, 16, 16, 15); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.7, 'rgba(255,255,255,.25)'); gr.addColorStop(.9, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 32, 32);
    const m = new THREE.PointsMaterial({ size: .03, map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, opacity: .7 });
    const pts = new THREE.Points(g, m); scene.add(pts); return { pts, p, sp, n };
  })();

  /* ---------------- shader patch: swim wave, fin flutter ---------------- */
  const U = { uT: { value: 0 }, uAmp: { value: 1 }, uFlut: { value: 1 }, uK: { value: 6.2 } };
  const DEF = `
attribute vec3 aW; uniform float uT, uAmp, uFlut, uK;
void fishDeform(inout vec3 p, inout vec3 n, vec3 w){
  float ph = uT*7.0 + p.x*38.0 + p.y*23.0;
  p += n * (w.z * uFlut * 0.0032 * sin(ph));
  float u = clamp(p.x, 0.0, 1.5), env = 0.010 + 0.05*u*u, k = uK, ang = k*u - uT*4.4;
  float dz = uAmp*(0.10*u*sin(ang) + env*k*cos(ang));
  p.z += uAmp*env*sin(ang);
  n.x -= dz*n.z; n = normalize(n);
}`;
  function patch(mat) {
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + DEF)
        .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3( normal ); vec3 fp = position; fishDeform(fp, objectNormal, aW);')
        .replace('#include <begin_vertex>', 'vec3 transformed = fp;');
    };
    mat.customProgramCacheKey = () => 'headlessfish';
    return mat;
  }
  const lin = h => new THREE.Color(h).convertSRGBToLinear();

  /* ---------------- fish build ---------------- */
  const S = { group: null, sp: null, body: null, mats: [], meshes: [], cx: .55, ext: 1.2, info: null };
  const CM = { bass: 46, seabass: 62, cod: 80, tilapia: 32, trout: 44, tuna: 110, carp: 56, koi: 60, catfish: 56, pike: 72, barracuda: 120, angelfish: 12, clownfish: 9, parrotfish: 46, piranha: 26, grouper: 66, goldfish: 15 };
  function variant(sp, r) {
    const P = sp.skin.pal; for (const k of ['d', 'm', 'b']) P[k] = jitterHex(P[k], r, .012, .05, .03);
    for (const k of ['mem', 'tip']) sp.fc[k] = jitterHex(sp.fc[k], r, .012, .05, .03);
  }
  function dispose() {
    if (S.group) { scene.remove(S.group); S.group.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
    S.mats.forEach(m => { ['map', 'bumpMap', 'roughnessMap', 'metalnessMap'].forEach(k => m[k] && m[k].dispose()); m.dispose(); }); S.mats = []; S.meshes = [];
  }
  const RN = { body: 0, part: 1, fin: 2, glass: 3 };
  function build(key, seed, title) {
    dispose();
    S.last = { key, seed, title }; const rnd = mulberry32(seed); let sp; S.pulse = [];
    if (typeof key === 'string') { sp = SPECIES[key](rnd); variant(sp, rnd); sp.cm = Math.round(CM[key] * (.85 + rnd() * .3)); sp.swim = [1, 6.2]; sp.mutations = []; }
    else if (key && key.genome) { sp = g2spec(FGEN.generate(seed, key.arch || 'Any', key.mut == null ? .15 : key.mut), rnd); key = sp.arch; }
    else { sp = makeFish(rnd, key); key = sp.arch; }
    const body = buildBody(sp), skin = paintSkin(sp, body, seed, TEXW, TEXW / 4), fins = buildFins(sp, body, seed);
    const grp = new THREE.Group();
    const add = (geo, mat, order) => { const m = new THREE.Mesh(geo, patch(mat)); m.frustumCulled = false; m.renderOrder = order; grp.add(m); S.mats.push(mat); S.meshes.push(m); return m; };
    /* body */
    const bm = new THREE.MeshPhysicalMaterial({ map: skin.map, bumpMap: skin.bump, bumpScale: sp.skin.scale.size > 0 ? 1.3 : .8, roughnessMap: skin.mr, metalnessMap: skin.mr, emissiveMap: skin.emissive || null, emissive: skin.emissive ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0), emissiveIntensity: 1.3, roughness: 1, metalness: 1, clearcoat: sp.skin.scale.size > 0 ? .18 : .55, clearcoatRoughness: .32, envMapIntensity: .6, side: THREE.DoubleSide });
    if (skin.emissive) { bm.userData.base = 1.3; S.pulse.push(bm); }
    const bodyMesh = add(body.geo, bm, RN.body); S.glowMat = skin.emissive ? bm : null;
    /* fins */
    fins.forEach(f => {
      let mat;
      if (f.tex) mat = new THREE.MeshStandardMaterial({ map: f.tex.map, bumpMap: f.tex.bump, bumpScale: 1.8, transparent: true, alphaTest: .035, side: THREE.DoubleSide, depthWrite: false, roughness: .5, metalness: 0, envMapIntensity: .55 });
      else if (f.kind === 'adipose') mat = new THREE.MeshStandardMaterial({ color: lin(toHex(f.color)), transparent: true, opacity: .88, roughness: .5, envMapIntensity: .5 });
      else mat = new THREE.MeshStandardMaterial({ color: lin(toHex(f.color)), side: THREE.DoubleSide, roughness: .5 });
      add(f.geo, mat, RN.fin);
      if (f.spines) add(f.spines, new THREE.MeshStandardMaterial({ color: lin(toHex(f.spineCol)), roughness: .38, metalness: .05, envMapIntensity: .7 }), RN.part);
    });
    const minX = body.xCut, maxX = 1 + sp.fins.caud.len, ext = maxX - minX, cxx = (minX + maxX) / 2; grp.position.x = -cxx; scene.add(grp);
    S.group = grp; S.sp = sp; S.body = body; S.ext = ext; S.cx = cxx; S.skin = skin;
    S.cm = sp.cm < 10 ? Math.round(sp.cm * 10) / 10 : Math.round(sp.cm); S.key = key; U.uK.value = sp.swim[1]; S.swimAmp = sp.swim[0]; S.seed = seed; S.title = title;
    info(sp, title); fit(); wireApply();
  }
  const wireApply = () => S.mats.forEach(m => m.wireframe = wire);
  const sizeStr = c => c >= 100 ? (c / 100).toFixed(1) + ' m' : c + ' cm';
  function info(sp, title) {
    const F = sp.fins, d0 = (F.dorsal || []).reduce((a, f) => [a[0] + (f.nsp || 0), a[1] + (f.n - (f.nsp || 0))], [0, 0]);
    const a0 = (F.anal || []).reduce((a, f) => [a[0] + (f.nsp || 0), a[1] + (f.n - (f.nsp || 0))], [0, 0]);
    const dStr = (F.dorsal || []).map(f => (f.nsp ? 'D ' + rom(f.nsp) + (f.n > f.nsp ? ' ' + (f.n - f.nsp) : '') : 'D ' + f.n)).join(' + ');
    const aStr = (F.anal || []).map(f => (f.nsp ? 'A ' + rom(f.nsp) + (f.n > f.nsp ? ' ' + (f.n - f.nsp) : '') : 'A ' + f.n)).join(' + ');
    const finStr = [dStr, aStr, 'C ' + F.caud.n, 'P ' + (F.pect ? F.pect.n : 0), 'V ' + (F.pelv ? F.pelv.n : 0)].filter(Boolean).join(' · ');
    $('fm').textContent = sp.family || '';
    $('nm').textContent = (sp.common || title || '').replace(/\b\w/g, c => c.toUpperCase());
    $('lt').textContent = sp.latin ? sp.latin + ' · ' + sizeStr(S.cm) : sizeStr(S.cm);
    $('inf').textContent = finStr;
  }
  /* ---------------- camera ---------------- */
  const view = { yaw: -.55, pitch: .12, dist: 2, ty: 0, tx: 0, tYaw: -.55, tPitch: .12, tDist: 2, txT: 0, tyT: 0 };
  function fit() {
    const a = innerWidth / innerHeight, fov = camera.fov * PI / 180, hf = 2 * Math.atan(Math.tan(fov / 2) * a), h = Math.max(.55, S.sp ? S.sp.D * 1.9 + .25 : .6);
    const dw = S.ext * 1.22 / (2 * Math.tan(hf / 2)), dh = h * 1.15 / (2 * Math.tan(fov / 2)); S.fitDist = Math.max(dw, dh, 1.2); view.tDist = S.fitDist;
  }
  let drag = null, pinch = null;
  canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointermove', e => { if (!drag) return; view.tYaw -= (e.clientX - drag.x) * .006; view.tPitch = clamp(view.tPitch + (e.clientY - drag.y) * .005, -1.2, 1.2); drag = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', () => drag = null); canvas.addEventListener('pointercancel', () => drag = null);
  canvas.addEventListener('wheel', e => { e.preventDefault(); view.tDist = clamp(view.tDist * Math.exp(e.deltaY * .001), .12, 5); }, { passive: false });
  canvas.addEventListener('touchmove', e => { if (e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); if (pinch) view.tDist = clamp(view.tDist * pinch / d, .12, 5); pinch = d; } }, { passive: true });
  canvas.addEventListener('touchend', () => pinch = null);
  let vo = null;
  function applyOffset(snap) {
    const w = innerWidth, h = innerHeight;
    const ch = Math.min($('card').offsetHeight, h * .55);
    const cx = w / 2, cy = h / 2 - Math.round(ch * .5);
    if (!vo || snap) vo = { cx, cy, sc: 1 };
    else { vo.cx += (cx - vo.cx) * .2; vo.cy += (cy - vo.cy) * .2; }
    const key = [Math.round(vo.cx), Math.round(vo.cy)].join();
    if (key === vo.key) return; vo.key = key;
    camera.setViewOffset(w, h, w / 2 - vo.cx, h / 2 - vo.cy, w, h);
  }
  function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; vo = null; camera.updateProjectionMatrix(); fit(); applyOffset(true); }
  addEventListener('resize', resize);

  /* ---------------- UI ---------------- */
  let wire = false, swim = true;
  const chips = $('chips');
  const gen = (src, seed, title) => { const inf = $('inf'); $('nm').textContent = 'Growing…'; inf.textContent = 'generating body, skin and fins'; setTimeout(() => { try { build(src, seed, title); } catch (e) { inf.textContent = 'Error: ' + e.message; console.error(e); } }, 30); };
  const habSel = () => { const v = $('hab').value; return v === 'any' ? undefined : v; }, weirdV = () => +$('wd').value / 100, rs = () => (Math.random() * 1e9) | 0;
  const THEMES = [['Surprise me', {}], ['Reef', { hab: 'reef' }], ['River', { hab: 'river' }], ['Lake', { hab: 'lake' }], ['Open sea', { hab: 'sea' }], ['Ocean giant', { hab: 'sea', size: 'large' }], ['Deep sea', { hab: 'deep' }], ['Anglerfish', { hab: 'deep', arch: 'deep', muts: ['lure', 'glow'] }], ['Shark', { arch: 'shark' }], ['Eel', { arch: 'eel' }], ['Puffer', { arch: 'globe' }], ['Tiny', { size: 'small' }], ['Fantasy', { hab: 'fantasy', weird: .9 }], ['Unicorn fish', { hab: 'fantasy', muts: ['horn', 'glow'] }], ['Dragon fish', { hab: 'fantasy', arch: 'eel', muts: ['sail', 'whiskers', 'glow'], weird: 1 }]];
  THEMES.forEach(([n, o]) => { const b = document.createElement('button'); b.className = 'th'; b.textContent = n; b.onclick = () => gen(Object.assign({ hab: habSel(), weird: weirdV() }, o), rs()); chips.append(b); });
  SP_LIST.forEach(k => { const b = document.createElement('button'); b.textContent = SPECIES[k](mulberry32(1)).common; b.onclick = () => gen(k, rs()); chips.append(b); });
  const GEN = window.GEN = { on: true }, gArch = () => $('ga').value, gMut = () => +$('gmu').value / 100, gSrc = () => ({ genome: true, arch: gArch(), mut: gMut() });
  GEN_ARCH.forEach(a => { const o = document.createElement('option'); o.value = a; o.textContent = a; $('ga').append(o); const b = document.createElement('button'); b.className = 'gn'; b.textContent = a; b.onclick = () => { GEN.on = true; $('gt').classList.add('on'); $('ga').value = a; gen(gSrc(), rs()); }; chips.prepend(b); });
  $('gt').onclick = e => { GEN.on = !GEN.on; e.target.classList.toggle('on', GEN.on); };
  $('ga').onchange = () => { GEN.on = true; $('gt').classList.add('on'); gen(gSrc(), rs()); };
  $('go').onclick = () => {
    if (GEN.on) { const q = $('q').value.trim(); if (!q) return gen(gSrc(), rs()); const a = genArchFromText(q); if (a) $('ga').value = a; return gen(gSrc(), hstr(q.toLowerCase()), q.replace(/\b\w/g, c => c.toUpperCase())); }
    const q = $('q').value.trim(); if (!q) return; const sd = hstr(q.toLowerCase()), title = q.replace(/\b\w/g, c => c.toUpperCase()), hn = parseHints(q), k = matchSpecies(q), mod = hn.hab || hn.muts.length || hn.size || hn.weird !== undefined;
    if (k && !mod) gen(k, sd, title); else gen({ hab: hn.hab || habSel(), arch: hn.arch, muts: hn.muts, size: hn.size, weird: hn.weird !== undefined ? hn.weird : weirdV() }, sd, title);
  };
  $('q').addEventListener('keydown', e => { if (e.key === 'Enter') $('go').click(); });
  $('rnd').onclick = () => gen(GEN.on ? gSrc() : { hab: habSel(), weird: weirdV() }, rs());
  $('swim').onclick = e => { swim = !swim; e.target.classList.toggle('on', swim); };
  $('wire').onclick = e => { wire = !wire; e.target.classList.toggle('on', wire); wireApply(); };
  
  $('studio').onclick = () => setMode(mode === 'water' ? 'studio' : 'water');
  $('snap').onclick = () => { renderer.render(scene, camera); const a = document.createElement('a'); a.download = (S.title || S.sp.common).replace(/\W+/g, '_') + '.png'; a.href = canvas.toDataURL('image/png'); a.click(); };

  /* ---------------- loop ---------------- */
  let t = 0, last = performance.now(), fixed = null;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (fixed === null) t += dt * (swim ? 1 : .15);
    const tt = fixed === null ? t : fixed.t;
    U.uT.value = tt; U.uAmp.value = fixed ? fixed.amp : (swim ? (S.swimAmp || 1) : .0); U.uFlut.value = swim ? 1 : .35;
    if (S.pulse) S.pulse.forEach((m, i) => { m.emissiveIntensity = (m.userData.base || 1) * (.78 + .22 * Math.sin(tt * 2.2 + i * 1.7)); });
    view.yaw += (view.tYaw - view.yaw) * .1; view.pitch += (view.tPitch - view.pitch) * .1; view.dist += (view.tDist - view.dist) * .1; view.tx += (view.txT - view.tx) * .1; view.ty += (view.tyT - view.ty) * .1;
    camera.position.set(view.tx + Math.sin(view.yaw) * Math.cos(view.pitch) * view.dist, view.ty + Math.sin(view.pitch) * view.dist, Math.cos(view.yaw) * Math.cos(view.pitch) * view.dist); camera.lookAt(view.tx, view.ty, 0);
    camera.near = Math.max(.005, view.dist * .05); applyOffset(); camera.updateProjectionMatrix();
    for (let i = 0; i < bub.n; i++) { bub.p[i * 3 + 1] += bub.sp[i] * dt; if (bub.p[i * 3 + 1] > 1.8) bub.p[i * 3 + 1] = -1.6; } bub.pts.geometry.attributes.position.needsUpdate = true; bub.pts.visible = mode === 'water';
    key.position.set(-1.2 + Math.sin(tt * .3) * .1, 2.4, 2.2);
    renderer.render(scene, camera);
  }
  resize(); setMode('water');
  window.FISH = { gen: (k, s, n) => build(k, s, n), set: o => { fixed = fixed || { t: 0, amp: 0 }; Object.assign(fixed, o); if (o.yaw !== undefined) { view.yaw = view.tYaw = o.yaw; } if (o.pitch !== undefined) view.pitch = view.tPitch = o.pitch; if (o.dist !== undefined) view.dist = view.tDist = o.dist; if (o.mode) setMode(o.mode); if (o.tx !== undefined) view.tx = view.txT = o.tx; if (o.ty !== undefined) view.ty = view.tyT = o.ty; if (o.snap) { view.yaw = view.tYaw; view.pitch = view.tPitch; view.dist = view.tDist; view.tx = view.txT; view.ty = view.tyT; } }, S, view, scene, camera, renderer };
  const h = location.hash.slice(1).split('&')[0], hp = h.split('.'), nz = v => (v === undefined || v === '_' || v === '') ? undefined : v;
  if (SPECIES[h]) gen(h, 12345);
  else if (hp[0] === 'g') gen({ hab: nz(hp[1]), arch: nz(hp[2]), muts: nz(hp[3]) ? hp[3].split('+') : [], weird: nz(hp[4]) !== undefined ? +hp[4] : undefined, size: nz(hp[6]) }, +hp[5] || 12345);
  else if (hp[0] === 'gen') gen({ genome: true, arch: nz(hp[1]) || 'Any', mut: nz(hp[2]) !== undefined ? +hp[2] : .15 }, +hp[3] || 12345);
  else gen({ genome: true, arch: 'Any', mut: .15 }, (Math.random() * 1e9) | 0);
  requestAnimationFrame(frame);
})();

