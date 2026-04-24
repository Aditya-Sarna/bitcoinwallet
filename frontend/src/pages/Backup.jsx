import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, Copy, CheckCircle, Warning } from "@phosphor-icons/react";
import Header from "../components/Header";
import { api } from "../lib/api";

export default function Backup() {
  const nav = useNavigate();
  const loc = useLocation();
  const initialPhrase = loc.state?.seedPhrase;
  const [phrase, setPhrase] = useState(initialPhrase || []);
  const [status, setStatus] = useState(null);
  const [step, setStep] = useState(initialPhrase ? 0 : -1); // -1 loading, 0 view, 1 verify, 3 already backed up
  const [shuffled, setShuffled] = useState([]);
  const [picked, setPicked] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data: s } = await api.get("/security/status");
        setStatus(s);
        if (initialPhrase) return;
        if (s.seed_backed_up) {
          setStep(3);
        } else {
          try {
            const { data } = await api.get("/security/seed");
            setPhrase(data.seed_phrase);
            setStep(0);
          } catch (e) {
            toast.error("couldn't load recovery phrase");
            setStep(3);
          }
        }
      } catch (e) {
        toast.error("could not load security status");
      }
    })();
  }, [initialPhrase]);

  useEffect(() => {
    if (step === 1 && phrase.length) {
      const s = [...phrase].sort(() => Math.random() - 0.5);
      setShuffled(s);
      setPicked([]);
    }
  }, [step, phrase]);

  const copyPhrase = () => {
    navigator.clipboard.writeText(phrase.join(" "));
    toast.success("phrase copied — store offline");
  };

  const pick = (word, idx) => {
    if (picked.find((p) => p.idx === idx)) return;
    setPicked((p) => [...p, { word, idx }]);
  };

  const unpick = (idx) => {
    setPicked((p) => p.filter((x) => x.idx !== idx));
  };

  const verify = async () => {
    const words = picked.map((p) => p.word);
    try {
      await api.post("/security/seed/verify", { words });
      nav("/success", {
        state: {
          kind: "backed_up",
          title: "vault fully secured",
          subtitle: "your phrase is verified · safely locked",
          amount: "+250 coins",
          secondary: "security score boosted",
          ctaLabel: "back to home",
          secondaryCta: { label: "view security", to: "/security" },
        },
      });
    } catch (e) {
      toast.error("order doesn't match. try again.");
      setPicked([]);
    }
  };

  return (
    <div className="shell">
      <Header title="backup vault" />
      <div className="px-6 pb-20">
        <AnimatePresence mode="wait">
          {step === -1 && (
            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
              <div className="text-white/40 text-xs tracking-[0.22em] uppercase">loading recovery phrase…</div>
            </motion.div>
          )}

          {step === 0 && (
            <motion.div key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} weight="fill" color="#D4FF4F" />
                <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4FF4F] font-bold">recovery phrase</div>
              </div>
              <h2
                className="text-white leading-[0.95] mb-3"
                style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 48, letterSpacing: "-0.035em" }}
              >
                twelve <span style={{ color: "#D4FF4F" }}>words.</span>
              </h2>
              <p className="text-white/55 text-sm leading-relaxed">
                these are the <span className="font-bold" style={{ color: "#D4FF4F" }}>keys to your vault</span>. write them down. never screenshot. never share. whoever has them, owns your bitcoin.
              </p>

              <div
                className="mt-6 rounded-3xl p-5"
                style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
                data-testid="seed-phrase-grid"
              >
                <div className="grid grid-cols-2 gap-3">
                  {phrase.map((w, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i }}
                      className="flex items-center gap-2 py-2 border-b border-white/5"
                    >
                      <div className="text-[10px] font-mono text-white/30 w-5">{String(i + 1).padStart(2, "0")}</div>
                      <div className="font-mono text-sm font-semibold" data-testid={`seed-word-${i}`}>{w}</div>
                    </motion.div>
                  ))}
                </div>
                <button
                  onClick={copyPhrase}
                  className="mt-4 w-full flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold"
                  style={{ color: "#D4FF4F" }}
                  data-testid="seed-copy"
                >
                  <Copy size={12} /> copy phrase
                </button>
              </div>

              <div
                className="mt-5 rounded-2xl p-4 flex gap-3"
                style={{ background: "rgba(255,62,138,0.1)", border: "1px solid rgba(255,62,138,0.3)" }}
              >
                <Warning size={16} weight="fill" color="#FF3E8A" className="shrink-0 mt-0.5" />
                <div className="text-xs text-white/80">
                  <span className="font-bold" style={{ color: "#FF3E8A" }}>warning.</span> no one from nova will ever ask for these words. screenshots may sync to the cloud — use pen & paper.
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                data-testid="seed-verify-btn"
                className="mt-6 w-full font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[12px]"
                style={{ background: "#D4FF4F", color: "#0A0A0F" }}
              >
                i wrote them down · verify
              </motion.button>

              <button
                onClick={() => nav("/")}
                data-testid="seed-skip-demo"
                className="mt-3 w-full text-center text-[11px] text-white/35 hover:text-white/55 transition-colors"
              >
                skip for demo
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="verify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 font-bold">verify · step 2 of 2</div>
              <h2
                className="text-white leading-[0.95] mt-1 mb-2"
                style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 48, letterSpacing: "-0.035em" }}
              >
                prove <span style={{ color: "#D4FF4F" }}>it.</span>
              </h2>
              <p className="text-white/55 text-sm">tap the words in the <span className="font-bold" style={{ color: "#D4FF4F" }}>correct order</span>.</p>

              <div
                className="mt-6 rounded-3xl p-4 min-h-[140px]"
                style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
              >
                <div className="text-[9px] tracking-[0.2em] uppercase text-white/40 mb-2 font-bold">your order</div>
                <div className="flex flex-wrap gap-2">
                  {picked.map((p, pi) => (
                    <motion.button
                      key={p.idx}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      onClick={() => unpick(p.idx)}
                      className="px-3 py-1.5 rounded-full text-xs font-mono font-bold"
                      style={{ background: "#D4FF4F", color: "#0A0A0F" }}
                      data-testid={`picked-${p.idx}`}
                    >
                      {pi + 1}. {p.word}
                    </motion.button>
                  ))}
                  {picked.length === 0 && <div className="text-white/30 text-xs">pick words below…</div>}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {shuffled.map((w, i) => {
                  const isPicked = picked.find((p) => p.idx === i);
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.92 }}
                      disabled={!!isPicked}
                      onClick={() => pick(w, i)}
                      data-testid={`shuffled-${i}`}
                      className="py-2.5 rounded-xl text-xs font-mono font-semibold transition-all"
                      style={
                        isPicked
                          ? { opacity: 0.2, background: "var(--surface)" }
                          : { background: "var(--surface)", border: "1px solid var(--surface-border)" }
                      }
                    >
                      {w}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={picked.length !== 12}
                onClick={verify}
                data-testid="seed-confirm-btn"
                className="mt-6 w-full disabled:opacity-30 font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[12px]"
                style={{ background: "#D4FF4F", color: "#0A0A0F" }}
              >
                confirm backup
              </motion.button>

              <button
                onClick={() => setStep(0)}
                data-testid="seed-back-view"
                className="mt-4 w-full text-[10px] tracking-[0.22em] uppercase text-white/45 font-semibold"
              >
                ← view phrase again
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-10">
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ background: "#D4FF4F22", border: "1px solid #D4FF4F55" }}
              >
                <CheckCircle size={22} weight="fill" color="#D4FF4F" />
              </div>
              <h2
                className="mt-4 text-white"
                style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: "-0.03em" }}
              >
                vault <span style={{ color: "#D4FF4F" }}>secured.</span>
              </h2>
              <p className="text-white/50 text-sm mt-2">your recovery phrase is verified and backed up.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
