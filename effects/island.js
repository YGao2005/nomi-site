// Web port of the Nomi island (apps/macos/Nomi/Island + IslandKit in YGao2005/nomi), for the site mockup.
(() => {
  const RAW = window.NomiCatSprites;
  const CELLS = {};
  for (const [name, rows] of Object.entries(RAW)) {
    if (!Array.isArray(rows)) continue;
    const cells = [];
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === "x") cells.push([x, rows.length - 1 - y]); });
    CELLS[name] = cells;
  }
  const seq = name => Array.from({ length: RAW[name + "Count"] }, (_, i) => name + i);

  const G = {
    notch: { w: 185, h: 32 }, wing: 41.5, drop: 6, expandedWidth: 540, maxCard: 420,
    restingRadius: 10, radius: 22, edge: 24, mascotSlot: 52, indicator: 16, indicatorTrailing: 11,
  };
  G.restW = G.notch.w + 2 * G.wing;
  G.restH = G.notch.h + G.drop;
  G.cardMin = 12 + G.mascotSlot + G.edge;
  const slot = phase => phase === "expanded"
    ? { x: G.edge, y: G.notch.h + 12, w: G.mascotSlot, h: G.mascotSlot }
    : { x: 3, y: (G.restH - 22) / 2, w: 36, h: 22 };
  const feet = phase => { const s = slot(phase), e = phase === "expanded"; return [s.x + (e ? 2 : 1), s.y + s.h - (e ? 5.5 : 1)]; };

  // CatPose + CatAnimator (IslandKit/CatPose.swift)
  const posture = p => (p === "asleep" || p === "noticing" ? "lying" : "sitting");
  const poseFor = (mood, phase) => {
    if (phase !== "expanded") return mood === "idle" || phase === "hidden" ? "asleep" : "noticing";
    return { idle: "upright", peek: "upright", listening: "listening", answering: "speaking", thinking: "laptop",
      waiting: "question", unsure: "question", searching: "searching" }[mood];
  };
  const clip = (...pairs) => pairs;
  const WAKE = clip(["noticing", .07], ["chestUp", .11], ["pushUp", .11], ["stretch", .13]);
  const LIE_DOWN = clip(["pushUp", .06], ["chestUp", .07], ["noticing", .09]);
  const LOOPS = {
    listening: clip(["listening", .6], ["listenFar", .15], ["listenMid", .15], ["listenNear", .15], ["listening", .5],
      ["listenRightEar", .14], ["listening", .7], ["listenFar", .15], ["listenMid", .15], ["listenNear", .15],
      ["listening", .5], ["listenLeftEar", .14], ["listening", .4]),
    laptop: clip(["laptop", .16], ["laptopPawUp", .14], ["laptopKey2", .16], ["laptopPawUp", .14], ["laptop", .7], ["laptopPawUp", .14]),
    speaking: clip(["speakNear", .13], ["speaking", .13], ["speakFar", .13], ["speakNear", .13], ["speaking", .13], ["speakFar", .13], ["upright", .6]),
    question: clip(["questionDraw1", .09], ["questionDraw2", .09], ["questionDraw3", .09], ["questionDraw4", .09],
      ["question", .5], ["questionEar", .7], ["question", .9], ["upright", .4]),
    searching: clip(["searching", .5], ["searchRise", .16], ["searchMid", .16], ["searchFar", .5], ["searchMid", .16], ["searchRise", .16]),
  };
  const ENTRIES = {
    laptop: clip(["laptopClosed", .09], ["laptopHalf", .09]),
    searching: clip(["searchDraw1", .09], ["searchDraw2", .09], ["searchDraw3", .09], ["searchDraw4", .09]),
  };
  const STRETCH_DOWN = seq("stretchDown");
  const STRETCH = [...STRETCH_DOWN.map(s => [s, .08]), ["stretchBow", .64], ...seq("stretchUp").map(s => [s, .08])];
  const FIDGET_WAITS = [9, 14], DOZE_AFTER = 30;
  const BREATH_IN = [[1, 4], [3, 5]], EAR_TIP = [16, 16], CURSOR = [24, 3];
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const length = c => c.reduce((t, f) => t + f[1], 0);
  const index = (c, t) => { for (let i = 0; i < c.length; i++) { if (t < c[i][1]) return i; t -= c[i][1]; } return c.length - 1; };
  const frame = (c, t) => c[index(c, t % length(c))][0];
  const fidget = idle => {
    const len = length(STRETCH); let t = idle;
    for (const wait of FIDGET_WAITS) {
      if (t < wait) return null;
      if (t < wait + len) return index(STRETCH, t - wait);
      t -= wait + len;
    }
    return null;
  };
  const hurryBack = i => {
    const path = i < STRETCH_DOWN.length ? STRETCH.slice(0, i).reverse() : STRETCH.slice(i + 1);
    const step = Math.max(Math.floor((path.length + 3) / 4), 1), idx = [];
    for (let k = path.length - 1; k >= 0; k -= step) idx.push(k);
    return idx.reverse().map(k => [path[k][0], .06]);
  };
  const sleeping = t => { const b = t % 4.2; return b > 1.5 && b < 3.3 ? CELLS.asleep.concat(BREATH_IN) : CELLS.asleep; };

  class CatAnimator {
    constructor(pose) { this.pose = pose; this.clip = []; this.clipStart = 0; }
    idle(t) { return this.pose === "upright" ? t - this.clipStart - length(this.clip) : null; }
    dozing(t) { const i = this.idle(t); return i != null && i >= DOZE_AFTER; }
    show(next, t) {
      if (next === this.pose) return;
      const drawn = this.dozing(t) ? "lying" : posture(this.pose);
      if (posture(next) === drawn) {
        if (t < this.clipStart + length(this.clip)) { this.pose = next; return; }
        const i = this.idle(t), s = i == null ? null : fidget(i);
        this.clip = posture(next) === "sitting" && s != null ? hurryBack(s) : [];
      } else {
        this.clip = this.resuming(posture(next) === "sitting" ? WAKE : LIE_DOWN, t);
      }
      this.clipStart = t;
      this.pose = next;
    }
    resuming(path, t) {
      const played = t - this.clipStart;
      if (played >= length(this.clip)) return path;
      const drawn = this.clip[index(this.clip, played)][0];
      const i = path.findIndex(f => f[0] === drawn);
      return i < 0 ? path : path.slice(i + 1);
    }
    cells(t) {
      let elapsed = Math.max(0, t - this.clipStart);
      for (const f of this.clip) { if (elapsed < f[1]) return CELLS[f[0]]; elapsed -= f[1]; }
      const pose = this.pose, entry = ENTRIES[pose] || [];
      if (elapsed < length(entry)) return CELLS[entry[index(entry, elapsed)][0]];
      const loop = LOOPS[pose];
      if (loop) {
        elapsed -= length(entry);
        const cells = CELLS[frame(loop, elapsed)];
        return pose === "laptop" && elapsed % length(loop) >= 0.44 ? cells.filter(c => !same(c, CURSOR)) : cells;
      }
      if (pose === "upright" && elapsed >= DOZE_AFTER) {
        const d = elapsed - DOZE_AFTER;
        return d < length(LIE_DOWN) ? CELLS[frame(LIE_DOWN, d)] : sleeping(t);
      }
      if (pose === "asleep") return sleeping(t);
      if (pose === "upright") { const i = fidget(elapsed); if (i != null) return CELLS[STRETCH[i][0]]; }
      if (posture(pose) === "sitting" && t % 5.2 < 0.16) return CELLS[pose].filter(c => !same(c, EAR_TIP));
      return CELLS[pose];
    }
  }

  // SwiftUI motion: spring(response:dampingFraction:) and timingCurve
  const springK = (response, damping) => ({ k: (2 * Math.PI / response) ** 2, c: 4 * Math.PI * damping / response });
  const bezier = (x1, y1, x2, y2) => {
    const a = (p1, p2) => 1 - 3 * p2 + 3 * p1, b = (p1, p2) => 3 * p2 - 6 * p1, c = p1 => 3 * p1;
    const at = (t, p1, p2) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
    const slope = (t, p1, p2) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);
    return x => { let t = x; for (let i = 0; i < 8; i++) { const s = slope(t, x1, x2); if (Math.abs(s) < 1e-6) break; t -= (at(t, x1, x2) - x) / s; } return at(Math.min(1, Math.max(0, t)), y1, y2); };
  };
  const OPEN = { type: "spring", ...springK(0.5, 0.72) };
  const CLOSE = { type: "curve", ease: bezier(0.45, 0, 0.2, 1), duration: 0.34 };
  const springEasing = (response, damping) => {
    const { k, c } = springK(response, damping); let x = 0, v = 0, t = 0; const pts = [];
    while (t < 3) { for (let i = 0; i < 4; i++) { v += (-(k * (x - 1)) - c * v) / 240; x += v / 240; t += 1 / 240; } pts.push(x); if (t > .2 && Math.abs(1 - x) < .001 && Math.abs(v) < .01) break; }
    return { easing: `linear(0, ${pts.map(p => p.toFixed(4)).join(", ")})`, duration: t };
  };
  const CARD_IN = springEasing(0.4, 0.8);
  const linearOK = CSS.supports("transition-timing-function", "linear(0, 1)");

  class Motion {
    constructor(values) { this.v = { ...values }; this.vel = {}; this.target = { ...values }; this.mode = null; for (const k in values) this.vel[k] = 0; }
    to(target, mode, now) {
      this.mode = mode; this.from = { ...this.v }; this.start = now;
      Object.assign(this.target, target);
    }
    step(dt, now) {
      if (!this.mode) return;
      if (this.mode.type === "curve") {
        const p = Math.min(1, (now - this.start) / this.mode.duration), e = this.mode.ease(p);
        for (const k in this.v) { this.v[k] = this.from[k] + (this.target[k] - this.from[k]) * e; this.vel[k] = 0; }
        if (p >= 1) this.mode = null;
        return;
      }
      const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n; let moving = false;
      for (const k in this.v) {
        for (let i = 0; i < n; i++) { this.vel[k] += (-(this.mode.k * (this.v[k] - this.target[k])) - this.mode.c * this.vel[k]) * h; this.v[k] += this.vel[k] * h; }
        if (Math.abs(this.v[k] - this.target[k]) > 0.01 || Math.abs(this.vel[k]) > 0.01) moving = true;
      }
      if (!moving) { Object.assign(this.v, this.target); this.mode = null; }
    }
  }

  const ICON_FILE = { files: "IslandFiles", desktop: "IslandDesktop", settings: "IslandSettings", search: "IslandSearch", up: "IslandArrowUp", spinner: "IslandSpinner" };
  const base = (document.currentScript?.src || location.href).replace(/[^/]*$/, "");
  const svg = (name, cls = "") => `<i class="mi-ic ${cls}" style="--ic:url('${base}island-icons/${ICON_FILE[name]}.svg')"></i>`;
  const SPINNER = svg("spinner", "mi-spinner");
  const WAVE = '<span class="mi-wave">' + [4.286, 10, 7.143, 12.857, 5.714].map(h => `<i style="height:${h}px"></i>`).join("") + "</span>";
  const DOTS = '<span class="mi-dots"><i></i><i></i><i></i></span>';
  const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
  const field = (placeholder, text) => `<div class="mi-field-row"><div class="mi-field${text ? " has-text" : ""}">${text ? `<span class="t-small">${esc(text)}</span><i class="mi-caret"></i>` : `<span class="t-caption sec">${placeholder}</span>`}</div><span class="mi-send${text ? " ready" : ""}">${svg("up")}</span></div>`;

  const CARDS = {
    question: s => `<div class="mi-stack"><div><div class="t-title">What do you need help with today?</div><div class="t-caption sec">Press control ^ and option to chat verbally or type below</div></div>${field("Ask Nomi", s.typed)}</div>`,
    answer: s => {
      const status = s.status && `<div class="mi-status t-caption sec">${s.status === "thinking" ? "Nomi is thinking" + DOTS : "Nomi is Searching" + svg("search")}</div>`;
      const turn = s.answer
        ? `<div class="mi-turn"><div class="t-label sec">NOMI</div><div class="t-body">${esc(s.answer)}</div></div>`
        : `<div class="mi-turn"><div class="t-label sec">YOU</div><div class="t-body">${esc(s.question)}</div></div>`;
      return `<div class="mi-stack"><div class="mi-inner">${turn}${status || ""}</div>${s.done ? `<div class="mi-follow">${field("Ask Nomi a follow-up", "")}</div>` : ""}</div>`;
    },
  };

  function mount(host, opts = {}) {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const story = { question: "What was the flight number Sam sent me on Tuesday?", answer: "UA 1342, SFO to JFK, departing 8:05 AM. Sam sent it in Slack on Tuesday at 4:12 PM.", ...opts };
    host.classList.add("mi");
    host.innerHTML = `<div class="mi-screen"><div class="mi-menubar"><div class="mi-menu-left"><span class="mi-apple"></span><b>Finder</b><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Window</span><span>Help</span></div><div class="mi-menu-right"><svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor"><path d="M9 11.6 10.6 10a2.3 2.3 0 0 0-3.2 0Zm-3-3a4.3 4.3 0 0 1 6 0l1.2-1.2a6 6 0 0 0-8.4 0Zm-2.6-2.6a8 8 0 0 1 11.2 0l1.2-1.2a9.7 9.7 0 0 0-13.6 0Z"/></svg><svg width="26" height="13" viewBox="0 0 26 13"><rect x=".5" y=".5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="16" height="9" rx="2" fill="currentColor"/><path d="M24 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg><svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><rect x="1" y="2" width="14" height="3.6" rx="1.8"/><rect x="1" y="8.4" width="14" height="3.6" rx="1.8" opacity=".55"/></svg><span>Sat Nov 1&nbsp;&nbsp;11:12 AM</span></div></div><div class="mi-island" aria-hidden="true"><canvas class="mi-cat"></canvas><div class="mi-indicator"></div><div class="mi-utility">${svg("files")}${svg("desktop")}${svg("settings")}</div><div class="mi-card-area"></div></div></div>`;
    const screen = host.querySelector(".mi-screen"), island = host.querySelector(".mi-island");
    const canvas = host.querySelector(".mi-cat"), indicator = host.querySelector(".mi-indicator"), area = host.querySelector(".mi-card-area");
    const scale = Math.max(2, Math.round(devicePixelRatio || 1));
    canvas.width = canvas.height = 68 * scale;
    const ctx = canvas.getContext("2d");
    const clock = () => performance.now() / 1000;

    const state = { phase: "resting", mood: "idle", pointer: false, card: null, cardHeight: 0 };
    const [fx0, fy0] = feet("resting");
    const motion = new Motion({ w: G.restW, h: G.restH, r: G.restingRadius, fx: fx0, fy: fy0 });
    const cat = new CatAnimator("asleep");
    let cardEl = null, cardKind = null;

    const displayMood = () => (state.phase === "resting" && state.pointer && state.mood === "idle" ? "peek" : state.mood);
    const targets = () => {
      const e = state.phase === "expanded", [fx, fy] = feet(state.phase);
      const h = e ? G.notch.h + Math.min(Math.max(state.cardHeight, G.cardMin), G.maxCard) : G.restH;
      return { w: e ? G.expandedWidth : G.restW, h, r: e ? G.radius : Math.min(G.restingRadius, h * 0.4), fx, fy };
    };
    const sync = mode => {
      const p = poseFor(displayMood(), state.phase);
      if (still) cat.pose = p; else cat.show(p, clock());
      const ind = state.phase === "resting" && { listening: WAVE, searching: svg("search"), thinking: SPINNER }[state.mood];
      if (ind && indicator.dataset.kind !== state.mood) { indicator.innerHTML = ind; indicator.dataset.kind = state.mood; }
      indicator.classList.toggle("on", !!ind);
      island.classList.toggle("expanded", state.phase === "expanded");
      if (mode) motion.to(targets(), still ? null : mode, clock());
      if (still || !mode) Object.assign(motion.v, targets());
    };

    const setCard = (kind, data) => {
      if (kind === cardKind && cardEl) { cardEl.innerHTML = CARDS[kind](data); return; }
      if (cardEl) { const old = cardEl; old.classList.add("leaving"); setTimeout(() => old.remove(), 160); }
      cardKind = kind; cardEl = null;
      if (!kind) return;
      cardEl = document.createElement("div");
      cardEl.className = "mi-card";
      cardEl.innerHTML = CARDS[kind](data);
      if (!still) {
        cardEl.style.animation = `mi-card-in ${CARD_IN.duration.toFixed(3)}s ${linearOK ? CARD_IN.easing : "cubic-bezier(.2,.9,.3,1)"} .16s both`;
      }
      area.append(cardEl);
      measure.observe(cardEl);
    };
    const measure = new ResizeObserver(() => {
      if (!cardEl) return;
      const h = cardEl.offsetHeight;
      if (Math.abs(h - state.cardHeight) < 0.5) return;
      state.cardHeight = h;
      if (state.phase === "expanded") sync(OPEN);
    });

    const draw = () => {
      const { w, h, r, fx, fy } = motion.v;
      island.style.width = `${w}px`;
      island.style.height = `${h}px`;
      island.style.borderRadius = `0 0 ${r}px ${r}px`;
      area.style.height = `${Math.max(0, h - G.notch.h)}px`;
      canvas.style.left = `${Math.round(fx * scale) / scale}px`;
      canvas.style.top = `${Math.round((fy - 68) * scale) / scale}px`;
      const cells = still ? CELLS[cat.pose] : cat.cells(clock());
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#F4F3EF";
      const dots = scale >= 2 ? [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]] : [[0, 0], [1, 1]];
      for (const [x, up] of cells) {
        const px = x * 2 * scale, py = (68 - (up + 1) * 2) * scale;
        for (const [dx, dy] of dots) ctx.fillRect(px + dx, py + dy, 1, 1);
      }
    };

    let visible = true, last = clock();
    const tick = () => {
      const now = clock();
      if (visible) { motion.step(Math.min(0.05, now - last), now); draw(); }
      last = now;
      requestAnimationFrame(tick);
    };

    island.addEventListener("pointerenter", () => { state.pointer = true; sync(); });
    island.addEventListener("pointerleave", () => { state.pointer = false; sync(); });

    const fit = () => {
      const width = host.clientWidth, s = Math.min(1, width / (G.expandedWidth + 64));
      screen.style.transform = `scale(${s})`;
      screen.style.width = `${width / s}px`;
      host.style.height = `${screen.offsetHeight * s}px`;
    };
    new ResizeObserver(fit).observe(host);
    fit();

    let run = 0;
    const wait = (ms, id) => new Promise((ok, no) => setTimeout(() => (id === run ? ok() : no()), ms));
    const phase = (p, mood) => { const opening = p === "expanded" && state.phase !== "expanded"; state.phase = p; state.mood = mood; sync(opening || p === "expanded" ? OPEN : CLOSE); };
    const stream = async (count, perMs, show, id) => {
      const start = performance.now();
      for (let n = 0; n < count;) {
        await wait(16, id);
        const next = Math.min(count, Math.floor((performance.now() - start) / perMs) + 1);
        if (next !== n) show((n = next));
      }
    };
    async function play(id) {
      const s = { question: story.question, typed: "", status: null, answer: "", done: false };
      state.phase = "resting"; state.mood = "idle"; setCard(null); sync(CLOSE);
      await wait(1800, id);
      phase("expanded", "idle"); setCard("question", s);
      await wait(900, id);
      await stream(story.question.length, 52, n => { s.typed = story.question.slice(0, n); setCard("question", s); }, id);
      await wait(450, id);
      s.status = "thinking"; state.mood = "thinking"; setCard("answer", s); sync(OPEN);
      await wait(1500, id);
      s.status = "searching"; state.mood = "searching"; setCard("answer", s); sync(OPEN);
      await wait(1700, id);
      s.status = null; state.mood = "answering"; sync(OPEN);
      const words = story.answer.split(" ");
      await stream(words.length, 60, n => { s.answer = words.slice(0, n).join(" "); setCard("answer", s); }, id);
      s.done = true; setCard("answer", s);
      await wait(4200, id);
      state.mood = "idle"; phase("resting", "idle"); setCard(null);
      await wait(2200, id);
    }
    const loop = async () => { const id = ++run; try { for (;;) await play(id); } catch {} };

    if (still) {
      state.phase = "expanded"; state.mood = "answering";
      setCard("answer", { question: story.question, answer: story.answer, done: true });
      sync(); draw();
      return;
    }
    new IntersectionObserver(([e]) => {
      const was = visible; visible = e.isIntersecting;
      if (visible && !was) loop(); else if (!visible) run++;
    }).observe(host);
    sync(); requestAnimationFrame(tick); loop();
  }

  window.MacIsland = { mount };
  document.querySelectorAll("[data-mac-island]").forEach(el => mount(el));
})();
