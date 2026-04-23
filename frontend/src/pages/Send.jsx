import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Header from "../components/Header";
import PinPad from "../components/PinPad";
import AmountWheel from "../components/AmountWheel";
import { api } from "../lib/api";
import { fmtBTC, fmtUSD } from "../lib/format";
import { Lightning, ClockCountdown, Gauge } from "@phosphor-icons/react";

const TIERS = [
  { k: "slow",    label: "slow",    desc: "~30 min", fee: 0.00002, Icon: ClockCountdown, color: "#6B5CFC" },
  { k: "average", label: "average", desc: "~10 min", fee: 0.00005, Icon: Gauge,          color: "#34D8FF" },
  { k: "fast",    label: "fast",    desc: "~2 min",  fee: 0.00012, Icon: Lightning,      color: "#D4FF4F" },
];

export default function Send() {
  const nav = useNavigate();
  const loc = useLocation();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(loc.state?.address || "");
  const [amount, setAmount] = useState("");
  const [tier, setTier] = useState("average");
  const [pin, setPin] = useState("");
  const [wallet, setWallet] = useState(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

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
          receiverInitial: address.slice(4, 5).toUpperCase(),
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
      toast.error(e?.response?.data?.detail || "failed to send");
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
    <div className="shell">
      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <Header title="send bitcoin" subtitle={`balance · ${fmtBTC(wallet?.balance_btc, 8)} BTC`} />
              <div className="px-6 flex-1">
                <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-2 font-semibold">recipient address</div>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="bc1q..."
                  data-testid="send-address"
                  className="w-full bg-transparent border-b-2 border-white/10 focus:border-[#D4FF4F] outline-none text-base font-mono py-3 placeholder:text-white/20 transition-colors"
                />

                <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mt-8 mb-2 font-semibold">amount</div>
                <div className="flex items-end gap-2">
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0000"
                    data-testid="send-amount"
                    className="flex-1 bg-transparent outline-none text-5xl font-display font-bold py-2 placeholder:text-white/15"
                    style={{ letterSpacing: "-0.04em" }}
                  />
                  <div className="text-lg text-white/50 font-mono pb-2">BTC</div>
                </div>
                <div className="text-xs text-white/50 font-mono">
                  ≈ ${fmtUSD((parseFloat(amount) || 0) * price, 2)}
                </div>

                <div className="text-[10px] tracking-[0.22em] uppercase text-white/40 mt-5 mb-1 font-semibold">or scroll · presets</div>
                <AmountWheel onPick={(v) => setAmount(String(v))} current={parseFloat(amount) || 0} />

                <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mt-8 mb-3 font-semibold">network fee</div>
                <div className="grid grid-cols-3 gap-2">
                  {TIERS.map((t) => (
                    <motion.button
                      key={t.k}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTier(t.k)}
                      data-testid={`send-tier-${t.k}`}
                      className="rounded-2xl p-3 text-left transition-all"
                      style={
                        tier === t.k
                          ? { background: `${t.color}22`, border: `1px solid ${t.color}` }
                          : { background: "var(--surface)", border: "1px solid var(--surface-border)" }
                      }
                    >
                      <t.Icon size={14} color={tier === t.k ? t.color : "#ffffff99"} weight="bold" />
                      <div className="text-[11px] font-bold mt-1.5 lowercase">{t.label}</div>
                      <div className="text-[9px] text-white/50">{t.desc}</div>
                      <div className="text-[9px] font-mono text-white/45 mt-1">{fmtBTC(t.fee, 6)}</div>
                    </motion.button>
                  ))}
                </div>

                <div
                  className="mt-8 rounded-2xl p-4 space-y-2"
                  style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
                >
                  <Row label="amount" value={`${fmtBTC(parseFloat(amount) || 0, 8)} BTC`} />
                  <Row label="network fee" value={`${fmtBTC(fee, 8)} BTC`} />
                  <div className="h-px bg-white/10 my-2" />
                  <Row label="total" value={`${fmtBTC(totalBTC, 8)} BTC`} bold />
                </div>
              </div>
              <div className="p-6">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={!canProceed}
                  onClick={() => setStep(1)}
                  data-testid="send-next-btn"
                  className="w-full disabled:opacity-30 disabled:grayscale font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[12px]"
                  style={{ background: "#D4FF4F", color: "#0A0A0F" }}
                >
                  continue to confirm
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="pin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col">
              <Header title="confirm with pin" onBack={() => setStep(0)} />
              <div className="px-6 text-center">
                <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4FF4F] font-bold">sending</div>
                <div
                  className="text-white mt-2"
                  style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 42, letterSpacing: "-0.035em" }}
                >
                  {fmtBTC(parseFloat(amount), 8)} <span className="text-white/40 text-2xl">BTC</span>
                </div>
                <div className="text-xs text-white/50 mt-1 font-mono">≈ ${fmtUSD(parseFloat(amount) * price, 2)}</div>
              </div>
              <div className="flex-1 flex items-center mt-6">
                <div className="w-full">
                  <PinPad value={pin} onChange={setPin} testidPrefix="send-pin" />
                </div>
              </div>
              {loading && <div className="text-center text-[#D4FF4F] text-[10px] tracking-[0.24em] uppercase pb-6 font-bold">broadcasting…</div>}
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
      <div className={`font-mono ${bold ? "text-white font-bold" : "text-white/80"}`}>{value}</div>
    </div>
  );
}
