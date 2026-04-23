import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowRight, House, Receipt, Gift, ShieldCheck } from "@phosphor-icons/react";
import Confetti from "../components/Confetti";

/**
 * Universal animated success/celebration screen.
 * Pass via nav state: { kind, title, subtitle, amount, secondary, lines, ctaLabel, ctaTo }
 *   kind: 'sent' | 'paid' | 'redeemed' | 'backed_up' | 'received' | 'claimed'
 */
const COPY = {
  sent: { eyebrow: "transaction · broadcasted", verb: "sent.", Icon: ArrowRight, accent: "#F0C850" },
  paid: { eyebrow: "bill · settled", verb: "paid.", Icon: Receipt, accent: "#10B981" },
  redeemed: { eyebrow: "voucher · unlocked", verb: "yours.", Icon: Gift, accent: "#EC4899" },
  backed_up: { eyebrow: "vault · secured", verb: "secured.", Icon: ShieldCheck, accent: "#F0C850" },
  received: { eyebrow: "received", verb: "incoming.", Icon: ArrowRight, accent: "#10B981" },
  claimed: { eyebrow: "reward · claimed", verb: "claimed.", Icon: Gift, accent: "#F0C850" },
};

export default function Success() {
  const nav = useNavigate();
  const loc = useLocation();
  const state = loc.state || {};
  const kind = state.kind || "sent";
  const meta = COPY[kind] || COPY.sent;
  const Icon = meta.Icon;

  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="shell grain relative overflow-hidden" data-testid="success-screen">
      {/* Glow background */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${meta.accent}55, transparent 65%)` }}
      />

      <div className="relative z-10 min-h-screen flex flex-col px-6 pt-20 pb-10">
        {/* Confetti burst */}
        <div className="relative h-44 flex items-center justify-center">
          {showConfetti && <Confetti />}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.1 }}
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${meta.accent}, ${meta.accent}aa 70%)`,
              boxShadow: `0 0 60px ${meta.accent}88, inset 0 0 20px rgba(0,0,0,0.2)`,
            }}
          >
            {/* Pulse ring */}
            <motion.div
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${meta.accent}` }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 220 }}
            >
              <CheckCircle size={56} weight="fill" className="text-black" />
            </motion.div>
          </motion.div>
        </div>

        {/* Eyebrow + headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">{meta.eyebrow}</div>
          <h1 className="font-cursive text-7xl text-white/95 leading-none mt-3" data-testid="success-headline">
            {meta.verb}
          </h1>
        </motion.div>

        {/* Title + subtitle from state */}
        {(state.title || state.subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-center mt-5"
          >
            {state.title && <div className="font-display text-2xl">{state.title}</div>}
            {state.subtitle && <div className="text-white/55 text-sm mt-1 font-serif-italic">{state.subtitle}</div>}
          </motion.div>
        )}

        {/* Amount big */}
        {state.amount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75, type: "spring", stiffness: 200 }}
            className="text-center mt-6"
          >
            <div className="font-display text-4xl font-semibold tracking-tighter" data-testid="success-amount">{state.amount}</div>
            {state.secondary && <div className="text-white/50 text-xs font-mono mt-1">{state.secondary}</div>}
          </motion.div>
        )}

        {/* Receipt lines */}
        {state.lines && state.lines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-8 glass rounded-3xl p-5 space-y-2.5"
            data-testid="success-receipt"
          >
            {state.lines.map((l, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div className="text-white/50">{l.label}</div>
                <div className="font-mono text-white/85 truncate ml-3 text-right max-w-[60%]">{l.value}</div>
              </div>
            ))}
          </motion.div>
        )}

        <div className="flex-1" />

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-3 mt-10"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => nav(state.ctaTo || "/home")}
            data-testid="success-cta"
            className="w-full gold-gradient text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm flex items-center justify-center gap-2"
          >
            <House size={14} weight="bold" /> {state.ctaLabel || "back to home"}
          </motion.button>
          {state.secondaryCta && (
            <button
              onClick={() => nav(state.secondaryCta.to)}
              data-testid="success-secondary"
              className="w-full text-[10px] tracking-[0.28em] uppercase text-white/50 py-2"
            >
              {state.secondaryCta.label} →
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
