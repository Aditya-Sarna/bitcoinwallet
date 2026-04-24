import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "@phosphor-icons/react";
import { api } from "../lib/api";

const PRIZES = [
  { label: "100",    unit: "coins", coins: 100,  color: "#D4FF4F", textColor: "#0A0A0F" },
  { label: "500",    unit: "coins", coins: 500,  color: "#FF3E8A", textColor: "#fff"    },
  { label: "50",     unit: "coins", coins: 50,   color: "#6B5CFC", textColor: "#fff"    },
  { label: "1,000",  unit: "coins", coins: 1000, color: "#34D8FF", textColor: "#0A0A0F" },
  { label: "25",     unit: "coins", coins: 25,   color: "#FF8C42", textColor: "#fff"    },
  { label: "2,500",  unit: "coins", coins: 2500, color: "#D4FF4F", textColor: "#0A0A0F" },
  { label: "250",    unit: "coins", coins: 250,  color: "#FF3E8A", textColor: "#fff"    },
  { label: "5,000",  unit: "JACKPOT", coins: 5000, color: "#6B5CFC", textColor: "#fff" },
];

const N = PRIZES.length;
const SEG = 360 / N; // 45° per segment

function WheelSVG() {
  const cx = 150, cy = 150, r = 140, textR = 96;
  return (
    <svg width={300} height={300} viewBox="0 0 300 300">
      {PRIZES.map((p, i) => {
        const startDeg = i * SEG - 90;
        const endDeg   = (i + 1) * SEG - 90;
        const startRad = startDeg * (Math.PI / 180);
        const endRad   = endDeg   * (Math.PI / 180);
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        const midRad = ((startDeg + endDeg) / 2) * (Math.PI / 180);
        const tx = cx + textR * Math.cos(midRad);
        const ty = cy + textR * Math.sin(midRad);
        const textRotDeg = (startDeg + endDeg) / 2 + 90;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
        return (
          <g key={i}>
            <path d={path} fill={p.color} stroke="#0A0A0F" strokeWidth={2.5} />
            <g transform={`translate(${tx},${ty}) rotate(${textRotDeg})`}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill={p.textColor}
                fontSize={p.coins >= 1000 ? 10 : 13}
                fontWeight="800"
                fontFamily="'Clash Display', sans-serif"
                y={-7}
              >
                {p.label}
              </text>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill={p.textColor}
                fontSize={8}
                fontWeight="600"
                opacity={0.85}
                y={6}
              >
                {p.unit}
              </text>
            </g>
          </g>
        );
      })}
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      {/* Center hub */}
      <circle cx={cx} cy={cy} r={30} fill="#0A0A0F" stroke="#D4FF4F" strokeWidth={3} />
      <text
        x={cx} y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#D4FF4F"
        fontSize={9}
        fontWeight="800"
        fontFamily="'Clash Display', sans-serif"
        letterSpacing="0.12em"
      >
        NOVA
      </text>
    </svg>
  );
}

