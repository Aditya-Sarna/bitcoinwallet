import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserCircle, Copy, SignOut, Bell, ShieldCheck, Question, Gift, CaretRight } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import BitcoinScore from "../components/BitcoinScore";
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
    toast.success("Referral code copied");
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("btc_token");
    toast.success("Signed out");
    nav("/lock");
  };

  const items = [
    {
      Icon: ShieldCheck,
      label: "security & backup",
      desc: security ? (security.seed_backed_up ? "fortress · phrase verified" : "action needed · backup phrase") : "—",
      warn: security && !security.seed_backed_up,
      testid: "profile-security",
      to: "/security",
    },
    { Icon: Bell, label: "notifications", desc: "alerts & activity updates", testid: "profile-notifications" },
    { Icon: Question, label: "help center", desc: "contact, faq, disputes", testid: "profile-help" },
  ];

  const memberSince = wallet?.created_at
    ? new Date(wallet.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";

  return (
    <Shell>
      <div className="grain" />
      <div className="px-5 pt-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center glow-gold">
            <UserCircle size={32} weight="fill" className="text-black" />
          </div>
          <div className="flex-1">
            <div className="text-[9px] tracking-[0.28em] uppercase text-white/40">the vault of</div>
            <div className="font-cursive text-4xl text-white leading-none mt-0.5" data-testid="profile-name">{wallet?.name || "…"}</div>
            <div className="text-[10px] text-white/50 font-mono mt-1">{shortAddr(wallet?.btc_address, 8, 8)}</div>
          </div>
        </div>
        <div className="text-[10px] text-white/30 font-serif-italic mt-3">· member since {memberSince} ·</div>

        <div className="grid grid-cols-3 gap-2 mt-5">
          <Stat label="balance" value={`${fmtBTC(wallet?.balance_btc, 4)}`} unit="BTC" />
          <Stat label="coins" value={fmtCoins(wallet?.coins)} unit="" />
          <Stat label="streak" value={wallet?.streak} unit="days" />
        </div>

        <div className="mt-5 glass rounded-3xl p-5">
          <BitcoinScore score={wallet?.btc_score || 742} />
        </div>

        {/* Referral */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="mt-5 rounded-3xl p-5 cursor-pointer"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.02))", border: "1px solid rgba(212,175,55,0.3)" }}
          onClick={copyReferral}
          data-testid="profile-referral"
        >
          <div className="flex items-center gap-2 mb-2">
            <Gift size={16} weight="fill" className="text-gold" />
            <div className="text-[9px] tracking-[0.28em] uppercase text-gold">invite & earn</div>
          </div>
          <div className="font-cursive text-3xl text-white/90 leading-tight">share the secret.</div>
          <div className="text-xs text-white/60 mt-1">Earn <span className="text-gold font-semibold">500 coins</span> per friend who joins.</div>
          <div className="flex items-center gap-2 bg-black/50 rounded-2xl p-3 mt-3">
            <div className="flex-1 font-mono text-base tracking-[0.2em]" data-testid="profile-referral-code">{wallet?.referral_code || "—"}</div>
            <Copy size={14} className="text-gold" />
          </div>
        </motion.div>

        {/* Items */}
        <div className="mt-5 glass rounded-3xl overflow-hidden">
          {items.map(({ Icon, label, desc, warn, testid, to }, i) => (
            <button
              key={label}
              data-testid={testid}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${i < items.length - 1 ? "border-b border-white/5" : ""}`}
              onClick={() => (to ? nav(to) : toast("Coming soon"))}
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative">
                <Icon size={16} className="text-gold" />
                {warn && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF7A3A]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm lowercase">{label}</div>
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
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold tracking-wider uppercase text-white/60 hover:text-[#FF443A] border border-white/10"
        >
          <SignOut size={14} /> sign out
        </motion.button>

        <div className="text-center font-cursive text-2xl text-white/20 mt-6 pb-4">SatVault · the emergent bitcoin wallet</div>
      </div>
    </Shell>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className="text-[8px] tracking-[0.22em] uppercase text-white/40">{label}</div>
      <div className="font-display text-base font-semibold mt-0.5">{value}</div>
      {unit && <div className="text-[9px] text-white/40 uppercase tracking-wider">{unit}</div>}
    </div>
  );
}
