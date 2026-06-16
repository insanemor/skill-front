# Tipografia — painel-ins

Tres familias, cada uma com um papel claro.

| Token | Familia | Papel |
|---|---|---|
| `--font-display` / `--font-heading` | **Orbitron** | titulos, numeros de destaque, marca |
| `--font-body` | **Inter** | texto corrido, paragrafos, UI geral |
| `--font-mono` | **JetBrains Mono** | labels, metadados, codigo, dados tecnicos |

## Carregar as fontes

Via Google Fonts (no `<head>` ou `@import` no CSS de entrada):

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
```

Body padrao: `font-body` (Inter). Defina no reset: `body { font-family: var(--font-body); }`.

## Convencoes de texto (a "voz" HUD)

Estas convencoes sao o que faz a interface parecer painel-ins:

- **Labels / metadados** → `font-mono`, MAIUSCULAS, `letter-spacing` largo
  (`tracking-wider`), tamanho pequeno (`text-xs`/`text-[10px]`), cor
  `muted-foreground`.
  Ex.: `ACTIVE PROCESSES`, `CPU 42% · MEM 67%`.

- **Subtitulos / dicas** → estilo comentario de codigo, `font-mono`,
  `muted-foreground`. Ex.: `// monitoring all systems · last sync 2s ago`.

- **Titulos de secao** → `font-display` (Orbitron), `font-bold`,
  `tracking-wide`, com **uma palavra em `primary` + glow**:
  ```
  COMMAND <span class="text-primary glow-text-green">CENTER</span>
  ```

- **Numeros de destaque (KPIs)** → `font-display`, `font-bold`, `text-2xl`+,
  na cor da categoria.

- **Tags de versao/status** → `font-mono`, minusculo, com separadores `//` ou
  `·`. Ex.: `v2.4.1 // ONLINE`.

## Escala sugerida

| Uso | Classe (Tailwind) |
|---|---|
| KPI / numero grande | `text-2xl md:text-3xl font-display font-bold` |
| Titulo de pagina | `text-xl md:text-2xl font-display font-bold tracking-wide` |
| Titulo de card | `text-sm font-display font-semibold` ou `text-base` |
| Corpo | `text-sm` (Inter) |
| Label/metadata | `text-xs font-mono uppercase tracking-wider` |
| Micro/metadata | `text-[10px] font-mono` |

## Acessibilidade

Orbitron e decorativa: use so em titulos/numeros curtos, nunca em paragrafos.
Mantenha contraste; `muted-foreground` so para texto realmente secundario.
