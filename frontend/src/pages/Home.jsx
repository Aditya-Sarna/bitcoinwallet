import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight, ArrowDownLeft, ShieldCheck, Gear, QrCode,
  ForkKnife, Airplane, ShoppingBag, GameController, Heart, House as HouseIcon, DotsNine
} from "@phosphor-icons/react";
import Shell from "../components/Shell";
import PriceChart from "../components/PriceChart";
import BitcoinScore from "../components/BitcoinScore";
import TxnItem from "../components/TxnItem";
import BalanceStatRow from "../components/BalanceStatRow";
import ColorCardStack from "../components/ColorCardStack";
import SplashCard from "../components/SplashCard";
import { ART } from "../lib/images";
import { api } from "../lib/api";
import { fmtUSD } from "../lib/format";

const CATEGORIES = [
  { k: "scan", Icon: QrCode, label: "scan", to: "/scan", color: "#fff", text: "#000" },
  { k: "food", Icon: ForkKnife, label: "food", to: "/store?cat=food" },
  { k: "travel", Icon: Airplane, label: "travel", to: "/store?cat=travel" },
  { k: "shop", Icon: ShoppingBag, label: "shop", to: "/store?cat=shopping" },
  { k: "play", Icon: GameController, label: "play", to: "/store?cat=entertainment" },
  { k: "health", Icon: Heart, label: "health", to: "/bills" },
  { k: "rent", Icon: HouseIcon, label: "rent", to: "/bills" },
];

