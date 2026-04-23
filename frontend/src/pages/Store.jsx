import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Storefront, Tag, ArrowRight } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import { api } from "../lib/api";
import { fmtCoins } from "../lib/format";

// Brand color mapping
const BRAND_STYLES = {
  "Amazon":      { bg: "#FF9900", text: "#fff" },
  "Starbucks":   { bg: "#00704A", text: "#fff" },
  "Uber":        { bg: "#0A0A0F", text: "#fff", border: "1px solid #444" },
  "Dior":        { bg: "#EADDC5", text: "#000" },
  "Spotify":     { bg: "#1DB954", text: "#000" },
  "Nike":        { bg: "#FF6B00", text: "#fff" },
  "AirMiles":    { bg: "#34D8FF", text: "#0A0A0F" },
  "Mystery Box": { bg: "#6B5CFC", text: "#fff" },
};

export default function Store() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(0);
  const [cat, setCat] = useState(searchParams.get("cat") || "all");

  const load = () =>
    api.get("/rewards/store").then((r) => {
      setItems(r.data.items);
      setCoins(r.data.coins);
    });

  useEffect(() => { load(); }, []);

  // Keep URL ?cat= in sync if user navigates here directly with a category
  useEffect(() => {
    const urlCat = searchParams.get("cat");
    if (urlCat && urlCat !== cat) setCat(urlCat);
    // eslint-disable-next-line
  }, [searchParams]);

  const cats = [
    { k: "all", label: "all" },
    { k: "luxury", label: "luxury" },
    { k: "shopping", label: "shop" },
    { k: "travel", label: "travel" },
    { k: "food", label: "food" },
    { k: "entertainment", label: "play" },
  ];

  const filtered = items.filter((i) => cat === "all" || i.category === cat);

  return (
    <Shell>
      <div className="px-5 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4FF4F] font-bold">nova store</div>
            <h1
              className="text-white mt-1 tracking-[-0.035em] leading-[0.95] lowercase"
              style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 44 }}
            >
              spend,<br /><span style={{ color: "#D4FF4F" }}>brighter.</span>
            </h1>
            <div className="text-white/55 text-sm mt-2 max-w-[260px]">
              redeem coins for vouchers, gift cards and real products.
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#D4FF4F22", border: "1px solid #D4FF4F55" }}
          >
            <Storefront size={18} color="#D4FF4F" weight="bold" />
          </div>
        </div>

        <div
          className="mt-5 rounded-3xl p-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #D4FF4F 0%, #7CFF8A 100%)", color: "#0A0A0F" }}
          data-testid="store-balance"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <span className="font-bold text-[#D4FF4F]">$</span>
          </div>
          <div className="flex-1">
            <div className="text-[9px] tracking-[0.2em] uppercase font-bold opacity-70">available</div>
            <div className="font-display text-xl font-bold">{fmtCoins(coins)} coins</div>
          </div>
          <Tag size={16} />
        </div>

        <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar">
          {cats.map((c) => (
            <button
              key={c.k}
              onClick={() => setCat(c.k)}
              data-testid={`store-cat-${c.k}`}
              className="px-4 py-2 rounded-full whitespace-nowrap text-[11px] lowercase tracking-wider transition-colors font-bold"
              style={
                cat === c.k
                  ? { background: "#D4FF4F", color: "#0A0A0F" }
                  : { background: "var(--surface)", color: "rgba(255,255,255,0.6)", border: "1px solid var(--surface-border)" }
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5" data-testid="store-items">
          {filtered.map((item, idx) => {
            const style = BRAND_STYLES[item.brand] || { bg: item.color, text: "#fff" };
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -2 }}
                onClick={() => nav(`/store/${item.id}`)}
                className="rounded-[24px] overflow-hidden flex flex-col cursor-pointer"
                style={{ background: "#141420", border: "1px solid var(--surface-border)" }}
                data-testid={`store-item-${item.id}`}
              >
                <div
                  className="h-32 flex items-center justify-center text-center px-3 relative overflow-hidden"
                  style={{ background: style.bg, color: style.text, border: style.border || "none" }}
                >
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.2) 0%, transparent 50%)",
                    }}
                  />
                  <div className="relative">
                    <div
                      className="lowercase"
                      style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "-0.03em" }}
                    >
                      {item.brand.toLowerCase()}
                    </div>
                    <div className="text-[9px] tracking-[0.22em] uppercase mt-2 opacity-70 font-bold">voucher</div>
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="text-xs font-bold flex-1">{item.title}</div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="font-mono text-sm font-bold" style={{ color: "#D4FF4F" }}>{fmtCoins(item.cost)}</div>
                    <ArrowRight size={14} className="text-white/40" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
