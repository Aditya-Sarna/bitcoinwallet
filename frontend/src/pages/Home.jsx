import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, Receipt, Coins, Bell, TrendUp, TrendDown } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import PriceChart from "../components/PriceChart";
import BitcoinScore from "../components/BitcoinScore";
import TxnItem from "../components/TxnItem";
import { api } from "../lib/api";
import { fmtBTC, fmtUSD, fmtCoins } from "../lib/format";

export default function Home() {
  const nav = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [price, setPrice] = useState(null);
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    api.get("/wallet/me").then((r) => setWallet(r.data));
    api.get("/market/price").then((r) => setPrice(r.data));
    api.get("/wallet/transactions").then((r) => setTxns(r.data.items || []));
  }, []);

  const fiatValue = wallet && price ? wallet.balance_btc * price.price_usd : 0;
  const up = (price?.change_24h || 0) >= 0;

  const actions = [
    { label: "Send", Icon: ArrowUpRight, to: "/send", testid: "home-send" },
    { label: "Receive", Icon: ArrowDownLeft, to: "/receive", testid: "home-receive" },
    { label: "Pay Bills", Icon: Receipt, to: "/bills", testid: "home-bills" },
    { label: "Rewards", Icon: Coins, to: "/rewards", testid: "home-rewards-quick" },
  ];

  return (
    <Shell>
      <div className="grain" />
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-10 pb-4">
        <div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/40">good evening</div>
          <div className="font-display text-xl" data-testid="home-greeting">{wallet?.name || "…"}</div>
        </div>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => nav("/transactions")} className="w-10 h-10 rounded-full glass flex items-center justify-center" data-testid="home-history-btn">
            <Bell size={18} />
          </motion.button>
        </div>
      </div>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-6 rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
        data-testid="balance-card"
      >
        <div
          className="absolute -top-20 -right-10 w-60 h-60 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
        />
        <div className="relative">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">total balance</div>
          <div className="font-display text-5xl font-semibold tracking-tighter" data-testid="balance-fiat">
            <span className="text-white/40 text-3xl">$</span>{fmtUSD(fiatValue, 2)}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="font-mono text-sm text-white/60" data-testid="balance-btc">
              {fmtBTC(wallet?.balance_btc, 8)} BTC
            </div>
            {price && (
              <div className={`flex items-center gap-1 text-xs font-mono ${up ? "text-[#00D09C]" : "text-[#FF443A]"}`}>
                {up ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
                {up ? "+" : ""}{price.change_24h.toFixed(2)}%
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="grid grid-cols-4 gap-3 px-6 mt-5">
        {actions.map(({ label, Icon, to, testid }, i) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            onClick={() => nav(to)}
            data-testid={testid}
            className="flex flex-col items-center gap-2 py-3 rounded-2xl glass"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Icon size={18} weight="bold" className="text-gold" />
            </div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-white/70">{label}</div>
          </motion.button>
        ))}
      </div>

      {/* Price chart */}
      <div className="mx-6 mt-6 glass rounded-3xl p-5" data-testid="chart-card">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-white/40">bitcoin · usd</div>
            <div className="font-display text-2xl font-medium mt-1" data-testid="btc-price-usd">
              ${price ? fmtUSD(price.price_usd, 2) : "—"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
            <span className="font-mono font-bold text-black text-xs">₿</span>
          </div>
        </div>
        <PriceChart />
      </div>

      {/* Bitcoin Score */}
      <div className="mx-6 mt-6 glass rounded-3xl p-5" data-testid="score-card">
        <BitcoinScore score={wallet?.btc_score || 742} />
      </div>

      {/* Coins row */}
      <div className="mx-6 mt-5 flex items-center gap-3 rounded-3xl p-4" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.02))", border: "1px solid rgba(212,175,55,0.2)" }}>
        <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center glow-gold">
          <span className="font-bold text-black text-lg">$</span>
        </div>
        <div className="flex-1">
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/50">reward coins</div>
          <div className="font-display text-xl font-medium" data-testid="coins-balance">{fmtCoins(wallet?.coins)}</div>
        </div>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => nav("/store")}
          data-testid="home-redeem-btn"
          className="px-4 py-2 rounded-full bg-black text-gold border border-gold/30 text-[10px] tracking-[0.22em] uppercase font-semibold"
        >
          redeem
        </motion.button>
      </div>

      {/* Recent */}
      <div className="mx-6 mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/40">recent activity</div>
          <button onClick={() => nav("/transactions")} data-testid="home-see-all" className="text-[10px] tracking-[0.22em] uppercase text-gold">see all</button>
        </div>
        <div>
          {txns.slice(0, 4).map((t) => <TxnItem key={t.id} t={t} />)}
          {txns.length === 0 && <div className="text-white/40 text-sm py-6 text-center">no activity yet</div>}
        </div>
      </div>
    </Shell>
  );
}
