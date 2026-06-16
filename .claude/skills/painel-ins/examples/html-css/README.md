# Exemplo de referencia — HTML + CSS + JS (sem build)

Demonstracao **completa e autocontida** da linguagem visual painel-ins, sem
framework nem etapa de build. Serve como validacao viva da skill e como
referencia de implementacao para qualquer stack agnostico (HTML puro, PHP,
Django templates, etc.).

![Preview do dashboard](screenshot.png)

## Galeria de componentes

Catalogo vivo de **todos os tipos de campo e componente** ja estilizados — use
como espelho ao montar telas novas (copie a anatomia, nao reinvente cores/efeitos).

**Kitchen-sink** — tabela de dados (badges de status, barras de carga), radial
gauges (CPU/Memory/Network), alertas inline (sucesso/info/aviso/erro), formulario
completo (text fields com validacao, checkbox, radio, toggle, segmented control,
range, tags), tabs e overlays (toasts, tooltip, dropdown, progress bars):

![Galeria de componentes](screenshot-components.png)

**Modal / dialog** com backdrop semitransparente (overlay desfocado, foco no card):

![Modal com backdrop](screenshot-modal.png)

## Arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | Shell da app: sidebar + topbar + 6 secoes de componentes. Icones SVG inline (estilo lucide), zero dependencia. |
| `styles.css` | Efeitos (grid-bg, scanline, glow, scrollbar, animacoes) + todos os componentes. **Toda cor via `hsl(var(--token) / alpha)`** — nenhum hex no arquivo. |
| `app.js` | Interatividade e animacoes vivas. As cores do canvas/matrix sao **lidas das CSS variables** (tokens continuam a fonte da verdade). |

Os **tokens** nao sao duplicados aqui: `index.html` importa
`../../assets/tokens.css` (a fonte da verdade da skill). Isso ilustra o passo 2
do workflow para stacks nao-Tailwind: *"importe `assets/tokens.css`"*.

## Como rodar

Por causa do import relativo dos tokens (`../../assets/tokens.css`), sirva a
partir da **raiz da skill** (ou abra `index.html` direto via `file://`):

```bash
# a partir de .claude/skills/painel-ins/
python3 -m http.server 4321
# abra http://127.0.0.1:4321/examples/html-css/
```

As 3 fontes (Orbitron, Inter, JetBrains Mono) vem do Google Fonts via `@import`
no topo de `styles.css` — requer acesso a internet na primeira carga.

## O que o exemplo cobre (checklist da skill)

- **Tokens semanticos, zero hex no markup** — hex so vive em `assets/tokens.css`.
- **Verde dominante** + neon por categoria (azul, roxo, amarelo, laranja, vermelho).
- **3 fontes** com papeis distintos (display / corpo / mono).
- **Voz HUD** — titulo com palavra em neon, subtitulos `// comentario`, labels
  MAIUSCULAS `tracking-wider`, tag `v2.4.1 // ONLINE`, cursor piscando no log.
- **Efeitos** — `grid-bg` 40px, `scanline`, glow neon, matrix rain de fundo,
  scrollbar custom, pulse em status.
- **Layout shell** — sidebar colapsavel (clique no logo: 240↔72px) com barra
  indicadora no item ativo + status no rodape; topbar sticky.
- **Componentes** — metric cards (accent de canto + glow no hover), grafico de
  linha ao vivo, donut, barras, feed/log streaming, badges, botoes, spinner +
  skeleton; **tabela de dados** com status; **radial gauges**; **alertas inline**
  (4 variantes); **formulario completo** (text/email/password com validacao,
  checkbox, radio, toggle, segmented control, range, tags, select, textarea,
  read-only); **tabs**; **overlays** — toasts, tooltip, dropdown, progress bars e
  **modal/dialog com backdrop semitransparente**.
- **Microanimacoes** — entrada de pagina (fade+translate), KPIs com stagger,
  hover `y:-2`, tap `scale .97`, barras animando a altura.
- **Acessibilidade** — `prefers-reduced-motion` desliga matrix/pulsos/streaming
  e zera as transicoes.

## Como regenerar os screenshots

Gera os tres de uma vez (`screenshot.png` = hero/full page, `screenshot-components.png`
= recorte da galeria de componentes, `screenshot-modal.png` = modal aberto):

Truque-chave: para o **bg fixo** (grid/scanline/matrix) renderizar ao longo de
toda a pagina, redimensione o viewport para a altura total ANTES dos clips do
hero e da galeria. O modal usa uma **pagina separada** num viewport normal (900px)
para ficar centralizado sobre o backdrop.

```bash
# requer: npm i playwright && npx playwright install chromium
node - <<'EOF'
const { chromium } = require('playwright');
const DIR = __dirname;                   // .../examples/html-css
(async () => {
  const b = await chromium.launch();

  // 1) hero + galeria — viewport alto comporta tudo (bg fixo renderiza certo)
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await p.goto('file://' + DIR + '/index.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const fullH = await p.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await p.setViewportSize({ width: 1440, height: fullH });
  await p.evaluate(() => window.dispatchEvent(new Event('resize')));  // re-tamanha matrix
  await p.waitForTimeout(2600);          // fontes + stagger + barras/gauges + frames

  await p.screenshot({ path: DIR + '/screenshot.png', clip: { x: 0, y: 0, width: 1440, height: 1640 } });

  const box = await p.evaluate(() => {
    const top = document.querySelector('.group-label').getBoundingClientRect().top;
    const bot = document.querySelector('footer').getBoundingClientRect().bottom;
    return { top: Math.max(0, top - 20), height: Math.ceil(bot - top + 40) };
  });
  await p.screenshot({ path: DIR + '/screenshot-components.png', clip: { x: 0, y: box.top, width: 1440, height: box.height } });

  // 2) modal aberto — pagina separada em viewport normal
  const p2 = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await p2.goto('file://' + DIR + '/index.html', { waitUntil: 'networkidle' });
  await p2.evaluate(() => document.fonts.ready);
  await p2.waitForTimeout(1500);
  await p2.click('#openDialog');
  await p2.waitForTimeout(600);
  await p2.screenshot({ path: DIR + '/screenshot-modal.png' });

  await b.close();
})();
EOF
```
