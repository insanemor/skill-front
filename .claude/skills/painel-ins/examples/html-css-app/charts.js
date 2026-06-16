/* painel-ins — charts.js
 * Biblioteca de graficos SVG/Canvas, agnostica e SEM libs externas.
 * REGRA: cores SEMPRE via tokens — hsl(var(--token) / alpha). Nada de hex.
 *
 * API (window.Charts):
 *   line(canvas, series, opts)   series:[{data:[n...], color:'--chart-1'}]  opts:{max,area,points,grid}  -> {redraw}
 *   bars(elBars, groups, opts)   groups:[{label, values:[n...]}] | [{label,v}]  opts:{max, colors:['--chart-1'...]}
 *   donut(svg, data)             data:[{pct,color,name}]
 *   gauge(svg, value, colorVar, opts)   opts:{frac=0.75}  -> anima o arco
 *   scatter(canvas, pts, opts)   pts:[{x,y}]  opts:{color,xMax,yMax}
 *   heatmap(el, opts)            opts:{cols, rows, data:[0..1...], colorVar}
 *   sparkline(svg, data, colorVar)
 */
window.Screens = window.Screens || {}; /* registro de telas (carregado antes dos screens/*.js) */

window.Charts = (function () {
  const root = getComputedStyle(document.documentElement);
  const token = (n) => root.getPropertyValue(n).trim();
  const hsl = (n, a = 1) => `hsl(${token(n)} / ${a})`;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LINE / AREA (canvas) ---------- */
  function line(canvas, series, opts = {}) {
    const ctx = canvas.getContext('2d');
    const { max = 100, area = true, points = false, grid = true, padTop = 10, padBottom = 18 } = opts;
    function redraw() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w) return;
      if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (grid) {
        ctx.strokeStyle = hsl('--border', 0.6); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) { const y = (h / 4) * i; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      }
      series.forEach(({ data, color }) => {
        const step = w / (data.length - 1);
        const yOf = (v) => h - padBottom - (v / max) * (h - padTop - padBottom);
        if (area) {
          const g = ctx.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, hsl(color, 0.25)); g.addColorStop(1, hsl(color, 0));
          ctx.beginPath(); ctx.moveTo(0, h);
          data.forEach((v, i) => ctx.lineTo(i * step, yOf(v)));
          ctx.lineTo(w, h); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
        }
        ctx.beginPath();
        data.forEach((v, i) => (i ? ctx.lineTo(i * step, yOf(v)) : ctx.moveTo(0, yOf(v))));
        ctx.strokeStyle = hsl(color); ctx.lineWidth = 2;
        ctx.shadowColor = hsl(color, 0.5); ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;
        if (points) {
          ctx.fillStyle = hsl(color);
          data.forEach((v, i) => { ctx.beginPath(); ctx.arc(i * step, yOf(v), 3, 0, Math.PI * 2); ctx.fill(); });
        }
      });
    }
    redraw();
    window.addEventListener('resize', redraw);
    return { redraw };
  }

  /* ---------- BARS (CSS, single ou grouped) ---------- */
  function bars(el, groups, opts = {}) {
    const colors = opts.colors || ['--chart-2'];
    const max = opts.max || Math.max(...groups.flatMap((g) => g.values || [g.v])) * 1.1;
    el.innerHTML = groups.map((g) => {
      const vals = g.values || [g.v];
      const inner = vals.map((v, i) =>
        `<div class="bar" style="height:0%;background:linear-gradient(to top, ${hsl(colors[i % colors.length], 0.25)}, ${hsl(colors[i % colors.length], 0.9)});box-shadow:0 0 12px ${hsl(colors[i % colors.length], 0.3)}" data-h="${(v / max) * 100}%"></div>`
      ).join('');
      return `<div class="bar-col"><div class="bar-group">${inner}</div><span class="bar-label">${g.label}</span></div>`;
    }).join('');
    requestAnimationFrame(() => el.querySelectorAll('.bar').forEach((b) => { b.style.height = b.dataset.h; }));
  }

  /* ---------- DONUT (SVG) ---------- */
  function donut(svg, data, opts = {}) {
    const R = opts.r || 56, C = 2 * Math.PI * R, sw = opts.stroke || 14;
    let off = 0;
    svg.innerHTML = data.map((d) => {
      const len = (d.pct / 100) * C;
      const c = `<circle cx="70" cy="70" r="${R}" fill="none" stroke="${hsl(d.color)}" stroke-width="${sw}" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" stroke-linecap="butt"/>`;
      off += len; return c;
    }).join('');
  }

  /* ---------- GAUGE radial 270deg (SVG) ---------- */
  function gauge(svg, value, colorVar, opts = {}) {
    const r = opts.r || 54, C = 2 * Math.PI * r, frac = opts.frac || 0.75;
    const track = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="hsl(var(--muted))" stroke-width="12" stroke-dasharray="${frac * C} ${C}" stroke-linecap="round"/>`;
    const val = `<circle class="gauge-val" cx="70" cy="70" r="${r}" fill="none" stroke="${hsl(colorVar)}" stroke-width="12" stroke-dasharray="0 ${C}" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${hsl(colorVar, 0.6)})"/>`;
    svg.innerHTML = `<g transform="rotate(135 70 70)">${track}${val}</g>`;
    const apply = () => svg.querySelector('.gauge-val').setAttribute('stroke-dasharray', `${(value / 100) * frac * C} ${C}`);
    REDUCED ? apply() : requestAnimationFrame(apply);
  }

  /* ---------- SCATTER (canvas) ---------- */
  function scatter(canvas, pts, opts = {}) {
    const ctx = canvas.getContext('2d');
    const color = opts.color || '--chart-4', xMax = opts.xMax || 100, yMax = opts.yMax || 100;
    function redraw() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth, h = canvas.clientHeight, pad = 6;
      if (!w) return;
      if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = hsl('--border', 0.6); ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) { const y = (h / 4) * i; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      pts.forEach((p) => {
        const x = pad + (p.x / xMax) * (w - pad * 2);
        const y = h - pad - (p.y / yMax) * (h - pad * 2);
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = hsl(color, 0.85); ctx.shadowColor = hsl(color, 0.6); ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0;
      });
    }
    redraw(); window.addEventListener('resize', redraw); return { redraw };
  }

  /* ---------- HEATMAP (grid de celulas) ---------- */
  function heatmap(el, opts = {}) {
    const cols = opts.cols || 24, rows = opts.rows || 7, colorVar = opts.colorVar || '--chart-1';
    const data = opts.data || Array.from({ length: cols * rows }, () => Math.random());
    el.style.setProperty('--hm-cols', cols);
    el.innerHTML = data.map((v) => {
      const a = 0.08 + v * 0.85;
      return `<span class="hm-cell" style="background:${hsl(colorVar, a)}" title="${Math.round(v * 100)}"></span>`;
    }).join('');
  }

  /* ---------- SPARKLINE (SVG inline) ---------- */
  function sparkline(svg, data, colorVar = '--chart-1') {
    const w = 100, h = 30, max = Math.max(...data), min = Math.min(...data);
    const step = w / (data.length - 1);
    const pts = data.map((v, i) => `${i * step},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(' ');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = `<polyline points="${pts}" fill="none" stroke="${hsl(colorVar)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  return { line, bars, donut, gauge, scatter, heatmap, sparkline, hsl, token };
})();
