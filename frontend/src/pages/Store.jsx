import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Storefront } from "@phosphor-icons/react";
import Shell from "../components/Shell";
import { api } from "../lib/api";
import { fmtCoins } from "../lib/format";

export default function Store() {
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(0);
  const [cat, setCat] = useState("all");
  const [redeemed, setRedeemed] = useState(null);

  const load = () =>
    api.get("/rewards/store").then((r) => {
      setItems(r.data.items);
      setCoins(r.data.coins);
    });

  useEffect(() => { load(); }, []);

  const redeem = async (item) => {
    if (coins < item.cost) return toast.error("Not enough coins");
    try {
      const { data } = await api.post("/rewards/redeem", { item_id: item.id });
      setCoins(data.coins);
      setRedeemed(data.redemption);
      toast.success(`Redeemed · Code: ${data.redemption.code}`);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed");
    }
  };

  const cats = [
    { k: "all", label: "All" },
    { k: "luxury", label: "Luxury" },
    { k: "shopping", label: "Shop" },
    { k: "travel", label: "Travel" },
    { k: "food", label: "Food" },
    { k: "entertainment", label: "Ent" },
  ];

  const filtered = items.filter((i) => cat === "all" || i.category === cat);

  return (
    <Shell>
      <div className="grain" />
      <div className="px-6 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">rewards store</div>
            <h1 className="font-display text-4xl font-semibold tracking-tight mt-1">spend your coins</h1>
          </div>
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
            <Storefront size={18} className="text-gold" />
          </div>
        </div>

        <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-3" data-testid="store-balance">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
            <span className="font-bold text-black">$</span>
          </div>
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.22em] uppercase text-white/50">available</div>
            <div className="font-display text-2xl font-semibold">{fmtCoins(coins)} coins</div>
          </div>
        </div>

        <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar">
          {cats.map((c) => (
            <button
              key={c.k}
              onClick={() => setCat(c.k)}
              data-testid={`store-cat-${c.k}`}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-[11px] uppercase tracking-widest font-semibold transition-colors ${
                cat === c.k ? "bg-[#D4AF37] text-black" : "glass text-white/60"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5" data-testid="store-items">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.97 }}
              className="glass rounded-3xl overflow-hidden flex flex-col"
              data-testid={`store-item-${item.id}`}
            >
              <div
                className="h-28 flex items-center justify-center text-center px-3"
                style={{
                  background: `linear-gradient(135deg, ${item.color}22, ${item.color}08)`,
                  borderBottom: `1px solid ${item.color}33`,
                }}
              >
                <div className="font-display font-semibold text-lg" style={{ color: item.color === "#FFFFFF" ? "#fff" : item.color }}>
                  {item.brand}
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="text-xs font-semibold flex-1">{item.title}</div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-gold font-mono text-sm font-semibold">{fmtCoins(item.cost)}</div>
                  <button
                    onClick={() => redeem(item)}
                    data-testid={`store-redeem-${item.id}`}
                    disabled={coins < item.cost}
                    className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-white/5 text-white disabled:opacity-30 hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    redeem
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {redeemed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-3xl p-5"
            style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.04))", border: "1px solid rgba(212,175,55,0.4)" }}
            data-testid="redeemed-card"
          >
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold">last redeemed</div>
            <div className="font-display text-xl mt-1">{redeemed.title}</div>
            <div className="text-xs text-white/60 mt-1">{redeemed.brand}</div>
            <div className="mt-3 font-mono text-lg tracking-widest bg-black/50 rounded-xl p-3 text-center">{redeemed.code}</div>
          </motion.div>
        )}
      </div>
    </Shell>
  );
}
