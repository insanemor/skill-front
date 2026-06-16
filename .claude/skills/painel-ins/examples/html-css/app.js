/* painel-ins — demo · app.js
 * Interatividade + animacoes vivas. Cores SEMPRE lidas das CSS variables
 * (tokens.css continua a fonte da verdade — nada de hex aqui). */

const root = getComputedStyle(document.documentElement);
const token = (name) => root.getPropertyValue(name).trim(); // ex.: "150 100% 45%"
const hsl = (name, a = 1) => `hsl(${token(name)} / ${a})`;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Sidebar: colapso pelo logo ---------- */
const sidebar = document.getElementById('sidebar');
document.getElementById('logoBtn').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

/* ---------- Navegacao: item ativo + breadcrumb ---------- */
const crumb = document.getElementById('crumbPage');
document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.nav-item.active')?.classList.remove('active');
    item.classList.add('active');
    crumb.textContent = item.dataset.page.toLowerCase();
  });
});

/* ---------- KPIs (metric cards) com stagger ---------- */
const ICONS = {
  cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  wifi: '<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0M8.5 16.429a5 5 0 0 1 7 0"/>',
};
const TREND = {
  up: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  down: '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
};
const kpis = [
  { title: 'Active Processes',   value: '1,284',  change: '+12.4%', type: 'up',   icon: 'cpu',      color: 'green'  },
  { title: 'Network Latency',    value: '24ms',   change: '-8.2%',  type: 'up',   icon: 'activity', color: 'blue'   },
  { title: 'Data Throughput',    value: '3.8 TB', change: '+23.1%', type: 'up',   icon: 'database', color: 'purple' },
  { title: 'Active Connections', value: '847',    change: '-2.1%',  type: 'down', icon: 'wifi',     color: 'yellow' },
];
const svg = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

document.getElementById('kpiGrid').innerHTML = kpis.map((m, i) => `
  <div class="metric c-${m.color}" style="animation-delay:${i * 0.1}s">
    <div class="wash"></div>
    <div class="corner"></div>
    <div class="metric-top">
      <span class="metric-icon">${svg(ICONS[m.icon])}</span>
      <span class="metric-change ${m.type}">${svg(TREND[m.type])}${m.change}</span>
    </div>
    <p class="label m-label">${m.title}</p>
    <p class="m-value">${m.value}</p>
  </div>
`).join('');

/* ---------- Line chart (canvas, live) ---------- */
const lc = document.getElementById('lineChart');
const lctx = lc.getContext('2d');
let ingress = Array.from({ length: 40 }, () => 40 + Math.random() * 30);
let egress = Array.from({ length: 40 }, () => 25 + Math.random() * 25);

function drawLine() {
  const dpr = window.devicePixelRatio || 1;
  const w = lc.clientWidth, h = lc.clientHeight;
  if (lc.width !== w * dpr) { lc.width = w * dpr; lc.height = h * dpr; }
  lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  lctx.clearRect(0, 0, w, h);

  // grade discreta
  lctx.strokeStyle = hsl('--border', 0.6);
  lctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = (h / 4) * i;
    lctx.beginPath(); lctx.moveTo(0, y); lctx.lineTo(w, y); lctx.stroke();
  }

  const series = [
    { data: ingress, color: '--chart-1' },
    { data: egress,  color: '--chart-2' },
  ];
  series.forEach(({ data, color }) => {
    const max = 80, pad = 6;
    const step = w / (data.length - 1);
    const yOf = (v) => h - pad - (v / max) * (h - pad * 2);

    // area
    const grad = lctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, hsl(color, 0.25));
    grad.addColorStop(1, hsl(color, 0));
    lctx.beginPath();
    lctx.moveTo(0, h);
    data.forEach((v, i) => lctx.lineTo(i * step, yOf(v)));
    lctx.lineTo(w, h); lctx.closePath();
    lctx.fillStyle = grad; lctx.fill();

    // linha
    lctx.beginPath();
    data.forEach((v, i) => (i ? lctx.lineTo(i * step, yOf(v)) : lctx.moveTo(0, yOf(v))));
    lctx.strokeStyle = hsl(color); lctx.lineWidth = 2;
    lctx.shadowColor = hsl(color, 0.5); lctx.shadowBlur = 8;
    lctx.stroke();
    lctx.shadowBlur = 0;
  });
}
drawLine();
window.addEventListener('resize', drawLine);

