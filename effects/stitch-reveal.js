// Stitch reveal: each letter is recalled as a cross-stitch of its own shape,
// coarse to fine, then settles into the real glyph. Usage:
// <h2 data-stitch-reveal>Text</h2>. Starts when 25% into the viewport.
(() => {
  const SAMPLE = 96;
  const STAGES = [3, 2, 1];
  const THREADS = ["#c8553d", "#3f6c8f", "#7a8b3a", "#a2557a"];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  function split(el) {
    const text = (el.dataset.text ??= el.textContent.trim().replace(/\s+/g, " "));
    el.textContent = "";
    delete el.dataset.state;
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = text;
    const vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    const chars = [];
    text.split(" ").forEach((word, wi) => {
      if (wi) vis.append(" ");
      const w = document.createElement("span");
      w.className = "stitch-word";
      for (const ch of word) {
        const c = document.createElement("span");
        c.className = "stitch-char";
        c.dataset.char = ch;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "stitch-dots");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svg.append(path);
        const letter = document.createElement("span");
        letter.className = "stitch-letter";
        letter.textContent = ch;
        c.append(svg, letter);
        w.append(c);
        chars.push({ el: c, svg, path });
      }
      vis.append(w);
    });
    el.append(sr, vis);
    return chars;
  }

  // Rasterises one glyph and returns, per stage, an SVG path of x-stitches
  // over the cells it covers, in milli-em units.
  function stitchFrames(ctx, ch, m, cellEm) {
    const glyph = ctx.measureText(ch);
    const adv = glyph.width / SAMPLE + m.spacing;
    const w = Math.max(1, Math.ceil(adv * SAMPLE)), h = Math.ceil(m.height * SAMPLE);
    const cv = ctx.canvas;
    if (cv.width < w || cv.height < h) { cv.width = Math.max(cv.width, w); cv.height = Math.max(cv.height, h); ctx.font = m.font; }
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#000";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(ch, 0, m.ascent * SAMPLE);
    const data = ctx.getImageData(0, 0, w, h).data;
    const k = v => Math.round(v * 1000);
    return STAGES.map(scale => {
      const cell = cellEm * scale * SAMPLE;
      const cols = Math.max(1, Math.round(w / cell)), rows = Math.max(1, Math.round(h / cell));
      const cw = w / cols, chh = h / rows;
      let d = "";
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        let hit = 0, n = 0;
        for (let y = Math.floor(r * chh); y < Math.floor((r + 1) * chh); y += 2)
          for (let x = Math.floor(c * cw); x < Math.floor((c + 1) * cw); x += 2) {
            n++; if (data[(y * w + x) * 4 + 3] > 127) hit++;
          }
        if (!n || hit / n < 0.4) continue;
        const x0 = (c * cw) / SAMPLE, y0 = (r * chh) / SAMPLE;
        const s = Math.min(cw, chh) / SAMPLE, inset = s * 0.18;
        const a = x0 + inset, b = y0 + inset, e = x0 + s - inset, f = y0 + s - inset;
        d += `M${k(a)} ${k(b)}L${k(e)} ${k(f)}M${k(e)} ${k(b)}L${k(a)} ${k(f)}`;
      }
      return { d, stroke: k(cellEm * scale * 0.22) };
    });
  }

  function run(el) {
    const chars = split(el);
    const done = () => { el.dataset.state = "done"; };
    if (reduced.matches) return done();
    const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    if (!ctx) return done();

    const start = () => {
      const cs = getComputedStyle(el);
      const font = `${cs.fontStyle} ${cs.fontWeight} ${SAMPLE}px ${cs.fontFamily}`;
      ctx.font = font;
      const fm = ctx.measureText("Hgjpqy");
      const ascent = fm.fontBoundingBoxAscent / SAMPLE, descent = fm.fontBoundingBoxDescent / SAMPLE;
      const cap = ctx.measureText("H").actualBoundingBoxAscent / SAMPLE;
      const m = { font, ascent, height: ascent + descent, spacing: (parseFloat(cs.letterSpacing) || 0) / parseFloat(cs.fontSize) };
      const cellEm = cap / 9;
      el.style.setProperty("--stitch-height", `${m.height}em`);
      el.style.setProperty("--stitch-descent", `${-descent}em`);
      el.style.setProperty("--stitch-thread", THREADS[Math.floor(Math.random() * THREADS.length)]);
      const cache = new Map();
      const items = chars.map((c, i) => {
        if (!cache.has(c.el.dataset.char)) cache.set(c.el.dataset.char, stitchFrames(ctx, c.el.dataset.char, m, cellEm));
        const adv = ctx.measureText(c.el.dataset.char).width / SAMPLE + m.spacing;
        c.svg.setAttribute("viewBox", `0 0 ${Math.round(adv * 1000)} ${Math.round(m.height * 1000)}`);
        c.svg.style.width = `${adv}em`;
        return { ...c, frames: cache.get(c.el.dataset.char), order: i, jitter: Math.random() * 90, step: 70 + Math.random() * 40, index: -1, shown: false };
      });
      const stagger = Math.min(28, 900 / Math.max(1, items.length - 1));
      el.dataset.state = "stitching";
      const t0 = performance.now();
      const tick = now => {
        let pending = false;
        for (const it of items) {
          if (it.shown) continue;
          pending = true;
          const at = t0 + it.order * stagger + it.jitter;
          if (now < at) continue;
          const f = Math.floor((now - at) / it.step);
          if (f >= it.frames.length) { it.shown = true; it.el.dataset.shown = ""; }
          else if (f !== it.index) {
            it.index = f;
            it.path.setAttribute("d", it.frames[f].d);
            it.path.setAttribute("stroke-width", it.frames[f].stroke);
          }
        }
        pending ? requestAnimationFrame(tick) : done();
      };
      requestAnimationFrame(tick);
    };

    document.fonts.ready.then(() => {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        e.boundingClientRect.bottom < 0 ? done() : start();
      }, { rootMargin: "100000px 0px -25% 0px" });
      io.observe(el);
    });
  }

  document.documentElement.dataset.js = "";
  window.StitchReveal = { run };
  document.querySelectorAll("[data-stitch-reveal]").forEach(run);
})();
