import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lightning, WifiHigh, Phone, DropHalf, House as HouseIcon, CheckCircle } from "@phosphor-icons/react";
import Header from "../components/Header";
import { api } from "../lib/api";
import { fmtBTC, fmtUSD } from "../lib/format";

const BILLERS = [
  { k: "Electricity", Icon: Lightning, color: "#FFD700" },
  { k: "Internet", Icon: WifiHigh, color: "#00D09C" },
  { k: "Mobile", Icon: Phone, color: "#FF7A3A" },
  { k: "Water", Icon: DropHalf, color: "#4A90E2" },
  { k: "Rent", Icon: HouseIcon, color: "#D4AF37" },
];

export default function Bills() {
  const [biller, setBiller] = useState("Electricity");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    api.get("/market/price").then((r) => setPrice(r.data.price_usd));
  }, []);

  const pay = async () => {
    if (!account || !amount) return toast.error("Fill all fields");
    setLoading(true);
    try {
      const { data } = await api.post("/bills/pay", {
        biller,
        account,
        amount_usd: parseFloat(amount),
      });
      setDone(data);
      toast.success(`Paid · -${fmtBTC(data.amount_btc, 8)} BTC`);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="shell grain">
        <Header title="Paid" />
        <div className="flex flex-col items-center justify-center px-6 pt-10 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center glow-gold">
            <CheckCircle size={44} weight="fill" className="text-black" />
          </motion.div>
          <h2 className="font-display text-3xl mt-4">bill paid</h2>
          <div className="text-white/60 text-sm mt-2">{biller} · {account}</div>
          <div className="font-display text-2xl mt-4">${fmtUSD(parseFloat(amount), 2)}</div>
          <div className="text-xs text-white/50 font-mono mt-1">{fmtBTC(done.amount_btc, 8)} BTC</div>
          <button
            onClick={() => { setDone(null); setAmount(""); setAccount(""); }}
            data-testid="bills-done-btn"
            className="mt-8 gold-gradient text-black rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em] font-semibold"
          >
            pay another bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shell grain">
      <Header title="Pay bills" subtitle="with bitcoin" />
      <div className="px-6">
        <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-3">select biller</div>
        <div className="grid grid-cols-5 gap-2">
          {BILLERS.map((b) => (
            <motion.button
              key={b.k}
              whileTap={{ scale: 0.92 }}
              onClick={() => setBiller(b.k)}
              data-testid={`bill-biller-${b.k}`}
              className={`flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${
                biller === b.k ? "bg-[#D4AF37]/10 border border-gold" : "glass"
              }`}
            >
              <b.Icon size={18} color={biller === b.k ? "#D4AF37" : b.color} weight="fill" />
              <div className="text-[9px] uppercase tracking-wider text-white/70">{b.k}</div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-2">account / reference</div>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="account number"
            data-testid="bill-account"
            className="w-full bg-transparent border-b-2 border-white/10 focus:border-gold outline-none text-lg font-mono py-2"
          />
        </div>

        <div className="mt-8">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-2">amount (USD)</div>
          <div className="flex items-end gap-2">
            <div className="text-3xl text-white/30 pb-2">$</div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              data-testid="bill-amount"
              className="flex-1 bg-transparent outline-none text-4xl font-display font-semibold py-2"
            />
          </div>
          <div className="text-xs text-white/40 font-mono mt-1">
            ≈ {price ? fmtBTC((parseFloat(amount) || 0) / price, 8) : "0"} BTC
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={pay}
          disabled={loading}
          data-testid="bill-pay-btn"
          className="mt-10 w-full gold-gradient disabled:opacity-40 text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm"
        >
          {loading ? "processing…" : "pay with bitcoin"}
        </motion.button>
      </div>
    </div>
  );
}
