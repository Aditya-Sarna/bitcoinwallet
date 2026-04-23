import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Copy, SignOut, Bell, ShieldCheck, Question, Gift, CaretRight } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import BitcoinScore from "../components/BitcoinScore";
import ThemeToggle from "../components/ThemeToggle";
import Logo from "../components/Logo";
import { api } from "../lib/api";
import { shortAddr, fmtBTC, fmtCoins } from "../lib/format";

export default function Profile() {
  const nav = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [security, setSecurity] = useState(null);

  useEffect(() => {
    api.get("/wallet/me").then((r) => setWallet(r.data));
    api.get("/security/status").catch(() => ({ data: null })).then((r) => setSecurity(r.data));
  }, []);

  const copyReferral = () => {
    navigator.clipboard.writeText(wallet?.referral_code || "");
    toast.success("referral code copied");
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("btc_token");
    toast.success("signed out");
    nav("/lock");
  };

  const items = [
    {
      Icon: ShieldCheck,
      label: "security & backup",
      desc: security ? (security.seed_backed_up ? "verified · fully secured" : "action needed · backup phrase") : "—",
      warn: security && !security.seed_backed_up,
      testid: "profile-security",
      to: "/security",
      color: "#D4FF4F",
    },
    { Icon: Bell, label: "notifications", desc: "alerts & activity updates", testid: "profile-notifications", color: "#34D8FF" },
    { Icon: Question, label: "help center", desc: "contact, faq, disputes", testid: "profile-help", color: "#6B5CFC" },
  ];

  const memberSince = wallet?.created_at
    ? new Date(wallet.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";

  return (
    <Shell>
      <div className="px-5 pt-10">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-bold"
            style={{ background: "linear-gradient(135deg, #FF3E8A 0%, #6B5CFC 100%)", color: "#fff" }}
          >
            {(wallet?.name || "N").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: "Italianno, cursive", fontSize: 28, color: "var(--ink-2)" }}>
                the vault of
              </span>
            </div>
            <div
              className="mt-0.5 tracking-[-0.03em] leading-none lowercase"
              style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 34, color: "var(--ink)" }}
              data-testid="profile-name"
            >
              {wallet?.name || "…"}
            </div>
            <div className="text-[10px] font-mono mt-1.5" style={{ color: "var(--ink-3)" }}>{shortAddr(wallet?.btc_address, 8, 8)}</div>
          </div>
          <ThemeToggle size={40} />
        </div>
        <div className="text-[10px] text-white/35 mt-3 font-semibold uppercase tracking-[0.2em]">
          member since {memberSince}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5">
          <Stat label="balance" value={`${fmtBTC(wallet?.balance_btc, 4)}`} unit="BTC" />
          <Stat label="coins" value={fmtCoins(wallet?.coins)} unit="" />
          <Stat label="streak" value={wallet?.streak} unit="days" />
        </div>

        <div
          className="mt-5 rounded-3xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
        >
          <BitcoinScore score={wallet?.btc_score || 742} />
        </div>

        {/* Referral */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="mt-5 rounded-[28px] p-5 cursor-pointer relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #D4FF4F 0%, #7CFF8A 100%)",
            color: "#0A0A0F",
          }}
          onClick={copyReferral}
          data-testid="profile-referral"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40 blur-2xl"
               style={{ background: "#fff" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={16} weight="fill" />
              <div className="text-[10px] tracking-[0.22em] uppercase font-bold">invite & earn</div>
            </div>
            <div
              className="leading-[0.95] tracking-[-0.035em]"
              style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 32 }}
            >
              share nova.<br />earn together.
            </div>
            <div className="text-sm mt-2 opacity-80">
              earn <span className="font-bold">500 coins</span> per friend who joins.
            </div>
            <div className="flex items-center gap-2 bg-black/15 rounded-2xl p-3 mt-3">
              <div className="flex-1 font-mono text-base tracking-[0.2em] font-bold" data-testid="profile-referral-code">
                {wallet?.referral_code || "—"}
              </div>
              <Copy size={14} />
            </div>
          </div>
        </motion.div>

        {/* Items */}
        <div
          className="mt-5 rounded-3xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
        >
          {items.map(({ Icon, label, desc, warn, testid, to, color }, i) => (
            <button
              key={label}
              data-testid={testid}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${i < items.length - 1 ? "border-b border-white/5" : ""}`}
              onClick={() => (to ? nav(to) : toast("coming soon"))}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative"
                style={{ background: `${color}22`, border: `1px solid ${color}44` }}
              >
                <Icon size={16} color={color} weight="fill" />
                {warn && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF3E8A]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm lowercase font-semibold">{label}</div>
                <div className="text-[11px] text-white/45 truncate">{desc}</div>
              </div>
              <CaretRight size={14} className="text-white/30" />
            </button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          data-testid="profile-logout"
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-full text-[12px] font-bold tracking-[0.16em] uppercase text-white/60 hover:text-[#FF3E8A] border border-white/10"
        >
          <SignOut size={14} /> sign out
        </motion.button>

        <div className="flex items-center justify-center gap-2 mt-6 pb-4 opacity-40">
          <Logo size={16} />
          <span className="text-[10px] tracking-[0.22em] uppercase font-semibold">nova · your bitcoin on steroids</span>
        </div>
      </div>
    </Shell>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div
      className="rounded-2xl p-3 text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
    >
      <div className="text-[8px] tracking-[0.2em] uppercase text-white/45 font-semibold">{label}</div>
      <div className="font-display text-base font-bold mt-0.5">{value}</div>
      {unit && <div className="text-[9px] text-white/40 uppercase tracking-wider">{unit}</div>}
    </div>
  );
}
