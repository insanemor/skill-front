// painel-ins — Shell da aplicacao (React + Tailwind + framer-motion).
// Fundo com texturas (grid-bg + scanline), sidebar fixa, conteudo deslocado,
// entrada de pagina com fade. Use com react-router (<Outlet/>).
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
// import TopBar from "./TopBar";   // opcional: barra superior

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background grid-bg scanline relative">
      {/* <MatrixRain />  // opcional: animacao de fundo, ver references/effects.md */}
      <Sidebar />

      <div className="ml-[72px] md:ml-[240px] relative z-10 transition-all duration-300">
        {/* <TopBar /> */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-4 md:p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
