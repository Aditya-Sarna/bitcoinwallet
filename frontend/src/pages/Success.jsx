import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { House, ArrowRight, Receipt, Gift, ShieldCheck, CheckCircle } from "@phosphor-icons/react";
import PaymentOrbit from "../components/PaymentOrbit";
import Confetti from "../components/Confetti";

const COPY = {
  sent:      { eyebrow: "transaction settled", verb: "sent.",       accent: "#D4FF4F", showOrbit: true  },
  paid:      { eyebrow: "bill paid",            verb: "paid.",       accent: "#34D8FF", showOrbit: true  },
  redeemed:  { eyebrow: "voucher unlocked",     verb: "unlocked.",   accent: "#FF3E8A", showOrbit: false },
  backed_up: { eyebrow: "vault secured",        verb: "secured.",    accent: "#D4FF4F", showOrbit: false },
  received:  { eyebrow: "received",             verb: "incoming.",   accent: "#D4FF4F", showOrbit: true  },
  claimed:   { eyebrow: "reward claimed",       verb: "claimed.",    accent: "#FF3E8A", showOrbit: false },
};

const ICONS = { sent: ArrowRight, paid: Receipt, redeemed: Gift, backed_up: ShieldCheck, received: ArrowRight, claimed: Gift };

export default function Success() {
  const nav = useNavigate();
  const loc = useLocation();
  const state = loc.state || null;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!state) nav("/home", { replace: true });
  }, [state, nav]);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 220);
    return () => clearTimeout(t);
  }, []);

  if (!state) return null;

  const kind = state.kind || "sent";
  const meta = COPY[kind] || COPY.sent;
  const Icon = ICONS[kind] || ArrowRight;
  const senderInitial = (localStorage.getItem("btc_name") || "U").charAt(0).toUpperCase();
  const receiverInitial = state.receiverInitial || (state.title || "·").charAt(0).toUpperCase();

  return (
    <div className="shell relative overflow-hidden" data-testid="success-screen">
      {/* Soft electric glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-50 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${meta.accent}66, transparent 65%)` }}
      />
      <div
        className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, #6B5CFC, transparent 70%)` }}
      />

      <div className="relative z-10 min-h-screen flex flex-col px-6 pt-14 pb-10">
        {showConfetti && <Confetti count={28} duration={1.6} />}

        {/* Animation slot */}
        <div className="relative h-[280px] flex items-center justify-center">
          {meta.showOrbit ? (
            <PaymentOrbit
              sender={{ initial: senderInitial, color: "#6B5CFC" }}
              receiver={{ initial: receiverInitial, color: meta.accent }}
              accent={meta.accent}
              size={320}
            />
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.1 }}
              className="relative w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 30% 30%, #fff, ${meta.accent} 70%)`,
                boxShadow: `0 0 80px ${meta.accent}aa, inset 0 0 30px rgba(0,0,0,0.15)`,
              }}
            >
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.7, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${meta.accent}` }}
              />
              <Icon size={52} weight="fill" className="text-[#0A0A0F] relative" />
            </motion.div>
          )}
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-2"
        >
          <div
            className="uppercase tracking-[0.22em] font-bold text-[11px]"
            style={{ color: meta.accent }}
          >
            {meta.eyebrow}
          </div>
          <h1
            className="text-white mt-3"
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontWeight: 700,
              fontSize: 56,
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
            }}
            data-testid="success-headline"
          >
            <span style={{ color: meta.accent }}>{meta.verb}</span>
          </h1>
        </motion.div>

        {/* Title + amount */}
        {(state.title || state.amount) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-4"
          >
            {state.title && (
              <div className="text-white/80 text-sm font-semibold">{state.title}</div>
            )}
            {state.amount && (
              <div
                className="text-white mt-3"
                style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: "-0.03em" }}
                data-testid="success-amount"
              >
                {state.amount}
              </div>
            )}
            {state.secondary && (
              <div className="text-white/45 text-[12px] font-mono mt-1">{state.secondary}</div>
            )}
          </motion.div>
        )}

        {/* Receipt */}
        {state.lines && state.lines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-7 rounded-3xl p-5 space-y-3"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--surface-border)",
            }}
            data-testid="success-receipt"
          >
            {state.lines.map((l, i) => (
              <div key={i} className="flex justify-between text-[13px]">
                <div className="text-white/50">{l.label}</div>
                <div className="font-mono text-white/90 truncate ml-3 text-right max-w-[60%]">{l.value}</div>
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
            className="w-full py-4 rounded-full text-[12px] uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2"
            style={{ background: "#D4FF4F", color: "#0A0A0F" }}
          >
            <House size={14} weight="bold" /> {state.ctaLabel || "back to home"}
          </motion.button>
          {state.secondaryCta && (
            <button
              onClick={() => nav(state.secondaryCta.to)}
              data-testid="success-secondary"
              className="w-full text-[11px] tracking-[0.18em] uppercase text-white/55 py-2 font-semibold"
            >
              {state.secondaryCta.label} →
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
