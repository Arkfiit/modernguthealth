/* eslint-disable */
// This file is loaded on /program and provides the DOM-based app logic from the provided HTML.
// It attaches key functions onto `window` so React event handlers can call them.

// IMPORTANT: `program-data.js` and `program.js` run in the same global scope.
// Wrap everything to avoid collisions with globals like `LESSONS`, `PROGRAMS`, `R`.
(function () {

// ═══ HELPERS ═══════════════════════════════════════════════════════
function sh2(t){return `<div class="sh2">${t}</div>`}
function sh3(t){return `<div class="sh3">${t}</div>`}
function sh4(t){return `<div class="sh4">${t}</div>`}
function bt(t){return `<p class="bt">${t}</p>`}
function btb(t){return `<span class="btb">${t}</span>`}
function bullets(items){return `<ul class="blist">${items.map(i=>`<li><div class="bdot"></div><span>${i}</span></li>`).join('')}</ul>`}
function nums(items){return `<ol class="nlist">${items.map((i,n)=>`<li><div class="nbadge">${n+1}</div><span>${i}</span></li>`).join('')}</ol>`}
function sci(text){return `<div class="sci"><div class="scilabel">🔬 Science Note</div><p>${text}</p></div>`}
function ibox(label,text){return `<div class="ibox"><div class="iboxlabel">${label}</div><p>${text}</p></div>`}
function abox(title,items){return `<div class="abox"><div class="atitle">✅ ${title}</div><ul class="alist">${items.map(i=>`<li><div class="chkico">✓</div><span>${i}</span></li>`).join('')}</ul></div>`}
function nutbanner(title,text){return `<div class="nutbanner"><div class="nutbanner-icon">🥗</div><div class="nutbanner-body"><div class="nutbanner-title">${title}</div><div class="nutbanner-text">${text}</div></div></div>`}
function suppbox(title,rows){return `<div class="suppbox"><div class="suppbox-title">💊 ${title}</div>${rows.map(r=>`<div class="supprow"><span class="supp-name">${r[0]}</span><span>${r[1]}</span></div>`).join('')}</div>`}
function recipe(r){
  return `<div class="rcrd">
    <div class="rchdr">
      <div class="rctitle">${r.title}</div>
      <div class="rctagline">${r.tagline}</div>
      <div class="rcmeta"><span>📋 ${r.forLesson}</span><span>👤 ${r.servings}</span><span>⏱ ${r.prep}</span><span>🔥 ${r.cook}</span></div>
    </div>
    <div class="rcbody">
      <div class="rccol"><div class="rcstitle">Ingredients</div><ul class="inglist">${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul></div>
      <div class="rccol"><div class="rcstitle">Method</div><ol class="stlist">${r.steps.map((s,i)=>`<li><div class="stnum">${i+1}</div><span>${s}</span></li>`).join('')}</ol></div>
    </div>
    <div class="rcfooter">
      <div class="wlabel">🧪 Why This Works</div>
      <div class="wtext">${r.why}</div>
      <div class="nutline"><strong style="color:#14b8a6">📊 Nutrition</strong> — ${r.nutrition}</div>
    </div>
  </div>`;
}

// ═══ DATASET ═══════════════════════════════════════════════════════
// The full content can be provided by `window.__VITACORE_DATA__` (static) or fetched from `/api/program-data` (dynamic).
let DATA = window.__VITACORE_DATA__ || null;

// Avoid redeclaring global identifiers from `program-data.js` (both scripts share global scope).
const RECIPES = DATA?.R || {};

let LESSONS = DATA?.LESSONS || {};

let PROGRAMS =
  DATA?.PROGRAMS || {
    men: {
      id: "men",
      label: "Men's Vitality & Performance",
      phases: [],
    },
    women: {
      id: "women",
      label: "Feminine Vitality & Intimate Health",
      phases: [],
    },
  };

let __dataReady = null;
async function ensureProgramData() {
  __dataReady = (async () => {
    try {
      const res = await fetch("/api/program-data", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      if (!json || !json.PROGRAMS) return;
      DATA = { ...(DATA || {}), ...json };
      PROGRAMS = DATA.PROGRAMS || PROGRAMS;
    } catch (_) {
      // ignore and keep fallback/static dataset
    }
  })();
  return __dataReady;
}

// ═══ STATE ═════════════════════════════════════════════════════════
let state = { prog: null, lessonId: null, completed: new Set(), flat: [] };

function buildFlat() {
  state.flat = [];
  const P = PROGRAMS[state.prog];
  P.phases.forEach((ph) =>
    ph.modules.forEach((m) =>
      m.lessons.forEach((l) => {
        state.flat.push({ ...l });
      }),
    ),
  );
}

function getAllLessonIds() {
  const P = PROGRAMS[state.prog];
  const all = [];
  P.phases.forEach((ph) =>
    ph.modules.forEach((m) =>
      m.lessons.forEach((_, i) => all.push(m.id + "_" + i)),
    ),
  );
  return all;
}

function setBreadcrumb(phase, mod) {
  const ac = state.prog === "men" ? "var(--mc)" : "var(--wc)";
  const bg = state.prog === "men" ? "rgba(0,212,170,.12)" : "rgba(244,114,182,.12)";
  const el = document.getElementById("bphase");
  el.textContent = phase;
  el.style.background = bg;
  el.style.color = ac;
  document.getElementById("bmodule").textContent = mod;
}

function toggleMod(mid, forceOpen = false) {
  const el = document.getElementById(mid);
  const ch = document.getElementById("chev-" + mid);
  if (!el) return;
  const open = el.classList.contains("open");
  if (forceOpen || !open) {
    el.classList.add("open");
    ch && ch.classList.add("open");
  } else {
    el.classList.remove("open");
    ch && ch.classList.remove("open");
  }
}

function buildSidebar() {
  const P = PROGRAMS[state.prog];
  const ac = state.prog === "men" ? "var(--mc)" : "var(--wc)";
  document.getElementById("sptitle").innerHTML =
    '<span style="color:' +
    ac +
    '">' +
    (state.prog === "men" ? "⚡ Men's Vitality" : "🌸 Feminine Vitality") +
    '</span><span class="sub">& ' +
    (state.prog === "men" ? "Performance" : "Intimate Health") +
    "</span>";
  let h = "";
  P.phases.forEach((ph) => {
    h += '<div class="phdiv">' + ph.label + " — " + ph.title + "</div>";
    ph.modules.forEach((m) => {
      const mid = "mod-" + m.id;
      h +=
        '<div class="mgrp"><div class="mhdr" data-mid="' +
        mid +
        '"><div class="mhl"><span>' +
        m.icon +
        '</span><span class="mname">' +
        m.title +
        '</span></div><svg class="mchev" id="chev-' +
        mid +
        '" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div><div class="llist" id="' +
        mid +
        '">';
      m.lessons.forEach((l, i) => {
        const lid = m.id + "_" + i;
        l._lid = lid;
        h +=
          '<div class="litem" id="li-' +
          lid +
          '" data-lid="' +
          lid +
          '"><div class="lchk ' +
          (state.completed.has(lid) ? "done" : "") +
          '" id="lc-' +
          lid +
          '">' +
          (state.completed.has(lid) ? "✓" : "") +
          "</div><span>" +
          l.title +
          "</span></div>";
      });
      h += "</div></div>";
    });
  });
  document.getElementById("snav").innerHTML = h;
  const firstMod = P.phases[0]?.modules[0];
  if (firstMod) toggleMod("mod-" + firstMod.id, true);

  // event delegation for sidebar toggles + lesson clicks
  const snav = document.getElementById("snav");
  snav.onclick = (e) => {
    const t = e.target.closest(".mhdr");
    if (t && t.dataset.mid) return toggleMod(t.dataset.mid);
    const li = e.target.closest(".litem");
    if (li && li.dataset.lid) return loadLesson(li.dataset.lid);
  };
}

function showWelcome() {
  const P = PROGRAMS[state.prog];
  const ac = state.prog === "men" ? "var(--mc)" : "var(--wc)";
  state.lessonId = null;
  setBreadcrumb(state.prog === "men" ? "MEN'S PROGRAM" : "WOMEN'S PROGRAM", "Welcome");
  let phHtml = "";
  P.phases.forEach((ph) => {
    phHtml +=
      '<div class="phcard"><div class="phnum" style="color:' +
      ac +
      '">' +
      ph.label +
      '</div><div class="phtitle">' +
      ph.title +
      '</div><div class="phdesc">' +
      ph.modules.map((m) => m.icon + " " + m.title).join(" · ") +
      "</div></div>";
  });
  const firstMod = P.phases[0]?.modules?.[0];
  const firstLid = firstMod ? firstMod.id + "_0" : null;
  document.getElementById("content").innerHTML =
    '<div class="wv"><div class="who"><h1 style="color:' +
    ac +
    '">' +
    (state.prog === "men"
      ? "The Masculine Vitality &<br>Performance System"
      : "The Feminine Vitality &<br>Intimate Health System") +
    '</h1><p>' +
    (state.prog === "men"
      ? "A complete, science-backed program for sexual health, stamina, confidence, and control through lifestyle, physical training, and mental discipline."
      : "A complete, science-backed program for hormonal health, vaginal wellness, pelvic strength, confidence, and intimate wellbeing.") +
    '</p></div><div class="pgrid">' +
    (phHtml || '<p style="opacity:0.5">No content published yet.</p>') +
    '</div>' + (firstLid ? '<button class="startbtn" id="startbtn">Begin Program →</button>' : "") + '</div>';
  document.getElementById("btn-prev").disabled = true;
  const next = document.getElementById("btn-next");
  if (firstLid) {
    next.innerHTML = "Start <span class='mshow'>Program </span>→";
    next.onclick = () => loadLesson(firstLid);
    document.getElementById("startbtn").onclick = () => loadLesson(firstLid);
  } else {
    next.textContent = "No Content Yet";
    next.onclick = () => {};
  }
  document.getElementById("main").scrollTop = 0;
}

function getLessonByLid(lid) {
  const P = PROGRAMS[state.prog];
  for (const ph of P.phases)
    for (const m of ph.modules) {
      const parts = lid.split("_");
      const idx = parseInt(parts[parts.length - 1]);
      const modId = parts.slice(0, -1).join("_");
      if (m.id === modId && idx >= 0 && idx < m.lessons.length)
        return { lesson: m.lessons[idx], modTitle: m.title, modIcon: m.icon, phaseLabel: ph.label };
    }
  return null;
}

function updateProgress() {
  const total = state.flat.length;
  const done = state.completed.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById("ppct").textContent = pct + "%";
  document.getElementById("pfill").style.width = pct + "%";
}

function updateNav() {
  const all = getAllLessonIds();
  const idx = all.indexOf(state.lessonId);
  document.getElementById("btn-prev").disabled = idx <= 0;
  const isLast = idx === all.length - 1;
  const nb = document.getElementById("btn-next");
  nb.innerHTML = isLast
    ? "Complete ✓"
    : '<span class="mhide">Mark </span>Complete<span class="mhide"> & Continue</span> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 12 4 18"/></svg>';
  nb.onclick = completeAndNext;
}

function loadLesson(lid) {
  const found = getLessonByLid(lid);
  if (!found) return;
  const { lesson, modTitle } = found;
  state.lessonId = lid;
  setBreadcrumb(lesson.phase.split(" — ")[0], "Module — " + modTitle);
  document.querySelectorAll(".litem").forEach((el) => el.classList.remove("active"));
  const activeEl = document.getElementById("li-" + lid);
  if (activeEl) {
    activeEl.classList.add("active");
    const parent = activeEl.closest(".llist");
    if (parent && !parent.classList.contains("open")) toggleMod(parent.id, true);
    setTimeout(() => activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" }), 100);
  }
  const sidebar = document.getElementById("sidebar");
  if (sidebar && sidebar.classList.contains("open")) sidebar.classList.remove("open");
  const tkHtml = lesson.takeaways.map((t) => "<li><span>" + t + "</span></li>").join("");
  // Hero video embed — only shown if lesson has a video_url set via admin
  var heroVideoHtml = "";
  if (lesson.video_url) {
    heroVideoHtml = '<div class="vcont" style="margin-bottom:24px"><div style="position:relative;width:100%;padding-top:56.25%;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 32px rgba(0,0,0,.4)"><iframe src="' + lesson.video_url + '" style="position:absolute;inset:0;width:100%;height:100%;border:none" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share;fullscreen" allowfullscreen></iframe></div></div>';
  }
  document.getElementById("content").innerHTML =
    '<div class="lv"><div class="lhdr"><div class="pbadge">' +
    lesson.phase +
    '</div><h1 class="ltitle">' +
    lesson.title +
    '</h1></div>' + heroVideoHtml + '<div class="card"><div class="card-icon-title"><span class="card-icon">🎓</span><span class="card-title">About this lesson</span></div><div class="about-text"><p>' +
    lesson.about +
    '</p></div><div class="tkcard"><div class="tktitle"><div class="tkicon">✓</div>Key Takeaways</div><ul class="tklist">' +
    tkHtml +
    '</ul></div></div><div class="card">' +
    lesson.body +
    "</div></div>";
  updateNav();
  updateProgress();
  document.getElementById("main").scrollTop = 0;
}

function completeAndNext() {
  if (state.lessonId) {
    state.completed.add(state.lessonId);
    const ch = document.getElementById("lc-" + state.lessonId);
    if (ch) {
      ch.classList.add("done");
      ch.textContent = "✓";
    }
    updateProgress();
    navigate(1);
  }
}

function navigate(dir) {
  const all = getAllLessonIds();
  const idx = all.indexOf(state.lessonId);
  const nIdx = idx + dir;
  if (nIdx >= 0 && nIdx < all.length) loadLesson(all[nIdx]);
}

function goHome() {
  document.getElementById("splash").style.display = "flex";
  ["topbar", "app", "bnav"].forEach((id) => (document.getElementById(id).style.display = "none"));
}

async function selectProgram(pid) {
  await ensureProgramData();
  state.prog = pid;
  state.completed = new Set();
  buildFlat();

  document.getElementById("splash").style.display = "none";
  document.getElementById("topbar").style.display = "flex";
  document.getElementById("app").style.display = "flex";
  document.getElementById("bnav").style.display = "flex";

  ["app", "sidebar", "bnav"].forEach((id) => (document.getElementById(id).className = pid));
  document.getElementById("btn-men").className = "pbtn" + (pid === "men" ? " am" : "");
  document.getElementById("btn-women").className = "pbtn" + (pid === "women" ? " aw" : "");

  buildSidebar();
  showWelcome();
}

// expose to window (called from React handlers)
window.selectProgram = selectProgram;
window.goHome = goHome;
window.navigate = navigate;
window.completeAndNext = completeAndNext;

})();


