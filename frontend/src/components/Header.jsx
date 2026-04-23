import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header({ title, onBack, right = null, subtitle }) {
  const nav = useNavigate();
  return (
    <div className="flex items-center gap-3 px-6 pt-10 pb-4">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => (onBack ? onBack() : nav(-1))}
        data-testid="header-back"
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
      >
        <ArrowLeft size={18} weight="bold" />
      </motion.button>
      <div className="flex-1">
        <div
          className="text-white lowercase tracking-[-0.02em]"
          style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 18 }}
        >
          {title}
        </div>
        {subtitle && <div className="text-xs text-white/50 lowercase">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