export default function Spin() {
  const nav = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult]   = useState(null);
  const [totalRot, setTotalRot] = useState(0);
  const [hasSpun, setHasSpun]   = useState(false);

  const doSpin = () => {
    if (spinning || result) return;
    setSpinning(true);

    // weighted: jackpot (idx 7) is 1-in-16 chance, others equal
    const pool = [0,1,2,3,4,5,6,  0,1,2,3,4,5,6,  7,  6];
    const idx  = pool[Math.floor(Math.random() * pool.length)];

    // angle of segment center from top (clockwise)
    const segCenterFromTop = idx * SEG + SEG / 2;
    // to land pointer (at 0°/top) on this segment, wheel rotates:
    const landAngle = (360 - segCenterFromTop % 360) % 360;
    const delta     = 6 * 360 + landAngle; // 6 full rotations + land

    setTotalRot(prev => prev + delta);
    setHasSpun(true);

    setTimeout(() => {
      // optimistically credit coins
      try { api.post("/rewards/spin", { coins: PRIZES[idx].coins }).catch(() => {}); } catch (_) {}
      setResult(PRIZES[idx]);
      setSpinning(false);
    }, 4300);
  };

  const spinAgain = () => {
    setResult(null);
  };

  return (
    <div
      className="shell relative flex flex-col overflow-hidden"
      style={{ minHeight: "100vh", background: "var(--bg)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-12 pb-2 shrink-0">
        <div>
          <div
            className="text-[10px] tracking-[0.22em] uppercase font-bold mb-1"
            style={{ color: "#D4FF4F" }}
          >
            mystery box
          </div>
          <h1
            className="leading-[0.92] tracking-[-0.03em]"
            style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 36, color: "var(--ink)" }}
          >
            spin to<br />
            <span style={{ color: "#D4FF4F" }}>win big.</span>
          </h1>
        </div>
        <button
          onClick={() => nav(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
        >
          <X size={16} style={{ color: "var(--ink-2)" }} />
        </button>
      </div>

      {/* Prizes hint strip */}
      <div className="px-5 mt-1 shrink-0">
        <div className="text-[11px]" style={{ color: "var(--ink-3)" }}>
          up to <span className="font-bold" style={{ color: "#D4FF4F" }}>5,000 coins</span> per spin · one free spin daily
        </div>
      </div>

      {/* Wheel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Pointer */}
        <div className="relative z-10 mb-[-10px]">
          <motion.div
            animate={spinning ? { y: [0, -4, 0] } : { y: 0 }}
            transition={{ repeat: spinning ? Infinity : 0, duration: 0.4 }}
          >
            <div
              style={{
                width: 0, height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "22px solid #D4FF4F",
                filter: "drop-shadow(0 2px 8px rgba(212,255,79,0.7))",
              }}
            />
          </motion.div>
        </div>

        {/* Wheel with glow */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              opacity: spinning ? [0.3, 0.55, 0.3] : 0.2,
              scale:   spinning ? [1, 1.04, 1]      : 1,
            }}
            transition={{ repeat: spinning ? Infinity : 0, duration: 1 }}
            style={{
              background: "radial-gradient(circle, rgba(212,255,79,0.45) 0%, rgba(107,92,252,0.3) 60%, transparent 80%)",
              filter: "blur(20px)",
            }}
          />
          <motion.div
            animate={{ rotate: totalRot }}
            transition={
              hasSpun
                ? { duration: 4, ease: [0.12, 0.8, 0.25, 1.0] }
                : { duration: 0 }
            }
          >
            <WheelSVG />
          </motion.div>
        </div>

        {/* Spin button */}
        {!result && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={doSpin}
            disabled={spinning}
            className="mt-7 w-full max-w-[260px] font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[13px] transition-all"
            style={{
              background: spinning ? "rgba(212,255,79,0.25)" : "#D4FF4F",
              color: spinning ? "rgba(212,255,79,0.6)" : "#0A0A0F",
              boxShadow: spinning ? "none" : "0 8px 32px rgba(212,255,79,0.35)",
            }}
          >
            {spinning ? (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
              >
                spinning…
              </motion.span>
            ) : "spin now"}
          </motion.button>
        )}
        {result && (
          <div className="mt-7 h-[52px]" /> /* spacer to keep layout stable */
        )}
      </div>

      {/* Result bottom sheet */}
      {result && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="absolute bottom-0 left-0 right-0 rounded-t-[32px] px-6 pt-5 pb-10 z-20"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
        >
          {/* Drag handle */}
          <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--surface-border)" }} />

          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            >
              <div
                className="text-[10px] tracking-[0.22em] uppercase font-bold mb-1"
                style={{ color: "#D4FF4F" }}
              >
                🎉 you won
              </div>
              <div
                style={{
                  fontFamily: "Clash Display, sans-serif",
                  fontWeight: 700,
                  fontSize: 64,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: "var(--ink)",
                }}
              >
                {result.label}
              </div>
              <div className="text-white/50 text-sm mt-1 lowercase tracking-wide">
                {result.unit} · added to your wallet
              </div>
            </motion.div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              nav("/success", {
                state: {
                  kind: "claimed",
                  title: "spin & win",
                  subtitle: `${result.label} ${result.unit} landed in your vault`,
                  amount: `+${result.coins} coins`,
                  secondary: "keep spinning for bigger rewards",
                  ctaLabel: "back to home",
                  secondaryCta: { label: "spin again", to: "/spin" },
                },
              })
            }
            className="w-full font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[13px]"
            style={{ background: "#D4FF4F", color: "#0A0A0F" }}
          >
            claim reward
          </motion.button>

          <button
            onClick={spinAgain}
            className="mt-3 w-full text-center text-[11px] transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            spin again
          </button>
        </motion.div>
      )}
    </div>
  );
}
