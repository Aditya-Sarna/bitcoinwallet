import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lightning, WifiHigh, Phone, DropHalf, House as HouseIcon } from "@phosphor-icons/react";
import Header from "../components/Header";
import { api } from "../lib/api";
import { fmtBTC, fmtUSD } from "../lib/format";

const BILLERS = [
  { k: "Electricity", Icon: Lightning, color: "#D4FF4F" },
  { k: "Internet",    Icon: WifiHigh,  color: "#34D8FF" },
  { k: "Mobile",      Icon: Phone,     color: "#FF3E8A" },
  { k: "Water",       Icon: DropHalf,  color: "#6B5CFC" },
  { k: "Rent",        Icon: HouseIcon, color: "#FF7A3A" },
];

export default function Bills() {
  const nav = useNavigate();
  const [biller, setBiller] = useState("Electricity");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/market/price").then((r) => setPrice(r.data.price_usd));
  }, []);

  const pay = async () => {
    if (!account || !amount) return toast.error("fill all fields");
    setLoading(true);
    try {
      const { data } = await api.post("/bills/pay", {
        biller,
        account,
        amount_usd: parseFloat(amount),
      });
      nav("/success", {
        state: {
          kind: "paid",
          title: `${biller.toLowerCase()} bill settled`,
          subtitle: `account · ${account}`,
          amount: `$${fmtUSD(parseFloat(amount), 2)}`,
          secondary: `${fmtBTC(data.amount_btc, 8)} BTC`,
          lines: [
            { label: "biller", value: biller },
            { label: "account", value: account },
            { label: "btc spent", value: `${fmtBTC(data.amount_btc, 8)}` },
            { label: "new balance", value: `${fmtBTC(data.new_balance, 8)} BTC` },
          ],
          ctaLabel: "back to home",
          secondaryCta: { label: "pay another bill", to: "/bills" },
        },
      });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "payment failed");
    } finally {
      setLoading(false);
    }
  };

  const activeBiller = BILLERS.find((b) => b.k === biller);

  return (
    <div className="shell">
      <Header title="pay bills" subtitle="with bitcoin" />
      <div className="px-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4FF4F] font-bold mb-3">select biller</div>
        <div className="grid grid-cols-5 gap-2">
          {BILLERS.map((b) => (
            <motion.button
              key={b.k}
              whileTap={{ scale: 0.92 }}
              onClick={() => setBiller(b.k)}
              data-testid={`bill-biller-${b.k}`}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl transition-all"
              style={
                biller === b.k
                  ? { background: `${b.color}22`, border: `1px solid ${b.color}` }
                  : { background: "var(--surface)", border: "1px solid var(--surface-border)" }
              }
            >
              <b.Icon size={18} color={b.color} weight="fill" />
              <div className="text-[9px] uppercase tracking-wider text-white/75 font-semibold">{b.k}</div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8">
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-2 font-bold">account / reference</div>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="account number"
            data-testid="bill-account"
            className="w-full bg-transparent border-b-2 border-white/10 focus:border-[#D4FF4F] outline-none text-lg font-mono py-2"
          />
        </div>

        <div className="mt-8">
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-2 font-bold">amount (usd)</div>
          <div className="flex items-end gap-2">
            <div className="text-3xl text-white/30 pb-2 font-bold">$</div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              data-testid="bill-amount"
              className="flex-1 bg-transparent outline-none font-display font-bold py-2"
              style={{ fontSize: 42, letterSpacing: "-0.04em" }}
            />
          </div>
          <div className="text-xs text-white/50 font-mono mt-1">
            ≈ {price ? fmtBTC((parseFloat(amount) || 0) / price, 8) : "0"} BTC
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={pay}
          disabled={loading}
          data-testid="bill-pay-btn"
          className="mt-10 w-full disabled:opacity-40 font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[12px]"
          style={{ background: "#D4FF4F", color: "#0A0A0F" }}
        >
          {loading ? "processing…" : `pay ${activeBiller?.k.toLowerCase() || "bill"} with bitcoin`}
        </motion.button>
      </div>
    </div>
  );
}
