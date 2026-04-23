import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Storefront, Tag, ArrowRight } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import { api } from "../lib/api";
import { fmtCoins } from "../lib/format";

// Brand color mapping with image backdrops
const BRAND_STYLES = {
  "Amazon": { bg: "#FF9900", image: null, text: "#fff" },
  "Starbucks": { bg: "#00704A", image: null, text: "#fff" },
  "Uber": { bg: "#000", image: null, text: "#fff", border: "1px solid #444" },
  "Dior": { bg: "#EADDC5", image: null, text: "#000" },
  "Spotify": { bg: "#1DB954", image: null, text: "#000" },
  "Nike": { bg: "#FF6B00", image: null, text: "#fff" },
  "AirMiles": { bg: "#4A90E2", image: null, text: "#fff" },
  "Mystery Box": { bg: "#6936D6", image: null, text: "#fff" },
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
      <div className="grain" />
      <div className="px-5 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] tracking-[0.28em] uppercase text-white/40">satvault store</div>
            <h1
              className="text-white leading-none mt-1 tracking-tight"
              style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: 44 }}
            >
              spend, lavishly.
            </h1>
            <div className="text-white/50 text-sm mt-2 font-serif-italic">
              from luxury goods to utility · your coins, your world.
            </div>
          </div>
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center shrink-0">
            <Storefront size={18} className="text-gold" />
          </div>
        </div>

        <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-3" data-testid="store-balance">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
            <span className="font-bold text-black">$</span>
          </div>
          <div className="flex-1">
            <div className="text-[9px] tracking-[0.22em] uppercase text-white/50">available</div>
            <div className="font-display text-xl font-semibold">{fmtCoins(coins)} coins</div>
          </div>
          <Tag size={16} className="text-white/40" />
        </div>

        <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar">
          {cats.map((c) => (
            <button
              key={c.k}
              onClick={() => setCat(c.k)}
              data-testid={`store-cat-${c.k}`}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-[11px] lowercase tracking-wider transition-colors ${
                cat === c.k ? "bg-white text-black font-semibold" : "glass text-white/60"
              }`}
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
                className="rounded-3xl overflow-hidden flex flex-col cursor-pointer"
                style={{ background: "#121212", border: "1px solid rgba(255,255,255,0.05)" }}
                data-testid={`store-item-${item.id}`}
              >
                <div
                  className="h-32 flex items-center justify-center text-center px-3 relative overflow-hidden"
                  style={{ background: style.bg, color: style.text, border: style.border || "none" }}
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.2) 0%, transparent 50%)",
                    }} />
                  <div className="relative">
                    <div
                    className="text-2xl leading-none opacity-85 lowercase"
                    style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}
                  >
                    {item.brand.toLowerCase()}
                  </div>
                    <div className="text-[9px] tracking-[0.25em] uppercase mt-2 opacity-70">voucher</div>
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="text-xs font-semibold flex-1">{item.title}</div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-gold font-mono text-sm font-semibold">{fmtCoins(item.cost)}</div>
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
