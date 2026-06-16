/* Tela: Systems Monitor (Command Center) — hardware & infra diagnostics */
window.Screens.systems = (function () {
  const svg = (p) => App.svg(p);
  const ICONS = {
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    mem: '<rect width="18" height="12" x="3" y="6" rx="2"/><path d="M7 6v12M11 6v12M15 6v12M19 6v12"/>',
    disk: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    net: '<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0M8.5 16.429a5 5 0 0 1 7 0"/>',
    deploy: '<path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="9"/>',
    cal: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  };

  function render() {
    return `
    <section class="section">
      <div class="grid grid-2e">

        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">${svg(ICONS.cpu)} CPU Performance</h3><p class="card-sub">// load & thermal</p></div><span class="badge online"><span class="dot"></span>live</span></div>
          <div class="gauge-row">
            <div><div class="gauge sm c-green"><svg width="110" height="110" viewBox="0 0 140 140" id="sysCpuUsage"></svg>
              <div class="gauge-center"><span class="gv">74.5</span></div></div><p class="gauge-mini-label">Usage</p></div>
            <div><div class="gauge sm c-blue"><svg width="110" height="110" viewBox="0 0 140 140" id="sysCpuTemp"></svg>
              <div class="gauge-center"><span class="gv">41.2</span></div></div><p class="gauge-mini-label">Temp</p></div>
          </div>
          <div class="info-panel" style="margin-top:14px">
            <div class="info-row"><span class="ir-k">Cores</span><span class="ir-v ok">16</span></div>
            <div class="info-row"><span class="ir-k">Frequency</span><span class="ir-v ok">4.6 GHz</span></div>
          </div>
        </div>

        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">${svg(ICONS.mem)} Memory Allocation</h3><p class="card-sub">// ram & swap</p></div><span class="badge info"><span class="dot"></span>64 GB</span></div>
          <div class="gauge c-green"><svg width="140" height="140" viewBox="0 0 140 140" id="sysMem"></svg>
            <div class="gauge-center"><span class="gv">30.7</span><span class="gk">RAM Used</span></div></div>
          <div style="margin-top:16px">
            <div class="prog c-green"><div class="prog-top"><span class="pname">RAM</span><span class="ppct">38.7 / 64 GB</span></div><div class="prog-track"><div class="prog-fill" data-w="78"></div></div></div>
            <div class="prog c-purple"><div class="prog-top"><span class="pname">SWAP</span><span class="ppct">8 / 16 GB</span></div><div class="prog-track"><div class="prog-fill" data-w="12"></div></div></div>
          </div>
        </div>

        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">${svg(ICONS.disk)} Storage I/O</h3><p class="card-sub">// throughput & iops</p></div><span class="badge ai"><span class="dot"></span>nvme</span></div>
          <div class="gauge c-purple"><svg width="140" height="140" viewBox="0 0 140 140" id="sysDisk"></svg>
            <div class="gauge-center"><span class="gv">1247.9</span><span class="gk">Disk Read</span></div></div>
          <div style="margin-top:16px">
            <div class="prog c-purple"><div class="prog-top"><span class="pname">Disk Speed</span><span class="ppct">1247.9 / 1500 MB/s</span></div><div class="prog-track"><div class="prog-fill" data-w="84"></div></div></div>
          </div>
          <div class="info-panel" style="margin-top:10px">
            <div class="info-row"><span class="ir-k">IOPS</span><span class="ir-v">184,302</span></div>
          </div>
        </div>

        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">${svg(ICONS.net)} Network Throughput</h3><p class="card-sub">// rx & tx</p></div><span class="badge online"><span class="dot"></span>up</span></div>
          <div class="gauge-row">
            <div><div class="gauge sm c-green"><svg width="110" height="110" viewBox="0 0 140 140" id="sysNetRx"></svg>
              <div class="gauge-center"><span class="gv">89.3</span><span class="gk">MB/s</span></div></div><p class="gauge-mini-label">RX Rate</p></div>
            <div><div class="gauge sm c-blue"><svg width="110" height="110" viewBox="0 0 140 140" id="sysNetTx"></svg>
              <div class="gauge-center"><span class="gv">120.8</span><span class="gk">MB/s</span></div></div><p class="gauge-mini-label">TX Rate</p></div>
          </div>
          <div class="info-panel" style="margin-top:14px">
            <div class="info-row"><span class="ir-k">Active Connections</span><span class="ir-v" style="color:hsl(var(--neon-yellow));font-size:1rem">1,198</span></div>
          </div>
        </div>

      </div>
    </section>

    <section class="section">
      <div class="grid grid-2e">

        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">${svg(ICONS.deploy)} Deployment Scale</h3><p class="card-sub">// horizontal pod autoscaler</p></div></div>
          <div class="slider-head"><span class="label">Replicas</span><span class="sh-val" id="sysReplVal">8</span></div>
          <div class="slider-row">
            <button class="step-btn" id="sysReplDec">&minus;</button>
            <input type="range" class="range" id="sysRepl" min="1" max="32" value="8">
            <button class="step-btn" id="sysReplInc">+</button>
          </div>
          <div class="info-panel" style="margin-top:14px">
            <div class="info-row"><span class="ir-k">Min</span><span class="ir-v">1 node</span></div>
            <div class="info-row"><span class="ir-k">Max</span><span class="ir-v">32 nodes</span></div>
          </div>
        </div>

        <div class="card"><div class="corner"></div>
          <div class="card-head"><div><h3 class="card-title">${svg(ICONS.cal)} Maintenance Window</h3><p class="card-sub">// scheduled downtime</p></div></div>
          <div class="field" style="max-width:none">
            <label>Window Date</label>
            <input type="date" class="input-plain" id="sysMaint" value="2026-07-01">
          </div>
        </div>

      </div>
    </section>

    <section class="section">
      <div class="card span-2"><div class="corner"></div>
        <div class="card-head"><div><h3 class="card-title">${svg(ICONS.upload)} Import Config</h3><p class="card-sub">// cluster manifest</p></div></div>
        <div class="dropzone" id="sysDrop">
          <div class="dz-ic">${svg(ICONS.upload)}</div>
          <p class="dz-main">Drop <b>.yaml</b> or <b>.json</b></p>
          <p class="dz-sub">// or click to browse · max 2 MB</p>
        </div>
      </div>
    </section>`;
  }

  function init(view) {
    // gauges radiais (animam sozinhos)
    Charts.gauge(document.getElementById('sysCpuUsage'), 74.5, '--neon-green');
    Charts.gauge(document.getElementById('sysCpuTemp'), 41.2, '--neon-blue');
    Charts.gauge(document.getElementById('sysMem'), 60.4, '--neon-green');
    Charts.gauge(document.getElementById('sysDisk'), 83.2, '--neon-purple');
    Charts.gauge(document.getElementById('sysNetRx'), 59.5, '--neon-green');
    Charts.gauge(document.getElementById('sysNetTx'), 80.5, '--neon-blue');

    // anima as barras de progresso (RAM / SWAP / Disk Speed)
    requestAnimationFrame(() => {
      document.querySelectorAll('#view .prog-fill').forEach((f) => { f.style.width = f.dataset.w + '%'; });
    });

    // slider de replicas: pinta o trilho e atualiza o valor
    const repl = document.getElementById('sysRepl');
    const replVal = document.getElementById('sysReplVal');
    const dec = document.getElementById('sysReplDec');
    const inc = document.getElementById('sysReplInc');
    if (repl) {
      const paintRange = (el) => {
        const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
        el.style.background = `linear-gradient(90deg, ${App.hsl('--primary')} ${pct}%, ${App.hsl('--muted')} ${pct}%)`;
      };
      const sync = () => { replVal.textContent = repl.value; paintRange(repl); };
      repl.addEventListener('input', sync);
      dec && dec.addEventListener('click', () => { repl.value = Math.max(+repl.min, +repl.value - 1); sync(); });
      inc && inc.addEventListener('click', () => { repl.value = Math.min(+repl.max, +repl.value + 1); sync(); });
      sync();
    }

    // dropzone: clique dispara toast
    const drop = document.getElementById('sysDrop');
    if (drop) drop.addEventListener('click', () => {
      App.toast && App.toast('info', 'File picker', '// select a .yaml or .json manifest');
    });
  }

  return { head: 'SYSTEMS', accent: 'MONITOR', comment: '// hardware & infrastructure diagnostics', render, init };
})();
