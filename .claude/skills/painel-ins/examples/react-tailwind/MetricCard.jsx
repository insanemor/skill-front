// painel-ins — Metric Card de referencia (React + Tailwind + framer-motion)
// Card de KPI: icone + variacao, label mono uppercase, valor display, glow no hover.
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({
  title,
  value,
  change,
  changeType,        // "up" | "down"
  icon: Icon,
  color = "green",   // green | orange | blue | purple | yellow | red
  index = 0,
}) {
  // Cada cor da paleta neon deriva 4 variacoes: fundo, borda, texto e glow.
  const colorMap = {
    orange: { bg: "bg-neon-orange/10", border: "border-neon-orange/20", text: "text-neon-orange", glow: "glow-orange" },
    green:  { bg: "bg-neon-green/10",  border: "border-neon-green/20",  text: "text-neon-green",  glow: "glow-green" },
    blue:   { bg: "bg-neon-blue/10",   border: "border-neon-blue/20",   text: "text-neon-blue",   glow: "glow-blue" },
    purple: { bg: "bg-neon-purple/10", border: "border-neon-purple/20", text: "text-neon-purple", glow: "glow-purple" },
    yellow: { bg: "bg-neon-yellow/10", border: "border-neon-yellow/20", text: "text-neon-yellow", glow: "" },
    red:    { bg: "bg-neon-red/10",    border: "border-neon-red/20",    text: "text-neon-red",    glow: "" },
  };
  const c = colorMap[color] || colorMap.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -2, boxShadow: "0 0 20px hsl(150 100% 45% / 0.2)", transition: { duration: 0.2 } }}
      className={`relative bg-card border ${c.border} rounded-xl p-5 overflow-hidden group transition-shadow`}
    >
      {/* camada de cor surgindo no hover */}
      <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${c.bg} ${c.border} border`}>
            {Icon && <Icon className={`w-5 h-5 ${c.text}`} />}
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-mono ${changeType === "up" ? "text-neon-green" : "text-neon-red"}`}>
              {changeType === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
        <p className={`text-2xl font-display font-bold ${c.text}`}>{value}</p>
      </div>

      {/* accent de canto (assinatura visual) */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${c.bg} rounded-bl-[40px] opacity-20`} />
    </motion.div>
  );
}
