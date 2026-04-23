import { motion } from "framer-motion";
import { fmtBTC, fmtUSD } from "../lib/format";
import { TrendUp, TrendDown, CurrencyBtc } from "@phosphor-icons/react";

/**
 * CRED-style stacked card stack with VIVID multi-color gradients
 * (orange, teal, purple). Much more alive than a single gold card.
 */
export default function ColorCardStack({ name, balance, fiat, change24h, loading }) {
  const up = (change24h || 0) >= 0;

  return (
    <div className="relative h-[280px] mt-3" data-testid="card-stack">
      {/* Back: Purple gradient */}
      <motion.div
        initial={{ y: 35, opacity: 0, rotate: -8, x: 30 }}
        animate={{ y: 28, opacity: 1, rotate: -7, x: 32 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 22 }}
        className="absolute top-0 left-6 right-6 h-48 rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #A855F7 100%)",
          boxShadow: "0 20px 40px rgba(139,92,246,0.25)",
        }}
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4), transparent 50%)" }} />
      </motion.div>

      {/* Middle: Teal-cyan gradient */}
      <motion.div
        initial={{ y: 28, opacity: 0, rotate: 6, x: -30 }}
        animate={{ y: 14, opacity: 1, rotate: 5, x: -28 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 150, damping: 22 }}
        className="absolute top-0 left-6 right-6 h-48 rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #06B6D4 0%, #14B8A6 50%, #10B981 100%)",
          boxShadow: "0 20px 40px rgba(6,182,212,0.25)",
        }}
      >
        <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4), transparent 50%)" }} />
      </motion.div>

      {/* Front: Orange-gold hero card with balance */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 22 }}
        className="relative mx-4 h-52 rounded-[28px] p-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FF9F1C 0%, #F77F00 40%, #D4AF37 100%)",
          boxShadow: "0 30px 60px rgba(247,127,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
        data-testid="hero-card"
      >
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full opacity-50 blur-2xl"
             style={{ background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)" }} />

        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[9px] tracking-[0.3em] uppercase text-black/55">the vault</div>
              <div className="font-cursive text-4xl text-black/85 leading-none mt-1">{name || "—"}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="w-10 h-10 rounded-full bg-black/85 flex items-center justify-center">
                <CurrencyBtc size={18} weight="fill" className="text-[#F0C850]" />
              </div>
              <div className="text-[9px] font-mono text-black/60">• • • •</div>
            </div>
          </div>

          <div className="flex-1" />

          <div>
            <div className="font-display text-4xl font-semibold tracking-tighter text-black" data-testid="stack-fiat">
              {loading ? "—" : <><span className="text-black/55 text-2xl">$</span>{fmtUSD(fiat, 2)}</>}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="font-mono text-xs text-black/70" data-testid="stack-btc">
                {loading ? "…" : fmtBTC(balance, 8)} BTC
              </div>
              {change24h !== null && change24h !== undefined && (
                <div className={`flex items-center gap-1 text-[11px] font-mono font-semibold ${up ? "text-[#0a4a2f]" : "text-[#6b1815]"}`}>
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
