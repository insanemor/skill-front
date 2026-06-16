/* Tela: System Settings (Command Center) — abas, configuracao geral, toggles, system info */
window.Screens.settings = (function () {
  const svg = (p) => App.svg(p);
  const ICONS = {
    general: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    notifications: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    security: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    appearance: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>',
    network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
    reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    restart: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    export: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
  };

  const TABS = [
    { id: 'general', label: 'General', icon: 'general', active: true },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'appearance', label: 'Appearance', icon: 'appearance' },
    { id: 'network', label: 'Network', icon: 'network' },
  ];

  const TOGGLES = [
    { name: 'Auto-Scale Nodes', desc: 'Automatically adjust cluster capacity based on load', on: true },
    { name: 'Debug Mode', desc: 'Enable verbose logging and stack traces', on: false },
    { name: 'Telemetry', desc: 'Send anonymous usage data to improve the platform', on: true },
    { name: 'Dark Mode', desc: 'Use dark theme across the interface', on: true },
  ];

  const INFO = [
    { k: 'Version', v: 'v2.4.1-rc.3', ok: true },
    { k: 'Environment', v: 'Production' },
    { k: 'Region', v: 'us-east-1' },
    { k: 'Uptime', v: '47d 12h 33m' },
    { k: 'Last Deploy', v: '2026-06-14 08:42 UTC' },
  ];

  const ACTIONS = [
    { label: 'Restart Services', icon: 'restart', kind: 'ok' },
    { label: 'Export Config', icon: 'export', kind: 'ok' },
    { label: 'Reset System', icon: 'power', danger: true },
  ];

  function field(label, value) {
    return `
      <div class="field" style="max-width:none">
        <label>${label}</label>
        <div class="input-wrap">
          <input type="text" value="${value}" style="padding-left:12px">
        </div>
      </div>`;
  }

  function selectField(label, options) {
    return `
      <div class="field" style="max-width:none">
        <label>${label}</label>
        <div class="select-wrap">
          <select class="select">${options.map((o, i) =>
            `<option${i === 0 ? ' selected' : ''}>${o}</option>`).join('')}</select>
          ${svg(ICONS.chevron)}
        </div>
      </div>`;
  }

  function render() {
    return `
    <section class="section">
      <div class="tab-pills" id="setTabs">${TABS.map((t) =>
        `<button class="tp${t.active ? ' active' : ''}" data-tab="${t.id}">${svg(ICONS[t.icon])}${t.label}</button>`).join('')}
      </div>

      <div class="grid grid-2-1">
        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">General Configuration</h3></div>

          <div class="fields-grid" style="margin-bottom:8px">
            ${field('API Endpoint', 'https://api.nexus.ai/v2')}
            ${field('Cluster Name', 'nexus-prod-us-east-1')}
            ${selectField('Language', ['English (EN)', 'Português (BR)', 'Español'])}
            ${selectField('Timezone', ['UTC (Coordinated Universal Time)', 'America/Sao_Paulo', 'US/Pacific'])}
          </div>

          <div class="set-list">${TOGGLES.map((s) => `
            <div class="set-row">
              <div><div class="sr-name">${s.name}</div><div class="sr-desc">${s.desc}</div></div>
              <label class="switch"><input type="checkbox"${s.on ? ' checked' : ''}><span class="track"></span><span class="thumb"></span></label>
            </div>`).join('')}
          </div>
        </div>

        <div class="card"><div class="corner"></div>
          <div class="card-head"><h3 class="card-title">System Info</h3></div>
          <div class="info-panel">${INFO.map((r) => `
            <div class="info-row"><span class="ir-k">${r.k}</span><span class="ir-v${r.ok ? ' ok' : ''}">${r.v}</span></div>`).join('')}
          </div>

          <p class="label" style="margin:18px 0 12px">Quick Actions</p>
          <div id="setActions">${ACTIONS.map((a) => `
            <button class="action-btn${a.danger ? ' danger' : ''}" data-action="${a.label}">${svg(ICONS[a.icon])}<span>${a.label}</span></button>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="btn-row">
        <button class="btn btn-primary" id="setSave">${svg(ICONS.save)}Save Changes</button>
        <button class="btn btn-outline" id="setReset">${svg(ICONS.reset)}Reset Defaults</button>
      </div>
    </section>`;
  }

  function init(view) {
    /* abas em pilula — alterna apenas o .active (visual) */
    const tabs = view.querySelector('#setTabs');
    tabs.addEventListener('click', (e) => {
      const b = e.target.closest('.tp');
      if (!b) return;
      tabs.querySelectorAll('.tp').forEach((t) => t.classList.toggle('active', t === b));
    });

    /* quick actions — cada botao dispara um toast */
    view.querySelector('#setActions').addEventListener('click', (e) => {
      const b = e.target.closest('.action-btn');
      if (!b) return;
      const name = b.dataset.action;
      if (b.classList.contains('danger')) App.toast('warn', name, 'operação destrutiva confirmada');
      else App.toast('info', name, 'comando enviado ao cluster');
    });

    /* rodape — salvar / resetar */
    view.querySelector('#setSave').addEventListener('click', () =>
      App.toast('success', 'Configurações salvas', 'aplicado ao cluster'));
    view.querySelector('#setReset').addEventListener('click', () =>
      App.toast('info', 'Padrões restaurados', 'valores de fábrica recarregados'));
  }

  return { head: 'SYSTEM', accent: 'SETTINGS', comment: '// configure platform parameters & preferences', render, init };
})();