if (!REDUCED) {
  setInterval(() => {
    ingress.push(40 + Math.random() * 30); ingress.shift();
    egress.push(25 + Math.random() * 25);  egress.shift();
    drawLine();
  }, 1500);
}

/* ---------- Donut chart (SVG) ---------- */
const donutData = [
  { name: 'Compute', pct: 42, color: '--chart-1' },
  { name: 'Storage', pct: 26, color: '--chart-2' },
  { name: 'Memory',  pct: 20, color: '--chart-3' },
  { name: 'Idle',    pct: 12, color: '--chart-4' },
];
const R = 56, C = 2 * Math.PI * R;
let offset = 0;
document.getElementById('donut').innerHTML = donutData.map((d) => {
  const len = (d.pct / 100) * C;
  const circle = `<circle cx="70" cy="70" r="${R}" fill="none" stroke="${hsl(d.color)}" stroke-width="14"
      stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}" stroke-linecap="butt"/>`;
  offset += len;
  return circle;
}).join('');
document.getElementById('donutLegend').innerHTML = donutData.map((d) => `
  <div class="row">
    <span class="name"><i style="background:${hsl(d.color)}"></i>${d.name}</span>
    <span class="pct">${d.pct}%</span>
  </div>
`).join('');

/* ---------- Bar chart (CSS) ---------- */
const bars = [
  { label: 'US', v: 92 }, { label: 'EU', v: 76 }, { label: 'APAC', v: 64 },
  { label: 'SA', v: 48 }, { label: 'AF', v: 31 }, { label: 'OCE', v: 22 },
];
document.getElementById('bars').innerHTML = bars.map((b) => `
  <div class="bar-col">
    <div class="bar" style="height:0%" data-h="${b.v}%"></div>
    <span class="bar-label">${b.label}</span>
  </div>
`).join('');
requestAnimationFrame(() => {
  document.querySelectorAll('.bar').forEach((bar) => { bar.style.height = bar.dataset.h; });
});

/* ---------- Activity feed (streaming) ---------- */
const feed = document.getElementById('feed');
const LEVELS = ['ok', 'info', 'warn', 'err'];
const MSGS = {
  ok:   ['process spawned · pid 4821', 'health check passed', 'node-7842 joined cluster', 'cache warmed · 1.2k keys'],
  info: ['sync complete · 3.8tb', 'model inference · 24ms', 'rebalancing shards', 'snapshot scheduled'],
  warn: ['latency spike · 180ms', 'memory at 84%', 'retry queue growing', 'cert expires in 6d'],
  err:  ['connection dropped · node-3', 'timeout on /v2/ingest', 'disk i/o saturated'],
};
let clock = 14 * 3600 + 22 * 60 + 4;
function pushLine() {
  const lvl = LEVELS[Math.floor(Math.random() * (Math.random() < 0.7 ? 2 : LEVELS.length))];
  const msg = MSGS[lvl][Math.floor(Math.random() * MSGS[lvl].length)];
  const h = String(Math.floor(clock / 3600) % 24).padStart(2, '0');
  const m = String(Math.floor(clock / 60) % 60).padStart(2, '0');
  const s = String(clock % 60).padStart(2, '0');
  clock += Math.floor(2 + Math.random() * 5);
  const line = document.createElement('div');
  line.className = 'line';
  line.innerHTML = `<span class="ts">${h}:${m}:${s}</span><span class="lvl ${lvl}">${lvl}</span><span class="msg">${msg}</span>`;
  feed.prepend(line);
  while (feed.children.length > 30) feed.lastChild.remove();
}
for (let i = 0; i < 8; i++) pushLine();
if (!REDUCED) setInterval(pushLine, 2200);

/* ---------- System metrics + last sync (sidebar/topbar) ---------- */
const sysEl = document.getElementById('sysMetrics');
const syncEl = document.getElementById('lastSync');
let syncSec = 2;
if (!REDUCED) setInterval(() => {
  const cpu = 38 + Math.floor(Math.random() * 18);
  const mem = 60 + Math.floor(Math.random() * 14);
  sysEl.textContent = `CPU ${cpu}% · MEM ${mem}%`;
  syncSec = syncSec >= 9 ? 1 : syncSec + 1;
  syncEl.textContent = `${syncSec}s`;
}, 2000);

