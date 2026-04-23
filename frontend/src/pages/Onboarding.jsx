import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, ShieldCheck, Sparkle, Lightning } from "@phosphor-icons/react";
import PinPad from "../components/PinPad";
import Logo, { Wordmark } from "../components/Logo";
import { api } from "../lib/api";

export default function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (finalConfirm) => {
    const c = finalConfirm !== undefined ? finalConfirm : confirm;
    if (pin !== c) {
      toast.error("PINs don't match. Try again.");
      setConfirm("");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, pin });
      localStorage.setItem("btc_token", data.token);
      localStorage.setItem("btc_wallet_id", data.wallet_id);
      localStorage.setItem("btc_name", data.name);
      toast.success(`welcome, ${data.name}`);
      nav("/backup", { state: { seedPhrase: data.seed_phrase } });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col overflow-hidden"
            style={{ background: "#0A0A0F" }}
            data-testid="onboarding-welcome"
          >
            {/* Electric radial glows */}
            <div
              className="absolute -top-24 -left-16 w-80 h-80 rounded-full blur-3xl opacity-60 pointer-events-none"
              style={{ background: "radial-gradient(circle, #FF3E8A 0%, transparent 65%)" }}
            />
            <div
              className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full blur-3xl opacity-50 pointer-events-none"
              style={{ background: "radial-gradient(circle, #6B5CFC 0%, transparent 65%)" }}
            />
            <div
              className="absolute top-1/3 right-10 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, #D4FF4F 0%, transparent 65%)" }}
            />

            {/* dot grid */}
            <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

            <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-8">
              {/* Wordmark top */}
              <div className="flex items-center justify-between">
                <Wordmark size={12} />
                <div className="text-[10px] tracking-[0.22em] uppercase text-white/40 font-semibold">v1 · beta</div>
              </div>

              {/* Big hero card — the "money on steroids" style */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 relative rounded-[32px] overflow-hidden p-6"
                style={{
                  background: "linear-gradient(155deg, #FF3E8A 0%, #6B5CFC 55%, #34D8FF 100%)",
                  minHeight: 380,
                  boxShadow: "0 30px 60px rgba(107,92,252,0.35)",
                }}
              >
                {/* noise */}
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  }}
                />
                <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full blur-2xl opacity-70"
                     style={{ background: "radial-gradient(circle, #FFF 0%, transparent 70%)" }} />

                <div className="relative h-full flex flex-col justify-between" style={{ minHeight: 340 }}>
                  <div className="flex items-start justify-between">
                    <Logo size={46} primary="#D4FF4F" secondary="#FFFFFF" />
                    <div className="text-[10px] tracking-[0.22em] uppercase text-white font-bold opacity-80">
                      the new way <br /> to hold bitcoin
                    </div>
                  </div>

                  <div>
                    <h1
                      className="text-white leading-[0.88] tracking-[-0.04em]"
                      style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 72 }}
                    >
                      your<br />
                      <span style={{ color: "#D4FF4F" }}>bitcoin.</span><br />
                      on steroids.
                    </h1>
                    <div className="flex items-center gap-2 mt-4">
                      <Lightning size={14} weight="fill" className="text-white" />
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/90 font-semibold">
                        rewards · stores · instant settles
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex-1" />

              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex flex-col gap-2.5"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(1)}
                  data-testid="get-started-btn"
                  className="w-full py-4 rounded-full text-[13px] tracking-[0.12em] uppercase font-bold flex items-center justify-center gap-2"
                  style={{ background: "#D4FF4F", color: "#0A0A0F" }}
                >
                  get started <ArrowRight size={14} weight="bold" />
                </motion.button>
                <button
                  onClick={() => nav("/lock")}
                  data-testid="existing-member-link"
                  className="text-[11px] tracking-[0.18em] uppercase text-white/55 py-2 font-semibold hover:text-white transition-colors"
                >
                  already have an account · sign in
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="pillars"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col px-6 pt-14 pb-8 relative overflow-hidden"
            style={{ background: "#0A0A0F" }}
          >
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, #D4FF4F 0%, transparent 70%)" }}
            />
            <div className="text-[10px] tracking-[0.24em] uppercase text-white/45 mb-3 font-semibold">three promises</div>
            <h2
              className="text-white tracking-[-0.035em] leading-[0.95] mb-8"
              style={{ fontFamily: "Clash Display, sans-serif", fontSize: 52, fontWeight: 700 }}
            >
              built for<br />
              the <span style={{ color: "#D4FF4F" }}>fast lane.</span>
            </h2>

            <div className="space-y-3 relative z-10">
              <Pillar
                num="01"
                Icon={ShieldCheck}
                color="#D4FF4F"
                title="locked down tight."
                desc="12-word recovery, biometrics, encrypted keys."
              />
              <Pillar
                num="02"
                Icon={Lightning}
                color="#FF3E8A"
                title="spend anywhere."
                desc="send, pay, settle — instantly in bitcoin."
              />
              <Pillar
                num="03"
                Icon={Sparkle}
                color="#6B5CFC"
                title="earn every tap."
                desc="coins, gems and vouchers on every transaction."
              />
            </div>

            <div className="flex-1" />

            <div className="space-y-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                data-testid="onboarding-pillars-next"
                className="w-full py-4 rounded-full text-[12px] tracking-[0.16em] uppercase font-bold flex items-center justify-center gap-2"
                style={{ background: "#D4FF4F", color: "#0A0A0F" }}
              >
                continue <ArrowRight size={14} weight="bold" />
              </motion.button>
              <button
                onClick={() => setStep(0)}
                className="w-full text-[10px] tracking-[0.2em] uppercase text-white/40 py-2 font-semibold"
              >
                ← back
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="min-h-screen flex flex-col px-6 pt-14 pb-8 relative overflow-hidden"
            style={{ background: "#0A0A0F" }}
          >
            <div
              className="absolute top-10 -left-20 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, #FF3E8A 0%, transparent 70%)" }}
            />
            <div className="text-[10px] tracking-[0.24em] uppercase text-white/45 mb-3 font-semibold">step 1 of 2</div>
            <h2
              className="text-white tracking-[-0.035em] leading-[0.95]"
              style={{ fontFamily: "Clash Display, sans-serif", fontSize: 48, fontWeight: 700 }}
            >
              what should<br />
              we <span style={{ color: "#D4FF4F" }}>call you?</span>
            </h2>
            <p className="text-white/50 text-[13px] mt-3">this is your name inside nova.</p>

            <div className="mt-10 relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="type your name"
                data-testid="onboarding-name-input"
                className="w-full bg-transparent border-b-2 border-white/15 focus:border-[#D4FF4F] outline-none py-4 placeholder:text-white/20 transition-colors text-white"
                style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 600, fontSize: 32 }}
                autoFocus
              />
            </div>

            <div className="flex-1" />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => name.trim() && setStep(3)}
              disabled={!name.trim()}
              data-testid="onboarding-name-next"
              className="w-full py-4 rounded-full text-[12px] tracking-[0.16em] uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-30"
              style={{ background: "#D4FF4F", color: "#0A0A0F" }}
            >
              continue <ArrowRight size={14} weight="bold" />
            </motion.button>
            <button
              onClick={() => setStep(1)}
              className="w-full text-[10px] tracking-[0.2em] uppercase text-white/40 py-2 mt-1 font-semibold"
            >
              ← back
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="min-h-screen flex flex-col px-6 pt-14 pb-8 relative overflow-hidden"
            style={{ background: "#0A0A0F" }}
          >
            <div className="text-[10px] tracking-[0.24em] uppercase text-white/45 mb-3 font-semibold">step 2 of 2</div>
            <h2
              className="text-white tracking-[-0.035em] leading-[0.95]"
              style={{ fontFamily: "Clash Display, sans-serif", fontSize: 48, fontWeight: 700 }}
            >
              create your<br />
              <span style={{ color: "#D4FF4F" }}>secret pin.</span>
            </h2>
            <p className="text-white/50 text-[13px] mt-3">six digits · used to unlock your vault.</p>

            <div className="mt-10 flex-1 flex items-center">
              <div className="w-full">
                <PinPad
                  value={pin}
                  onChange={(v) => {
                    setPin(v);
                    if (v.length === 6) setTimeout(() => setStep(4), 250);
                  }}
                  testidPrefix="onb-pin"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="min-h-screen flex flex-col px-6 pt-14 pb-8 relative overflow-hidden"
            style={{ background: "#0A0A0F" }}
          >
            <div className="text-[10px] tracking-[0.24em] uppercase text-white/45 mb-3 font-semibold">almost there</div>
            <h2
              className="text-white tracking-[-0.035em] leading-[0.95]"
              style={{ fontFamily: "Clash Display, sans-serif", fontSize: 48, fontWeight: 700 }}
            >
              confirm your<br />
              <span style={{ color: "#D4FF4F" }}>pin.</span>
            </h2>
            <p className="text-white/50 text-[13px] mt-3">enter it once more to lock it in.</p>

            <div className="mt-10 flex-1 flex items-center">
              <div className="w-full">
                <PinPad
                  value={confirm}
                  onChange={(v) => {
                    setConfirm(v);
                    if (v.length === 6 && !loading) setTimeout(() => submit(v), 200);
                  }}
                  testidPrefix="onb-confirm"
                />
              </div>
            </div>

            {loading && (
              <div className="text-center text-[#D4FF4F] text-[10px] tracking-[0.26em] uppercase font-semibold">creating your vault…</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pillar({ num, Icon, title, desc, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + Number(num) * 0.08 }}
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, border: `1px solid ${color}55` }}
      >
        <Icon size={18} weight="fill" color={color} />
      </div>
      <div className="flex-1">
        <div className="text-white text-[15px] font-semibold leading-tight">{title}</div>
        <div className="text-white/50 text-[12px] mt-0.5">{desc}</div>
      </div>
      <div className="text-[10px] font-mono text-white/25">{num}</div>
    </motion.div>
  );
}
