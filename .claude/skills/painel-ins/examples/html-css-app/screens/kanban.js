/* Tela: Task Kanban (Command Center) — board com 4 colunas e drag-and-drop nativo */
window.Screens.kanban = (function () {
  const svg = (p) => App.svg(p);
  const ICONS = {
    plus: '<path d="M5 12h14M12 5v14"/>',
    cal: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  };

  /* colunas: id, titulo, cor do dot (token) */
  const COLS = [
    { id: 'todo', title: 'TO DO', c: '--neon-blue' },
    { id: 'doing', title: 'IN PROGRESS', c: '--neon-yellow' },
    { id: 'review', title: 'REVIEW', c: '--neon-purple' },
    { id: 'done', title: 'DONE', c: '--neon-green' },
  ];

  /* 10 tarefas distribuidas entre as colunas (fiel ao print) */
  const CARDS = {
    todo: [
      { id: 'TSK-104', prio: 'high', title: 'Otimizar pipeline de dados', desc: 'Reduzir latencia do pipeline ETL em 40%.', tags: ['backend', 'infra'], date: '2026-06-20', n: 3 },
      { id: 'TSK-097', prio: 'mid', title: 'Implementar autenticacao SSO', desc: 'Integrar OAuth com Google e GitHub.', tags: ['backend'], date: '2026-06-22', n: 2 },
      { id: 'TSK-110', prio: 'low', title: 'Atualizar documentacao API', desc: 'Revisar endpoints v2 e adicionar exemplos.', tags: ['ux'], date: '2026-06-25', n: 1 },
    ],
    doing: [
      { id: 'TSK-088', prio: 'high', title: 'Corrigir race condition', desc: 'Sessoes concorrentes causam deadlock no cache.', tags: ['backend', 'critical'], date: '2026-06-18', n: 5 },
      { id: 'TSK-091', prio: 'mid', title: 'Dashboard em tempo real', desc: 'WebSocket + 12k req/s metricas ao vivo.', tags: ['frontend'], date: '2026-06-21', n: 4 },
      { id: 'TSK-079', prio: 'mid', title: 'Testes de carga', desc: 'Simular 50k usuarios simultaneos com k6.', tags: ['infra', 'testing'], date: '2026-06-24', n: 2 },
    ],
    review: [
      { id: 'TSK-072', prio: 'high', title: 'Refatorar modulo de cache', desc: 'Migrar de Redis simples para cluster com sentinel.', tags: ['backend', 'infra'], date: '2026-06-17', n: 6 },
      { id: 'TSK-068', prio: 'low', title: 'Nova landing page', desc: 'Rebranding com hero cyberpunk e animacoes.', tags: ['frontend', 'ux'], date: '2026-06-19', n: 3 },
    ],
    done: [
      { id: 'TSK-061', prio: 'high', title: 'Setup CI/CD pipeline', desc: 'GitHub Actions com deploy automatico.', tags: ['infra'], date: '2026-06-12', n: 8 },
      { id: 'TSK-055', prio: 'mid', title: 'Modelo de predicao v1', desc: 'Regressao linear para previsao de carga.', tags: ['ml'], date: '2026-06-10', n: 4 },
    ],
  };

  const PRIO_LABEL = { high: 'ALTA', mid: 'MEDIA', low: 'BAIXA' };

  function cardHTML(c) {
    return `
      <div class="kb-card" draggable="true" data-id="${c.id}">
        <div class="kc-top">
          <span class="prio ${c.prio}">${PRIO_LABEL[c.prio]}</span>
          <span class="label">${c.id}</span>
        </div>
        <p class="kc-title">${c.title}</p>
        <p class="kc-desc">${c.desc}</p>
        <div class="kc-tags">${c.tags.map((t) => `<span class="kc-tag">${t}</span>`).join('')}</div>
        <div class="kc-foot">
          <span class="meta">${svg(ICONS.cal)}${c.date}</span>
          <span class="meta">${svg(ICONS.msg)}${c.n}</span>
        </div>
      </div>`;
  }

  function render() {
    return `
    <section class="section">
      <div class="card-head" style="margin-bottom:18px">
        <p class="card-sub">// quadro de tarefas · 10 itens ativos</p>
        <button class="btn btn-primary" id="kbNew">${svg(ICONS.plus)}Nova Tarefa</button>
      </div>

      <div class="kanban">${COLS.map((col) => `
        <div class="kb-col" data-col="${col.id}">
          <div class="kb-head">
            <span class="kb-title" style="--c:var(${col.c})"><span class="kb-dot"></span>${col.title}</span>
            <span class="kb-count">${CARDS[col.id].length}</span>
          </div>
          <div class="kb-list" data-col="${col.id}">${CARDS[col.id].map(cardHTML).join('')}</div>
        </div>`).join('')}
      </div>
    </section>`;
  }

  function init(view) {
    let dragged = null;
    let newSeq = 200;

    /* recalcula os contadores de cada coluna a partir do DOM */
    function refreshCounts() {
      view.querySelectorAll('.kb-col').forEach((col) => {
        const list = col.querySelector('.kb-list');
        const count = col.querySelector('.kb-count');
        if (list && count) count.textContent = list.children.length;
      });
    }

    /* habilita drag em um card (usado tambem nos cards criados depois) */
    function wireCard(card) {
      card.addEventListener('dragstart', () => {
        dragged = card;
        requestAnimationFrame(() => card.classList.add('dragging'));
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        dragged = null;
      });
    }

    view.querySelectorAll('.kb-card').forEach(wireCard);

    /* cada lista aceita o drop */
    view.querySelectorAll('.kb-list').forEach((list) => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!dragged) return;
        const after = afterElement(list, e.clientY);
        if (after == null) list.appendChild(dragged);
        else list.insertBefore(dragged, after);
      });
      list.addEventListener('drop', (e) => {
        e.preventDefault();
        refreshCounts();
      });
    });

    /* descobre o card sob o cursor para inserir na posicao certa */
    function afterElement(list, y) {
      const cards = [...list.querySelectorAll('.kb-card:not(.dragging)')];
      let closest = { dist: Number.NEGATIVE_INFINITY, el: null };
      for (const card of cards) {
        const box = card.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.dist) closest = { dist: offset, el: card };
      }
      return closest.el;
    }

    /* botao Nova Tarefa: adiciona um card simples em TO DO */
    const btn = view.querySelector('#kbNew');
    if (btn) btn.addEventListener('click', () => {
      const id = 'TSK-' + (++newSeq);
      const card = {
        id, prio: 'low', title: 'Nova tarefa', desc: 'Detalhe a tarefa e arraste para a coluna certa.',
        tags: ['backend'], date: '2026-06-30', n: 0,
      };
      const list = view.querySelector('.kb-list[data-col="todo"]');
      const tmp = document.createElement('div');
      tmp.innerHTML = cardHTML(card).trim();
      const el = tmp.firstChild;
      list.appendChild(el);
      wireCard(el);
      refreshCounts();
      App.toast('success', 'Tarefa criada', `${id} adicionada em TO DO`);
    });
  }

  return {
    head: 'TASK',
    accent: 'KANBAN',
    comment: '// arraste os cartoes entre colunas · 10 tarefas',
    render,
    init,
  };
})();