/* ---------- Matrix rain (fundo) ---------- */
const mx = document.getElementById('matrix');
const mctx = mx.getContext('2d');
const GLYPHS = 'アカサタナハマヤラワ0123456789ABCDEF</>{}#$%';
let cols, drops;
function resizeMatrix() {
  mx.width = window.innerWidth;
  mx.height = window.innerHeight;
  cols = Math.floor(mx.width / 16);
  drops = Array(cols).fill(0).map(() => Math.random() * -50);
}
function drawMatrix() {
  mctx.fillStyle = hsl('--background', 0.12);
  mctx.fillRect(0, 0, mx.width, mx.height);
  mctx.fillStyle = hsl('--primary');
  mctx.font = '14px JetBrains Mono, monospace';
  for (let i = 0; i < cols; i++) {
    const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    mctx.fillText(ch, i * 16, drops[i] * 16);
    if (drops[i] * 16 > mx.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
if (!REDUCED) {
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);
  setInterval(drawMatrix, 70);
} else {
  mx.style.display = 'none';
}

/* ============================================================
   COMPONENTES EXTRA (kitchen sink)
   ============================================================ */

/* ---------- Tabela de dados ---------- */
const nodes = [
  { id: 'node-7842', region: 'eu-west-1',      status: 'online',  load: 42, uptime: '18d 04h', tput: '3.8 GB/s', trend: 'up' },
  { id: 'node-3391', region: 'us-east-1',      status: 'online',  load: 67, uptime: '42d 11h', tput: '5.1 GB/s', trend: 'up' },
  { id: 'node-5120', region: 'ap-southeast-2', status: 'pending', load: 88, uptime: '02h 13m', tput: '1.2 GB/s', trend: 'down' },
  { id: 'node-3-sa', region: 'sa-east-1',      status: 'offline', load: 0,  uptime: '—',        tput: '0 GB/s',   trend: 'down' },
  { id: 'node-9087', region: 'eu-central-1',   status: 'online',  load: 55, uptime: '7d 22h',  tput: '4.4 GB/s', trend: 'up' },
  { id: 'node-2245', region: 'us-west-2',      status: 'online',  load: 73, uptime: '31d 06h', tput: '2.9 GB/s', trend: 'down' },
];
const loadColor = (v) => (v > 85 ? '--neon-red' : v >= 60 ? '--neon-yellow' : '--neon-green');
const tbody = document.getElementById('tableBody');
tbody.innerHTML = nodes.map((n) => {
  const cv = loadColor(n.load);
  return `<tr>
    <td><input type="checkbox" class="chk row-chk"></td>
    <td class="node-id">${n.id}</td>
    <td class="num" style="color:hsl(var(--muted-foreground))">${n.region}</td>
    <td><span class="badge ${n.status}"><span class="dot"></span>${n.status}</span></td>
    <td><div class="load-bar"><div class="load-track"><div class="load-fill" style="width:${n.load}%;background:hsl(var(${cv}));box-shadow:0 0 8px hsl(var(${cv}) / 0.5)"></div></div><span class="load-pct">${n.load}%</span></div></td>
    <td class="num">${n.uptime}</td>
    <td class="ta-r num ${n.trend === 'up' ? 'trend-up' : 'trend-down'}">${n.tput}</td>
  </tr>`;
}).join('');
// selecao de linha
tbody.querySelectorAll('tr').forEach((tr) => {
  const cb = tr.querySelector('.row-chk');
  tr.addEventListener('click', (e) => {
    if (e.target !== cb) cb.checked = !cb.checked;
    tr.classList.toggle('selected', cb.checked);
  });
});
document.getElementById('chkAll').addEventListener('change', (e) => {
  tbody.querySelectorAll('tr').forEach((tr) => {
    tr.querySelector('.row-chk').checked = e.target.checked;
    tr.classList.toggle('selected', e.target.checked);
  });
});

/* ---------- Gauges radiais (arco de 270deg) ---------- */
function renderGauge(id, value, colorVar) {
  const r = 54, C = 2 * Math.PI * r, frac = 0.75;
  const track = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="hsl(var(--muted))" stroke-width="12"
      stroke-dasharray="${frac * C} ${C}" stroke-linecap="round"/>`;
  const val = `<circle class="gauge-val" cx="70" cy="70" r="${r}" fill="none" stroke="${hsl(colorVar)}" stroke-width="12"
      stroke-dasharray="0 ${C}" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${hsl(colorVar, 0.6)})"/>`;
  const el = document.getElementById(id);
  el.innerHTML = `<g transform="rotate(135 70 70)">${track}${val}</g>`;
  // anima o arco do valor apos um tick
  requestAnimationFrame(() => {
    const target = (value / 100) * frac * C;
    el.querySelector('.gauge-val').setAttribute('stroke-dasharray', `${target} ${C}`);
  });
}
renderGauge('gaugeCpu', 68, '--neon-green');
renderGauge('gaugeMem', 82, '--neon-yellow');
renderGauge('gaugeNet', 45, '--neon-blue');

/* ---------- Alerts: fechar ---------- */
document.addEventListener('click', (e) => {
  const close = e.target.closest('.al-close');
  if (close) close.closest('.alert')?.remove();
  const chipX = e.target.closest('.chip .x');
  if (chipX) chipX.closest('.chip')?.remove();
});

/* ---------- Password: mostrar/ocultar ---------- */
const EYE = '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';
const EYE_OFF = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>';
const pwField = document.getElementById('pwField');
const pwToggle = document.getElementById('pwToggle');
pwToggle.addEventListener('click', () => {
  const show = pwField.type === 'password';
  pwField.type = show ? 'text' : 'password';
  pwToggle.innerHTML = svg(show ? EYE_OFF : EYE);
});

/* ---------- Range: valor + preenchimento ---------- */
const rangeInput = document.getElementById('rangeInput');
const rangeVal = document.getElementById('rangeVal');
function paintRange() {
  const v = rangeInput.value;
  rangeVal.textContent = v;
  rangeInput.style.background = `linear-gradient(90deg, ${hsl('--primary')} ${v}%, ${hsl('--muted')} ${v}%)`;
}
rangeInput.addEventListener('input', paintRange);
paintRange();

/* ---------- Segmented control ---------- */
document.getElementById('segmented').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  b.parentElement.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
  b.classList.add('active');
});

