import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CurrencyBtc, ShieldCheck, Sparkle } from "@phosphor-icons/react";
import PinPad from "../components/PinPad";
import { api } from "../lib/api";

export default function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(0); // 0 welcome, 1 name, 2 pin, 3 confirm
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (finalConfirm) => {
    const c = finalConfirm !== undefined ? finalConfirm : confirm;
    if (pin !== c) {
      toast.error("PINs do not match. Try again.");
      setConfirm("");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, pin });
      localStorage.setItem("btc_token", data.token);
      localStorage.setItem("btc_wallet_id", data.wallet_id);
      localStorage.setItem("btc_name", data.name);
      toast.success(`Welcome, ${data.name}`);
      nav("/home");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell grain">
      <div className="bg-radial-gold" />
      <div className="relative z-10 px-6 pt-16 pb-10 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-20">
                <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center">
                  <CurrencyBtc size={18} weight="bold" className="text-black" />
                </div>
                <div className="text-xs tracking-[0.3em] uppercase text-white/60">SatVault</div>
              </div>

              <div className="flex-1">
                <div className="text-[10px] tracking-[0.35em] uppercase text-gold/70 mb-4">
                  · Members only ·
                </div>
                <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight">
                  The Bitcoin<br />wallet for the<br />
                  <span className="text-gold">one percent.</span>
                </h1>
                <p className="text-white/60 mt-6 max-w-sm leading-relaxed">
                  A members-only wallet where every transaction earns you rewards worth 10,000+ coins at luxury brands.
                </p>

                <div className="mt-10 space-y-3">
                  {[
                    { i: ShieldCheck, t: "Military-grade vault security" },
                    { i: Sparkle, t: "Exclusive rewards & bitcoin score" },
                    { i: CurrencyBtc, t: "Send, receive, pay bills in BTC" },
                  ].map(({ i: Ic, t }, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-center gap-3 glass rounded-2xl p-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                        <Ic size={16} weight="bold" className="text-gold" />
                      </div>
                      <div className="text-sm text-white/80">{t}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                data-testid="get-started-btn"
                className="gold-gradient text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm mt-8 glow-gold"
              >
                Get Started
              </motion.button>
              <div className="text-center text-[10px] tracking-[0.25em] uppercase text-white/30 mt-4">
                already a member? <span onClick={() => nav("/lock")} className="text-white/60 cursor-pointer" data-testid="existing-member-link">sign in</span>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-[10px] tracking-[0.35em] uppercase text-white/40 mb-4">Step 1 of 2</div>
              <h2 className="font-display text-4xl font-semibold tracking-tight">what should<br />we call you?</h2>
              <p className="text-white/50 mt-3 text-sm">This is how we'll address you inside the vault.</p>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name"
                data-testid="onboarding-name-input"
                className="mt-10 bg-transparent border-b-2 border-white/15 focus:border-[#D4AF37] outline-none text-3xl font-display py-3 placeholder:text-white/20 transition-colors"
                autoFocus
              />

              <div className="flex-1" />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => name.trim() && setStep(2)}
                disabled={!name.trim()}
                data-testid="onboarding-name-next"
                className="gold-gradient disabled:opacity-40 text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm"
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-[10px] tracking-[0.35em] uppercase text-white/40 mb-4">Step 2 of 2</div>
              <h2 className="font-display text-4xl font-semibold tracking-tight">create your<br />secret PIN</h2>
              <p className="text-white/50 mt-3 text-sm">6 digits. You'll use this to unlock the vault.</p>

              <div className="mt-12">
                <PinPad
                  value={pin}
                  onChange={(v) => {
                    setPin(v);
                    if (v.length === 6) setTimeout(() => setStep(3), 250);
                  }}
                  testidPrefix="onb-pin"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="font-display text-4xl font-semibold tracking-tight">confirm<br />your PIN</h2>
              <p className="text-white/50 mt-3 text-sm">Enter it once more to lock it in.</p>

              <div className="mt-12">
                <PinPad
                  value={confirm}
                  onChange={(v) => {
                    setConfirm(v);
                    if (v.length === 6 && !loading) setTimeout(() => submit(v), 200);
                  }}
                  testidPrefix="onb-confirm"
                />
              </div>

              {loading && (
                <div className="text-center mt-6 text-gold text-xs tracking-[0.3em] uppercase">creating vault…</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
