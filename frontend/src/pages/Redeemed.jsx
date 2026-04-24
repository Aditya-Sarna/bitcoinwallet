import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Confetti from "../components/Confetti";

/* ─────────────────────────────────────────────
   Brand Illustrations – pure SVG + Framer Motion
   ───────────────────────────────────────────── */

function AmazonIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Ground shadow */}
      <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full"
        style={{ background: "rgba(255,153,0,0.15)" }}
        animate={{ scaleX: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
      {/* Box */}
      <motion.div
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative"
      >
        <svg width="140" height="130" viewBox="0 0 140 130" fill="none">
          {/* Box body */}
          <rect x="10" y="40" width="120" height="80" rx="4" fill="#FF9900" />
          {/* Box top */}
          <path d="M10 40 L70 16 L130 40 L70 60 Z" fill="#E67E00" />
          {/* Box right side */}
          <path d="M130 40 L130 120 L70 100 L70 60 Z" fill="#C96A00" />
          {/* Tape strip */}
          <rect x="58" y="16" width="24" height="84" rx="2" fill="#FFE0A0" opacity="0.7" />
          {/* Amazon smile */}
          <path d="M38 80 Q70 100 102 80" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M98 76 L102 80 L96 82" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Stars */}
        {[[-20, -10], [20, -20], [35, 15], [-30, 20]].map(([x, y], i) => (
          <motion.div key={i} className="absolute text-[#FF9900] text-lg font-bold"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(40% + ${y}px)` }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}>★</motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function StarbucksIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Steam */}
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute"
          style={{ left: `calc(50% + ${(i - 1) * 16}px)`, top: "18px", width: 3, height: 20, borderRadius: 4, background: "#00704A", opacity: 0 }}
          animate={{ y: [-8, -28], opacity: [0, 0.7, 0], scaleX: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.45, ease: "easeOut" }} />
      ))}
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}>
        <svg width="130" height="160" viewBox="0 0 130 160" fill="none">
          {/* Cup body */}
          <path d="M25 55 L30 140 Q30 148 38 148 L92 148 Q100 148 100 140 L105 55 Z" fill="#00704A" />
          {/* Cup top rim */}
          <rect x="20" y="48" width="90" height="12" rx="6" fill="#005A38" />
          {/* Lid */}
          <rect x="22" y="36" width="86" height="16" rx="8" fill="#1a1a1a" />
          {/* Lid hole */}
          <rect x="48" y="38" width="34" height="8" rx="4" fill="#333" />
          {/* Sleeve */}
          <path d="M32 80 L38 140 L92 140 L98 80 Z" fill="#005A38" opacity="0.5" />
          {/* Starbucks star */}
          <text x="65" y="118" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">★</text>
          {/* Green ring at bottom */}
          <ellipse cx="65" cy="148" rx="31" ry="5" fill="#003D28" />
        </svg>
      </motion.div>
      {/* Coffee beans decoration */}
      {[[-32, 30], [36, 20], [-28, 60]].map(([x, y], i) => (
        <motion.div key={i} className="absolute text-xs"
          style={{ left: `calc(50% + ${x}px)`, top: `calc(30% + ${y}px)`, fontSize: 18 }}
          animate={{ rotate: [0, 20, -20, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.7 }}>☕</motion.div>
      ))}
    </div>
  );
}

function UberIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
      {/* Road */}
      <div className="absolute bottom-10 left-0 right-0 h-14 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} className="h-1.5 w-8 rounded" style={{ background: "rgba(255,255,255,0.18)" }}
            animate={{ x: [-60, 60] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.37, ease: "linear" }} />
        ))}
      </div>
      {/* Car */}
      <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
        className="relative z-10">
        <svg width="160" height="90" viewBox="0 0 160 90" fill="none">
          {/* Car body */}
          <rect x="10" y="42" width="140" height="40" rx="8" fill="#1a1a1a" />
          {/* Car roof */}
          <path d="M35 42 Q40 18 60 16 L100 16 Q120 18 125 42 Z" fill="#111" />
          {/* Windshield */}
          <path d="M55 42 Q58 22 72 20 L92 20 Q106 22 109 42 Z" fill="#4FC3F7" opacity="0.8" />
          {/* Windows side */}
          <rect x="40" y="22" width="15" height="20" rx="3" fill="#4FC3F7" opacity="0.7" />
          <rect x="105" y="22" width="15" height="20" rx="3" fill="#4FC3F7" opacity="0.7" />
          {/* Wheels */}
          <circle cx="38" cy="82" r="12" fill="#222" />
          <circle cx="38" cy="82" r="6" fill="#555" />
          <circle cx="122" cy="82" r="12" fill="#222" />
          <circle cx="122" cy="82" r="6" fill="#555" />
          {/* Headlights */}
          <rect x="140" y="50" width="8" height="10" rx="2" fill="#FFE082" />
          <rect x="12" y="50" width="8" height="10" rx="2" fill="#FF8A65" />
          {/* Uber logo on door */}
          <text x="80" y="66" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="sans-serif">Uber</text>
        </svg>
      </motion.div>
      {/* Speed lines */}
      {[-30, -14, 2].map((y, i) => (
        <motion.div key={i} className="absolute h-0.5 rounded" style={{ background: "rgba(255,255,255,0.15)" }}
          style={{ width: 30, left: 8, top: `calc(70% + ${y}px)` }}
          animate={{ opacity: [0, 0.7, 0], x: [0, -10] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
      ))}
    </div>
  );
}

function DiorIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Soft background radial */}
      <div className="absolute inset-0 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #c8a96e 0%, transparent 70%)" }} />
      {/* Perfume bottle */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
          <svg width="130" height="170" viewBox="0 0 130 170" fill="none">
            {/* Bottle body */}
            <rect x="28" y="60" width="74" height="98" rx="10" fill="#EADDC5" stroke="#c8a96e" strokeWidth="1.5" />
            {/* Bottle neck */}
            <rect x="46" y="36" width="38" height="26" rx="5" fill="#d4b896" />
            {/* Cap */}
            <rect x="40" y="16" width="50" height="22" rx="5" fill="#1a1a1a" />
            {/* Cap shine */}
            <rect x="44" y="19" width="10" height="14" rx="3" fill="#333" opacity="0.5" />
            {/* Label area */}
            <rect x="34" y="80" width="62" height="58" rx="4" fill="white" opacity="0.6" />
            {/* Dior label text */}
            <text x="65" y="108" textAnchor="middle" fill="#1a1a1a" fontSize="11" fontWeight="700" fontFamily="serif" letterSpacing="4">DIOR</text>
            <text x="65" y="122" textAnchor="middle" fill="#7a6040" fontSize="7" fontFamily="serif" letterSpacing="2">PARIS</text>
            {/* Liquid level */}
            <rect x="30" y="120" width="70" height="36" rx="0 0 10 10" fill="#d4a843" opacity="0.35" />
            {/* Shine */}
            <rect x="34" y="64" width="8" height="50" rx="4" fill="white" opacity="0.25" />
          </svg>
        </motion.div>
      </motion.div>
      {/* Sparkles */}
      {[[-38, -20], [42, -10], [-22, 50], [38, 45]].map(([x, y], i) => (
        <motion.div key={i} className="absolute text-[#c8a96e]"
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, fontSize: 14 }}
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 1, 0.3], rotate: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.5 }}>✦</motion.div>
      ))}
    </div>
  );
}

function SpotifyIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Headphone */}
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}>
        <motion.div animate={{ rotate: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
            {/* Headband arc */}
            <path d="M22 80 Q22 22 75 22 Q128 22 128 80" stroke="#1DB954" strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Left cup */}
            <rect x="8" y="72" width="28" height="44" rx="14" fill="#1DB954" />
            <rect x="14" y="80" width="16" height="28" rx="8" fill="#148a3e" />
            {/* Right cup */}
            <rect x="114" y="72" width="28" height="44" rx="14" fill="#1DB954" />
            <rect x="120" y="80" width="16" height="28" rx="8" fill="#148a3e" />
          </svg>
        </motion.div>
      </motion.div>
      {/* Sound waves */}
      {[1, 2, 3].map((i) => (
        <motion.div key={i} className="absolute rounded-full border border-[#1DB954]"
          style={{ width: 80 + i * 32, height: 80 + i * 32, left: `calc(50% - ${40 + i * 16}px)`, top: `calc(50% - ${40 + i * 16}px)` }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }} />
      ))}
      {/* Music notes */}
      {[[-44, -40], [46, -30], [-36, 40]].map(([x, y], i) => (
        <motion.div key={i} className="absolute text-[#1DB954] font-bold"
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, fontSize: 20 }}
          animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}>♪</motion.div>
      ))}
    </div>
  );
}

function NikeIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Motion lines */}
      {[-20, -4, 12].map((y, i) => (
        <motion.div key={i} className="absolute h-0.5 rounded" style={{ background: "rgba(255,107,0,0.35)" }}
          style={{ width: 40, right: "12%", top: `calc(62% + ${y}px)` }}
          animate={{ opacity: [0, 0.8, 0], scaleX: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }} />
      ))}
      <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 16 }}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
            {/* Sole */}
            <ellipse cx="90" cy="100" rx="74" ry="12" fill="#2a2a2a" />
            {/* Midsole */}
            <path d="M18 90 Q90 80 162 88 L158 100 Q90 108 22 100 Z" fill="#333" stroke="#444" strokeWidth="1" />
            {/* Upper */}
            <path d="M28 90 Q30 56 58 48 L120 42 Q154 44 155 64 L162 88 Q90 80 28 90 Z" fill="#FF6B00" />
            {/* Toe box */}
            <path d="M28 90 Q18 72 38 58 Q52 50 64 52 L58 48 Q30 56 28 90 Z" fill="#E55A00" />
            {/* Nike swoosh */}
            <path d="M70 72 Q100 54 140 62 Q115 74 80 82 Z" fill="white" />
            {/* Laces */}
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={70 + i * 12} y1={54} x2={76 + i * 12} y2={68}
                stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            ))}
            {/* Heel tab */}
            <path d="M152 64 L158 66 L156 82 L150 80 Z" fill="#E55A00" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

function AirMilesIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
      {/* Cloud 1 */}
      <motion.div className="absolute top-10 left-4 opacity-40"
        animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
        <div className="w-20 h-8 rounded-full relative" style={{ background: "rgba(52,216,255,0.15)" }}>
          <div className="absolute -top-3 left-4 w-10 h-10 rounded-full" style={{ background: "rgba(52,216,255,0.15)" }} />
          <div className="absolute -top-2 left-10 w-7 h-7 rounded-full" style={{ background: "rgba(52,216,255,0.15)" }} />
        </div>
      </motion.div>
      {/* Cloud 2 */}
      <motion.div className="absolute top-20 right-2 opacity-30"
        animate={{ x: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}>
        <div className="w-14 h-6 rounded-full relative" style={{ background: "rgba(52,216,255,0.15)" }}>
          <div className="absolute -top-2 left-3 w-7 h-7 rounded-full" style={{ background: "rgba(52,216,255,0.15)" }} />
        </div>
      </motion.div>
      {/* Plane */}
      <motion.div initial={{ x: -80, y: 20, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.2 }}>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none">
            {/* Fuselage */}
            <path d="M10 50 Q60 30 130 48 Q150 50 160 52 Q150 56 130 56 Q60 70 10 50 Z" fill="#34D8FF" />
            {/* Nose */}
            <path d="M130 48 Q160 48 160 52 Q160 56 130 56 Q145 54 145 52 Q145 50 130 48 Z" fill="#0ab8e0" />
            {/* Main wing */}
            <path d="M60 48 L100 14 L115 14 L85 50 Z" fill="#0ab8e0" />
            <path d="M60 52 L100 86 L115 86 L85 50 Z" fill="#0ab8e0" opacity="0.7" />
            {/* Tail fin */}
            <path d="M20 50 L30 28 L50 40 Z" fill="#0ab8e0" />
            {/* Windows */}
            {[80, 98, 116].map((x, i) => (
              <ellipse key={i} cx={x} cy={50} rx={6} ry={5} fill="white" opacity={0.85} />
            ))}
          </svg>
        </motion.div>
      </motion.div>
      {/* Trail */}
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute h-0.5 bg-[#34D8FF] rounded"
          style={{ width: 24, left: `calc(20% - ${i * 20}px)`, top: "calc(55% + 2px)" }}
          animate={{ opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.25 }} />
      ))}
    </div>
  );
}

function MysteryIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Glow */}
      <motion.div className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(107,92,252,0.2) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 12 }}>
        <motion.div animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
            {/* Box bottom */}
            <rect x="20" y="72" width="110" height="70" rx="6" fill="#6B5CFC" />
            {/* Box right side shade */}
            <rect x="100" y="72" width="30" height="70" rx="0 6 6 0" fill="#5046cc" />
            {/* Lid */}
            <rect x="14" y="56" width="122" height="20" rx="6" fill="#7C6DFD" />
            <rect x="14" y="56" width="60" height="20" rx="6 0 0 6" fill="#8B7EFE" />
            {/* Ribbon vertical */}
            <rect x="68" y="40" width="14" height="102" rx="3" fill="#D4FF4F" />
            {/* Ribbon horizontal */}
            <rect x="14" y="62" width="122" height="8" rx="2" fill="#D4FF4F" />
            {/* Bow */}
            <path d="M62 52 Q50 32 40 42 Q40 56 62 56 Z" fill="#bbf000" />
            <path d="M88 52 Q100 32 110 42 Q110 56 88 56 Z" fill="#bbf000" />
            <circle cx="75" cy="54" r="7" fill="#D4FF4F" />
            {/* Question mark on box */}
            <text x="75" y="116" textAnchor="middle" fill="white" fontSize="28" fontWeight="900" opacity="0.5">?</text>
          </svg>
        </motion.div>
      </motion.div>
      {/* Stars */}
      {[[-40, -30], [44, -22], [-26, 50], [46, 44], [10, -46]].map(([x, y], i) => (
        <motion.div key={i} className="absolute"
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, color: "#D4FF4F", fontSize: 14 }}
          animate={{ scale: [0.5, 1.4, 0.5], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}>✦</motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Brand config
   ───────────────────────────────────────────── */
const BRANDS = {
  Amazon:        { Illustration: AmazonIllustration,   accent: "#FF9900" },
  Starbucks:     { Illustration: StarbucksIllustration, accent: "#1DB954" },
  Uber:          { Illustration: UberIllustration,      accent: "#34D8FF" },
  Dior:          { Illustration: DiorIllustration,      accent: "#c8a96e" },
  Spotify:       { Illustration: SpotifyIllustration,   accent: "#1DB954" },
  Nike:          { Illustration: NikeIllustration,      accent: "#FF6B00" },
  AirMiles:      { Illustration: AirMilesIllustration,  accent: "#34D8FF" },
  "Mystery Box": { Illustration: MysteryIllustration,   accent: "#D4FF4F" },
};

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */
export default function Redeemed() {
  const nav = useNavigate();
  const loc = useLocation();
  const state = loc.state;
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!state) { nav("/store", { replace: true }); return; }
    const t = setTimeout(() => setConfetti(true), 300);
    return () => clearTimeout(t);
  }, [state, nav]);

  if (!state) return null;

  const brand = state.brand || "Mystery Box";
  const cfg = BRANDS[brand] || BRANDS["Mystery Box"];
  const { Illustration } = cfg;
  const accent = cfg.accent;

  return (
    <div className="shell relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}55, transparent 65%)` }}
      />

      {confetti && <Confetti count={32} duration={2} />}

      <div className="relative z-10 min-h-screen flex flex-col pb-10">
        <Header title={brand} onBack={() => nav("/store")} />

        {/* Illustration panel */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.1 }}
          className="flex justify-center mt-2"
        >
          <Illustration />
        </motion.div>

        {/* Eyebrow + headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mt-1 text-center"
        >
          <div
            className="uppercase tracking-[0.22em] font-bold text-[11px] mb-2"
            style={{ color: accent }}
          >
            voucher redeemed
          </div>
          <h1
            className="leading-[0.92] tracking-[-0.035em]"
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontWeight: 700,
              fontSize: 48,
              color: "var(--ink)",
            }}
          >
            <span style={{ color: accent }}>unlocked.</span>
          </h1>
        </motion.div>

        {/* Details card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mx-5 mt-5 rounded-[24px] p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
        >
          {[
            { label: "brand",   value: brand },
            { label: "voucher", value: state.title },
            { label: "spent",   value: state.coinsSpent ? `${state.coinsSpent} coins` : "—" },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between py-2.5 ${i < 2 ? "border-b border-white/5" : ""}`}
            >
              <span
                className="text-[11px] uppercase tracking-[0.18em] font-semibold"
                style={{ color: "var(--ink-3)" }}
              >
                {label}
              </span>
              <span
                className="text-sm font-bold lowercase"
                style={{ color: "var(--ink)" }}
              >
                {value}
              </span>
            </div>
          ))}

          {/* Code block */}
          {state.code && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62 }}
              className="mt-4 rounded-2xl py-3 px-4 text-center"
              style={{ background: `${accent}18`, border: `1.5px dashed ${accent}60` }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.24em] font-bold mb-1.5"
                style={{ color: accent }}
              >
                your code
              </div>
              <div
                className="font-mono font-bold text-xl tracking-[0.2em]"
                style={{ color: "var(--ink)" }}
              >
                {state.code}
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="flex-1" />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="px-5 mt-6 space-y-2.5"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => nav("/store")}
            className="w-full font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[12px]"
            style={{ background: accent, color: accent === "#D4FF4F" || accent === "#34D8FF" || accent === "#c8a96e" ? "#0A0A0F" : "#fff" }}
          >
            shop more
          </motion.button>
          <button
            onClick={() => nav("/home")}
            className="w-full text-center text-[11px] font-semibold py-2"
            style={{ color: "var(--ink-3)" }}
          >
            back to home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
