/* Tela: Model Hub — selecao de modelo, parametros de inferencia, upload de pesos */
window.Screens.models = (function () {
  const svg = (p) => App.svg(p);

  const ICONS = {
    chip: '<path d="M12 3v2M12 19v2M3 12h2M19 12h2"/><rect width="16" height="16" x="4" y="4" rx="2"/><path d="m9 9 6 6M15 9l-6 6"/>',
    bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
    spark: '<path d="M9.94 3.69a1 1 0 0 1 1.94 0l.9 2.66a1 1 0 0 0 .63.63l2.66.9a1 1 0 0 1 0 1.9l-2.66.9a1 1 0 0 0-.63.63l-.9 2.66a1 1 0 0 1-1.94 0l-.9-2.66a1 1 0 0 0-.63-.63l-2.66-.9a1 1 0 0 1 0-1.9l2.66-.9a1 1 0 0 0 .63-.63z"/><path d="M18 5h.01M19 12h.01"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
  };

  const MODELS = [
    { name: 'GPT-5 Omni', vendor: 'OpenAI', icon: 'spark', ctx: '1M context', lat: '~200ms', selected: true },
    { name: 'Claude Opus 4', vendor: 'Anthropic', icon: 'bot', ctx: '500K context', lat: '~350ms' },
    { name: 'Gemini 3 Pro', vendor: 'Google', icon: 'chip', ctx: '2M context', lat: '~180ms' },
    { name: 'Custom Fine-Tune', vendor: 'Self-hosted', icon: 'bolt', ctx: 'Flexible', lat: '~50ms' },
  ];

  function render() {
    return `
    <section class="section">
      <div class="grid grid-4" id="modelGrid">${MODELS.map((m) => `
        <div class="model-card${m.selected ? ' selected' : ''}" data-name="${m.name}">
          <div class="mc-top">
            <span class="mc-ic">${svg(ICONS[m.icon])}</span>
            <span class="mc-check">${svg(ICONS.check)}</span>
          </div>
          <p class="mc-name">${m.name}</p>
          <p class="mc-vendor">${m.vendor}</p>
          <div class="mc-meta"><span><b>·</b> ${m.ctx}</span><span><b>·</b> ${m.lat}</span></div>
        </div>`).join('')}
      </div>
    </section>

    <section class="section">
      <div class="card"><div class="corner"></div>
        <div class="card-head"><h3 class="card-title">Inference Parameters</h3></div>
        <div class="grid grid-2e">
          <div class="slider-block" data-slider="tokens">
            <div class="slider-head"><span class="label">Max Tokens</span><span class="sh-val">4096</span></div>
            <div class="slider-row">
              <button class="step-btn" data-step="-1" aria-label="decrease">&minus;</button>
              <input type="range" class="range" min="256" max="8192" step="256" value="4096">
              <button class="step-btn" data-step="1" aria-label="increase">+</button>
            </div>
          </div>
          <div class="slider-block" data-slider="temp">
            <div class="slider-head"><span class="label">Temperature</span><span class="sh-val">0.7</span></div>
            <div class="slider-row">
              <button class="step-btn" data-step="-1" aria-label="decrease">&minus;</button>
              <input type="range" class="range" min="0" max="20" step="1" value="7">
              <button class="step-btn" data-step="1" aria-label="increase">+</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="card"><div class="corner"></div>
        <div class="card-head"><div><h3 class="card-title">Custom Model Weights</h3><p class="card-sub">// import fine-tuned weights (.pt, .h5, .onnx, .safetensors)</p></div></div>
        <div class="dropzone" id="modelDrop">
          <div class="dz-ic">${svg(ICONS.upload)}</div>
          <p class="dz-main">Drop model file here or <b>browse files</b></p>
          <p class="dz-sub">Max file size: 500MB · .pt, .h5, .onnx, .safetensors</p>
        </div>
      </div>
    </section>`;
  }

  function init(view) {
    /* --- selecao de modelo --- */
    const grid = view.querySelector('#modelGrid');
    grid.querySelectorAll('.model-card').forEach((card) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('selected')) return;
        grid.querySelectorAll('.model-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        App.toast('success', 'Modelo selecionado', card.dataset.name);
      });
    });

    /* --- sliders --- */
    function paintRange(range) {
      const pct = ((range.value - range.min) / (range.max - range.min)) * 100;
      range.style.background = `linear-gradient(90deg, ${App.hsl('--primary')} 0%, ${App.hsl('--primary')} ${pct}%, ${App.hsl('--muted')} ${pct}%, ${App.hsl('--muted')} 100%)`;
    }

    view.querySelectorAll('.slider-block').forEach((block) => {
      const isTemp = block.dataset.slider === 'temp';
      const range = block.querySelector('.range');
      const valEl = block.querySelector('.sh-val');
      const fmt = (v) => (isTemp ? (v / 10).toFixed(1) : String(v));
      const sync = () => { valEl.textContent = fmt(+range.value); paintRange(range); };
      range.addEventListener('input', sync);
      block.querySelectorAll('.step-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const step = +range.step * +btn.dataset.step;
          range.value = Math.min(+range.max, Math.max(+range.min, +range.value + step));
          sync();
        });
      });
      sync();
    });

    /* --- dropzone --- */
    view.querySelector('#modelDrop').addEventListener('click', () => {
      App.toast('info', 'Upload', 'selecione um arquivo de pesos');
    });
  }

  return { head: 'MODEL', accent: 'HUB', comment: '// deploy and manage AI inference models', render, init };
})();
