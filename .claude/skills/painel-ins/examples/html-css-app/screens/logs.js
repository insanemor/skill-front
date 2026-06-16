/* Tela: System Logs — stream de eventos em tempo real, visual terminal.
 * Reaproveita .filter-bar, .segmented, .btn, .card, .feed (.line/.ts/.lvl/.msg),
 * .feed-foot/.cursor-blink. Estilos pontuais via inline + tokens (sem hex, sem CSS novo). */
window.Screens.logs = (function () {
  const svg = (p) => App.svg(p);
  const ICONS = {
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    pause: '<rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>',
  };

  /* niveis exibidos -> classe .lvl do .feed + token de cor (boxed chip) */
  const LEVELS = ['ALL', 'INFO', 'WARN', 'ERROR', 'SUCCESS', 'DEBUG'];
  const LVL = {
    INFO:    { cls: 'info', c: '--neon-blue' },
    WARN:    { cls: 'warn', c: '--neon-yellow' },
    ERROR:   { cls: 'err',  c: '--neon-red' },
    SUCCESS: { cls: 'ok',   c: '--neon-green' },
    DEBUG:   { cls: 'info', c: '--muted-foreground' },
  };

  /* mensagens realistas de infra/ML, agrupadas por nivel */
  const MSG = {
    INFO: [
      '[STREAM] Data pipeline throughput · 12,847 events/sec',
      '[NET] WebSocket connection established · eu-2/node-7',
      '[DEPLOY] Rolling update initiated for service-api',
      '[QUEUE] Consumer group rebalanced · 8 partitions',
      '[AUTH] Token refreshed for session sx-4421',
      '[SCALE] Autoscaler added 2 replicas to ml-worker',
      '[INDEX] Vector index rebuilt · 1.2M embeddings',
    ],
    WARN: [
      '[PROXY] Rate limit applied · 429 Too Many Requests',
      '[MONITOR] CPU threshold alert on node-3',
      '[CACHE] Cache miss for key: model_weights_v3',
      '[MEM] Heap usage at 84% on inference-pool',
      '[RETRY] Backpressure detected · retry queue growing',
      '[DISK] Volume /data at 91% capacity',
    ],
    ERROR: [
      '[STREAM] Data pipeline stalled · 0 events/sec',
      '[DB] Connection pool exhausted · timeout 5s',
      '[GPU] CUDA out of memory on device cuda:1',
      '[NET] Upstream 502 from gateway · node-9 dropped',
      '[DEPLOY] Rollout failed · readiness probe timeout',
    ],
    SUCCESS: [
      '[WORKER] Batch processing job #4421 completed',
      '[ML] Model accuracy checkpoint · 94.7%',
      '[DEPLOY] Canary promoted to 100% traffic',
      '[BACKUP] Snapshot persisted · 3.8 TB · s3://nexus',
      '[HEALTH] All 12 services reporting healthy',
      '[CACHE] Cache warmed · 1,204 keys preloaded',
    ],
    DEBUG: [
      '[TRACE] span ingest.parse · 1.8ms · ok',
      '[WORKER] Batch processing job #4421 started',
      '[GET] /v2/models/inference · 200 OK · 24ms',
      '[SCHED] Next cron tick in 30s · job=compact',
      '[CFG] Feature flag stream_v2 evaluated · true',
    ],
  };

  const PID = () => 1000 + Math.floor(Math.random() * 8999);
  const pad = (n) => String(n).padStart(2, '0');

  function tsString(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  /* chip de nivel "boxed" (borda + bg por token), reusando .lvl do .feed */
  function chipStyle(c) {
    return `style="border:1px solid hsl(var(${c}) / 0.4);background:hsl(var(${c}) / 0.12);` +
      `color:hsl(var(${c}));font-weight:600;min-width:54px;text-align:center;letter-spacing:0.05em"`;
  }

  function lineHTML(level, msg, ts, pid) {
    const L = LVL[level];
    return `<div class="line" data-level="${level}" style="gap:14px">` +
      `<span class="ts" style="opacity:0.7">${ts}</span>` +
      `<span class="lvl ${L.cls}" ${chipStyle(L.c)}>${level}</span>` +
      `<span class="ts" style="flex-shrink:0">PID:${pid}</span>` +
      `<span class="msg">${msg}</span></div>`;
  }

  function render() {
    return `
    <div class="filter-bar">
      <span class="label" style="display:inline-flex;align-items:center;gap:8px;margin-bottom:0">
        <span style="display:inline-flex;color:hsl(var(--muted-foreground))">${svg(ICONS.filter)}</span>FILTER:</span>
      <div class="segmented" id="logFilter">${LEVELS.map((l, i) =>
        `<button data-level="${l}" class="${i === 0 ? 'active' : ''}">${l}</button>`).join('')}</div>
      <div class="sec-actions" style="margin-left:auto">
        <button class="btn btn-outline btn-sm" id="logPause"
          style="color:hsl(var(--neon-yellow));border-color:hsl(var(--neon-yellow) / 0.4)">
          <span class="pl-ic" style="display:inline-flex;color:hsl(var(--neon-yellow))">${svg(ICONS.pause)}</span><span class="pl-txt">PAUSE</span></button>
        <button class="btn btn-outline btn-sm" id="logClear"
          style="color:hsl(var(--neon-red));border-color:hsl(var(--neon-red) / 0.4)">
          <span style="display:inline-flex;color:hsl(var(--neon-red))">${svg(ICONS.trash)}</span>CLEAR</button>
      </div>
    </div>

    <section class="section">
      <div class="card"><div class="corner"></div>
        <div class="card-head" style="margin-bottom:14px;gap:14px;position:relative">
          <span style="display:inline-flex;gap:7px;align-items:center;flex-shrink:0">
            <i style="width:11px;height:11px;border-radius:50%;background:hsl(var(--neon-red))"></i>
            <i style="width:11px;height:11px;border-radius:50%;background:hsl(var(--neon-yellow))"></i>
            <i style="width:11px;height:11px;border-radius:50%;background:hsl(var(--neon-green))"></i>
          </span>
          <span class="font-mono" style="font-size:0.78rem;color:hsl(var(--muted-foreground));position:absolute;left:50%;transform:translateX(-50%)">~/.nexus/system.log</span>
          <span class="font-mono" style="font-size:0.74rem;color:hsl(var(--muted-foreground));margin-left:auto"><b id="logCount" style="color:hsl(var(--primary));font-weight:600">0</b> entries</span>
        </div>
        <div class="feed" id="logFeed" style="max-height:520px"></div>
        <div class="feed-foot"><span class="cursor-blink" id="logFootMsg">Awaiting next event</span></div>
      </div>
    </section>`;
  }

  function init(view) {
    const feed = view.querySelector('#logFeed');
    const countEl = view.querySelector('#logCount');
    const footMsg = view.querySelector('#logFootMsg');
    const pauseBtn = view.querySelector('#logPause');
    const filterEl = view.querySelector('#logFilter');
    const MAX = 60;

    let active = 'ALL';
    let paused = false;
    let clk = new Date(); clk.setHours(11, 28, 11, 0);

    const pickLevel = () => {
      const r = Math.random();
      if (r < 0.34) return 'INFO';
      if (r < 0.54) return 'WARN';
      if (r < 0.66) return 'ERROR';
      if (r < 0.84) return 'SUCCESS';
      return 'DEBUG';
    };

    function makeLine(prepend) {
      const level = pickLevel();
      const pool = MSG[level];
      const msg = pool[Math.floor(Math.random() * pool.length)];
      const el = document.createElement('div');
      el.innerHTML = lineHTML(level, msg, tsString(clk), PID());
      const line = el.firstChild;
      if (active !== 'ALL' && level !== active) line.style.display = 'none';
      if (prepend) feed.prepend(line); else feed.appendChild(line);
      clk = new Date(clk.getTime() + (1 + Math.floor(Math.random() * 3)) * 1000);
      while (feed.children.length > MAX) feed.lastChild.remove();
    }

    function updateCount() {
      const visible = [...feed.children].filter((c) => c.style.display !== 'none').length;
      countEl.textContent = visible;
    }

    function applyFilter() {
      [...feed.children].forEach((c) => {
        c.style.display = (active === 'ALL' || c.dataset.level === active) ? '' : 'none';
      });
      updateCount();
    }

    /* seed inicial (~18 linhas) */
    for (let i = 0; i < 18; i++) makeLine(false);
    updateCount();

    /* streaming no topo (limpo na troca de tela via App.interval) */
    function push() {
      if (paused) return;
      makeLine(true);
      updateCount();
    }
    App.interval(push, 1800);

    /* filtro por nivel */
    filterEl.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-level]');
      if (!b) return;
      active = b.dataset.level;
      filterEl.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
      applyFilter();
    });

    /* pause / resume */
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.querySelector('.pl-txt').textContent = paused ? 'RESUME' : 'PAUSE';
      pauseBtn.querySelector('.pl-ic svg').outerHTML = svg(paused ? ICONS.play : ICONS.pause);
      footMsg.textContent = paused ? 'Stream paused' : 'Awaiting next event';
      footMsg.classList.toggle('cursor-blink', !paused);
      App.toast(paused ? 'warn' : 'success', paused ? 'Stream paused' : 'Streaming',
        paused ? 'Event ingestion halted' : 'Live tail resumed');
    });

    /* clear */
    view.querySelector('#logClear').addEventListener('click', () => {
      feed.innerHTML = '';
      updateCount();
      App.toast('info', 'Log cleared', 'Buffer flushed · 0 entries');
    });
  }

  return { head: 'SYSTEM', accent: 'LOGS', comment: '// real-time event stream · terminal view', render, init };
})();
