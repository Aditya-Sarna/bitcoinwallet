import { motion } from "framer-motion";
import { fmtBTC, fmtUSD } from "../lib/format";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

/**
 * Vibrant multi-gradient card stack — CRED reference.
 * Orange · mint · purple tilted behind a gradient front hero card.
 */
export default function ColorCardStack({ name, balance, fiat, change24h, loading }) {
  const up = (change24h || 0) >= 0;

  return (
    <div className="relative h-[270px] mt-3" data-testid="card-stack">
      {/* Back left — purple/magenta */}
      <motion.div
        initial={{ y: 28, opacity: 0, rotate: -10, x: 28 }}
        animate={{ y: 22, opacity: 1, rotate: -9, x: 30 }}
        transition={{ delay: 0.18, type: "spring", stiffness: 150, damping: 22 }}
        className="absolute top-0 left-6 right-6 h-48 rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
          boxShadow: "0 16px 30px rgba(168,85,247,0.35)",
        }}
      />
      {/* Back right — orange/amber */}
      <motion.div
        initial={{ y: 22, opacity: 0, rotate: 8, x: -30 }}
        animate={{ y: 12, opacity: 1, rotate: 7, x: -32 }}
        transition={{ delay: 0.22, type: "spring", stiffness: 150, damping: 22 }}
        className="absolute top-0 left-6 right-6 h-48 rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
          boxShadow: "0 16px 30px rgba(249,115,22,0.35)",
        }}
      />

      {/* Front hero — rainbow gradient like CRED */}
      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 22 }}
        className="relative mx-4 h-52 rounded-[28px] p-5 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #F97316 0%, #10B981 40%, #06B6D4 70%, #8B5CF6 100%)",
          boxShadow: "0 26px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
        data-testid="hero-card"
      >
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute -top-16 -right-12 w-48 h-48 rounded-full opacity-50 blur-2xl"
             style={{ background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)" }} />

        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[9px] tracking-[0.3em] uppercase text-white/80 font-semibold">the vault</div>
              <div
                className="text-white/95 leading-none mt-1 tracking-tight"
                style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 26 }}
              >
                {name?.toUpperCase() || "—"}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                {/* Inline logo — small vault glyph */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 L20 5 V14 C20 18 16 22 12 23 C8 22 4 18 4 14 V5 Z" stroke="#fff" strokeWidth="1.5" fill="none" />
                  <path d="M12 8 L17 11 L14 16 H10 L7 11 Z" fill="#fff" />
                </svg>
              </div>
              <div className="text-[9px] font-mono text-white/70">• • • •</div>
            </div>
          </div>

          <div className="flex-1" />

          <div>
            <div
              className="text-white tracking-tight"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: "-0.03em" }}
              data-testid="stack-fiat"
            >
              {loading ? "—" : <><span className="text-white/70 text-2xl">$</span>{fmtUSD(fiat, 2)}</>}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="font-mono text-xs text-white/85" data-testid="stack-btc">
                {loading ? "…" : fmtBTC(balance, 8)} BTC
              </div>
              {change24h !== null && change24h !== undefined && (
                <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-white">
                  {up ? <TrendUp size={11} weight="bold" /> : <TrendDown size={11} weight="bold" />}
                  {up ? "+" : ""}{(change24h || 0).toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
