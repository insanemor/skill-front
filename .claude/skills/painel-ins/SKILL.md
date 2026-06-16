---
name: painel-ins
description: >-
  Linguagem visual "command center" (dashboard cyberpunk: dark near-black, neon
  verde dominante, HUD/terminal, microanimacoes). Use ao criar, estilizar ou
  revisar QUALQUER front-end, dashboard, painel, tela de admin ou landing que
  deva seguir esse modelo visual. Fornece tokens de cor, tipografia, layout,
  efeitos (glow/scanline/grid) e padroes de componente de forma agnostica de
  tecnologia (React, Vue, Svelte, HTML+CSS). Acione tambem via /painel-ins.
---

# painel-ins — linguagem visual "command center"

Modelo de design reutilizavel, **independente de tecnologia**. O nucleo sao
**regras + tokens**; o codigo de cada stack e derivado dessas regras. Ao aplicar,
detecte o stack do projeto e use o mecanismo nativo dele (CSS variables, theme do
Tailwind, styled-components, etc.). Se nao houver, copie `assets/tokens.css`.

## DNA do visual (resumo de 10s)

- Fundo **near-black azulado** (`hsl(220 20% 4%)`), nunca branco.
- **Uma** cor neon dominante: **verde** `hsl(150 100% 45%)`. Acentos: roxo, ciano, laranja, amarelo, vermelho — usados com parcimonia.
- Estetica **HUD / terminal**: textos tecnicos em fonte monoespacada, MAIUSCULAS, `tracking-wider`, subtitulos no estilo `// comentario`.
- Tipografia de destaque **Orbitron** (display), corpo **Inter**, dados/labels **JetBrains Mono**.
- **Glow** sutil (box-shadow e text-shadow neon) em elementos ativos/hover.
- Texturas de fundo discretas: **grid** 40px e **scanline**.
- Microanimacoes curtas (0.3–0.5s), entradas com fade + leve translate, stagger por indice.
- Cantos arredondados (`radius 0.5rem`), bordas neon de baixa opacidade (`/10`–`/30`).

**Como deve parecer** (referencia visual de um dashboard completo aplicando o modelo):

![Preview painel-ins](examples/html-css/screenshot.png)

> Exemplo vivo e autocontido (HTML+CSS+JS, sem build) em `examples/html-css/` — use como espelho ao montar telas novas.

## Regras inegociaveis

1. **Cor sempre via token semantico** (`primary`, `card`, `border`…), nunca hex solto no markup. Hex so vive no arquivo de tokens.
2. **Um destaque por tela.** Verde domina; outras neon entram como exceca/categoria, nao como decoracao aleatoria.
3. **Contraste alto** texto sobre fundo escuro; texto secundario usa `muted-foreground`.
4. **Glow e efeito, nao estrutura** — nunca dependa de glow para legibilidade.
5. **Labels e metadados** em `font-mono uppercase tracking-wider`; titulos em `font-display`.
6. **Animacao discreta** — se distrair, esta errado. Respeite `prefers-reduced-motion`.

## Como aplicar (workflow)

1. Identifique o stack-alvo do projeto.
2. Instale os tokens: Tailwind → mapeie no `theme.extend.colors` apontando para CSS vars (ver `examples/react-tailwind/theme-setup.md`); outros → importe `assets/tokens.css`.
3. Carregue as 3 fontes (Orbitron, Inter, JetBrains Mono) — ver `references/typography.md`.
4. Aplique efeitos globais (`grid-bg`, `scanline`, scrollbar) no container raiz — ver `references/effects.md`.
5. Monte componentes seguindo a anatomia de `references/components.md`.
6. Anime conforme `references/motion.md`.

## Indice de referencias (carregue sob demanda)

- `references/design-principles.md` — filosofia visual e o "porque".
- `references/color-tokens.md` — paleta semantica + valores exatos + quando usar cada cor.
- `references/typography.md` — fontes, escala, convencoes de texto.
- `references/layout.md` — sidebar, topbar, grids, espacamentos.
- `references/components.md` — anatomia agnostica dos padroes (metric card, widget de grafico, nav item…).
- `references/motion.md` — duracoes, easings, padroes de animacao.
- `references/effects.md` — glow, scanline, grid-bg, matrix rain, pulse, scrollbar.

## Tokens e exemplos

- `assets/tokens.css` — CSS variables puras (fonte da verdade, agnostica).
- `assets/tokens.json` — os mesmos tokens em JSON (consumivel por qualquer build).
- `examples/react-tailwind/` — implementacao de referencia (MetricCard, Sidebar, AppLayout + setup).
- `examples/html-css/` — **dashboard completo, autocontido e sem build** (HTML+CSS+JS vanilla) com 3 screenshots (hero, galeria de componentes, modal). Cobre todos os pilares (tokens, 3 fontes, layout shell, efeitos, microanimacoes, reduced-motion) + **catalogo de componentes**: tabela de dados, radial gauges, alertas inline, formulario completo (todos os tipos de campo), tabs, toasts, tooltip, dropdown, progress bars e modal/dialog com backdrop. Melhor ponto de partida quando NAO ha framework; ver `examples/html-css/README.md`.
- `examples/reference-app/` — **galeria de 9 telas** do app onde a skill foi prototipada (NEXUS.AI / NEURAL COMMAND): Dashboard, Analytics, Logs, Data Grid, Systems, Model Hub, Docs, Kanban, Settings. Catalogo visual mais amplo (todos os campos/componentes/graficos por tela) + notas de animacao de entrada e troca de tela; ver `examples/reference-app/README.md`.
