// Memory field: a WebGL2 layer behind a hero. The cursor leaves a trail of
// cross-stitches that fades like a memory; a click sends a ring outward.
// Usage: <div data-memory-field> ... </div> (the element gets a canvas behind
// its content). Without WebGL2 or with reduced motion it stays still or blank.
(() => {
  const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const COMMON = `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x),
             mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.07 + vec2(3.1, 7.7); a *= 0.5; }
  return v;
}`;

  // Trail state, one texel per 2 css px: r = ink, g = thread hue.
  const TRAIL = `#version 300 es
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uRes;
uniform vec2 uSize;
uniform float uDt;
uniform float uDecay;
uniform float uReach;
uniform float uTime;
uniform float uSegOn;
uniform vec4 uSeg;
uniform float uSegInk;
uniform int uRippleCount;
uniform vec3 uRipples[4];
out vec4 o;
float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec4 prev = texture(uPrev, uv);
  vec2 px = vec2(uv.x, 1.0 - uv.y) * uSize;
  float ink = prev.r * exp(-uDt / uDecay);
  float hue = prev.g;
  if (uSegOn > 0.5) {
    float d = segDist(px, uSeg.xy, uSeg.zw);
    float k = exp(-(d * d) / (uReach * uReach)) * uSegInk;
    hue = mix(hue, fract(uTime * 0.04), clamp(k * 1.5, 0.0, 1.0));
    ink = min(1.0, ink + k);
  }
  for (int i = 0; i < 4; i++) {
    if (i >= uRippleCount) break;
    float age = uRipples[i].z;
    float r = age * 520.0;
    float d = length(px - uRipples[i].xy) - r;
    float k = exp(-(d * d) / 260.0) * (1.0 - age / 1.4) * uDt * 3.5;
    ink = min(1.0, ink + max(k, 0.0));
  }
  o = vec4(ink, hue, 0.0, 1.0);
}`;

  const DRAW = `#version 300 es
precision highp float;
uniform sampler2D uTrail;
uniform vec2 uSize;
uniform float uDpr;
uniform float uTime;
uniform float uCell;
uniform vec4 uGlow;
uniform float uGlowStrength;
uniform vec3 uPalA, uPalB, uPalC, uPalD;
out vec4 o;
${COMMON}
vec3 pal(float t) { return uPalA + uPalB * cos(6.28318 * (uPalC * t + uPalD)); }
void main() {
  vec2 px = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 cell = floor(px / uCell);
  vec2 center = (cell + 0.5) * uCell;
  vec2 local = (px - center) / uCell;

  float ink = texture(uTrail, vec2(center.x / uSize.x, 1.0 - center.y / uSize.y)).r;
  vec2 tuvPx = vec2(px.x / uSize.x, 1.0 - px.y / uSize.y);
  vec4 trPx = texture(uTrail, tuvPx);

  float t = uTime * 0.025;
  vec2 q = px / uSize.x * 2.2;
  vec2 w = vec2(fbm(q + vec2(t, -t)), fbm(q + vec2(5.2 - t, 1.3 + t)));
  float n = fbm(q * 1.4 + w * 1.6);

  vec2 g = (px - uGlow.xy) / uGlow.zw;
  float glow = exp(-dot(g, g)) * uGlowStrength * smoothstep(0.25, 0.75, n);

  vec3 col = pal(n * 0.9 + trPx.g);

  // One cross-stitch per cell, its arms growing with the ink under it.
  float arm = 0.46 * smoothstep(0.04, 0.7, ink);
  vec2 a = abs(local);
  float d = min(abs(local.x - local.y), abs(local.x + local.y)) * 0.7071;
  float aa = 1.2 / (uCell * uDpr);
  float th = 0.055 + 0.02 * ink;
  float stitch = (1.0 - smoothstep(th - aa, th + aa, d))
               * (1.0 - smoothstep(arm - aa, arm + aa, max(a.x, a.y)));
  stitch *= smoothstep(0.03, 0.2, ink);

  float grain = hash12(floor(px * uDpr)) - 0.5;
  float wash = clamp(glow + trPx.r * 0.05, 0.0, 1.0);
  wash = clamp(wash * (1.0 + grain * 0.5) + grain / 255.0, 0.0, 1.0);

  vec3 stitchCol = pal(n * 0.9 + trPx.g + 0.08) * 0.92;
  float alpha = clamp(stitch * 0.5 + wash * (1.0 - stitch), 0.0, 1.0);
  vec3 rgb = (stitchCol * stitch * 0.5 + col * wash * (1.0 - stitch));
  o = vec4(rgb, alpha);
}`;

  const DEFAULTS = {
    cell: 8,
    decay: 1.1,
    reach: 18,
    glowStrength: 0.55,
    palA: [0.78, 0.66, 0.62],
    palB: [0.22, 0.2, 0.24],
    palC: [1.0, 1.0, 1.0],
    palD: [0.0, 0.12, 0.3],
  };

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(gl, frag) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(p, 0, "aPos");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i).name.replace(/\[0\]$/, "");
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  }

  function mount(host, opts = {}) {
    const P = { ...DEFAULTS, ...opts };
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "memory-field-canvas";
    host.prepend(canvas);
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });
    if (!gl) { canvas.remove(); return; }

    const half = !!gl.getExtension("EXT_color_buffer_float");
    const trailP = program(gl, TRAIL);
    const drawP = program(gl, DRAW);

    gl.bindVertexArray(gl.createVertexArray());
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let W = 0, H = 0, dpr = 1, tw = 0, th = 0;
    let targets = [];
    function makeTarget(w, h) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (half) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fbo };
    }
    function resize() {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      const ntw = Math.ceil(W / 2), nth = Math.ceil(H / 2);
      if (ntw !== tw || nth !== th) {
        targets.forEach(t => { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); });
        tw = ntw; th = nth;
        targets = [makeTarget(tw, th), makeTarget(tw, th)];
      }
      kick();
    }

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let last = null, seg = null, ripples = [], visible = true, raf = 0, prevT = 0, idleUntil = 0;
    const start = performance.now();

    function onMove(e) {
      if (e.pointerType !== "mouse" || reduced.matches) return;
      const r = canvas.getBoundingClientRect();
      const p = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (p.x < -60 || p.y < -60 || p.x > r.width + 60 || p.y > r.height + 60) { last = null; return; }
      if (last) {
        const len = Math.hypot(p.x - last.x, p.y - last.y);
        const ink = Math.min(0.5, 0.06 + len / 100);
        seg = seg ? { ...seg, x1: p.x, y1: p.y, ink: Math.max(seg.ink, ink) }
                  : { x0: last.x, y0: last.y, x1: p.x, y1: p.y, ink };
      }
      last = p;
      kick();
    }
    function onDown(e) {
      if (reduced.matches || (e.pointerType === "mouse" && e.button !== 0)) return;
      if (e.target.closest("a, button, input, textarea, select, label, [role=button]")) return;
      const r = canvas.getBoundingClientRect();
      ripples = [...ripples, { x: e.clientX - r.left, y: e.clientY - r.top, born: performance.now() }].slice(-4);
      kick();
    }

    function frame(now) {
      raf = 0;
      const dt = Math.min(0.05, prevT ? (now - prevT) / 1000 : 0.016);
      prevT = now;
      const time = (now - start) / 1000;
      ripples = ripples.filter(r => now - r.born < 1400);

      const [src, dst] = targets;
      gl.disable(gl.BLEND);
      gl.useProgram(trailP.p);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
      gl.viewport(0, 0, tw, th);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      const u = trailP.u;
      gl.uniform1i(u.uPrev, 0);
      gl.uniform2f(u.uRes, tw, th);
      gl.uniform2f(u.uSize, W, H);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uDecay, P.decay);
      gl.uniform1f(u.uReach, P.reach);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uSegOn, seg ? 1 : 0);
      if (seg) {
        gl.uniform4f(u.uSeg, seg.x0, seg.y0, seg.x1, seg.y1);
        gl.uniform1f(u.uSegInk, seg.ink);
      }
      gl.uniform1i(u.uRippleCount, ripples.length);
      if (ripples.length) {
        const arr = new Float32Array(12);
        ripples.forEach((r, i) => arr.set([r.x, r.y, (now - r.born) / 1000], i * 3));
        gl.uniform3fv(u.uRipples, arr);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      targets = [dst, src];
      if (seg) idleUntil = now + P.decay * 4000;
      seg = null;

      gl.useProgram(drawP.p);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindTexture(gl.TEXTURE_2D, dst.tex);
      const d = drawP.u;
      gl.uniform1i(d.uTrail, 0);
      gl.uniform2f(d.uSize, W, H);
      gl.uniform1f(d.uDpr, dpr);
      gl.uniform1f(d.uTime, reduced.matches ? 0 : time);
      gl.uniform1f(d.uCell, P.cell);
      gl.uniform4f(d.uGlow, W * 0.5, H * 0.78, W * 0.42, H * 0.3);
      gl.uniform1f(d.uGlowStrength, P.glowStrength);
      gl.uniform3fv(d.uPalA, P.palA);
      gl.uniform3fv(d.uPalB, P.palB);
      gl.uniform3fv(d.uPalC, P.palC);
      gl.uniform3fv(d.uPalD, P.palD);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!visible || reduced.matches) return;
      if (now < idleUntil || ripples.length) raf = requestAnimationFrame(frame);
      else setTimeout(() => { if (!raf) raf = requestAnimationFrame(frame); }, 66);
    }
    function kick() { if (!raf && visible) raf = requestAnimationFrame(frame); }

    new ResizeObserver(resize).observe(host);
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) { cancelAnimationFrame(raf); raf = 0; last = null; } else kick();
    }).observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { last = null; });
    resize();
  }

  window.MemoryField = { mount };
  document.querySelectorAll("[data-memory-field]").forEach(el => mount(el));
})();
