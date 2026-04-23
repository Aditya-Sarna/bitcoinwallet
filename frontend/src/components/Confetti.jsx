import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Confetti burst — 36 colored particles exploding from center.
 * Gold + brand palette. CSS-driven, lightweight.
 */
const COLORS = ["#F0C850", "#D4AF37", "#FF9F1C", "#EC4899", "#06B6D4", "#10B981", "#A855F7", "#FFFFFF"];

export default function Confetti({ count = 36, duration = 1.6 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 120 + Math.random() * 140;
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          color: COLORS[i % COLORS.length],
          rotate: (Math.random() - 0.5) * 720,
          size: 6 + Math.random() * 8,
          shape: Math.random() > 0.5 ? "circle" : "square",
          delay: Math.random() * 0.15,
        };
      }),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{
            x: p.dx,
            y: [0, p.dy * 0.3, p.dy + 200],
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: [0, 1, 1],
          }}
          transition={{
            duration,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.4, 1],
          }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            boxShadow: `0 0 12px ${p.color}88`,
          }}
        />
      ))}
    </div>
  );
}
