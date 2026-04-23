import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight, ArrowDownLeft, ShieldCheck, Gear, QrCode,
  ForkKnife, Airplane, ShoppingBag, GameController, Heart, House as HouseIcon, DotsNine, Lightning
} from "@phosphor-icons/react";
import Shell from "../components/Shell";
import PriceChart from "../components/PriceChart";
import BitcoinScore from "../components/BitcoinScore";
import TxnItem from "../components/TxnItem";
import BalanceStatRow from "../components/BalanceStatRow";
import ColorCardStack from "../components/ColorCardStack";
import SplashCard from "../components/SplashCard";
import { TreasureChest, GiftStack, BillEnvelope, ProductShelf, LaptopPrize } from "../components/Illustrations";
import Logo from "../components/Logo";
import { api } from "../lib/api";
import { fmtUSD } from "../lib/format";

const CATEGORIES = [
  { k: "scan", Icon: QrCode, label: "scan", to: "/scan", active: true },
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
    { label: "scan", Icon: QrCode, to: "/scan", testid: "home-scan", color: "#D4FF4F" },
    { label: "send", Icon: ArrowUpRight, to: "/send", testid: "home-send", color: "#FF3E8A" },
    { label: "receive", Icon: ArrowDownLeft, to: "/receive", testid: "home-receive", color: "#34D8FF" },
    { label: "history", Icon: DotsNine, to: "/transactions", testid: "home-history", color: "#6B5CFC" },
  ];

  return (
    <Shell>
      {/* Top bar · avatar + wordmark + gear */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => nav("/profile")}
          data-testid="home-avatar"
          className="w-11 h-11 rounded-full flex items-center justify-center font-display text-base font-bold"
          style={{ background: "linear-gradient(135deg, #FF3E8A 0%, #6B5CFC 100%)", color: "#fff" }}
        >
          {firstName?.charAt(0)?.toUpperCase() || "·"}
        </motion.button>

        <div className="flex items-center gap-2">
          <Logo size={22} />
          <span
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.22em",
              fontSize: 12,
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            nova
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => nav("/security")}
          data-testid="home-security-btn"
          className="w-11 h-11 rounded-full flex items-center justify-center relative"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Gear size={16} className="text-white/80" />
          {security && !security.seed_backed_up && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF3E8A] animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Welcome greeting */}
      <div className="px-5 pt-3">
        <div
          className="leading-[1.02] tracking-[-0.035em] lowercase text-white"
          style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 32 }}
          data-testid="home-greeting"
        >
          welcome, <span style={{ color: "#D4FF4F" }}>{firstName || (loading ? "…" : "friend")}</span>
        </div>
        <div className="text-white/50 text-[13px] mt-1.5 leading-snug font-medium">
          let's make your bitcoin work harder today.
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

      {/* 4 circular action buttons */}
      <div className="grid grid-cols-4 gap-2 px-5 mt-3">
        {actions.map(({ label, Icon, to, testid, color }, i) => (
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
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: `${color}22`, border: `1px solid ${color}44` }}
            >
              <Icon size={20} weight="bold" style={{ color }} />
            </div>
            <div className="text-[10px] lowercase text-white/80 font-semibold">{label}</div>
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
            background: "linear-gradient(135deg, rgba(255,62,138,0.18), rgba(107,92,252,0.12))",
            border: "1px solid rgba(255,62,138,0.4)",
          }}
        >
          <div className="w-11 h-11 rounded-full bg-[#FF3E8A]/20 flex items-center justify-center">
            <ShieldCheck size={18} weight="fill" className="text-[#FF3E8A]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold lowercase">secure your vault</div>
            <div className="text-[11px] text-white/60">back up your 12-word phrase · earn <span className="text-[#D4FF4F] font-bold">+250 coins</span></div>
          </div>
          <div className="text-[11px] text-[#FF3E8A] font-bold">→</div>
        </motion.button>
      )}

      {/* Hero splash — rewards */}
      <div className="px-5 mt-6">
        <SplashCard
          testid="splash-hero"
          bg="#D4FF4F"
          textColor="#0A0A0F"
          ctaBg="#0A0A0F"
          ctaText="#D4FF4F"
          eyebrow="EARN UPTO"
          title={<>10,000<br />coins daily.</>}
          subtitle="spin · stack · spend. your daily reward awaits."
          tag="spin now"
          height={220}
          illustration={<TreasureChest color="gold" size={150} />}
          onClick={() => nav("/rewards")}
        />
      </div>

      {/* Category pills row */}
      <div className="px-5 mt-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-3 font-semibold">pay · earn · explore</div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((c) => (
            <motion.button
              key={c.k}
              whileTap={{ scale: 0.9 }}
              onClick={() => nav(c.to)}
              data-testid={`cat-${c.k}`}
              className="shrink-0 flex flex-col items-center gap-1 min-w-[54px]"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={
                  c.active
                    ? { background: "#D4FF4F", color: "#000" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                <c.Icon size={18} weight="bold" color={c.active ? "#000" : "#fff"} />
              </div>
              <div className="text-[9px] lowercase text-white/60 font-semibold">{c.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 2-up vibrant bento */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <SplashCard
          testid="bento-store"
          bg="#FF3E8A"
          textColor="#fff"
          ctaBg="#fff"
          ctaText="#FF3E8A"
          eyebrow="THE STORE"
          title={<>brands<br />you love.</>}
          subtitle="amazon · nike · uber"
          tag="shop"
          height={220}
          size="sm"
          illustration={<GiftStack size={110} />}
          onClick={() => nav("/store")}
        />
        <SplashCard
          testid="bento-mystery"
          bg="#6B5CFC"
          textColor="#fff"
          ctaBg="#D4FF4F"
          ctaText="#0A0A0F"
          eyebrow="MYSTERY BOX"
          title={<>upto<br />100,000.</>}
          subtitle="coins inside"
          tag="unlock"
          height={220}
          size="sm"
          illustration={<LaptopPrize size={110} />}
          onClick={() => nav("/rewards")}
        />
      </div>

      {/* Pay bills splash */}
      <div className="px-5 mt-4">
        <SplashCard
          testid="bills-splash"
          bg="#FFEFC4"
          textColor="#0A0A0F"
          ctaBg="#0A0A0F"
          ctaText="#FFEFC4"
          eyebrow="RENT · BILLS · UTILITIES"
          title={<>pay bills in<br />bitcoin.</>}
          subtitle="one tap · instant · earn coins on every bill."
          tag="pay now"
          height={210}
          illustration={<BillEnvelope size={120} />}
          onClick={() => nav("/bills")}
        />
      </div>

      {/* Live price + chart */}
      <div
        className="mx-5 mt-6 rounded-3xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        data-testid="chart-card"
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 font-semibold">bitcoin · live</div>
            <div
              className="text-white mt-1"
              style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: "-0.03em" }}
              data-testid="btc-price-usd"
            >
              ${price ? fmtUSD(price.price_usd, 2) : "—"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
               style={{ background: "#D4FF4F22", border: "1px solid #D4FF4F55" }}>
            <Lightning size={16} weight="fill" color="#D4FF4F" />
          </div>
        </div>
        <PriceChart />
      </div>

      {/* Bitcoin Score */}
      <div
        className="mx-5 mt-5 rounded-3xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        data-testid="score-card"
      >
        <BitcoinScore score={wallet?.btc_score || 742} />
      </div>

      {/* Shop / Electronics splash */}
      <div className="px-5 mt-5">
        <SplashCard
          testid="splash-shop"
          bg="#34D8FF"
          textColor="#0A0A0F"
          ctaBg="#0A0A0F"
          ctaText="#34D8FF"
          eyebrow="SPEND COINS"
          title={<>tech · style<br />on us.</>}
          subtitle="redeem coins for real products · airpods, phones, more."
          tag="redeem"
          height={210}
          illustration={<ProductShelf size={140} />}
          onClick={() => nav("/store")}
        />
      </div>

      {/* Recent activity */}
      <div className="mx-5 mt-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 font-semibold">recent</div>
            <div
              className="text-white mt-0.5 leading-none"
              style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: "-0.03em" }}
            >
              your activity
            </div>
          </div>
          <button
            onClick={() => nav("/transactions")}
            data-testid="home-see-all"
            className="text-[10px] tracking-[0.18em] uppercase text-white/60 font-semibold"
          >
            view all →
          </button>
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
