import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Copy, Share } from "@phosphor-icons/react";
import Header from "../components/Header";
import StyledQR from "../components/StyledQR";
import { api } from "../lib/api";
import { fmtBTC, fmtCoins } from "../lib/format";

export default function Receive() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    api.get("/wallet/me").then((r) => setWallet(r.data));
    api.get("/wallet/transactions").then((r) => setTxns(r.data.items || []));
  }, []);

  const uri = wallet
    ? `bitcoin:${wallet.btc_address}${amount ? `?amount=${amount}` : ""}`
    : "";

  const copy = () => {
    navigator.clipboard.writeText(wallet.btc_address);
    toast.success("address copied");
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ text: uri, title: "my bitcoin address" }); } catch {}
    } else copy();
  };

  const receivedCount = txns.filter((t) => t.type === "received").length;
  const initial = (wallet?.name || "N").charAt(0).toUpperCase();

  return (
    <div className="shell">
      <Header title="receive" />
      <div className="px-6 text-center pb-10">
        <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4FF4F] font-bold">your address</div>
        <h2
          className="text-white mt-1.5 leading-[0.95]"
          style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 42, letterSpacing: "-0.035em" }}
        >
          scan to <span style={{ color: "#D4FF4F" }}>receive.</span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mt-6"
          data-testid="receive-qr"
        >
          <StyledQR
            value={uri}
            size={280}
            initial={initial}
            topText={`${(wallet?.name || "your").toLowerCase()} · nova vault`}
            bottomText={`· scan · send · secured ·`}
          />
        </motion.div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <StoryStat label="received" value={receivedCount} unit="txns" />
          <StoryStat label="balance" value={fmtBTC(wallet?.balance_btc, 4)} unit="BTC" />
          <StoryStat label="coins" value={fmtCoins(wallet?.coins)} unit="" />
        </div>

        {/* Address */}
        <div
          className="mt-6 rounded-3xl p-4"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
          data-testid="receive-address-card"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-2 font-semibold text-left">address</div>
          <div className="font-mono text-xs break-all text-white/85 text-left" data-testid="receive-address">
            {wallet?.btc_address}
          </div>
        </div>

        {/* Request amount */}
        <div className="mt-4 text-left">
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-1 font-semibold">request (optional)</div>
          <div className="flex items-end gap-2 border-b border-white/10 py-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              data-testid="receive-amount"
              className="flex-1 bg-transparent outline-none text-2xl font-display font-bold"
            />
            <div className="text-sm text-white/40 font-mono pb-1">BTC</div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={copy}
            data-testid="receive-copy"
            className="flex-1 rounded-full py-3 flex items-center justify-center gap-2 text-sm font-bold"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--surface-border)" }}
          >
            <Copy size={14} /> copy
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={share}
            data-testid="receive-share"
            className="flex-1 rounded-full py-3 flex items-center justify-center gap-2 text-sm font-bold"
            style={{ background: "#D4FF4F", color: "#0A0A0F" }}
          >
            <Share size={14} /> share
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function StoryStat({ label, value, unit }) {
  return (
    <div
      className="rounded-2xl p-3"
      style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
    >
      <div className="text-[8px] tracking-[0.2em] uppercase text-white/45 font-semibold">{label}</div>
      <div className="font-display text-base font-bold mt-0.5">{value}</div>
      {unit && <div className="text-[9px] text-white/40 uppercase tracking-wider">{unit}</div>}
    </div>
  );
}
