# skill-front

Repositorio que abriga a **skill `painel-ins`** para Claude Code — uma
**linguagem visual reutilizavel** no estilo _"command center"_ (dashboard
cyberpunk: fundo near-black, neon verde dominante, estetica HUD/terminal e
microanimacoes).

![Preview painel-ins](.claude/skills/painel-ins/examples/html-css/screenshot.png)

## Objetivo

Padronizar a aparencia de qualquer front-end — dashboard, painel, tela de admin
ou landing — atraves de **regras + tokens** independentes de tecnologia, em vez
de recriar o estilo do zero a cada projeto.

A skill nao e um componente nem um tema preso a um framework: e a **fonte da
verdade** do design (cores, tipografia, layout, efeitos, motion e anatomia de
componentes). O codigo de cada stack (React/Tailwind, Vue, Svelte, HTML+CSS, PHP,
Django templates...) e **derivado** desses tokens. Quando ha Tailwind, mapeiam-se
os tokens no `theme`; quando nao ha, importa-se `assets/tokens.css`.

## Como usar

A skill e ativada automaticamente pelo Claude Code ao criar/estilizar/revisar um
front-end que deva seguir esse modelo, ou manualmente via:

```
/painel-ins crie um dashboard de monitoramento de nos
```

O fluxo que a skill aplica: detecta o stack → instala os tokens → carrega as 3
fontes → aplica efeitos globais → monta componentes pela anatomia de referencia →
anima de forma discreta. Detalhes em [`docs/painel-ins.md`](docs/painel-ins.md).

## O DNA em 10 segundos

- Fundo **near-black azulado** (`hsl(220 20% 4%)`), nunca branco.
- **Uma** neon dominante: **verde** `hsl(150 100% 45%)`. Outras (roxo, ciano,
  laranja, amarelo, vermelho) entram so com significado semantico.
- Voz **HUD/terminal**: metadados em mono MAIUSCULO `tracking-wider`, subtitulos
  `// comentario`, titulos em Orbitron com palavra em neon.
- **Glow** sutil, texturas de **grid** + **scanline**, microanimacoes curtas
  (0.2–0.5s) que respeitam `prefers-reduced-motion`.

## Estrutura

```
.claude/skills/painel-ins/
├── SKILL.md                 # entrada: DNA, regras, workflow, indice
├── assets/                  # fonte da verdade dos tokens
│   ├── tokens.css           #   CSS variables (qualquer stack)
│   └── tokens.json          #   os mesmos tokens em JSON
├── references/              # o "porque" + especificacoes (carregadas sob demanda)
│   ├── design-principles.md
│   ├── color-tokens.md
│   ├── typography.md
│   ├── layout.md
│   ├── components.md
│   ├── motion.md
│   └── effects.md
└── examples/
    ├── html-css/            # dashboard completo autocontido (sem build) + 3 screenshots
    ├── html-css-app/        # SPA rodavel: reproducao das 9 telas (roteamento + animacoes)
    ├── react-tailwind/      # implementacao de referencia (MetricCard, Sidebar, AppLayout)
    └── reference-app/       # galeria de 9 telas do app original (catalogo visual completo)
```

## Exemplo vivo

O exemplo [`examples/html-css/`](.claude/skills/painel-ins/examples/html-css/)
e um **dashboard completo, autocontido e sem build** (HTML+CSS+JS vanilla) que
valida a skill e serve de espelho ao montar telas novas. Cobre todos os pilares e
um catalogo amplo de componentes — tabela de dados, radial gauges, alertas,
formulario completo, tabs, overlays e modal/dialog. Veja a galeria de prints na
[documentacao](docs/painel-ins.md#5-galeria-de-componentes).

Alem disso, a [galeria do app de referencia](.claude/skills/painel-ins/examples/reference-app/)
(9 telas: Dashboard, Analytics, Logs, Data Grid, Systems, Model Hub, Docs, Kanban,
Settings) e o catalogo visual mais amplo — todos os campos, componentes, graficos
e animacoes de entrada/troca de tela.

```bash
# a partir de .claude/skills/painel-ins/
python3 -m http.server 4321
# abra http://127.0.0.1:4321/examples/html-css/
```

## Documentacao

Visao geral completa, principios, tabela de tokens e galeria de componentes em
**[`docs/painel-ins.md`](docs/painel-ins.md)**.
