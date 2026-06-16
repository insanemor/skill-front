# Cores e tokens — painel-ins

Todas as cores sao **tokens semanticos** em HSL (`H S% L%`), pensados para compor
com alpha: `hsl(var(--primary) / 0.1)`. Valores canonicos em `assets/tokens.css`
e `assets/tokens.json`.

## Regra de ouro

> Nunca escreva um hex/rgb no markup ou no componente. Refira sempre o token.
> Hex so existe dentro do arquivo de tokens.

## Tokens semanticos e quando usar

| Token | Valor (HSL) | Usar para |
|---|---|---|
| `background` | `220 20% 4%` | fundo da pagina |
| `foreground` | `150 100% 90%` | texto principal |
| `card` | `220 20% 7%` | superficie de cards/paineis |
| `popover` | `220 20% 6%` | menus, dropdowns, tooltips |
| `primary` | `150 100% 45%` | acao principal, item ativo, marca (VERDE) |
| `secondary` | `260 100% 65%` | acao/realce secundario (roxo) |
| `accent` | `150 60% 40%` | realce sutil, hover de superficie |
| `destructive` | `0 85% 55%` | erro, exclusao, queda |
| `muted` | `220 15% 12%` | fundos discretos, chips |
| `muted-foreground` | `150 20% 55%` | texto secundario, legendas |
| `border` | `150 40% 12%` | bordas (use com alpha p/ mais sutileza) |
| `input` | `220 15% 14%` | fundo de campos |
| `ring` | `150 100% 45%` | anel de foco |

`radius` = `0.5rem` (cards `rounded-xl`, controles `rounded-lg`).

## Convencao de opacidade (muito importante)

O visual depende de **camadas translucidas** da cor de marca:

- Fundo de elemento ativo/realce: `primary / 0.05` a `primary / 0.10`
- Borda neon: `primary / 0.10` a `primary / 0.30`
- Glow hover: ver `references/effects.md`
- Texto/icone ativo: `primary` cheio

Exemplo (Tailwind): `bg-primary/10 border border-primary/30 text-primary`.

## Series de grafico

Use **nesta ordem** para multiplas series; sao distinguiveis e on-brand:

1. `chart-1` verde `150 100% 45%`
2. `chart-2` ciano `190 100% 50%`
3. `chart-3` roxo `260 100% 65%`
4. `chart-4` amarelo `45 100% 55%`
5. `chart-5` vermelho `0 85% 55%`

## Paleta neon (acentos categoricos)

Para tags, status e cores de categoria. Cada uma carrega um significado:

| Nome | HEX | Significado tipico |
|---|---|---|
| green `#00e676` | sucesso, ativo, online |
| orange `#ff8c1a` | alerta, destaque secundario, energia |
| blue `#00bcd4` | informacao, rede, dados |
| purple `#b388ff` | IA/modelo, categoria especial |
| yellow `#ffd740` | atencao, pendente |
| red `#ff5252` | erro, offline, queda |

Padrao de uso em card colorido (ver `MetricCard`): para cada cor, derive 4
variacoes — `bg` (`/10`), `border` (`/20`), `text` (cheio), `glow`.

## Sidebar (tokens dedicados)

A sidebar e levemente mais escura que o fundo (`sidebar-background 220 20% 5%`)
e tem foreground proprio mais suave (`sidebar-foreground 150 60% 70%`). Item
ativo usa `sidebar-primary`/`primary`.
