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
  const [confirmed, setConfirmed] = useState(false);
  const [shuffled, setShuffled] = useState([]);
  const [picked, setPicked] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data: s } = await api.get("/security/status");
        setStatus(s);
        if (initialPhrase) return; // already have it
        if (s.seed_backed_up) {
          setStep(3);
        } else {
          // fetch the seed
          try {
            const { data } = await api.get("/security/seed");
            setPhrase(data.seed_phrase);
            setStep(0);
          } catch (e) {
            toast.error("Couldn't load recovery phrase");
            setStep(3);
          }
        }
      } catch (e) {
        toast.error("Could not load security status");
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
    toast.success("Phrase copied — store offline");
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
          subtitle: "your phrase is verified · phrase is now locked",
          amount: "+250 coins",
          secondary: "security score boosted",
          ctaLabel: "back to home",
          secondaryCta: { label: "view security", to: "/security" },
        },
      });
    } catch (e) {
      toast.error("Order doesn't match. Try again.");
      setPicked([]);
    }
  };

  return (
    <div className="shell grain">
      <Header title="Backup vault" />
      <div className="px-6 pb-20">
        <AnimatePresence mode="wait">
          {step === -1 && (
            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
              <div className="text-white/40 text-xs tracking-[0.25em] uppercase">loading recovery phrase…</div>
            </motion.div>
          )}

          {step === 0 && (
            <motion.div key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} weight="fill" className="text-gold" />
                <div className="text-[10px] tracking-[0.28em] uppercase text-white/50">recovery phrase</div>
              </div>
              <h2 className="font-cursive text-6xl text-white/95 leading-none mb-3">twelve words.</h2>
              <p className="text-white/55 text-sm leading-relaxed">
                These are the <span className="font-serif-italic text-gold">keys to your kingdom</span>. Write them down. Never screenshot. Never share. Whoever has them, owns your bitcoin.
              </p>

              <div className="mt-6 glass rounded-3xl p-5" data-testid="seed-phrase-grid">
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
                      <div className="font-mono text-sm" data-testid={`seed-word-${i}`}>{w}</div>
                    </motion.div>
                  ))}
                </div>
                <button onClick={copyPhrase} className="mt-4 w-full flex items-center justify-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gold" data-testid="seed-copy">
                  <Copy size={12} /> copy phrase
                </button>
              </div>

              <div className="mt-5 glass rounded-2xl p-4 flex gap-3">
                <Warning size={16} weight="fill" className="text-[#FF7A3A] shrink-0 mt-0.5" />
                <div className="text-xs text-white/70">
                  <span className="font-serif-italic text-[#FF7A3A]">warning.</span> No one from SatVault will ever ask for these words. Screenshots may sync to the cloud — use pen & paper.
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                data-testid="seed-verify-btn"
                className="mt-6 w-full gold-gradient text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm"
              >
                I wrote them down · verify
              </motion.button>
            </motion.div>
          )}

          {step === 1 && !confirmed && (
            <motion.div key="verify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-[10px] tracking-[0.28em] uppercase text-white/40">verify · step 2 of 2</div>
              <h2 className="font-cursive text-6xl text-white/95 leading-none mt-1 mb-2">prove it.</h2>
              <p className="text-white/55 text-sm">Tap the words in the <span className="font-serif-italic text-gold">correct order</span>.</p>

              <div className="mt-6 glass rounded-3xl p-4 min-h-[140px]">
                <div className="text-[9px] tracking-[0.25em] uppercase text-white/30 mb-2">your order</div>
                <div className="flex flex-wrap gap-2">
                  {picked.map((p, pi) => (
                    <motion.button
                      key={p.idx}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      onClick={() => unpick(p.idx)}
                      className="px-3 py-1.5 rounded-full text-xs font-mono bg-[#D4AF37] text-black"
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
                      className={`py-2.5 rounded-xl text-xs font-mono transition-all ${
                        isPicked ? "opacity-20 bg-white/5" : "glass hover:bg-white/10"
                      }`}
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
                className="mt-6 w-full gold-gradient disabled:opacity-30 text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm"
              >
                confirm backup
              </motion.button>

              <button
                onClick={() => setStep(0)}
                data-testid="seed-back-view"
                className="mt-4 w-full text-[10px] tracking-[0.25em] uppercase text-white/40"
              >
                ← view phrase again
              </button>
            </motion.div>
          )}

          {confirmed && (
            <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center text-center pt-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                transition={{ type: "spring", duration: 1 }}
                className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center glow-gold"
              >
                <CheckCircle size={44} weight="fill" className="text-black" />
              </motion.div>
              <h2 className="font-cursive text-6xl mt-6">secured.</h2>
              <div className="text-white/60 text-sm mt-2">Your vault is fully backed up.</div>
              <div className="text-gold text-xs mt-2 tracking-wider uppercase">+250 coins bonus</div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#00D09C]/10 border border-[#00D09C]/30 flex items-center justify-center">
                <CheckCircle size={22} weight="fill" className="text-[#00D09C]" />
              </div>
              <h2 className="font-display text-2xl mt-4">vault secured</h2>
              <p className="text-white/50 text-sm mt-2">Your recovery phrase is verified and backed up.</p>
              <p className="font-serif-italic text-xs text-white/40 mt-4">the phrase is locked — as it should be.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
