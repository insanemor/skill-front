# Layout — painel-ins

Estrutura padrao de aplicacao: **sidebar fixa + topbar + area de conteudo**,
sobre um fundo com texturas (grid + scanline) e matrix rain opcional.

## Shell da aplicacao

```
+--------------------------------------------------+
| [sidebar]  | [topbar ........................]   |
|  72/240px  |------------------------------------ |
|            | [main: padding 16/24px]             |
|            |   conteudo (grids de cards/widgets) |
+--------------------------------------------------+
```

Container raiz: `min-h-screen`, `bg-background`, classes de textura `grid-bg`
e `scanline`, `position: relative`. O conteudo principal recebe `margin-left`
igual a largura da sidebar e `z-index` acima das texturas.

- Sidebar colapsada: **72px**. Expandida: **240px**.
- Conteudo: `margin-left: 72px` no mobile, `240px` em `md+`. Transicao suave.
- Main: `padding: 16px` (mobile) / `24px` (`md+`).

## Sidebar

- `position: fixed`, `left:0 top:0`, `height: 100vh`, `z-index: 40`.
- Fundo `sidebar-background`, borda direita `sidebar-border`.
- **Topo (h-16):** logo num quadrado `44x44` `rounded-xl`, `bg-primary/10`,
  `border-primary/30`, com `glow-green`. Clicar no logo **alterna colapso**.
  Ao lado: nome da marca em `font-display` + tag `v2.4.1 // ONLINE` em mono.
- **Nav (flex-1):** lista de itens `rounded-lg`, gap 12px, padding `12px`.
  - Item normal: `text-muted-foreground`, hover → `text-primary` +
    `bg-primary/5` + glow leve.
  - Item ativo: `bg-primary/10 text-primary` + **barra indicadora** animada a
    esquerda (`layoutId` no framer-motion) + icone com `drop-shadow` verde.
  - Itens tem icone (lucide) + label; no colapsado, so o icone.
- **Rodape:** bloco de status do sistema (`bg-primary/5`, borda `/10`) com
  icone pulsando e metricas em mono (`CPU 42% · MEM 67%`).

## Topbar

- `height: 64px` (`h-16`), alinhada ao conteudo (apos a sidebar).
- Esquerda: busca (ou breadcrumb/titulo). Direita: chips de status + relogio.
- **Obrigatorio a direita (regra 7):** dropdown de **notificacoes** (sino com
  badge) e dropdown de **usuario** (avatar → editar perfil, preferencias, sair).
  Nunca entregar uma topbar sem esses dois. Anatomia em `references/components.md`.
- Mesma linguagem: fundo translucido, borda inferior `border`, texto mono.

## Grids de conteudo

Sempre responsivos, gap consistente de **16px** (`gap-4`):

| Bloco | Grid sugerido |
|---|---|
| Cards de KPI | `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` |
| Dois widgets lado a lado | `grid-cols-1 lg:grid-cols-2` |
| Principal + lateral | `grid-cols-1 lg:grid-cols-3` (principal `lg:col-span-2`) |

Espacamento vertical entre secoes: `space-y-6` (24px).

## Cabecalho de pagina (padrao)

```
<h2 font-display text-xl md:text-2xl font-bold tracking-wide>
  COMMAND <span text-primary glow-text-green>CENTER</span>
</h2>
<p text-sm font-mono text-muted-foreground>
  // monitoring all systems · last sync 2s ago
</p>
```

## Responsividade

- Mobile: sidebar colapsa para 72px (so icones); grids viram 1 coluna.
- Breakpoints padrao Tailwind (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
- A margem do conteudo acompanha a largura da sidebar.
