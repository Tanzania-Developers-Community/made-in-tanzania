let ALL_PROJECTS = [];
let activeFilter = "all";
let searchQuery = "";

/* ── BOOT ── */
document.addEventListener("DOMContentLoaded", async () => {
  await loadProjects();
  setupSearch();
  setupScroll();
});

/* ── LOAD DATA ── */
async function loadProjects() {
  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error("Failed to load projects.json");
    ALL_PROJECTS = await res.json();

    // Compute stats
    const techSet = new Set(ALL_PROJECTS.flatMap((p) => p.tech));
    const authorSet = new Set(ALL_PROJECTS.map((p) => p.author));

    animateNum("statProjects", ALL_PROJECTS.length);
    animateNum("statContributors", authorSet.size);
    animateNum("statTech", techSet.size);

    // Build tech filters
    buildFilters(techSet);

    // Build letter nav
    buildLetterNav();

    // Initial render
    renderProjects(ALL_PROJECTS);
  } catch (err) {
    console.error(err);
    document.getElementById("loadingState").innerHTML =
      '<span style="color:var(--rd)">Failed to load projects.</span>';
  }
}

/* ── RENDER ── */
function renderProjects(projects) {
  const grid = document.getElementById("projectsGrid");
  const empty = document.getElementById("emptyState");
  const loading = document.getElementById("loadingState");

  if (loading) loading.remove();

  if (projects.length === 0) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  // Group by letter
  const byLetter = {};
  for (const p of projects) {
    const l = p.letter.toUpperCase();
    if (!byLetter[l]) byLetter[l] = [];
    byLetter[l].push(p);
  }

  const letters = Object.keys(byLetter).sort();
  let html = "";

  letters.forEach((letter) => {
    html += `
      <div class="letter-group" id="letter-${letter}">
        <div class="letter-group-char">${letter}</div>
        <div class="letter-group-line"></div>
      </div>
    `;
    byLetter[letter].forEach((p, i) => {
      html += buildCard(p, i);
    });
  });

  grid.innerHTML = html;
}

function buildCard(p, delay) {
  const techTags = p.tech
    .map((t) => `<span class="tech-tag">${esc(t)}</span>`)
    .join("");

  return `
    <div class="project-card" style="animation-delay:${delay * 40}ms">
      <div class="card-top">
        <span class="card-emoji">${p.emoji}</span>
        <div class="card-links">
          <a href="${p.repo}" target="_blank" rel="noopener" class="card-link" title="View on GitHub">↗</a>
        </div>
      </div>
      <div class="card-name">${esc(p.name)}</div>
      <div class="card-desc">${esc(p.description)}</div>
      <div class="card-footer">
        <a href="${p.authorUrl}" target="_blank" rel="noopener" class="card-author">${esc(p.author)}</a>
        <div class="card-tech">${techTags}</div>
      </div>
    </div>
  `;
}

/* ── FILTERS ── */
function buildFilters(techSet) {
  const wrap = document.getElementById("filterWrap");

  // Pick top categories (those with 2+ projects)
  const techCount = {};
  ALL_PROJECTS.forEach((p) => {
    p.tech.forEach((t) => {
      techCount[t] = (techCount[t] || 0) + 1;
    });
  });

  const popular = Object.entries(techCount)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([t]) => t);

  popular.forEach((tech) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = tech;
    btn.textContent = tech;
    btn.addEventListener("click", () => setFilter(tech, btn));
    wrap.appendChild(btn);
  });
}

function setFilter(filter, btnEl) {
  activeFilter = filter;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btnEl.classList.add("active");
  applyFilters();
}

/* ── SEARCH ── */
function setupSearch() {
  const input = document.getElementById("searchInput");
  const kbd = document.getElementById("searchKbd");

  input.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
  });

  // Keyboard shortcut "/"
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
    if (e.key === "Escape") {
      input.blur();
      input.value = "";
      searchQuery = "";
      applyFilters();
    }
  });
}

window.clearSearch = function () {
  document.getElementById("searchInput").value = "";
  searchQuery = "";
  activeFilter = "all";
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.filter === "all"));
  applyFilters();
};

function applyFilters() {
  let filtered = ALL_PROJECTS;

  if (activeFilter !== "all") {
    filtered = filtered.filter((p) => p.tech.includes(activeFilter));
  }

  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.author.toLowerCase().includes(searchQuery) ||
        p.tech.some((t) => t.toLowerCase().includes(searchQuery)),
    );
  }

  renderProjects(filtered);
}

/* ── LETTER NAV ── */
function buildLetterNav() {
  const nav = document.getElementById("letterNav");
  const letters = [
    ...new Set(ALL_PROJECTS.map((p) => p.letter.toUpperCase())),
  ].sort();
  letters.forEach((l) => {
    const a = document.createElement("a");
    a.className = "letter-nav-item";
    a.href = `#letter-${l}`;
    a.textContent = l;
    nav.appendChild(a);
  });
}

/* ── SCROLL ── */
function setupScroll() {
  const nav = document.getElementById("nav");
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    },
    { passive: true },
  );
}

/* ── UTILS ── */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function animateNum(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}
