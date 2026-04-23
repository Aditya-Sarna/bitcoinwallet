import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Flame, Gift, Sparkle } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import { api } from "../lib/api";
import { fmtCoins } from "../lib/format";

export default function Rewards() {
  const nav = useNavigate();
  const [daily, setDaily] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [coinBurst, setCoinBurst] = useState(false);

  const load = () => api.get("/rewards/daily").then((r) => setDaily(r.data));
  useEffect(() => { load(); }, []);

  const claim = async () => {
    setClaiming(true);
    try {
      const { data } = await api.post("/rewards/claim");
      setCoinBurst(true);
      setTimeout(() => setCoinBurst(false), 1400);
      toast.success(`+${data.reward} coins · Day ${data.streak} streak`);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Try again");
    } finally {
      setClaiming(false);
    }
  };

  const streak = daily?.streak || 0;
  const streakDays = Array.from({ length: 7 }, (_, i) => i < (streak % 7 || 7));

  return (
    <Shell>
      <div className="grain" />
      <div className="px-6 pt-10">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">rewards center</div>
        <h1 className="font-display text-4xl font-semibold tracking-tight mt-1">earn. unlock. flex.</h1>

        {/* Coin balance hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 relative rounded-3xl p-6 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a1a1a, #000)",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
          data-testid="rewards-hero"
        >
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(#D4AF37, transparent 70%)" }} />
          <div className="relative flex items-center gap-4">
            <motion.div
              animate={{ rotate: coinBurst ? [0, -15, 15, -8, 0] : 0, scale: coinBurst ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center glow-gold"
            >
              <span className="text-black font-bold text-2xl">$</span>
            </motion.div>
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.28em] uppercase text-white/50">your coins</div>
              <div className="font-display text-4xl font-semibold" data-testid="rewards-coins">{fmtCoins(daily?.coins)}</div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => nav("/store")}
            data-testid="rewards-goto-store"
            className="w-full gold-gradient text-black font-semibold rounded-full py-3 mt-5 uppercase tracking-[0.22em] text-xs"
          >
            Redeem coins
          </motion.button>
        </motion.div>

        {/* Streak */}
        <div className="mt-5 glass rounded-3xl p-5" data-testid="streak-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/40">streak</div>
              <div className="flex items-end gap-2 mt-1">
                <Flame size={24} weight="fill" className="text-[#FF7A3A]" />
                <div className="font-display text-3xl font-semibold">{streak}</div>
                <div className="text-white/50 text-sm pb-1">days</div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={!daily?.can_claim || claiming}
              onClick={claim}
              data-testid="rewards-claim-btn"
              className={`px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.22em] font-bold ${
                daily?.can_claim
                  ? "gold-gradient text-black"
                  : "bg-white/5 text-white/40 cursor-not-allowed"
              }`}
            >
              {claiming ? "…" : daily?.can_claim ? `Claim +${daily?.next_reward}` : "Claimed"}
            </motion.button>
          </div>
          <div className="flex justify-between mt-5">
            {streakDays.map((on, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${on ? "gold-gradient text-black" : "bg-white/5 text-white/30"}`}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Bento testid="bento-mystery" icon={<Gift size={18} weight="fill" className="text-gold" />} title="Mystery Box" subtitle="Spin to win up to 5,000 coins" onClick={() => toast("Coming soon")} />
          <Bento testid="bento-referral" icon={<Sparkle size={18} weight="fill" className="text-gold" />} title="Invite Friends" subtitle="Earn 500 coins per friend" onClick={() => nav("/profile")} />
        </div>

        {/* How to earn */}
        <div className="mt-6 glass rounded-3xl p-5">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-3">how to earn</div>
          <Earn title="Send bitcoin" reward="+50" />
          <Earn title="Pay bills with BTC" reward="+10/$1" />
          <Earn title="Daily streak" reward="+100+" />
          <Earn title="Refer a friend" reward="+500" last />
        </div>
      </div>
    </Shell>
  );
}

function Bento({ icon, title, subtitle, onClick, testid }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      data-testid={testid}
      className="glass rounded-3xl p-4 text-left h-32 flex flex-col justify-between"
    >
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[10px] text-white/50 mt-0.5">{subtitle}</div>
      </div>
    </motion.button>
  );
}

function Earn({ title, reward, last }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${last ? "" : "border-b border-white/5"}`}>
      <div className="text-sm">{title}</div>
      <div className="text-gold font-mono text-sm">{reward}</div>
    </div>
  );
}
