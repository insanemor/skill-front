# Efeitos visuais — painel-ins

As texturas e brilhos que dao a identidade "command center". Copie estas
utilidades para o CSS global do projeto (ou adapte para o stack).

## Glow (box-shadow neon)

Brilho ao redor de elementos ativos/em foco. Uma classe por cor:

```css
.glow-green  { box-shadow: 0 0 15px hsl(150 100% 45% / 0.3), 0 0 30px hsl(150 100% 45% / 0.1); }
.glow-orange { box-shadow: 0 0 15px hsl(25 100% 55% / 0.3),  0 0 30px hsl(25 100% 55% / 0.1); }
.glow-blue   { box-shadow: 0 0 15px hsl(190 100% 50% / 0.3), 0 0 30px hsl(190 100% 50% / 0.1); }
.glow-purple { box-shadow: 0 0 15px hsl(260 100% 65% / 0.3), 0 0 30px hsl(260 100% 65% / 0.1); }
```

## Glow de texto

```css
.glow-text-green { text-shadow: 0 0 10px hsl(150 100% 45% / 0.6), 0 0 20px hsl(150 100% 45% / 0.3); }
.glow-text-orange{ text-shadow: 0 0 10px hsl(25 100% 55% / 0.6),  0 0 20px hsl(25 100% 55% / 0.3); }
.glow-text-blue  { text-shadow: 0 0 10px hsl(190 100% 50% / 0.6), 0 0 20px hsl(190 100% 50% / 0.3); }
```
Use em palavras-chave de titulos (`<span class="text-primary glow-text-green">`).

## Grid de fundo

Grade tecnica sutil no container raiz:

```css
.grid-bg {
  background-image:
    linear-gradient(hsl(150 100% 45% / 0.03) 1px, transparent 1px),
    linear-gradient(90deg, hsl(150 100% 45% / 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

## Scanline (linhas de varredura)

Sobreposicao de linhas horizontais, estilo monitor CRT. Aplicar via `::after`
num container `position: relative`:

```css
.scanline::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent, transparent 2px,
    hsl(150 100% 45% / 0.02) 2px,
    hsl(150 100% 45% / 0.02) 4px
  );
  pointer-events: none;
}
```

## Matrix rain (opcional, de fundo)

Queda continua de caracteres atras do conteudo. Keyframe base:

```css
@keyframes matrix-fall {
  0%   { transform: translateY(-100%); opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
```
Renderize colunas de caracteres (canvas ou divs absolutas) com cor
`hsl(150 100% 45%)` e baixa opacidade, atras de tudo (`z-index` baixo,
`pointer-events: none`). Desligue em `prefers-reduced-motion`.

## Pulso de borda

```css
@keyframes pulse-border {
  0%, 100% { border-color: hsl(150 100% 45% / 0.2); }
  50%      { border-color: hsl(150 100% 45% / 0.6); }
}
.animate-pulse-border { animation: pulse-border 2s ease-in-out infinite; }
```

## Cursor piscando (terminal)

```css
@keyframes blink-cursor { 0%,50% { opacity:1 } 51%,100% { opacity:0 } }
.cursor-blink::after {
  content: '\2588';                 /* bloco solido */
  animation: blink-cursor 1s step-end infinite;
  color: hsl(150 100% 45%);
}
```

## Scrollbar custom

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: hsl(220 20% 6%); }
::-webkit-scrollbar-thumb { background: hsl(150 100% 20%); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: hsl(150 100% 30%); }
```

## Como combinar

- Container raiz da app: `grid-bg` + `scanline` + (opcional) matrix rain.
- Logo / item ativo / KPI em foco: `glow-*` correspondente.
- Palavra-chave de titulo: `glow-text-*`.
- Use com moderacao: glow demais polui. Em geral 1 glow por area de atencao.
