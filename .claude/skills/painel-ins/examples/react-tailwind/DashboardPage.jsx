// painel-ins — Pagina de dashboard de exemplo (composicao).
// Demonstra: cabecalho de pagina (titulo com palavra em neon + subtitulo "//"),
// grid responsivo de KPIs, espacamento vertical entre secoes.
import { Cpu, Activity, Database, Wifi } from "lucide-react";
import MetricCard from "./MetricCard";

// Dados de exemplo — troque por sua camada de dados / API.
const metrics = [
  { title: "Active Processes",   value: "1,284",  change: "+12.4%", changeType: "up",   icon: Cpu,      color: "green"  },
  { title: "Network Latency",    value: "24ms",   change: "-8.2%",  changeType: "up",   icon: Activity, color: "blue"   },
  { title: "Data Throughput",    value: "3.8 TB", change: "+23.1%", changeType: "up",   icon: Database, color: "purple" },
  { title: "Active Connections", value: "847",    change: "-2.1%",  changeType: "down", icon: Wifi,     color: "yellow" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Cabecalho de pagina (padrao painel-ins) */}
      <div>
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-wide">
          COMMAND <span className="text-primary glow-text-green">CENTER</span>
        </h2>
        <p className="text-sm font-mono text-muted-foreground mt-1">
          // monitoring all systems · last sync 2s ago
        </p>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} index={i} />
        ))}
      </div>

      {/* ... outras secoes (widgets de grafico, feed, status) seguem o mesmo
          padrao: cards em grids responsivos com gap-4 e space-y-6 entre blocos. */}
    </div>
  );
}
