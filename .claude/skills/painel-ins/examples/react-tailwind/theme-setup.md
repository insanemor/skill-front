# Setup React + Tailwind — painel-ins

Como ligar os tokens da skill num projeto Vite + React + Tailwind. Combina
muito bem com **shadcn/ui** (que ja consome estas CSS vars).

## 1. CSS de entrada (`src/index.css`)

Importe as fontes, o Tailwind e cole o conteudo de `assets/tokens.css` + as
utilidades de `references/effects.md`:

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* --> cole aqui o :root e .dark de assets/tokens.css <-- */
/* --> cole aqui as classes .glow-*, .grid-bg, .scanline, scrollbar, keyframes <-- */

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground font-body; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 2. `tailwind.config.js`

Mapeie os tokens semanticos para as CSS vars (assim `bg-primary`, `text-card`,
`border-border/30` etc. funcionam):

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))', 2: 'hsl(var(--chart-2))', 3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))', 5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        neon: {
          orange: '#ff8c1a', green: '#00e676', blue: '#00bcd4',
          purple: '#b388ff', red: '#ff5252', yellow: '#ffd740',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'], body: ['var(--font-body)'],
        display: ['var(--font-display)'], mono: ['var(--font-mono)'],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## 3. Dependencias tipicas

```
npm i framer-motion lucide-react recharts clsx tailwind-merge class-variance-authority
npm i -D tailwindcss-animate
```
`framer-motion` (animacoes), `lucide-react` (icones), `recharts` (graficos),
`clsx`+`tailwind-merge` (helper `cn`).

## 4. Helper `cn`

```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) { return twMerge(clsx(inputs)); }
```

Pronto. A partir daqui use os componentes de `MetricCard.jsx`, `Sidebar.jsx`
e `AppLayout.jsx` como ponto de partida.
