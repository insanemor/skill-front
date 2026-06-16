// painel-ins — Sidebar de referencia (React + Tailwind + framer-motion).
// Colapsavel (72<->240), item ativo com barra indicadora animada (layoutId),
// logo clicavel que alterna o colapso, bloco de status no rodape.
// Marca configuravel via props (brandName/brandVersion) — agnostico de conteudo.
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BarChart3, Database, Settings2, Cpu, Zap, Bot } from "lucide-react";

// Defina aqui (ou receba por prop) os itens de navegacao do seu app.
const defaultNavItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/data", label: "Data", icon: Database },
  { path: "/settings", label: "Settings", icon: Settings2 },
];

export default function Sidebar({
  navItems = defaultNavItems,
  brandName = "PAINEL.INS",
  brandVersion = "v1.0.0 // ONLINE",
  Logo = Bot,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
    >
      {/* Logo — clique alterna colapso */}
      <div className={`h-16 flex items-center border-b border-sidebar-border transition-all ${collapsed ? "justify-center px-0" : "px-4"}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 glow-green hover:border-primary/50 transition-all cursor-pointer"
          >
            <Logo className="w-6 h-6 text-primary" />
          </button>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <h1 className="font-display text-sm font-bold text-primary glow-text-green tracking-wider">{brandName}</h1>
                <p className="text-[10px] font-mono text-muted-foreground">{brandVersion}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navegacao */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full glow-green"
                  />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "drop-shadow-[0_0_6px_hsl(150_100%_45%/0.5)]" : ""}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Status do sistema */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-2 py-2 rounded-lg bg-primary/5 border border-primary/10"
            >
              <Cpu className="w-4 h-4 text-primary animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-primary">SYSTEM ACTIVE</p>
                <p className="text-[9px] font-mono text-muted-foreground">CPU 42% · MEM 67%</p>
              </div>
              <Zap className="w-3 h-3 text-neon-yellow" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
