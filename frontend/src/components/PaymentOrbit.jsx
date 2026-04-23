/**
 * PaymentOrbit — animated payment visualization.
 * Two avatars on opposite sides of an oval orbit; an envelope/card slides
 * along the orbit from sender to receiver. Inspired by CRED reference.
 *
 * Props:
 *   sender: { initial, color }
 *   receiver: { initial, color, label }   // initial OR logoUrl
 *   accent: hex color for orbit ring
 *   onComplete: callback when one cycle done
 */
import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function PaymentOrbit({
  sender = { initial: "B", color: "#8B5CF6" },
  receiver = { initial: "S", color: "#10B981" },
  accent = "#10B981",
  size = 320,
  onComplete,
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      // Card travels around the oval in one full revolution
      await controls.start({
        offsetDistance: ["0%", "100%"],
        transition: { duration: 2.4, ease: [0.45, 0.05, 0.55, 0.95] },
      });
      if (!cancelled && onComplete) onComplete();
    };
    run();
    return () => { cancelled = true; };
  }, [controls, onComplete]);

  const cx = size / 2;
  const cy = size * 0.55;
  const rx = size * 0.42;
  const ry = size * 0.18;

  // Avatar positions on the orbit
  const leftX = cx - rx;
  const leftY = cy;
  const rightX = cx + rx;
  const rightY = cy;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        <defs>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.05" />
            <stop offset="60%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Outer faint ellipse */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx + 4}
          ry={ry + 4}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Glowing accent orbit */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="url(#ringGrad)"
          stroke={accent}
          strokeWidth="1.5"
          filter="url(#ringGlow)"
          opacity="0.85"
        />

        {/* Soft inner ellipse (depth) */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx - 6}
          ry={ry - 6}
          fill="none"
          stroke={`${accent}60`}
          strokeWidth="0.5"
        />
      </svg>

      {/* Sender avatar (left) */}
      <Avatar
        x={leftX}
        y={leftY}
        size={48}
        item={sender}
        delay={0.2}
      />

      {/* Receiver avatar (right) */}
      <Avatar
        x={rightX}
        y={rightY}
        size={48}
        item={receiver}
        delay={0.35}
      />

      {/* Sliding "card" along the orbit */}
      <motion.div
        initial={{ opacity: 0, offsetDistance: "0%" }}
        animate={controls}
        transition={{ delay: 0.7 }}
        className="absolute"
        style={{
          width: 36,
          height: 22,
          top: 0,
          left: 0,
          // Use CSS Motion Path along the same ellipse
          offsetPath: `path('M ${cx - rx},${cy} a ${rx},${ry} 0 1,1 ${rx * 2},0 a ${rx},${ry} 0 1,1 ${-rx * 2},0')`,
          offsetRotate: "0deg",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.35 }}
          className="w-full h-full rounded-md relative"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            boxShadow: `0 4px 14px ${accent}88, 0 0 0 1px rgba(255,255,255,0.2) inset`,
          }}
        >
          <div className="absolute top-1 left-1.5 w-3 h-1.5 rounded-sm bg-white/40" />
          <div className="absolute bottom-1 right-1.5 w-4 h-1 rounded-sm bg-black/30" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Avatar({ x, y, size, item, delay }) {
  const isLogo = item?.logoUrl;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 18 }}
      className="absolute rounded-full flex items-center justify-center font-semibold"
      style={{
        width: size,
        height: size,
        left: x - size / 2,
        top: y - size / 2,
        background: item?.color || "#fff",
        color: "#fff",
        boxShadow: `0 0 0 2px rgba(255,255,255,0.95), 0 0 0 4px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.3)`,
      }}
    >
      {isLogo ? (
        <img src={item.logoUrl} alt="" className="w-full h-full rounded-full object-cover" />
      ) : (
        <span style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: size * 0.45 }}>{item?.initial || "·"}</span>
      )}
    </motion.div>
  );
}
