import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Copy, Share } from "@phosphor-icons/react";
import Header from "../components/Header";
import { api } from "../lib/api";

export default function Receive() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    api.get("/wallet/me").then((r) => setWallet(r.data));
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
      try {
        await navigator.share({ text: uri, title: "My Bitcoin Address" });
      } catch {}
    } else {
      copy();
    }
  };

  return (
    <div className="shell grain">
      <Header title="Receive Bitcoin" />
      <div className="px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="rounded-3xl bg-white p-5 mt-4 glow-gold"
          data-testid="receive-qr"
        >
          {wallet && (
            <QRCodeSVG
              value={uri}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={false}
            />
          )}
        </motion.div>

        <div className="mt-6 w-full">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-2 text-center">your bitcoin address</div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="font-mono text-xs break-all text-white/80" data-testid="receive-address">
              {wallet?.btc_address}
            </div>
          </div>
        </div>

        <div className="mt-5 w-full">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-2">request amount (optional)</div>
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

        <div className="flex gap-3 mt-8 w-full">
          <motion.button whileTap={{ scale: 0.96 }} onClick={copy} data-testid="receive-copy" className="flex-1 glass rounded-full py-3 flex items-center justify-center gap-2 text-sm font-semibold">
            <Copy size={16} /> copy
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={share} data-testid="receive-share" className="flex-1 gold-gradient text-black rounded-full py-3 flex items-center justify-center gap-2 text-sm font-semibold">
            <Share size={16} /> share
          </motion.button>
        </div>
      </div>
    </div>
  );
}
