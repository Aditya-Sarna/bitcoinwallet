import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserCircle, Copy, SignOut, Bell, ShieldCheck, Question, Gift } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import BitcoinScore from "../components/BitcoinScore";
import { api } from "../lib/api";
import { shortAddr, fmtBTC, fmtCoins } from "../lib/format";

export default function Profile() {
  const nav = useNavigate();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    api.get("/wallet/me").then((r) => setWallet(r.data));
  }, []);

  const copyReferral = () => {
    navigator.clipboard.writeText(wallet?.referral_code || "");
    toast.success("Referral code copied");
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("btc_token");
    toast.success("Logged out");
    nav("/lock");
  };

  const items = [
    { Icon: Bell, label: "Notifications", testid: "profile-notifications" },
    { Icon: ShieldCheck, label: "Security & PIN", testid: "profile-security" },
    { Icon: Question, label: "Help center", testid: "profile-help" },
  ];

  return (
    <Shell>
      <div className="grain" />
      <div className="px-6 pt-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center glow-gold">
            <UserCircle size={32} weight="fill" className="text-black" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.28em] uppercase text-white/40">member</div>
            <div className="font-display text-2xl" data-testid="profile-name">{wallet?.name || "…"}</div>
            <div className="text-xs text-white/50 font-mono">{shortAddr(wallet?.btc_address, 8, 8)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <Stat label="Balance" value={`${fmtBTC(wallet?.balance_btc, 4)}`} unit="BTC" />
          <Stat label="Coins" value={fmtCoins(wallet?.coins)} unit="" />
          <Stat label="Streak" value={wallet?.streak} unit="days" />
        </div>

        <div className="mt-6 glass rounded-3xl p-5">
          <BitcoinScore score={wallet?.btc_score || 742} />
        </div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          className="mt-5 rounded-3xl p-5 cursor-pointer"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.02))", border: "1px solid rgba(212,175,55,0.3)" }}
          onClick={copyReferral}
          data-testid="profile-referral"
        >
          <div className="flex items-center gap-3 mb-3">
            <Gift size={18} weight="fill" className="text-gold" />
            <div className="text-[10px] tracking-[0.28em] uppercase text-gold">invite & earn</div>
          </div>
          <div className="text-sm text-white/70 mb-3">Share your code. Earn <span className="text-gold font-semibold">500 coins</span> per friend.</div>
          <div className="flex items-center gap-2 bg-black/50 rounded-2xl p-3">
            <div className="flex-1 font-mono text-lg tracking-widest" data-testid="profile-referral-code">{wallet?.referral_code || "—"}</div>
            <Copy size={16} className="text-gold" />
          </div>
        </motion.div>

        <div className="mt-6 glass rounded-3xl overflow-hidden">
          {items.map(({ Icon, label, testid }, i) => (
            <button
              key={label}
              data-testid={testid}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${i < items.length - 1 ? "border-b border-white/5" : ""}`}
              onClick={() => toast("Coming soon")}
            >
              <Icon size={18} className="text-gold" />
              <div className="flex-1 text-sm">{label}</div>
              <div className="text-white/30">›</div>
            </button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          data-testid="profile-logout"
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold tracking-wider uppercase text-white/60 hover:text-[#FF443A] border border-white/10"
        >
          <SignOut size={16} /> sign out
        </motion.button>

        <div className="text-center text-[10px] tracking-[0.3em] uppercase text-white/30 mt-6 pb-4">
          SATVAULT · v1.0
        </div>
      </div>
    </Shell>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className="text-[9px] tracking-[0.22em] uppercase text-white/40">{label}</div>
      <div className="font-display text-lg font-semibold mt-1">{value}</div>
      {unit && <div className="text-[9px] text-white/40 uppercase tracking-wider">{unit}</div>}
    </div>
  );
}