export default function Home() {
  const nav = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [price, setPrice] = useState(null);
  const [txns, setTxns] = useState([]);
  const [security, setSecurity] = useState(null);
  const [loading, setLoading] = useState(true);
  const cachedName = typeof window !== "undefined" ? localStorage.getItem("btc_name") || "" : "";

  useEffect(() => {
    let alive = true;
    Promise.all([
      api.get("/wallet/me"),
      api.get("/market/price").catch(() => ({ data: null })),
      api.get("/wallet/transactions"),
      api.get("/security/status").catch(() => ({ data: null })),
    ]).then(([w, p, t, s]) => {
      if (!alive) return;
      setWallet(w.data);
      setPrice(p.data);
      setTxns(t.data.items || []);
      setSecurity(s.data);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { alive = false; };
  }, []);

  const fiatValue = wallet && price ? wallet.balance_btc * price.price_usd : 0;
  const firstName = ((wallet?.name || cachedName) || "").split(" ")[0].toLowerCase();

  const actions = [
    { label: "scan & pay", Icon: QrCode, to: "/scan", testid: "home-scan" },
    { label: "send", Icon: ArrowUpRight, to: "/send", testid: "home-send" },
    { label: "receive", Icon: ArrowDownLeft, to: "/receive", testid: "home-receive" },
    { label: "history", Icon: DotsNine, to: "/transactions", testid: "home-history" },
  ];

  return (
    <Shell>
      <div className="grain" />
      {/* Top bar · avatar + scan & pay chip + gear */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => nav("/profile")}
          data-testid="home-avatar"
          className="w-11 h-11 rounded-full flex items-center justify-center font-display text-base font-semibold"
          style={{ background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)", color: "#fff" }}
        >
          {firstName?.charAt(0)?.toUpperCase() || "·"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => nav("/scan")}
          data-testid="home-scan-chip"
          className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2"
        >
          <QrCode size={14} weight="bold" />
          <span className="text-[11px] lowercase">scan & pay</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => nav("/security")}
          data-testid="home-security-btn"
          className="w-11 h-11 rounded-full glass flex items-center justify-center relative"
        >
          <Gear size={16} className="text-white/80" />
          {security && !security.seed_backed_up && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF7A3A] animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Welcome greeting */}
      <div className="px-5 pt-3">
        <div className="font-display text-[30px] lowercase leading-[1.1] tracking-tight" data-testid="home-greeting">
          welcome, {firstName || (loading ? "…" : "member")}
        </div>
        <div className="text-white/50 text-[13px] mt-1 leading-snug">
          welcome back to satvault<br />
          <span className="font-serif-italic">we have great things planned for you</span>
        </div>
      </div>

      {/* Balance / coins / gems / vouchers row */}
      <div className="px-5 mt-5">
        <BalanceStatRow
          balance={wallet?.balance_btc || 0}
          coins={wallet?.coins || 0}
          gems={wallet?.gems || 0}
          vouchers={wallet?.vouchers || 0}
        />
      </div>

      {/* Colorful card stack */}
      <ColorCardStack
        name={wallet?.name}
        balance={wallet?.balance_btc}
        fiat={fiatValue}
        change24h={price?.change_24h}
        loading={loading}
      />

      {/* 4 Circular action buttons */}
      <div className="grid grid-cols-4 gap-2 px-5 mt-3">
        {actions.map(({ label, Icon, to, testid }, i) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.88 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.04 }}
            onClick={() => nav(to)}
            data-testid={testid}
            className="flex flex-col items-center gap-1.5 py-2"
          >
            <div className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center">
              <Icon size={20} weight="bold" className="text-white" />
            </div>
            <div className="text-[10px] lowercase text-white/70">{label}</div>
          </motion.button>
        ))}
      </div>

      {/* Backup banner */}
      {security && !security.seed_backed_up && (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav("/backup")}
          data-testid="home-backup-banner"
          className="mx-5 mt-4 w-[calc(100%-2.5rem)] rounded-3xl p-4 flex items-center gap-3 text-left"
          style={{
            background: "linear-gradient(135deg, rgba(255,122,58,0.18), rgba(255,122,58,0.02))",
            border: "1px solid rgba(255,122,58,0.4)",
          }}
        >
          <div className="w-11 h-11 rounded-full bg-[#FF7A3A]/20 flex items-center justify-center">
            <ShieldCheck size={18} weight="fill" className="text-[#FF7A3A]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">secure your vault</div>
            <div className="text-[11px] text-white/60">backup your 12-word recovery phrase · <span className="text-[#FF7A3A] font-serif-italic">earn 250 coins</span></div>
          </div>
          <div className="text-[11px] text-[#FF7A3A]">→</div>
        </motion.button>
      )}

      {/* Splash hero promo — quiet luxury painterly */}
      <div className="px-5 mt-6">
        <SplashCard
          testid="splash-hero"
          eyebrow="today · the morning brief"
          title={<>fortunes are not<br />made loudly.</>}
          subtitle="claim your daily reward · quietly compounding"
          image={ART.goldenStill}
          tone="warm"
          tag="claim"
          height={260}
          onClick={() => nav("/rewards")}
        />
      </div>

      {/* Category pills */}
      <div className="px-5 mt-6">
        <div className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-3">pay bills · earn quietly</div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.k}
              whileTap={{ scale: 0.9 }}
              onClick={() => nav(c.to)}
              data-testid={`cat-${c.k}`}
              className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                i === 0 ? "" : "border border-white/10 bg-white/[0.03]"
              }`}
              style={i === 0 ? { background: c.color || "#fff" } : {}}
            >
              <c.Icon size={18} weight="bold" color={i === 0 ? "#000" : "#fff"} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* 2-up bento — painterly */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <SplashCard
          testid="bento-treasure"
          eyebrow="earn upto"
          title="10,000 coins"
          image={ART.linen}
          tone="warm"
          tag="spin"
          height={200}
          size="sm"
          onClick={() => nav("/rewards")}
        />
        <SplashCard
          testid="bento-pearls"
          eyebrow="earn upto"
          title="100,000 coins"
          image={ART.pearls}
          tone="cool"
          tag="unlock"
          height={200}
          size="sm"
          onClick={() => nav("/rewards")}
        />
      </div>

      {/* Pay bills splash */}
      <div className="px-5 mt-4">
        <SplashCard
          testid="bills-splash"
          eyebrow="rent · education · everything"
          title={<>a quiet home for<br />all your payments.</>}
          subtitle="one click · instantly settled in bitcoin."
          image={ART.interior}
          tone="cool"
          tag="pay bills"
          height={240}
          onClick={() => nav("/bills")}
        />
      </div>

      {/* Live price + chart */}
      <div className="mx-5 mt-6 glass rounded-3xl p-5" data-testid="chart-card">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-[9px] tracking-[0.28em] uppercase text-white/40">bitcoin · live</div>
            <div className="font-display text-2xl font-medium mt-1" data-testid="btc-price-usd">
              ${price ? fmtUSD(price.price_usd, 2) : "—"}
            </div>
          </div>
          <div
            className="text-2xl text-white/70 leading-none"
            style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}
          >
            the tape
          </div>
        </div>
        <PriceChart />
      </div>

      {/* Bitcoin Score */}
      <div className="mx-5 mt-5 glass rounded-3xl p-5" data-testid="score-card">
        <BitcoinScore score={wallet?.btc_score || 742} />
      </div>

      {/* Recent activity */}
      <div className="mx-5 mt-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[9px] tracking-[0.28em] uppercase text-white/40">recent</div>
            <div
              className="text-2xl text-white mt-0.5 leading-none"
              style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}
            >
              your story.
            </div>
          </div>
          <button onClick={() => nav("/transactions")} data-testid="home-see-all" className="text-[10px] tracking-[0.22em] uppercase text-white/60">all</button>
        </div>
        <div>
          {loading ? (
            <div className="py-8 text-center text-white/30 text-xs font-mono">loading…</div>
          ) : txns.length === 0 ? (
            <div className="text-white/40 text-sm py-6 text-center">no activity yet</div>
          ) : (
            txns.slice(0, 4).map((t) => <TxnItem key={t.id} t={t} />)
          )}
        </div>
      </div>
    </Shell>
  );
}
