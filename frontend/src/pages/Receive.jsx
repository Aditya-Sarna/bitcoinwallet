import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Copy, Share, Scan } from "@phosphor-icons/react";
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
    toast.success("Address copied");
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ text: uri, title: "My Bitcoin Address" }); } catch {}
    } else copy();
  };

  const receivedCount = txns.filter((t) => t.type === "received").length;
  const initial = (wallet?.name || "B").charAt(0).toUpperCase();
  const memberSince = wallet?.created_at ? new Date(wallet.created_at).getFullYear() : 2026;

  return (
    <div className="shell grain">
      <Header title="Receive" />
      <div className="px-6 text-center">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">
          your story · encoded
        </div>
        <h2
          className="text-white/95 mt-2 leading-none"
          style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: 44 }}
        >
          scan to gift.
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
            topText={`${wallet?.name?.toLowerCase() || "your"}'s vault`}
            bottomText={`· member since ${memberSince} ·`}
          />
        </motion.div>

        <div className="mt-4 text-sm text-white/55" style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}>
          every satoshi arriving here writes a new chapter.
        </div>

        {/* Story strip */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <StoryStat label="received" value={receivedCount} unit="txns" />
          <StoryStat label="balance" value={fmtBTC(wallet?.balance_btc, 4)} unit="BTC" />
          <StoryStat label="coins earned" value={fmtCoins(wallet?.coins)} unit="" />
        </div>

        {/* Address */}
        <div className="mt-6 glass rounded-2xl p-4" data-testid="receive-address-card">
          <div className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-2">address</div>
          <div className="font-mono text-xs break-all text-white/80" data-testid="receive-address">
            {wallet?.btc_address}
          </div>
        </div>

        {/* Request amount */}
        <div className="mt-4 text-left">
          <div className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-1">request (optional)</div>
          <div className="flex items-end gap-2 border-b border-white/10 py-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              data-testid="receive-amount"
              className="flex-1 bg-transparent outline-none text-2xl font-display"
            />
            <div className="text-sm text-white/40 font-mono pb-1">BTC</div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button whileTap={{ scale: 0.96 }} onClick={copy} data-testid="receive-copy" className="flex-1 glass rounded-full py-3 flex items-center justify-center gap-2 text-sm font-semibold">
            <Copy size={14} /> copy
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={share} data-testid="receive-share" className="flex-1 gold-gradient text-black rounded-full py-3 flex items-center justify-center gap-2 text-sm font-semibold">
            <Share size={14} /> share
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function StoryStat({ label, value, unit }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="text-[8px] tracking-[0.22em] uppercase text-white/40">{label}</div>
      <div className="font-display text-base font-semibold mt-0.5">{value}</div>
      {unit && <div className="text-[9px] text-white/30 uppercase tracking-wider">{unit}</div>}
    </div>
  );
}
