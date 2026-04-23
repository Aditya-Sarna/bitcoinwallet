import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, ShieldCheck, Sparkle, CurrencyBtc } from "@phosphor-icons/react";
import PinPad from "../components/PinPad";
import { api } from "../lib/api";
import { ART } from "../lib/images";

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
      nav("/backup", { state: { seedPhrase: data.seed_phrase } });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell relative overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col"
          >
            {/* Hero image background */}
            <motion.img
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              src={ART.onboardingHero}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "saturate(0.7) contrast(1.1)" }}
            />
            {/* Tonal scrim */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.95) 100%)" }} />

            {/* Subtle grain */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
              }}
            />

            <div className="relative z-10 flex-1 flex flex-col px-7 pt-16 pb-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CurrencyBtc size={16} weight="bold" className="text-white/85" />
                  <div className="text-[10px] tracking-[0.32em] uppercase text-white/70">SatVault</div>
                </div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-white/45">est. 2026</div>
              </div>

              <div className="flex-1" />

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="text-[10px] tracking-[0.34em] uppercase text-white/55 mb-5">a quiet vault for bitcoin</div>
                <h1
                  className="text-white leading-[0.95] tracking-tight"
                  style={{
                    fontFamily: "Instrument Serif, serif",
                    fontStyle: "italic",
                    fontSize: "62px",
                    fontWeight: 400,
                  }}
                >
                  fortunes,<br />
                  <span className="not-italic" style={{ fontFamily: "Instrument Serif, serif" }}>kept</span>{" "}
                  <span style={{ fontStyle: "italic" }}>quietly.</span>
                </h1>
                <p className="text-white/60 text-[13px] mt-5 leading-relaxed max-w-[300px]">
                  A members-only bitcoin wallet for those who prefer compounding over conversation.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-10 flex flex-col gap-3"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(1)}
                  data-testid="get-started-btn"
                  className="w-full py-4 rounded-full text-sm tracking-[0.22em] uppercase font-medium flex items-center justify-center gap-3"
                  style={{ background: "#EFE6D2", color: "#1a1410" }}
                >
                  begin <ArrowRight size={14} weight="bold" />
                </motion.button>
                <button
                  onClick={() => nav("/lock")}
                  data-testid="existing-member-link"
                  className="text-[10px] tracking-[0.28em] uppercase text-white/50 py-2"
                >
                  already a member · enter
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
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col px-7 pt-16 pb-10 bg-black"
          >
            <div className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-3">three principles</div>
            <h2
              className="text-white tracking-tight leading-[1] mb-10"
              style={{ fontFamily: "Instrument Serif, serif", fontSize: 44 }}
            >
              <span style={{ fontStyle: "italic" }}>quiet,</span> by design.
            </h2>

            <div className="space-y-5">
              <Pillar
                num="01"
                Icon={ShieldCheck}
                title={<>secured <span style={{ fontStyle: "italic" }}>completely.</span></>}
                desc="twelve-word recovery, biometric guard, encrypted at rest."
              />
              <Pillar
                num="02"
                Icon={CurrencyBtc}
                title={<>spent <span style={{ fontStyle: "italic" }}>seamlessly.</span></>}
                desc="send, receive, settle bills — all in bitcoin."
              />
              <Pillar
                num="03"
                Icon={Sparkle}
                title={<>rewarded <span style={{ fontStyle: "italic" }}>quietly.</span></>}
                desc="every transaction earns coins, redeemable at curated brands."
              />
            </div>

            <div className="flex-1" />

            <div className="space-y-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                data-testid="onboarding-pillars-next"
                className="w-full py-4 rounded-full text-sm tracking-[0.22em] uppercase font-medium flex items-center justify-center gap-3"
                style={{ background: "#EFE6D2", color: "#1a1410" }}
              >
                continue <ArrowRight size={14} weight="bold" />
              </motion.button>
              <button onClick={() => setStep(0)} className="w-full text-[10px] tracking-[0.28em] uppercase text-white/40 py-2">
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
            className="min-h-screen flex flex-col px-7 pt-16 pb-10 bg-black"
          >
            <div className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-3">step 1 of 2</div>
            <h2
              className="text-white tracking-tight leading-[1.05]"
              style={{ fontFamily: "Instrument Serif, serif", fontSize: 42 }}
            >
              what shall we<br />
              <span style={{ fontStyle: "italic" }}>call you?</span>
            </h2>
            <p className="text-white/45 text-[13px] mt-3">your address inside the vault.</p>

            <div className="mt-12 relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aditya"
                data-testid="onboarding-name-input"
                className="w-full bg-transparent border-b border-white/15 focus:border-[#EFE6D2] outline-none py-4 placeholder:text-white/15 transition-colors"
                style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: 36 }}
                autoFocus
              />
              <div className="text-[9px] tracking-[0.28em] uppercase text-white/30 mt-2">type your name</div>
            </div>

            <div className="flex-1" />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => name.trim() && setStep(3)}
              disabled={!name.trim()}
              data-testid="onboarding-name-next"
              className="w-full py-4 rounded-full text-sm tracking-[0.22em] uppercase font-medium flex items-center justify-center gap-3 disabled:opacity-30"
              style={{ background: "#EFE6D2", color: "#1a1410" }}
            >
              continue <ArrowRight size={14} weight="bold" />
            </motion.button>
            <button onClick={() => setStep(1)} className="w-full text-[10px] tracking-[0.28em] uppercase text-white/40 py-2 mt-1">
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
            className="min-h-screen flex flex-col px-7 pt-16 pb-10 bg-black"
          >
            <div className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-3">step 2 of 2</div>
            <h2
              className="text-white tracking-tight leading-[1.05]"
              style={{ fontFamily: "Instrument Serif, serif", fontSize: 42 }}
            >
              create your<br />
              <span style={{ fontStyle: "italic" }}>secret pin.</span>
            </h2>
            <p className="text-white/45 text-[13px] mt-3">six digits · used to unlock the vault.</p>

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
            className="min-h-screen flex flex-col px-7 pt-16 pb-10 bg-black"
          >
            <div className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-3">final step</div>
            <h2
              className="text-white tracking-tight leading-[1.05]"
              style={{ fontFamily: "Instrument Serif, serif", fontSize: 42 }}
            >
              confirm your<br />
              <span style={{ fontStyle: "italic" }}>pin.</span>
            </h2>
            <p className="text-white/45 text-[13px] mt-3">enter it once more to lock it in.</p>

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
              <div className="text-center text-white/55 text-[10px] tracking-[0.3em] uppercase">creating your vault…</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pillar({ num, Icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + Number(num) * 0.08 }}
      className="flex items-start gap-4 py-3 border-b border-white/8"
      style={{ borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="text-[10px] font-mono text-white/30 mt-2">{num}</div>
      <div className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center mt-1 shrink-0">
        <Icon size={14} className="text-white/80" />
      </div>
      <div className="flex-1">
        <div className="text-white text-base" style={{ fontFamily: "Instrument Serif, serif" }}>{title}</div>
        <div className="text-white/45 text-[12px] mt-0.5">{desc}</div>
      </div>
    </motion.div>
  );
}
