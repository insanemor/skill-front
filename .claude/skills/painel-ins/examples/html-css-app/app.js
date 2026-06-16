/* painel-ins — app.js (shell + roteador)
 * SPA multi-tela que reproduz o app de referencia (NEXUS.AI).
 * Cores SEMPRE via tokens. Cada tela vive em screens/<rota>.js e registra
 * window.Screens[rota] = { head, accent, comment, render(), init(view) }. */

window.Screens = window.Screens || {};

const App = (function () {
  const rootCS = getComputedStyle(document.documentElement);
  const token = (n) => rootCS.getPropertyValue(n).trim();
  const hsl = (n, a = 1) => `hsl(${token(n)} / ${a})`;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* timers por tela — limpos a cada navegacao para nao vazar */
  const timers = [];
  function clearTimers() { timers.forEach((id) => clearInterval(id)); timers.length = 0; }
  function interval(fn, ms) { if (REDUCED) return null; const id = setInterval(fn, ms); timers.push(id); return id; }

  /* helper SVG (lucide-like, stroke) */
  /* width/height padrao (18px): icones soltos ficam pequenos; containers com regra
     CSS de tamanho (.metric-icon svg, .btn svg, .sl-ic svg...) sobrescrevem por especificidade. */
  const svg = (paths, sw = 2) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

  /* toast util compartilhado */
  const TOAST_ICONS = {
    success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  };
  function toast(kind, title, text) {
    const stack = document.getElementById('toastStack');
    const el = document.createElement('div');
    el.className = `toast s-${kind}`;
    el.innerHTML = `<span class="ic">${svg(TOAST_ICONS[kind])}</span><div class="t-body"><p class="t-title">${title}</p><p class="t-text">${text}</p></div>`;
    stack.appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); el.addEventListener('animationend', () => el.remove(), { once: true }); }, 3800);
  }

  return { token, hsl, svg, interval, clearTimers, toast, REDUCED };
})();

/* ====================== SHELL ====================== */

/* Sidebar: colapso pelo logo */
const sidebar = document.getElementById('sidebar');
document.getElementById('logoBtn').addEventListener('click', () => sidebar.classList.toggle('collapsed'));

/* Topbar: relogio ao vivo */
(function clock() {
  const el = document.getElementById('clock');
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function tick() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    el.innerHTML = `<b>${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}</b> // ${DOW[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`;
  }
  tick(); setInterval(tick, 1000);
})();

/* Sidebar footer: metricas vivas */
App.interval(() => {
  const el = document.getElementById('sysMetrics');
  if (el) el.textContent = `CPU ${38 + Math.floor(Math.random() * 18)}% · MEM ${60 + Math.floor(Math.random() * 14)}%`;
}, 2000);

/* ====================== ROTEADOR ====================== */
const ROUTES = ['dashboard', 'analytics', 'logs', 'data', 'systems', 'models', 'docs', 'kanban', 'settings'];

function currentRoute() {
  const r = (location.hash || '#/dashboard').replace(/^#\/?/, '');
  return ROUTES.includes(r) ? r : 'dashboard';
}

function mountScreen(route) {
  const def = window.Screens[route];
  const view = document.getElementById('view');
  if (!def) { view.innerHTML = `<div class="card"><p class="comment">// tela "${route}" nao encontrada</p></div>`; return; }

  App.clearTimers();

  /* nav ativo */
  document.querySelectorAll('.nav-item').forEach((a) => a.classList.toggle('active', a.dataset.route === route));

  /* cabecalho de pagina */
  const head = document.getElementById('pageHead');
  head.innerHTML = `<h2 class="font-display">${def.head} <span class="hl glow-text-green">${def.accent || ''}</span></h2>` +
    (def.comment ? `<p class="comment">${def.comment}</p>` : '');

  /* breadcrumb (opcional) */
  const crumb = document.getElementById('crumbPage');
  if (crumb) crumb.textContent = route;

  /* render + animacao de entrada com stagger (re-disparada a cada troca) */
  view.innerHTML = def.render();
  const main = document.querySelector('.main');
  main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter');
  [...view.children].forEach((child, i) => { child.style.setProperty('--i', i); });

  /* init da tela (charts, interacoes, live data) */
  if (def.init) def.init(view);

  /* scroll ao topo na troca */
  document.querySelector('.content').scrollTo?.({ top: 0 });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => mountScreen(currentRoute()));

/* ====================== MATRIX RAIN (fundo) ====================== */
(function matrix() {
  if (App.REDUCED) { const c = document.getElementById('matrix'); if (c) c.style.display = 'none'; return; }
  const mx = document.getElementById('matrix');
  const mctx = mx.getContext('2d');
  const GLYPHS = 'アカサタナハマヤラワ0123456789ABCDEF</>{}#$%';
  let cols, drops;
  function resize() { mx.width = innerWidth; mx.height = innerHeight; cols = Math.floor(mx.width / 16); drops = Array(cols).fill(0).map(() => Math.random() * -50); }
  function draw() {
    mctx.fillStyle = App.hsl('--background', 0.12); mctx.fillRect(0, 0, mx.width, mx.height);
    mctx.fillStyle = App.hsl('--primary'); mctx.font = '14px JetBrains Mono, monospace';
    for (let i = 0; i < cols; i++) {
      mctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * 16, drops[i] * 16);
      if (drops[i] * 16 > mx.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  resize(); addEventListener('resize', resize); setInterval(draw, 70);
})();

/* ====================== BOOT ====================== */
document.addEventListener('DOMContentLoaded', () => mountScreen(currentRoute()));
mountScreen(currentRoute());
