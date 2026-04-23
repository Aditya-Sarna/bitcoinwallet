import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkle, Lock } from "@phosphor-icons/react";
import Header from "../components/Header";
import { api } from "../lib/api";
import { fmtCoins } from "../lib/format";

const BRAND_STYLES = {
  Amazon:        { bg: "#FF9900", text: "#fff", tagline: "the everything store" },
  Starbucks:     { bg: "#00704A", text: "#fff", tagline: "your coffee, your moment" },
  Uber:          { bg: "#0A0A0F", text: "#fff", tagline: "go anywhere", border: "1px solid #333" },
  Dior:          { bg: "#EADDC5", text: "#000", tagline: "savoir-faire since 1947" },
  Spotify:       { bg: "#1DB954", text: "#000", tagline: "music for everyone" },
  Nike:          { bg: "#FF6B00", text: "#fff", tagline: "just do it." },
  AirMiles:      { bg: "#34D8FF", text: "#0A0A0F", tagline: "fly farther" },
  "Mystery Box": { bg: "#6B5CFC", text: "#fff", tagline: "fortune favors the bold" },
};

const PERKS = {
  shopping: ["instant delivery", "no expiry", "stackable with offers"],
  food: ["valid at all outlets", "redeem in app", "no minimum order"],
  travel: ["one-time use", "valid 6 months", "global redemption"],
  luxury: ["exclusive members only", "concierge included", "personal stylist"],
  entertainment: ["streaming + downloads", "ad-free", "all devices"],
  mystery: ["random reward", "guaranteed coin value", "limited time"],
};

export default function StoreItem() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/rewards/store").then((r) => {
      setItem(r.data.items.find((i) => i.id === id));
      setCoins(r.data.coins);
    });
  }, [id]);

  if (!item) {
    return (
      <div className="shell" style={{ background: "#0A0A0F" }}>
        <Header title="loading…" />
        <div className="px-6 py-20 text-center text-white/40 text-xs tracking-widest uppercase">fetching voucher…</div>
      </div>
    );
  }

  const style = BRAND_STYLES[item.brand] || { bg: item.color, text: "#fff", tagline: "premium voucher" };
  const canAfford = coins >= item.cost;
  const perks = PERKS[item.category] || ["instant delivery", "no expiry"];

  const redeem = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/rewards/redeem", { item_id: item.id });
      nav("/success", {
        state: {
          kind: "redeemed",
          title: item.title,
          subtitle: item.brand,
          amount: data.redemption.code,
          secondary: `-${fmtCoins(item.cost)} coins · new balance ${fmtCoins(data.coins)}`,
          receiverInitial: item.brand.charAt(0).toUpperCase(),
          lines: [
            { label: "brand", value: item.brand },
            { label: "voucher", value: item.title },
            { label: "code", value: data.redemption.code },
            { label: "coins spent", value: fmtCoins(item.cost) },
          ],
          ctaLabel: "back to store",
          ctaTo: "/store",
          secondaryCta: { label: "view profile", to: "/profile" },
        },
      });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "redemption failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell pad-bottom" style={{ background: "#0A0A0F" }}>
      <Header title={item.brand} />

      <div className="px-5">
        {/* Hero voucher card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] overflow-hidden relative"
          style={{
            background: style.bg,
            color: style.text,
            border: style.border || "none",
            minHeight: 280,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
          data-testid="voucher-hero"
        >
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.18) 0%, transparent 50%)",
            }}
          />
          <div className="absolute top-5 right-5 opacity-40">
            <Sparkle size={22} weight="fill" />
          </div>
          <div className="relative h-full p-6 flex flex-col justify-between" style={{ minHeight: 280 }}>
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase opacity-70 font-bold">NOVA · voucher</div>
              <div
                className="mt-3 lowercase tracking-[-0.03em]"
                style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 44, lineHeight: 0.95 }}
              >
                {item.brand.toLowerCase()}
              </div>
              <div className="text-sm mt-2 opacity-80 font-semibold">{style.tagline}</div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[9px] tracking-[0.22em] uppercase opacity-60 font-bold">unlocks</div>
                <div className="font-display text-2xl font-bold mt-1">{item.title}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] tracking-[0.22em] uppercase opacity-60 font-bold">cost</div>
                <div className="font-mono text-xl font-bold mt-1">{fmtCoins(item.cost)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coin balance bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" }}
          data-testid="voucher-balance"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#D4FF4F" }}>
            <span className="font-bold text-black">$</span>
          </div>
          <div className="flex-1">
            <div className="text-[9px] tracking-[0.2em] uppercase text-white/50 font-bold">your coins</div>
            <div className="font-display text-lg font-bold">{fmtCoins(coins)}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] tracking-[0.2em] uppercase text-white/50 font-bold">after redeem</div>
            <div className={`font-mono text-base font-bold ${canAfford ? "text-white" : "text-[#FF3E8A]"}`}>
              {canAfford ? fmtCoins(coins - item.cost) : "insufficient"}
            </div>
          </div>
        </motion.div>

        {/* Perks */}
        <div
          className="mt-5 rounded-3xl p-5"
          style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-3 font-bold">what's inside</div>
          {perks.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className={`flex items-center gap-3 py-2.5 ${i < perks.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                   style={{ background: "#D4FF4F22", border: "1px solid #D4FF4F55" }}>
                <Sparkle size={12} weight="fill" color="#D4FF4F" />
              </div>
              <div className="text-sm">{p}</div>
            </motion.div>
          ))}
        </div>

        {/* Terms */}
        <div
          className="mt-5 rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/45 mb-2 font-bold">
            <Lock size={10} /> terms
          </div>
          <div className="text-xs text-white/55 leading-relaxed">
            redemption is non-refundable. one voucher per redemption. nova is not the issuer of the underlying gift card — codes are delivered instantly via partner.
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canAfford || loading}
          onClick={redeem}
          data-testid="voucher-redeem-btn"
          className="mt-6 w-full disabled:opacity-30 disabled:grayscale font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[12px]"
          style={{ background: "#D4FF4F", color: "#0A0A0F" }}
        >
          {loading ? "unlocking…" : canAfford ? `redeem for ${fmtCoins(item.cost)}` : "not enough coins"}
        </motion.button>
        {!canAfford && (
          <button
            onClick={() => nav("/rewards")}
            data-testid="voucher-earn-more"
            className="mt-3 w-full text-[11px] tracking-[0.18em] uppercase py-2 font-bold"
            style={{ color: "#D4FF4F" }}
          >
            earn more coins →
          </button>
        )}
      </div>
    </div>
  );
}
