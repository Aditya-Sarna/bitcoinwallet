import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Header from "../components/Header";
import PinPad from "../components/PinPad";
import { api } from "../lib/api";
import { fmtBTC, fmtUSD } from "../lib/format";
import { CheckCircle, Lightning, ClockCountdown, Gauge } from "@phosphor-icons/react";

const TIERS = [
  { k: "slow", label: "Slow", desc: "~30 min", fee: 0.00002, Icon: ClockCountdown },
  { k: "average", label: "Average", desc: "~10 min", fee: 0.00005, Icon: Gauge },
  { k: "fast", label: "Fast", desc: "~2 min", fee: 0.00012, Icon: Lightning },
];

export default function Send() {
  const nav = useNavigate();
  const loc = useLocation();
  const [step, setStep] = useState(0); // 0 form, 1 pin, 2 success
  const [address, setAddress] = useState(loc.state?.address || "");
  const [amount, setAmount] = useState("");
  const [tier, setTier] = useState("average");
  const [pin, setPin] = useState("");
  const [wallet, setWallet] = useState(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get("/wallet/me").then((r) => setWallet(r.data));
    api.get("/market/price").then((r) => setPrice(r.data.price_usd));
  }, []);

  const fee = TIERS.find((t) => t.k === tier).fee;
  const totalBTC = (parseFloat(amount) || 0) + fee;
  const canProceed = address.length > 20 && parseFloat(amount) > 0 && totalBTC <= (wallet?.balance_btc || 0);

  const doSend = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/wallet/send", {
        to_address: address,
        amount_btc: parseFloat(amount),
        fee_tier: tier,
      });
      nav("/success", {
        state: {
          kind: "sent",
          title: "transaction broadcasted",
          subtitle: `+${data.coins_earned} reward coins earned`,
          amount: `${fmtBTC(parseFloat(amount), 8)} BTC`,
          secondary: `≈ $${fmtUSD(parseFloat(amount) * price, 2)}`,
          lines: [
            { label: "to", value: `${address.slice(0, 10)}…${address.slice(-6)}` },
            { label: "network fee", value: `${fmtBTC(fee, 8)} BTC` },
            { label: "total", value: `${fmtBTC(totalBTC, 8)} BTC` },
            { label: "txid", value: `${data.transaction.txid.slice(0, 12)}…` },
          ],
          ctaLabel: "back to home",
          secondaryCta: { label: "view all transactions", to: "/transactions" },
        },
      });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to send");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pin.length === 6 && !loading) doSend();
    // eslint-disable-next-line
  }, [pin]);

  return (
    <div className="shell grain">
      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <Header title="Send Bitcoin" subtitle={`Balance · ${fmtBTC(wallet?.balance_btc, 8)} BTC`} />
              <div className="px-6 flex-1">
                <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-2">recipient address</div>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="bc1q..."
                  data-testid="send-address"
                  className="w-full bg-transparent border-b-2 border-white/10 focus:border-[#D4AF37] outline-none text-base font-mono py-3 placeholder:text-white/20 transition-colors"
                />

                <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mt-8 mb-2">amount</div>
                <div className="flex items-end gap-2">
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0000"
                    data-testid="send-amount"
                    className="flex-1 bg-transparent outline-none text-4xl font-display font-semibold py-2 placeholder:text-white/15"
                  />
                  <div className="text-lg text-white/50 font-mono pb-2">BTC</div>
                </div>
                <div className="text-xs text-white/40 font-mono">
                  ≈ ${fmtUSD((parseFloat(amount) || 0) * price, 2)}
                </div>

                <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mt-8 mb-3">network fee</div>
                <div className="grid grid-cols-3 gap-2">
                  {TIERS.map((t) => (
                    <motion.button
                      key={t.k}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTier(t.k)}
                      data-testid={`send-tier-${t.k}`}
                      className={`rounded-2xl p-3 text-left transition-all ${
                        tier === t.k ? "bg-[#D4AF37]/10 border border-[#D4AF37]" : "glass"
                      }`}
                    >
                      <t.Icon size={14} className={tier === t.k ? "text-gold" : "text-white/60"} />
                      <div className="text-[11px] font-semibold mt-1.5">{t.label}</div>
                      <div className="text-[9px] text-white/50">{t.desc}</div>
                      <div className="text-[9px] font-mono text-white/40 mt-1">{fmtBTC(t.fee, 6)}</div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 glass rounded-2xl p-4 space-y-2">
                  <Row label="Amount" value={`${fmtBTC(parseFloat(amount) || 0, 8)} BTC`} />
                  <Row label="Network fee" value={`${fmtBTC(fee, 8)} BTC`} />
                  <div className="h-px bg-white/10 my-2" />
                  <Row label="Total" value={`${fmtBTC(totalBTC, 8)} BTC`} bold />
                </div>
              </div>
              <div className="p-6">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={!canProceed}
                  onClick={() => setStep(1)}
                  data-testid="send-next-btn"
                  className="w-full gold-gradient disabled:opacity-30 disabled:grayscale text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm"
                >
                  Continue to confirm
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="pin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col">
              <Header title="Confirm with PIN" onBack={() => setStep(0)} />
              <div className="px-6 text-center">
                <div className="text-[10px] tracking-[0.28em] uppercase text-white/40">sending</div>
                <div className="font-display text-4xl font-semibold mt-1">{fmtBTC(parseFloat(amount), 8)} <span className="text-white/40 text-2xl">BTC</span></div>
                <div className="text-xs text-white/50 mt-1 font-mono">≈ ${fmtUSD(parseFloat(amount) * price, 2)}</div>
              </div>
              <div className="flex-1 flex items-center mt-6">
                <div className="w-full">
                  <PinPad value={pin} onChange={setPin} testidPrefix="send-pin" />
                </div>
              </div>
              {loading && <div className="text-center text-gold text-[10px] tracking-[0.3em] uppercase pb-6">broadcasting…</div>}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
                className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center glow-gold mb-6"
              >
                <CheckCircle size={44} weight="fill" className="text-black" />
              </motion.div>
              <h2 className="font-display text-4xl font-semibold" data-testid="send-success-title">sent</h2>
              <div className="text-white/60 mt-2 text-sm">Your transaction is on its way.</div>
              <div className="font-display text-3xl font-semibold mt-6">{fmtBTC(parseFloat(amount), 8)} BTC</div>
              <div className="text-sm text-gold mt-1" data-testid="send-success-coins">+{result?.coins_earned || 0} reward coins earned</div>

              <div className="w-full mt-10 space-y-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => nav("/home")} className="w-full gold-gradient text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm" data-testid="send-done-btn">done</motion.button>
                <button onClick={() => nav("/transactions")} className="w-full text-[10px] tracking-[0.28em] uppercase text-white/50">view transaction</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <div className="text-white/50">{label}</div>
      <div className={`font-mono ${bold ? "text-white font-semibold" : "text-white/80"}`}>{value}</div>
    </div>
  );
}
