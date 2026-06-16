# Principios de design — painel-ins

O "porque" por tras das regras. Use isto para decidir em casos nao cobertos
pelos outros arquivos.

## 1. Dark-first, near-black azulado

O fundo nunca e preto puro nem branco: e `hsl(220 20% 4%)` — um quase-preto com
leve viés azul-frio. Tudo o mais (cards, popovers, sidebar) sao variacoes
proximas em luminosidade (4%–12%), criando profundidade por camadas sutis, nao
por bordas grossas. Sombra e separacao vem de **borda neon de baixa opacidade**
e de **glow**, nao de linhas cinza solidas.

## 2. Um neon manda na tela

Verde `hsl(150 100% 45%)` e a identidade. Ele marca o que esta **ativo, vivo,
selecionado ou e a acao principal**. As outras neon (roxo, ciano, laranja,
amarelo, vermelho) sao **semanticas/categoricas** — cada uma significa algo
(uma serie de grafico, um tipo de status) — nunca decoracao gratuita. Se uma
tela tem 5 cores brilhando sem razao, esta errada.

## 3. Estetica HUD / terminal

A interface se parece com um painel de controle de ficcao cientifica:
- Metadados e numeros em **fonte monoespacada, MAIUSCULAS, com `tracking-wider`**.
- Subtitulos e dicas no estilo comentario de codigo: `// monitorando sistemas`.
- Rotulos de versao/status: `v2.4.1 // ONLINE`, `CPU 42% · MEM 67%`.
- Titulos com uma palavra destacada em neon + glow: `COMMAND` + `CENTER`(verde).
Isso comunica "tecnico, em tempo real, sob controle".

## 4. Densidade com respiro

Muita informacao por tela (cards de metrica, varios graficos, feeds), mas
organizada em **grids responsivos** com gaps consistentes (16px). Cada bloco e
um `card` com padding generoso (20px) e cantos arredondados. Densidade != bagunça.

## 5. Movimento como sinal de vida

O painel "respira": graficos ao vivo, pulsos, cursor piscando, matrix rain de
fundo, entradas com fade. Tudo **curto e sutil** (0.2–0.5s). Animacao serve para
indicar atualidade e hierarquia (o que entrou, o que esta ativo), nunca para
espetaculo. Respeite `prefers-reduced-motion`.

## 6. Glow é verniz, não estrutura

Glow (box-shadow/text-shadow neon) realca foco e estado ativo. Mas legibilidade
e layout precisam funcionar **sem** o glow. Nunca use glow como unica pista de
um estado nem para criar contraste de texto.

## Checklist rapido (a tela "parece painel-ins"?)

- [ ] Fundo near-black, sem branco.
- [ ] Verde neon como destaque principal e coerente.
- [ ] Numeros/labels em mono maiusculo; titulos em Orbitron.
- [ ] Cards com borda neon `/10–/30` e cantos arredondados.
- [ ] Pelo menos uma textura de fundo (grid e/ou scanline).
- [ ] Microanimacoes de entrada e hover discretas.
- [ ] Cada cor extra tem significado.
