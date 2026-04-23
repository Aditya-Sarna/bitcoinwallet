import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { House, ArrowRight, Receipt, Gift, ShieldCheck } from "@phosphor-icons/react";
import PaymentOrbit from "../components/PaymentOrbit";
import Confetti from "../components/Confetti";

const COPY = {
  sent: { eyebrow: "transaction · settled", verb: "sent.", accent: "#C9A961", showOrbit: true },
  paid: { eyebrow: "bill · paid", verb: "paid.", accent: "#5B7A5C", showOrbit: true },
  redeemed: { eyebrow: "voucher · unlocked", verb: "yours.", accent: "#A88547", showOrbit: false },
  backed_up: { eyebrow: "vault · secured", verb: "secured.", accent: "#A88547", showOrbit: false },
  received: { eyebrow: "received", verb: "incoming.", accent: "#5B7A5C", showOrbit: true },
  claimed: { eyebrow: "reward · claimed", verb: "claimed.", accent: "#A88547", showOrbit: false },
};

const ICONS = { sent: ArrowRight, paid: Receipt, redeemed: Gift, backed_up: ShieldCheck, received: ArrowRight, claimed: Gift };

export default function Success() {
  const nav = useNavigate();
  const loc = useLocation();
  const state = loc.state || null;
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!state) {
      nav("/home", { replace: true });
    }
  }, [state, nav]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowConfetti(true), 250);
    const t2 = setTimeout(() => setRevealed(true), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!state) return null;

  const kind = state.kind || "sent";
  const meta = COPY[kind] || COPY.sent;
  const Icon = ICONS[kind] || ArrowRight;
  const senderInitial = (localStorage.getItem("btc_name") || "U").charAt(0).toUpperCase();
  const receiverInitial = state.receiverInitial || (state.title || "·").charAt(0).toUpperCase();

  return (
    <div className="shell relative overflow-hidden bg-black" data-testid="success-screen">
      {/* Soft glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${meta.accent}55, transparent 65%)` }}
      />

      <div className="relative z-10 min-h-screen flex flex-col px-7 pt-14 pb-10">
        {/* Confetti subtle */}
        {showConfetti && <Confetti count={20} duration={1.4} />}

        {/* Animation slot */}
        <div className="relative h-[280px] flex items-center justify-center">
          {meta.showOrbit ? (
            <PaymentOrbit
              sender={{ initial: senderInitial, color: "#7A6CB7" }}
              receiver={{ initial: receiverInitial, color: meta.accent }}
              accent={meta.accent}
              size={320}
            />
          ) : (
            // Quiet checkmark medallion for non-payment events (redeem/backup/claim)
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.1 }}
              className="relative w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 30% 30%, #FAF3E0, #C9A961 70%)`,
                boxShadow: `0 0 60px ${meta.accent}77, inset 0 0 30px rgba(0,0,0,0.15)`,
              }}
            >
              <motion.div
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                className="absolute inset-0 rounded-full"
                style={{ border: `1px solid ${meta.accent}` }}
              />
              <Icon size={42} weight="duotone" className="text-[#1a1410]" />
            </motion.div>
          )}
        </div>

        {/* Eyebrow + headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: revealed ? 0 : 0.5 }}
          className="text-center mt-6"
        >
          <div className="text-[10px] tracking-[0.32em] uppercase text-white/45">{meta.eyebrow}</div>
          <h1
            className="text-white/95 leading-none mt-3"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              fontSize: 64,
              letterSpacing: "-0.01em",
            }}
            data-testid="success-headline"
          >
            {meta.verb}
          </h1>
        </motion.div>

        {/* Title + amount */}
        {(state.title || state.amount) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-4"
          >
            {state.title && (
              <div className="text-white/85 text-base" style={{ fontFamily: "Instrument Serif, serif" }}>
                {state.title}
              </div>
            )}
            {state.amount && (
              <div className="font-display text-3xl font-semibold tracking-tighter text-white mt-3" data-testid="success-amount">
                {state.amount}
              </div>
            )}
            {state.secondary && (
              <div className="text-white/40 text-[11px] font-mono mt-1">{state.secondary}</div>
            )}
          </motion.div>
        )}

        {/* Receipt */}
        {state.lines && state.lines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-8 rounded-3xl p-5 space-y-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            data-testid="success-receipt"
          >
            {state.lines.map((l, i) => (
              <div key={i} className="flex justify-between text-[13px]">
                <div className="text-white/45">{l.label}</div>
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
          className="space-y-2 mt-8"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => nav(state.ctaTo || "/home")}
            data-testid="success-cta"
            className="w-full py-4 rounded-full text-sm uppercase tracking-[0.22em] font-medium flex items-center justify-center gap-2"
            style={{ background: "#EFE6D2", color: "#1a1410" }}
          >
            <House size={14} weight="bold" /> {state.ctaLabel || "back to home"}
          </motion.button>
          {state.secondaryCta && (
            <button
              onClick={() => nav(state.secondaryCta.to)}
              data-testid="success-secondary"
              className="w-full text-[10px] tracking-[0.3em] uppercase text-white/45 py-2"
            >
              {state.secondaryCta.label} →
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
