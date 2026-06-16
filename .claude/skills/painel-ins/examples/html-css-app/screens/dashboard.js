/* Tela: Dashboard (Command Center) — KPIs, charts, heatmap, status, feed */
window.Screens.dashboard = (function () {
  const svg = (p) => App.svg(p);
  const ICONS = {
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    wifi: '<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0M8.5 16.429a5 5 0 0 1 7 0"/>',
    up: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
    down: '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
  };
  const KPIS = [
    { title: 'Active Processes', value: '1,284', change: '+12.4%', type: 'up', icon: 'cpu', color: 'green' },
    { title: 'Network Latency', value: '24ms', change: '-8.2%', type: 'up', icon: 'activity', color: 'blue' },
    { title: 'Data Throughput', value: '3.8 TB', change: '+23.1%', type: 'up', icon: 'database', color: 'purple' },
    { title: 'Active Connections', value: '847', change: '-2.1%', type: 'down', icon: 'wifi', color: 'yellow' },
  ];
  const STATUS = [
    { name: 'API Gateway', v: 98, c: '--neon-green', ic: '<path d="M5 12h14M12 5v14"/>' },
    { name: 'ML Pipeline', v: 76, c: '--neon-blue', ic: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>' },
    { name: 'Data Store', v: 62, c: '--neon-purple', ic: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/>' },
    { name: 'Edge Cache', v: 88, c: '--neon-yellow', ic: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>' },
    { name: 'Auth Service', v: 44, c: '--neon-red', ic: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  ];

  function render() {
    return `
    <section class="section">
      <div class="grid grid-kpi" id="kpiGrid">${KPIS.map((m, i) => `
        <div class="metric c-${m.color}" style="animation-delay:${i * 0.08}s">
          <div class="wash"></div><div class="corner"></div>
          <div class="metric-top">
            <span class="metric-icon">${svg(ICONS[m.icon])}</span>
            <span class="metric-change ${m.type}">${svg(ICONS[m.type])}${m.change}</span>
          </div>
          <p class="label m-label">${m.title}</p>
          <p class="m-value">${m.value}</p>
        </div>`).join('')}
      </div>
    </section>

    <section class="section">
      <div class="grid grid-2">
        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">Requests by Region</h3><p class="card-sub">// last 24h</p></div><span class="badge info"><span class="dot"></span>24h</span></div>
          <div class="bars" id="dashBars"></div>
        </div>
        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">Resource Allocation</h3></div>
          <div class="donut-wrap">
            <div class="donut"><svg width="140" height="140" viewBox="0 0 140 140" id="dashDonut"></svg>
              <div class="donut-center"><span class="v">78%</span><span class="k">in use</span></div></div>
            <div class="donut-legend" id="dashDonutLegend"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="grid grid-2">
        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">Network Traffic</h3><p class="card-sub">// 600 req/s sustained</p></div>
            <div class="legend"><span><i style="background:hsl(var(--chart-1))"></i>ingress</span></div></div>
          <div class="chart-wrap"><canvas id="dashLine" class="chart-canvas" height="220"></canvas></div>
        </div>
        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">Live Gauges</h3></div>
          <div class="gauge-row">
            <div><div class="gauge sm c-green"><svg width="110" height="110" viewBox="0 0 140 140" id="gA"></svg>
              <div class="gauge-center"><span class="gv">56%</span></div></div><p class="gauge-mini-label">GPU 0</p></div>
            <div><div class="gauge sm c-blue"><svg width="110" height="110" viewBox="0 0 140 140" id="gB"></svg>
              <div class="gauge-center"><span class="gv">66%</span></div></div><p class="gauge-mini-label">GPU 1</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="grid grid-2">
        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">Latency vs Throughput</h3><p class="card-sub">// correlation map</p></div></div>
          <div class="chart-wrap"><canvas id="dashScatter" class="chart-canvas" height="200"></canvas></div>
        </div>
        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">Deploy Pipeline</h3></div>
          <div class="prog c-green"><div class="prog-top"><span class="pname">build</span><span class="ppct">100%</span></div><div class="prog-track"><div class="prog-fill" data-w="100"></div></div></div>
          <div class="prog c-blue"><div class="prog-top"><span class="pname">test</span><span class="ppct">92%</span></div><div class="prog-track"><div class="prog-fill" data-w="92"></div></div></div>
          <div class="prog c-purple"><div class="prog-top"><span class="pname">stage</span><span class="ppct">74%</span></div><div class="prog-track"><div class="prog-fill" data-w="74"></div></div></div>
          <div class="prog c-yellow"><div class="prog-top"><span class="pname">canary</span><span class="ppct">48%</span></div><div class="prog-track"><div class="prog-fill" data-w="48"></div></div></div>
          <div class="prog c-red"><div class="prog-top"><span class="pname">prod</span><span class="ppct">21%</span></div><div class="prog-track"><div class="prog-fill" data-w="21"></div></div></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="card"><div class="corner"></div>
        <div class="card-head"><div><h3 class="card-title">Activity Heatmap</h3><p class="card-sub">// requests/hour · last 7 days</p></div><span class="badge online"><span class="dot"></span>live</span></div>
        <div class="heatmap" id="dashHeatmap"></div>
      </div>
    </section>

    <section class="section">
      <div class="grid grid-2">
        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">System Status</h3></div>
          <div class="stat-list">${STATUS.map((s) => `
            <div class="stat-line" style="--c:var(${s.c})">
              <span class="sl-ic">${svg(s.ic)}</span>
              <div class="sl-body"><div style="display:flex;justify-content:space-between"><span class="sl-name">${s.name}</span><span class="sl-val">${s.v}%</span></div>
                <div class="sl-track"><div class="sl-fill" data-w="${s.v}"></div></div></div>
            </div>`).join('')}
          </div>
        </div>
        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">Live Activity</h3><span class="badge online"><span class="dot"></span>streaming</span></div>
          <div class="feed" id="dashFeed"></div>
          <div class="feed-foot"><span class="cursor-blink">root@nexus:~$ tail -f /var/log/sys</span></div>
        </div>
      </div>
    </section>`;
  }

  function init() {
    Charts.bars(document.getElementById('dashBars'),
      [{ label: 'US-E', v: 92 }, { label: 'US-W', v: 76 }, { label: 'EU', v: 64 }, { label: 'APAC', v: 81 }, { label: 'SA', v: 38 }, { label: 'AF', v: 22 }],
      { colors: ['--chart-2'] });

    Charts.donut(document.getElementById('dashDonut'),
      [{ name: 'Compute', pct: 42, color: '--chart-1' }, { name: 'Storage', pct: 26, color: '--chart-2' }, { name: 'Memory', pct: 20, color: '--chart-3' }, { name: 'Idle', pct: 12, color: '--chart-4' }]);
    document.getElementById('dashDonutLegend').innerHTML = [
      ['Compute', 42, '--chart-1'], ['Storage', 26, '--chart-2'], ['Memory', 20, '--chart-3'], ['Idle', 12, '--chart-4'],
    ].map(([n, p, c]) => `<div class="row"><span class="name"><i style="background:${App.hsl(c)}"></i>${n}</span><span class="pct">${p}%</span></div>`).join('');

    let data = Array.from({ length: 40 }, () => 40 + Math.random() * 35);
    const line = Charts.line(document.getElementById('dashLine'), [{ data, color: '--chart-1' }], { max: 90 });
    App.interval(() => { data.push(40 + Math.random() * 35); data.shift(); line.redraw(); }, 1500);

    Charts.gauge(document.getElementById('gA'), 56, '--neon-green');
    Charts.gauge(document.getElementById('gB'), 66, '--neon-blue');

    Charts.scatter(document.getElementById('dashScatter'),
      Array.from({ length: 26 }, () => ({ x: Math.random() * 100, y: 30 + Math.random() * 60 })), { color: '--chart-4' });

    Charts.heatmap(document.getElementById('dashHeatmap'), { cols: 24, rows: 7 });

    requestAnimationFrame(() => {
      document.querySelectorAll('#view .prog-fill, #view .sl-fill').forEach((f) => { f.style.width = f.dataset.w + '%'; });
    });

    // feed streaming
    const feed = document.getElementById('dashFeed');
    const LV = ['ok', 'info', 'warn', 'err'];
    const MSG = { ok: ['health check passed', 'node joined cluster', 'cache warmed · 1.2k keys'], info: ['sync complete · 3.8tb', 'inference · 24ms', 'snapshot scheduled'], warn: ['latency spike · 180ms', 'memory at 84%', 'retry queue growing'], err: ['connection dropped · node-3', 'timeout on /v2/ingest'] };
    let clk = 8 * 3600 + 28 * 60;
    function push() {
      const lvl = LV[Math.floor(Math.random() * (Math.random() < 0.7 ? 2 : 4))];
      const m = MSG[lvl][Math.floor(Math.random() * MSG[lvl].length)];
      const p = (n) => String(n).padStart(2, '0');
      const ts = `${p(Math.floor(clk / 3600) % 24)}:${p(Math.floor(clk / 60) % 60)}:${p(clk % 60)}`;
      clk += 2 + Math.floor(Math.random() * 5);
      const el = document.createElement('div'); el.className = 'line';
      el.innerHTML = `<span class="ts">${ts}</span><span class="lvl ${lvl}">${lvl}</span><span class="msg">${m}</span>`;
      feed.prepend(el); while (feed.children.length > 20) feed.lastChild.remove();
    }
    for (let i = 0; i < 9; i++) push();
    App.interval(push, 2200);
  }

  return { head: 'COMMAND', accent: 'CENTER', comment: '// monitoring all systems · last sync 2s ago', render, init };
})();
