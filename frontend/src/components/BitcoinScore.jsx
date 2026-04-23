import { motion } from "framer-motion";

export default function BitcoinScore({ score = 742, max = 900 }) {
  const pct = Math.min(100, (score / max) * 100);
  const radius = 60;
  const circumference = Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-5" data-testid="bitcoin-score">
      <div className="relative w-[140px] h-[80px]">
        <svg viewBox="0 0 160 90" className="w-full h-full">
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6B5CFC" />
              <stop offset="50%" stopColor="#FF3E8A" />
              <stop offset="100%" stopColor="#D4FF4F" />
            </linearGradient>
          </defs>
          <path
            d="M 15 80 A 65 65 0 0 1 145 80"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <motion.path
            d="M 15 80 A 65 65 0 0 1 145 80"
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: "drop-shadow(0 0 10px rgba(212,255,79,0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <div
            className="text-white tracking-[-0.04em]"
            style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 32, lineHeight: 1 }}
          >
            {score}
          </div>
          <div className="text-[9px] tracking-[0.22em] text-white/40 uppercase font-semibold">/ {max}</div>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-[10px] tracking-[0.2em] text-[#D4FF4F] uppercase mb-1 font-bold">bitcoin score</div>
        <div
          className="text-white tracking-[-0.025em]"
          style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 22 }}
        >
          elite
        </div>
        <div className="text-xs text-white/50 mt-0.5">above 92% of users</div>
      </div>
    </div>
  );
}
