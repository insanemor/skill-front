#!/usr/bin/env node
'use strict';

/* Instalador da skill painel-ins para Claude Code.
 * Copia .claude/skills/painel-ins para o .claude/skills do projeto (padrao) ou
 * global do usuario (--global). Sem dependencias externas. */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILL = 'painel-ins';
const SRC = path.join(__dirname, '..', '.claude', 'skills', SKILL);
const pkg = require('../package.json');

/* ---------- cores (gated em TTY) ---------- */
const TTY = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code) => (s) => (TTY ? `[${code}m${s}[0m` : s);
const green = c('38;5;48');
const dim = c('2');
const bold = c('1');
const red = c('31');
const yellow = c('33');

/* ---------- args ---------- */
function parseArgs(argv) {
  const o = { global: false, force: false, dir: null, help: false, version: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--global' || a === '-g') o.global = true;
    else if (a === '--local' || a === '-l') o.global = false;
    else if (a === '--force' || a === '-f') o.force = true;
    else if (a === '--dir' || a === '-d') o.dir = argv[++i];
    else if (a === '--help' || a === '-h') o.help = true;
    else if (a === '--version' || a === '-v') o.version = true;
    else { console.error(red(`Opcao desconhecida: ${a}`)); o.help = true; }
  }
  return o;
}

function help() {
  console.log(`
${bold(green('painel-ins'))} ${dim('· instalador da skill (Claude Code)')}
linguagem visual "command center" — dashboard cyberpunk, neon verde, HUD/terminal

${bold('USO')}
  npx github:insanemor/skill-front            ${dim('# instala em ./.claude/skills/painel-ins')}
  npx github:insanemor/skill-front --global   ${dim('# instala em ~/.claude/skills/painel-ins')}

${bold('OPCOES')}
  -g, --global       instala no diretorio do usuario (~/.claude/skills)
  -l, --local        instala no projeto atual (padrao)
  -d, --dir <path>   diretorio "skills" de destino (sobrepoe -g/-l)
  -f, --force        sobrescreve uma instalacao existente
  -h, --help         mostra esta ajuda
  -v, --version      mostra a versao do instalador

${bold('DEPOIS DE INSTALAR')}
  Abra o Claude Code no projeto e use /painel-ins, ou peca para criar/estilizar
  um dashboard — a skill e acionada automaticamente.
`);
}

/* ---------- copia recursiva (Node >=16.7) ---------- */
function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

function countFiles(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) n += countFiles(path.join(dir, e.name));
    else n++;
  }
  return n;
}

function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.version) { console.log(pkg.version); return; }
  if (o.help) { help(); return; }

  if (!fs.existsSync(SRC) || !fs.existsSync(path.join(SRC, 'SKILL.md'))) {
    console.error(red(`Conteudo da skill nao encontrado em ${SRC}`));
    console.error(dim('O pacote pode estar corrompido — reinstale.'));
    process.exit(1);
  }

  const base = o.dir
    ? path.resolve(o.dir)
    : o.global
      ? path.join(os.homedir(), '.claude', 'skills')
      : path.join(process.cwd(), '.claude', 'skills');
  const dest = path.join(base, SKILL);
  const scope = o.dir ? o.dir : o.global ? '~/.claude/skills (global)' : '.claude/skills (projeto)';

  console.log(`\n${bold(green('▸ painel-ins'))} ${dim('· instalando skill para Claude Code')}\n`);

  if (fs.existsSync(dest)) {
    if (!o.force) {
      console.error(`${yellow('!')} ja existe uma instalacao em ${bold(dest)}`);
      console.error(`  use ${bold('--force')} para sobrescrever.\n`);
      process.exit(1);
    }
    console.log(`${yellow('!')} sobrescrevendo instalacao existente ${dim('(--force)')}`);
    fs.rmSync(dest, { recursive: true, force: true });
  }

  fs.mkdirSync(base, { recursive: true });
  copyDir(SRC, dest);

  const n = countFiles(dest);
  console.log(`${green('✓')} skill instalada ${dim(`(${n} arquivos)`)}`);
  console.log(`  destino: ${bold(dest)}`);
  console.log(`  escopo:  ${dim(scope)}\n`);
  console.log(`${dim('Proximo passo:')} abra o Claude Code e use ${bold(green('/painel-ins'))} ${dim('ou peca um dashboard.')}\n`);
}

try {
  main();
} catch (err) {
  console.error(red('\nFalha na instalacao: ') + (err && err.message ? err.message : String(err)));
  process.exit(1);
}
