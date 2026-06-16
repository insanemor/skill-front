# Componentes — painel-ins (anatomia agnostica)

Descricoes de estrutura, nao de framework. Implementacao React+Tailwind de
referencia em `examples/react-tailwind/`. Base de componentes recomendada quando
houver: **shadcn/ui** (Radix) — combina perfeitamente com os tokens.

## Card (superficie base)

A unidade fundamental. Todo painel/widget e um card.

- Fundo `card`, borda `border` (ou `primary/20` p/ realce), `rounded-xl`,
  `padding 20px`, `overflow-hidden`, `position: relative`.
- Hover opcional: leve elevacao (`y: -2`) + glow + camada de cor surgindo.
- **Accent de canto** (assinatura visual): um quarto-de-circulo translucido no
  canto superior direito — `w-16 h-16`, cor `/10–/20`, `rounded-bl-[40px]`,
  `opacity-20`.

## Metric Card (KPI)

Card que mostra um numero-chave. Anatomia (de cima p/ baixo):

1. **Linha superior:** icone (lucide) numa caixa `p-2 rounded-lg` com
   `bg/border` da cor da categoria + indicador de variacao a direita
   (`↑`/`↓` `TrendingUp/Down` + `+12.4%`) em `font-mono text-xs`, verde p/
   alta, vermelho p/ baixa.
2. **Label:** `text-xs font-mono uppercase tracking-wider text-muted-foreground`.
3. **Valor:** `text-2xl font-display font-bold` na cor da categoria.
4. Accent de canto + glow no hover.

Recebe uma `color` (green/orange/blue/purple/yellow/red) e deriva 4 variacoes
via um `colorMap`: `{ bg: cor/10, border: cor/20, text: cor, glow: glow-cor }`.

## Item de navegacao (sidebar)

- Linha `rounded-lg`, `px-3 py-2.5`, icone + label.
- Estados: normal (`muted-foreground`), hover (`primary` + `bg-primary/5` +
  desloca `x:+4`), ativo (`bg-primary/10 text-primary` + barra indicadora a
  esquerda animada com `layoutId`).

## Topbar + dropdowns OBRIGATORIOS

A barra superior (sticky, `backdrop-blur`) tem busca a esquerda e, a direita,
chips de status + relogio e **sempre estes dois dropdowns** (regra 7 do
`SKILL.md` — nao podem faltar em nenhuma entrega):

**1. Menu do usuario** — gatilho = avatar (+ nome/role opcional + chevron que
gira ao abrir). Popover (`popover` ancorado a direita) com:
- Cabecalho com avatar maior + nome + email.
- Lista de itens (icone lucide + label): **Editar perfil**, **Configuracoes da
  conta**, **Preferencias**, **Atalhos de teclado**, separador, **Sair** (variante
  `danger`, hover vermelho).

**2. Dropdown de notificacoes** — gatilho = sino (`icon-btn`) com ponto de alerta
(`dot-badge`) quando ha nao-lidas. Popover com:
- Cabecalho: titulo "Notificacoes" + acao "marcar todas como lidas".
- Lista de itens: icone colorido por tipo (verde/azul/amarelo/vermelho) + titulo +
  texto + tempo ("2 min atras"); itens nao-lidos com fundo sutil `primary/5` e um
  ponto neon a esquerda. Clicar marca como lido e atualiza o badge.
- Rodape: "Ver todas as notificacoes".

Comportamento (ambos): abrir um fecha o outro; clique fora ou `Esc` fecham;
`aria-haspopup`/`aria-expanded` nos gatilhos. Implementacao viva em
`examples/html-css/` e `examples/html-css-app/` (classes `.popover`, `.user-btn`,
`.menu-flat`, `.notif-pop`, `.notif-item`, `.dot-badge`).

## Widget de grafico

- Card com cabecalho: titulo (`font-display`/`font-semibold`) + legenda/seletor.
- Grafico (recharts ou equivalente) usando series `chart-1..5`.
- Grid/eixos discretos (`border` com baixa opacidade); tooltip estilo popover.
- Variantes do modelo: barra, donut/pizza, radial gauge, scatter, funil,
  heatmap, linha "ao vivo" (atualiza periodicamente).

## Badge / tag de status

- `rounded-full` ou `rounded-md`, `px-2 py-0.5`, `text-xs font-mono`,
  `bg-<neon>/10 text-<neon> border border-<neon>/20`.
- Cor mapeia significado: verde=online, vermelho=offline, amarelo=pendente, etc.
- Opcional: ponto pulsando antes do texto para "ao vivo".

## Feed de atividade / log

- Lista densa, `font-mono`, `text-xs`/`text-sm`.
- Cada linha: timestamp (`muted-foreground`) + tag de nivel colorida + mensagem.
- Estilo terminal; bom com leve scanline e cursor piscando no fim.

## Botoes

- Primario: `bg-primary text-primary-foreground`, `rounded-lg`, hover com glow.
- Secundario/outline: `border-border`, `bg-transparent`, hover `bg-primary/5`.
- Altura confortavel (`h-12` em forms), `font-medium`.

## Formularios / inputs

- Input: fundo `input`, borda `border`, `rounded-lg`, foco com `ring`
  (`ring-primary`). Icone interno a esquerda em `muted-foreground`.
- Label em `font-medium` (ou mono uppercase p/ estilo HUD).

## Loading / estados

- Spinner: anel `border-primary/20` com topo `border-t-primary`, girando.
- Texto de loading em `font-mono text-primary animate-pulse`:
  `INITIALIZING SYSTEMS...`.
- Skeletons em `bg-muted` com `animate-pulse`.

## Regras transversais

- Cantos: cards `rounded-xl`, controles `rounded-lg`, tags `rounded-full`.
- Bordas sempre de baixa opacidade da cor (`/10`–`/30`), nunca cinza solido.
- Icones: biblioteca **lucide** (line icons), tamanho `w-4/w-5`.
- Todo estado ativo/hover ganha um toque de `primary` + glow sutil.
