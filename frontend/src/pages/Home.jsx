import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, Receipt, ShieldCheck, QrCode, GridFour, Gear } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import PriceChart from "../components/PriceChart";
import BitcoinScore from "../components/BitcoinScore";
import TxnItem from "../components/TxnItem";
import ChipRow from "../components/ChipRow";
import CardStack from "../components/CardStack";
import { api } from "../lib/api";
import { fmtUSD } from "../lib/format";

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
    { label: "send", Icon: ArrowUpRight, to: "/send", testid: "home-send" },
    { label: "receive", Icon: ArrowDownLeft, to: "/receive", testid: "home-receive" },
    { label: "pay", Icon: Receipt, to: "/bills", testid: "home-bills" },
    { label: "more", Icon: GridFour, to: "/rewards", testid: "home-more" },
  ];

  return (
    <Shell>
      <div className="grain" />
      {/* Top bar · chip row + gear */}
      <div className="flex items-center justify-between px-5 pt-10 pb-3">
        <ChipRow
          coins={wallet?.coins || 0}
          gems={wallet?.gems || 0}
          vouchers={wallet?.vouchers || 0}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => nav("/security")}
          data-testid="home-security-btn"
          className="w-10 h-10 rounded-full glass flex items-center justify-center relative"
        >
          <Gear size={16} className="text-white/80" />
          {security && !security.seed_backed_up && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF7A3A] animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Welcome greeting */}
      <div className="px-6 pt-4 pb-1">
        <div className="font-display text-[32px] lowercase leading-[1.05] tracking-tight" data-testid="home-greeting">
          welcome, {firstName || (loading ? "…" : "member")}
        </div>
        <div className="text-white/45 text-sm mt-1 font-serif-italic">
          we have <span className="text-gold">great things</span> planned for you
        </div>
      </div>

      {/* Card stack */}
      <CardStack
        name={wallet?.name}
        balance={wallet?.balance_btc}
        fiat={fiatValue}
        change24h={price?.change_24h}
        loading={loading}
      />

      {/* Actions */}
      <div className="grid grid-cols-4 gap-2 px-5 mt-4">
        {actions.map(({ label, Icon, to, testid }, i) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            onClick={() => nav(to)}
            data-testid={testid}
            className="flex flex-col items-center gap-1.5 py-2"
          >
            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center">
              <Icon size={18} weight="bold" className="text-white/90" />
            </div>
            <div className="text-[10px] lowercase text-white/60">{label}</div>
          </motion.button>
        ))}
      </div>

      {/* Backup banner (if not backed up) */}
      {security && !security.seed_backed_up && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
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

      {/* Live price + chart */}
      <div className="mx-5 mt-5 glass rounded-3xl p-5" data-testid="chart-card">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-[9px] tracking-[0.28em] uppercase text-white/40">bitcoin · live</div>
            <div className="font-display text-2xl font-medium mt-1" data-testid="btc-price-usd">
              ${price ? fmtUSD(price.price_usd, 2) : "—"}
            </div>
          </div>
          <div className="font-cursive text-3xl text-gold leading-none">the tape</div>
        </div>
        <PriceChart />
      </div>

      {/* Bitcoin Score */}
      <div className="mx-5 mt-5 glass rounded-3xl p-5" data-testid="score-card">
        <BitcoinScore score={wallet?.btc_score || 742} />
      </div>

      {/* Rewards teaser cards — colorful bento */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[9px] tracking-[0.28em] uppercase text-white/40">for you</div>
            <div className="font-cursive text-3xl text-white mt-0.5 leading-none">the daily drop.</div>
          </div>
          <button onClick={() => nav("/rewards")} data-testid="home-rewards-link" className="text-[10px] tracking-[0.22em] uppercase text-gold">see all</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TeaserCard
            testid="teaser-apple"
            color="#EADDC5"
            textColor="#000"
            eyebrow="today's bounty"
            title="win an entire apple store"
            tag="claim now →"
            onClick={() => nav("/rewards")}
          />
          <TeaserCard
            testid="teaser-amazon"
            color="#6936D6"
            textColor="#fff"
            eyebrow="gift card"
            title="amazon · win ₹1,000"
            tag="play →"
            onClick={() => nav("/store")}
          />
        </div>
      </div>

      {/* Recent */}
      <div className="mx-5 mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] tracking-[0.28em] uppercase text-white/40">recent activity</div>
          <button onClick={() => nav("/transactions")} data-testid="home-see-all" className="text-[10px] tracking-[0.22em] uppercase text-gold">all</button>
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

function TeaserCard({ color, textColor, eyebrow, title, tag, onClick, testid }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      data-testid={testid}
      className="rounded-3xl p-4 text-left overflow-hidden relative h-44 flex flex-col justify-between"
      style={{ background: color, color: textColor }}
    >
      <div className="text-[9px] tracking-[0.22em] uppercase opacity-70">{eyebrow}</div>
      <div className="font-serif-italic text-lg leading-tight">{title}</div>
      <div className="text-[10px] tracking-[0.22em] uppercase font-semibold">{tag}</div>
    </motion.button>
  );
}
