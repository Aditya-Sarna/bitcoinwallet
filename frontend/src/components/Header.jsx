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
        className="w-10 h-10 rounded-full glass flex items-center justify-center"
      >
        <ArrowLeft size={18} weight="bold" />
      </motion.button>
      <div className="flex-1">
        <div className="font-display text-lg font-medium tracking-tight">{title}</div>
        {subtitle && <div className="text-xs text-white/50">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
