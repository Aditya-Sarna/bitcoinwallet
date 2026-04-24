import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Flame, Gift, Sparkle } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import SplashCard from "../components/SplashCard";
import { TreasureChest, GiftStack } from "../components/Illustrations";
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
      await load();
      nav("/success", {
        state: {
          kind: "claimed",
          title: `day ${data.streak} streak`,
          subtitle: "keep it alive — bigger rewards ahead",
          amount: `+${data.reward} coins`,
          secondary: `total · ${data.coins.toLocaleString()} coins`,
          ctaLabel: "back to home",
          secondaryCta: { label: "spend in store", to: "/store" },
        },
      });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "try again");
    } finally {
      setClaiming(false);
    }
  };

  const streak = daily?.streak || 0;
  const streakDays = Array.from({ length: 7 }, (_, i) => i < (streak % 7 || 7));

  return (
    <Shell>
      <div className="px-6 pt-10">
        <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4FF4F] font-bold">rewards center</div>
        <h1
          className="text-white tracking-[-0.035em] leading-[0.95] mt-1"
          style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 42 }}
        >
          earn. <span style={{ color: "#D4FF4F" }}>unlock. flex.</span>
        </h1>

        {/* Coin balance hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 relative rounded-[28px] p-6 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #D4FF4F 0%, #7CFF8A 100%)",
            color: "#0A0A0F",
          }}
          data-testid="rewards-hero"
        >
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-40 blur-3xl"
               style={{ background: "radial-gradient(#fff, transparent 70%)" }} />
          <div className="relative flex items-center gap-4">
            <motion.div
              animate={{ rotate: coinBurst ? [0, -15, 15, -8, 0] : 0, scale: coinBurst ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
             
            >
              <span className="font-bold text-2xl" style={{ color: "#D4FF4F" }}>$</span>
            </motion.div>
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.22em] uppercase font-bold opacity-70">your coins</div>
              <div
                className="tracking-[-0.035em]"
                style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 40, lineHeight: 1 }}
                data-testid="rewards-coins"
              >
                {fmtCoins(daily?.coins)}
              </div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => nav("/store")}
            data-testid="rewards-goto-store"
            className="w-full font-bold rounded-full py-3 mt-5 uppercase tracking-[0.16em] text-[12px]"
            style={{ background: "#0A0A0F", color: "#D4FF4F" }}
          >
            redeem coins
          </motion.button>
        </motion.div>

        {/* Streak */}
        <div
          className="mt-5 rounded-3xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
          data-testid="streak-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 font-bold">streak</div>
              <div className="flex items-end gap-2 mt-1">
                <Flame size={24} weight="fill" color="#FF3E8A" />
                <div
                  className="text-white tracking-[-0.03em]"
                  style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 30, lineHeight: 1 }}
                >
                  {streak}
                </div>
                <div className="text-white/50 text-sm pb-1">days</div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={!daily?.can_claim || claiming}
              onClick={claim}
              data-testid="rewards-claim-btn"
              className="px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.16em] font-bold"
              style={
                daily?.can_claim
                  ? { background: "#D4FF4F", color: "#0A0A0F" }
                  : { background: "var(--surface)", color: "rgba(255,255,255,0.4)", cursor: "not-allowed" }
              }
            >
              {claiming ? "…" : daily?.can_claim ? `claim +${daily?.next_reward}` : "claimed"}
            </motion.button>
          </div>
          <div className="flex justify-between mt-5">
            {streakDays.map((on, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={
                    on
                      ? { background: "#D4FF4F", color: "#0A0A0F" }
                      : { background: "var(--surface)", color: "rgba(255,255,255,0.3)" }
                  }
                >
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <SplashCard
            testid="bento-mystery"
            bg="#6B5CFC"
            textColor="#fff"
            ctaBg="#D4FF4F"
            ctaText="#0A0A0F"
            eyebrow="MYSTERY BOX"
            title={<>spin to<br />win big.</>}
            subtitle="upto 5,000 coins"
            tag="spin"
            height={200}
            size="sm"
            illustration={<TreasureChest color="purple" size={90} />}
            onClick={() => nav("/spin")}
          />
          <SplashCard
            testid="bento-referral"
            bg="#FF3E8A"
            textColor="#fff"
            ctaBg="#fff"
            ctaText="#FF3E8A"
            eyebrow="INVITE"
            title={<>share &<br />earn 500.</>}
            subtitle="per friend"
            tag="invite"
            height={200}
            size="sm"
            illustration={<GiftStack size={90} />}
            onClick={() => nav("/profile")}
          />
        </div>

        {/* How to earn */}
        <div
          className="mt-6 rounded-3xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-3 font-bold">how to earn</div>
          <Earn title="send bitcoin" reward="+50" />
          <Earn title="pay bills with BTC" reward="+10 / $1" />
          <Earn title="daily streak" reward="+100+" />
          <Earn title="refer a friend" reward="+500" last />
        </div>
      </div>
    </Shell>
  );
}

function Earn({ title, reward, last }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${last ? "" : "border-b border-white/5"}`}>
      <div className="text-sm lowercase">{title}</div>
      <div className="font-mono text-sm font-bold" style={{ color: "#D4FF4F" }}>{reward}</div>
    </div>
  );
}
