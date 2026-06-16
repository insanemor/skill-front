/* Tela: Analytics (Command Center) — workload, accuracy, model mix, resource gauges */
window.Screens.analytics = (function () {
  const svg = (p) => App.svg(p);
  const ICONS = {
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    bars: '<path d="M3 3v18h18"/><rect width="4" height="7" x="7" y="10"/><rect width="4" height="12" x="15" y="5"/>',
    line: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    pie: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  };

  // titulo de card com icone pequeno em destaque (verde) — sem precisar de classe nova
  const titIcon = (p) => `<span style="display:inline-flex;width:16px;height:16px;color:hsl(var(--primary));vertical-align:-3px;margin-right:7px">${svg(p)}</span>`;

  // dados (verde = inference, roxo = training) — labels Mon..Sun
  const WORKLOAD = [
    { label: 'Mon', values: [62, 48] },
    { label: 'Tue', values: [88, 70] },
    { label: 'Wed', values: [74, 54] },
    { label: 'Thu', values: [95, 66] },
    { label: 'Fri', values: [58, 80] },
    { label: 'Sat', values: [40, 33] },
    { label: 'Sun', values: [92, 58] },
  ];
  // acuracia do modelo por mes (0..100) — Jan..Dec
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ACCURACY = [82, 88, 91, 86, 90, 84, 92, 95, 89, 94, 90, 96];
  // distribuicao de modelos
  const DIST = [
    ['NLP', 35, '--chart-1'],
    ['Vision', 25, '--chart-2'],
    ['Prediction', 20, '--chart-3'],
    ['Automation', 20, '--chart-4'],
  ];
  // gauges de utilizacao
  const RES = [
    { name: 'GPU', v: 78, c: '--neon-green', cls: 'c-green', id: 'anGpu' },
    { name: 'CPU', v: 42, c: '--neon-blue', cls: 'c-blue', id: 'anCpu' },
    { name: 'Memory', v: 67, c: '--neon-purple', cls: 'c-purple', id: 'anMem' },
  ];

  function render() {
    return `
    <section class="section">
      <div class="grid grid-2e">

        <div class="card"><div class="corner"></div>
          <div class="card-head">
            <div><h3 class="card-title">${titIcon(ICONS.bars)}Workload Distribution</h3><p class="card-sub">// inference vs training · per day</p></div>
            <div class="segmented" id="anPeriod">
              <button data-p="day">Day</button>
              <button class="active" data-p="week">Week</button>
              <button data-p="month">Month</button>
            </div>
          </div>
          <div class="legend" style="margin-bottom:12px">
            <span><i style="background:${App.hsl('--chart-1')}"></i>inference</span>
            <span><i style="background:${App.hsl('--chart-3')}"></i>training</span>
          </div>
          <div class="bars" id="anBars"></div>
        </div>

        <div class="card"><div class="corner"></div>
          <div class="card-head">
            <div><h3 class="card-title">${titIcon(ICONS.line)}Model Accuracy</h3><p class="card-sub">// rolling 12 months · %</p></div>
            <span class="badge ai"><span class="dot"></span>v3</span>
          </div>
          <div class="legend" style="margin-bottom:12px"><span><i style="background:${App.hsl('--chart-2')}"></i>accuracy</span></div>
          <div class="chart-wrap"><canvas id="anLine" class="chart-canvas" height="220"></canvas></div>
        </div>

        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">${titIcon(ICONS.pie)}Model Distribution</h3><span class="badge info"><span class="dot"></span>4 types</span></div>
          <div class="donut-wrap">
            <div class="donut"><svg width="140" height="140" viewBox="0 0 140 140" id="anDonut"></svg>
              <div class="donut-center"><span class="v">320</span><span class="k">models</span></div></div>
            <div class="donut-legend" id="anDonutLegend"></div>
          </div>
        </div>

        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">${titIcon(ICONS.gauge)}Resource Utilization</h3><span class="badge online"><span class="dot"></span>live</span></div>
          <div class="gauge-row">${RES.map((r) => `
            <div><div class="gauge sm ${r.cls}"><svg width="110" height="110" viewBox="0 0 140 140" id="${r.id}"></svg>
              <div class="gauge-center"><span class="gv">${r.v}%</span></div></div><p class="gauge-mini-label">${r.name}</p></div>`).join('')}
          </div>
        </div>

      </div>
    </section>`;
  }

  function init() {
    // barras agrupadas (2 series): verde --chart-1 e roxo --chart-3
    Charts.bars(document.getElementById('anBars'), WORKLOAD, { colors: ['--chart-1', '--chart-3'], max: 110 });

    // linha de acuracia (area + pontos), ciano --chart-2
    Charts.line(document.getElementById('anLine'), [{ data: ACCURACY, color: '--chart-2' }], { max: 100, area: true, points: true });

    // donut de distribuicao + legenda
    Charts.donut(document.getElementById('anDonut'), DIST.map(([name, pct, color]) => ({ name, pct, color })));
    document.getElementById('anDonutLegend').innerHTML = DIST.map(([n, p, c]) =>
      `<div class="row"><span class="name"><i style="background:${App.hsl(c)}"></i>${n}</span><span class="pct">${p}%</span></div>`).join('');

    // gauges radiais (animam sozinhos)
    RES.forEach((r) => Charts.gauge(document.getElementById(r.id), r.v, r.c));

    // segmented de periodo (re-renderiza barras com leve variacao)
    const seg = document.getElementById('anPeriod');
    if (seg) seg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      seg.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
      const f = { day: 0.78, week: 1, month: 1.18 }[b.dataset.p] || 1;
      const scaled = WORKLOAD.map((g) => ({ label: g.label, values: g.values.map((v) => Math.min(108, Math.round(v * f))) }));
      Charts.bars(document.getElementById('anBars'), scaled, { colors: ['--chart-1', '--chart-3'], max: 110 });
      App.toast && App.toast('info', 'Range updated', `// scope · ${b.dataset.p}`);
    });

    requestAnimationFrame(() => {
      document.querySelectorAll('#view .prog-fill, #view .sl-fill').forEach((f) => { f.style.width = f.dataset.w + '%'; });
    });
  }

  return { head: 'ANALYTICS', accent: 'ENGINE', comment: '// performance metrics & model analytics', render, init };
})();
