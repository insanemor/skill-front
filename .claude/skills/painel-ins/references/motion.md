# Movimento — painel-ins

Animacao **curta e sutil**. Sinaliza vida e hierarquia, nunca distrai.
Biblioteca de referencia: **framer-motion** (React); o mesmo se reproduz com
CSS transitions/keyframes em qualquer stack.

## Duracoes e easings

| Token | Valor | Uso |
|---|---|---|
| fast | `0.2s` | hover de cor, micro-feedback |
| base | `0.3s` | colapso de sidebar, transicoes de estado |
| page | `0.4s` | entrada de conteudo de pagina |
| slow | `0.5s` | entrada de cards/KPIs |

Easing: `easeOut` para entradas; `easeInOut` para transicoes reversiveis
(colapso, toggle).

## Padroes canonicos

**Entrada de pagina** (main):
```
initial: { opacity: 0, y: 10 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4, ease: easeOut }
```

**Entrada de cards com stagger** (lista de KPIs):
```
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { delay: index * 0.1, duration: 0.5 }
```

**Transicao entre telas** (troca de rota): a cada navegacao, a tela que entra
re-dispara a entrada de pagina e seus blocos chegam em stagger. Observado no app
de referencia: o **titulo entra primeiro**, depois os cards (fade + `y` para
cima, `delay` por indice). Em React, dê um `key={rota}` ao container da pagina
(com `AnimatePresence`) para o mount re-animar a cada troca:
```
<AnimatePresence mode="wait">
  <motion.main key={pathname}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: easeOut }}>
    {/* filhos com stagger via delay: index * 0.08 */}
  </motion.main>
</AnimatePresence>
```
Sem framer-motion: aplique uma classe de entrada (`@keyframes` fade+translateY)
ao montar a tela e escalone com `animation-delay: calc(var(--i) * 0.08s)`.

**Hover de card:** `y: -2` + box-shadow glow, `duration 0.2`.

**Tap:** `scale: 0.97` (botoes, itens clicaveis).

**Sidebar colapsar:** anima `width` 72↔240, `duration 0.3 easeInOut`.
Labels entram/saem com `opacity` (`AnimatePresence`).

**Item de nav ativo:** barra indicadora compartilhada com `layoutId`
(transicao fluida entre itens).

**Nav hover:** desloca `x: +4`.

## Animacoes "vivas" (ambiente)

- **Matrix rain** de fundo (queda continua de caracteres) — ver `effects.md`.
- **Pulso** em icones de status (`animate-pulse`).
- **Cursor piscando** em texto estilo terminal.
- **Grafico ao vivo**: atualiza dados em intervalo (ex.: a cada 1–2s) com
  transicao suave da linha.
- **pulse-border**: borda que pulsa entre `primary/0.2` e `primary/0.6`.

## Acessibilidade (obrigatorio)

Sempre respeitar reducao de movimento:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
Desative matrix rain / pulsos continuos quando `prefers-reduced-motion`.