/* ---------- Tabs ---------- */
const tabs = document.getElementById('tabs');
tabs.addEventListener('click', (e) => {
  const t = e.target.closest('.tab');
  if (!t) return;
  const i = t.dataset.tab;
  tabs.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === t));
  document.querySelectorAll('[data-panel]').forEach((p) => p.classList.toggle('active', p.dataset.panel === i));
});

/* ---------- Progress bars: anima largura ---------- */
requestAnimationFrame(() => {
  document.querySelectorAll('.prog-fill').forEach((f) => { f.style.width = f.dataset.w + '%'; });
});

/* ---------- Dropdown ---------- */
const dropdown = document.getElementById('dropdown');
document.getElementById('ddBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});
document.addEventListener('click', () => dropdown.classList.remove('open'));

/* ---------- Modal / dialog ---------- */
const overlay = document.getElementById('overlay');
const openModal = () => { overlay.hidden = false; };
const closeModal = () => { overlay.hidden = true; };
document.getElementById('openDialog').addEventListener('click', openModal);
document.getElementById('dlgClose').addEventListener('click', closeModal);
document.getElementById('dlgCancel').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeModal(); });
document.getElementById('dlgConfirm').addEventListener('click', () => {
  closeModal();
  toast('success', 'Deploy iniciado', 'build #4821 · drenando trafego...');
});

/* ---------- Toasts ---------- */
const TOAST_ICONS = {
  success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  info:    '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  warn:    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
  error:   '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
};
const TOAST_TITLE = { success: 'Sucesso', info: 'Info', warn: 'Atencao', error: 'Erro' };
const toastStack = document.getElementById('toastStack');
function toast(kind, title, text) {
  const el = document.createElement('div');
  el.className = `toast s-${kind}`;
  el.innerHTML = `<span class="ic">${svg(TOAST_ICONS[kind])}</span>
    <div class="t-body"><p class="t-title">${title || TOAST_TITLE[kind]}</p><p class="t-text">${text}</p></div>`;
  toastStack.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 4000);
}
document.querySelectorAll('[data-toast]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const k = btn.dataset.toast;
    const msg = k === 'success'
      ? ['Operacao concluida', 'node sincronizado · 0 erros']
      : ['Falha na operacao', 'node-3-sa-east nao respondeu'];
    toast(k, msg[0], msg[1]);
  });
});
