/* Tela: Data Grid (Command Center) — cluster node registry, filtros, tabela, paginacao */
window.Screens.data = (function () {
  const svg = (p) => App.svg(p);
  const ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    prev: '<path d="m15 18-6-6 6-6"/>',
    next: '<path d="m9 18 6-6-6-6"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  };

  const REGIONS = ['us-west-1', 'us-east-1', 'eu-west-1', 'ap-south-1'];

  /* status -> {classe badge, texto} */
  const ST = {
    active: { cls: 'online', label: 'ACTIVE' },
    idle: { cls: 'pending', label: 'IDLE' },
    error: { cls: 'offline', label: 'ERROR' },
    maint: { cls: 'ai', label: 'MAINTENANCE' },
  };

  /* 12 linhas fieis ao print */
  const ROWS = [
    { name: 'Alpha Cortex', type: 'ML Model', st: 'active', cpu: 58, mem: 12.2, up: '47d 3h', region: 'us-west-1', ping: '21s ago' },
    { name: 'Beta Synapse', type: 'Data Pipeline', st: 'active', cpu: 66, mem: 19.6, up: '13d 9h', region: 'us-east-1', ping: '4s ago' },
    { name: 'Gamma Neuron', type: 'API Endpoint', st: 'active', cpu: 13, mem: 3.8, up: '110d 6h', region: 'ap-south-1', ping: '44s ago' },
    { name: 'Delta Encoder', type: 'Worker Node', st: 'idle', cpu: 9, mem: 1.1, up: '35d 4h', region: 'us-west-1', ping: '27s ago' },
    { name: 'Epsilon Vector', type: 'Cache Layer', st: 'error', cpu: 92, mem: 8.4, up: '88d 2h', region: 'eu-west-1', ping: '58s ago' },
    { name: 'Zeta Pipeline', type: 'Data Pipeline', st: 'active', cpu: 34, mem: 14.1, up: '208d 18h', region: 'us-east-1', ping: '6s ago' },
    { name: 'Eta Transformer', type: 'Data Pipeline', st: 'maint', cpu: 39, mem: 15.2, up: '209d 18h', region: 'ap-south-1', ping: '47s ago' },
    { name: 'Theta Classifier', type: 'API Endpoint', st: 'active', cpu: 53, mem: 13.5, up: '565d 14h', region: 'us-west-1', ping: '3s ago' },
    { name: 'Iota Generator', type: 'Worker Node', st: 'active', cpu: 61, mem: 10.6, up: '230d 18h', region: 'eu-west-1', ping: '15s ago' },
    { name: 'Kappa Decoder', type: 'Cache Layer', st: 'idle', cpu: 94, mem: 2.8, up: '147d 52m', region: 'ap-south-1', ping: '32s ago' },
    { name: 'Alpha Cortex', type: 'ML Model', st: 'idle', cpu: 48, mem: 5.1, up: '139d 8h', region: 'us-east-1', ping: '13s ago' },
    { name: 'Beta Synapse', type: 'Data Pipeline', st: 'error', cpu: 78, mem: 4.5, up: '662d 9h', region: 'us-west-1', ping: '47s ago' },
  ];

  /* cor do CPU por faixa (verde<60, amarelo 60-85, vermelho>85) */
  function cpuVar(v) { return v > 85 ? '--neon-red' : v >= 60 ? '--neon-yellow' : '--neon-green'; }

  function pad(n) { return String(n).padStart(4, '0'); }

  function render() {
    const rows = ROWS.map((r, i) => {
      const s = ST[r.st];
      const id = 'NODE-' + pad(i + 1);
      return `
        <tr data-row="${i}">
          <td class="col-check"><input type="checkbox" class="chk row-chk" data-row="${i}"></td>
          <td><span class="node-id">${id}</span></td>
          <td>${r.name}</td>
          <td class="muted">${r.type}</td>
          <td><span class="badge ${s.cls}"><span class="dot"></span>${s.label}</span></td>
          <td><span class="num cpu" style="color:${App.hsl(cpuVar(r.cpu))}">${r.cpu}%</span></td>
          <td><span class="num">${r.mem.toFixed(1)}</span></td>
          <td><span class="num muted">${r.up}</span></td>
          <td><span class="num muted">${r.region}</span></td>
          <td><span class="num muted">${r.ping}</span></td>
        </tr>`;
    }).join('');

    const chips = REGIONS.map((r, i) =>
      `<button class="page-btn region-chip${i === 0 ? ' active' : ''}" data-region="${r}">${r}</button>`).join('');

    return `
    <section class="section">
      <div class="filter-bar">
        <div class="search">${svg(ICONS.search)}<input type="text" placeholder="Search nodes..."></div>
        <span class="comment" id="dataCount">60 results · page 1/5</span>
        <div class="segmented" id="regionSeg">${chips}</div>
      </div>

      <div class="card"><div class="corner"></div>
        <div class="table-wrap">
          <table class="data-table" id="dataTable">
            <thead>
              <tr>
                <th class="col-check"><input type="checkbox" class="chk" id="checkAll"></th>
                <th>ID</th>
                <th>Node</th>
                <th>Type</th>
                <th>Status</th>
                <th>CPU %</th>
                <th>Mem (GB)</th>
                <th>Uptime</th>
                <th>Region</th>
                <th>Last Ping</th>
              </tr>
            </thead>
            <tbody id="dataBody">${rows}</tbody>
          </table>
        </div>

        <div class="table-foot">
          <span class="comment">Showing 1-12 of 60</span>
          <div class="pagination" id="dataPager">
            <button class="page-btn" data-nav="prev" disabled>${svg(ICONS.prev)}</button>
            <button class="page-btn active" data-page="1">1</button>
            <button class="page-btn" data-page="2">2</button>
            <button class="page-btn" data-page="3">3</button>
            <button class="page-btn" data-page="4">4</button>
            <button class="page-btn" data-page="5">5</button>
            <button class="page-btn" data-nav="next">${svg(ICONS.next)}</button>
          </div>
        </div>
      </div>
    </section>`;
  }

  function init(view) {
    const body = view.querySelector('#dataBody');
    const checkAll = view.querySelector('#checkAll');
    const rowChks = () => [...body.querySelectorAll('.row-chk')];

    /* seleciona/desseleciona uma linha (sincroniza checkbox + classe) */
    function setRow(tr, on) {
      tr.classList.toggle('selected', on);
      const chk = tr.querySelector('.row-chk');
      if (chk) chk.checked = on;
    }

    /* clique na linha alterna selecao (ignora clique direto no checkbox) */
    body.querySelectorAll('tr').forEach((tr) => {
      tr.addEventListener('click', (e) => {
        if (e.target.classList.contains('row-chk')) return;
        setRow(tr, !tr.classList.contains('selected'));
        syncAll();
      });
    });

    /* checkbox por linha */
    rowChks().forEach((chk) => {
      chk.addEventListener('change', () => {
        setRow(chk.closest('tr'), chk.checked);
        syncAll();
      });
    });

    /* "selecionar tudo" no header */
    function syncAll() {
      const all = rowChks();
      const sel = all.filter((c) => c.checked).length;
      checkAll.checked = sel === all.length && all.length > 0;
      checkAll.indeterminate = sel > 0 && sel < all.length;
    }
    checkAll.addEventListener('change', () => {
      body.querySelectorAll('tr').forEach((tr) => setRow(tr, checkAll.checked));
      checkAll.indeterminate = false;
    });

    /* paginacao — apenas troca .active (visual) */
    const pager = view.querySelector('#dataPager');
    const count = view.querySelector('#dataCount');
    let page = 1;
    function goto(p) {
      page = p;
      pager.querySelectorAll('[data-page]').forEach((b) =>
        b.classList.toggle('active', Number(b.dataset.page) === page));
      pager.querySelector('[data-nav="prev"]').disabled = page === 1;
      pager.querySelector('[data-nav="next"]').disabled = page === 5;
      if (count) count.textContent = `60 results · page ${page}/5`;
    }
    pager.addEventListener('click', (e) => {
      const b = e.target.closest('.page-btn');
      if (!b || b.disabled) return;
      if (b.dataset.page) goto(Number(b.dataset.page));
      else if (b.dataset.nav === 'prev') goto(Math.max(1, page - 1));
      else if (b.dataset.nav === 'next') goto(Math.min(5, page + 1));
    });

    /* chips de regiao — alterna .active (filtro visual) */
    const seg = view.querySelector('#regionSeg');
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('.region-chip');
      if (!b) return;
      seg.querySelectorAll('.region-chip').forEach((c) => c.classList.toggle('active', c === b));
    });
  }

  return { head: 'DATA', accent: 'GRID', comment: '// cluster node registry · 60 nodes indexed', render, init };
})();
