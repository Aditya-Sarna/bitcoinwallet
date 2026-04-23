import { motion } from "framer-motion";
import { fmtBTC, fmtUSD } from "../lib/format";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

/**
 * CRED-style stacked credit cards showing BTC balance.
 * Three overlapping cards with gradients; hero card has balance.
 */
export default function CardStack({ name, balance, fiat, change24h, loading }) {
  const up = (change24h || 0) >= 0;

  return (
    <div className="relative h-[260px] mt-2" data-testid="card-stack">
      {/* Back card (warm) */}
      <motion.div
        initial={{ y: 20, opacity: 0, rotate: -6 }}
        animate={{ y: 20, opacity: 0.9, rotate: -5 }}
        transition={{ delay: 0.15 }}
        className="absolute top-0 left-4 right-12 h-48 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #3b2a14 0%, #1a1208 100%)",
          border: "1px solid rgba(255,180,100,0.15)",
        }}
      />
      {/* Middle card (cool) */}
      <motion.div
        initial={{ y: 10, opacity: 0, rotate: 4 }}
        animate={{ y: 10, opacity: 0.95, rotate: 3 }}
        transition={{ delay: 0.2 }}
        className="absolute top-0 left-10 right-4 h-48 rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2b1e3f 0%, #1a1128 100%)",
          border: "1px solid rgba(200,100,255,0.15)",
        }}
      />
      {/* Front card — the hero */}
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 200, damping: 22 }}
        className="relative mx-2 h-52 rounded-3xl p-5 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #F0C850 0%, #D4AF37 35%, #9B7F2A 75%, #52400D 100%)",
          boxShadow: "0 30px 60px rgba(212,175,55,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
        data-testid="hero-card"
      >
        {/* Subtle grain */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute -top-24 -right-16 w-56 h-56 rounded-full opacity-40 blur-2xl"
             style={{ background: "radial-gradient(circle, #fff8dd 0%, transparent 70%)" }} />

        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[9px] tracking-[0.3em] uppercase text-black/55">the vault</div>
              <div className="font-cursive text-3xl text-black/80 leading-none mt-1">{name || "—"}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-black/80 flex items-center justify-center">
              <span className="font-display text-sm text-[#F0C850] font-bold">₿</span>
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
                <div className={`flex items-center gap-1 text-[11px] font-mono ${up ? "text-[#0e5c43]" : "text-[#7a1f19]"}`}>
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
