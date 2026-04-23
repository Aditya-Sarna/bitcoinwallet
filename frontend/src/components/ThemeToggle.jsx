import { motion } from "framer-motion";
import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "../lib/theme";

export default function ThemeToggle({ size = 44 }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      data-testid="theme-toggle"
      className="rounded-full flex items-center justify-center relative overflow-hidden"
      style={{
        width: size,
        height: size,
        background: isLight ? "#0A0A0F" : "rgba(255,255,255,0.05)",
        border: isLight ? "1px solid #0A0A0F" : "1px solid rgba(255,255,255,0.08)",
      }}
      aria-label={`switch to ${isLight ? "dark" : "light"} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {isLight ? (
          <Sun size={16} weight="fill" color="#D4FF4F" />
        ) : (
          <Moon size={16} weight="fill" color="#D4FF4F" />
        )}
      </motion.div>
    </motion.button>
  );
}
