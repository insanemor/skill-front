/* Tela: Docs Engine (Command Center) — templates, metadados de documento, tags & categorias */
window.Screens.docs = (function () {
  const svg = (p) => App.svg(p);
  const ICONS = {
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    docs: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h8M8 17h5"/>',
    save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7M7 3v4a1 1 0 0 0 1 1h7"/>',
  };

  const TEMPLATES = [
    { id: 'api', icon: 'code', name: 'API Reference', desc: 'Endpoint documentation template' },
    { id: 'model', icon: 'layers', name: 'Model Card', desc: 'AI model metadata & usage guide' },
    { id: 'runbook', icon: 'terminal', name: 'Runbook', desc: 'Operational procedures & alerts' },
    { id: 'blank', icon: 'file', name: 'Blank Document', desc: 'Start from scratch' },
  ];

  const CATEGORIES = ['Infrastructure', 'Machine Learning', 'Operations', 'Security'];
  const SEED_TAGS = ['ml', 'infra'];

  function chip(tag) {
    return `<span class="chip" data-tag="${tag}">${tag}<span class="x" data-x="${tag}">${svg(ICONS.x)}</span></span>`;
  }

  /* svg dimensionado explicitamente (varios containers nao restringem svg "cru") */
  function isvg(icon, px) {
    return svg(ICONS[icon]).replace('<svg ', `<svg width="${px}" height="${px}" style="flex-shrink:0" `);
  }
  /* cabecalho de card no estilo do print: rotulo mono uppercase + icone neon pequeno */
  function head(icon, text) {
    return `<div class="kb-title" style="margin-bottom:16px"><span style="color:hsl(var(--primary));display:inline-flex">${isvg(icon, 15)}</span>${text}</div>`;
  }

  function render() {
    return `
    <section class="section">
      <div class="card"><div class="corner"></div>
        ${head('docs', 'Document Templates')}
        <div class="grid grid-4" id="docTemplates">${TEMPLATES.map((t) => `
          <div class="opt-card" data-tpl="${t.id}">
            <span class="oc-ic">${svg(ICONS[t.icon])}</span>
            <div class="oc-name">${t.name}</div>
            <div class="oc-desc">${t.desc}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="card"><div class="corner"></div>
        <div class="field" style="max-width:none;margin-bottom:18px">
          <label for="docTitle">Document Title</label>
          <input id="docTitle" type="text" placeholder="Document title..." style="padding-left:12px;font-family:var(--font-display);font-size:1.05rem">
        </div>
        <div class="field" style="max-width:none">
          <label for="docDesc">Description</label>
          <textarea id="docDesc" placeholder="Brief description of this document..."></textarea>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="grid grid-2e">
        <div class="card"><div class="corner"></div>
          ${head('tag', 'Tags')}
          <div class="tag-input">
            <input id="docTagInput" type="text" placeholder="Type and press Enter..." style="padding-left:12px">
            <button class="add-btn" id="docTagAdd" type="button" aria-label="add tag">${svg(ICONS.plus)}</button>
          </div>
          <div class="chips" id="docChips" style="margin-top:14px">${SEED_TAGS.map(chip).join('')}</div>
        </div>

        <div class="card"><div class="corner"></div>
          ${head('grid', 'Categories')}
          <div class="field" style="max-width:none">
            <div class="select-wrap">
              <select class="select" id="docCategory">
                <option value="" disabled selected>Select categories...</option>
                ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join('')}
              </select>
              ${svg(ICONS.chevron)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="btn-row">
        <button class="btn btn-primary" id="docSave" type="button">${svg(ICONS.save)} Save Document</button>
        <span class="badge pending"><span class="dot"></span>draft</span>
      </div>
    </section>`;
  }

  function init(view) {
    /* seleção de template (borda neon via .selected do .opt-card... usa estilo inline já que .opt-card nao tem .selected no css) */
    const tpl = view.querySelector('#docTemplates');
    if (tpl) tpl.addEventListener('click', (e) => {
      const card = e.target.closest('.opt-card'); if (!card) return;
      tpl.querySelectorAll('.opt-card').forEach((c) => {
        c.style.borderColor = '';
        c.style.boxShadow = '';
        c.style.background = '';
      });
      card.style.borderColor = App.hsl('--primary', 0.7);
      card.style.boxShadow = '0 0 20px ' + App.hsl('--primary', 0.15);
      card.style.background = App.hsl('--primary', 0.04);
      const t = TEMPLATES.find((x) => x.id === card.dataset.tpl);
      App.toast('info', 'Template selecionado', `// ${t ? t.name : card.dataset.tpl}`);
    });

    /* tags: input (Enter) ou botão + adiciona chip; x remove (delegado) */
    const chips = view.querySelector('#docChips');
    const tagInput = view.querySelector('#docTagInput');
    const tagAdd = view.querySelector('#docTagAdd');

    function has(tag) {
      return [...chips.querySelectorAll('.chip')].some((c) => c.dataset.tag === tag);
    }
    function addTag() {
      const v = (tagInput.value || '').trim().toLowerCase();
      tagInput.value = '';
      if (!v) return;
      if (has(v)) { App.toast('warn', 'Tag duplicada', `// ${v} já existe`); return; }
      chips.insertAdjacentHTML('beforeend', chip(v));
    }
    if (tagAdd) tagAdd.addEventListener('click', addTag);
    if (tagInput) tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); addTag(); }
    });
    if (chips) chips.addEventListener('click', (e) => {
      const x = e.target.closest('.x'); if (!x) return;
      x.closest('.chip').remove();
    });

    /* salvar documento */
    const save = view.querySelector('#docSave');
    if (save) save.addEventListener('click', () => {
      App.toast('success', 'Documento salvo', 'rascunho atualizado');
    });
  }

  return { head: 'DOCS', accent: 'ENGINE', comment: '// internal documentation & knowledge base', render, init };
})();
