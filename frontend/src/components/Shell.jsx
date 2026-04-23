import { motion } from "framer-motion";
import BottomNav from "./BottomNav";

export default function Shell({ children, showNav = true, className = "" }) {
  return (
    <div className={`shell ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`relative ${showNav ? "pad-bottom" : ""}`}
      >
        {children}
      </motion.div>
      {showNav && <BottomNav />}
    </div>
  );
}
