import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";

const RANGES = [
  { k: "1h", label: "1H" },
  { k: "24h", label: "24H" },
  { k: "7d", label: "7D" },
  { k: "30d", label: "30D" },
  { k: "1y", label: "1Y" },
];

export default function PriceChart() {
  const [range, setRange] = useState("24h");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get(`/market/chart?range=${range}`).then((r) => {
      if (!alive) return;
      setData(r.data.points || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { alive = false; };
  }, [range]);

  const first = data[0]?.p || 0;
  const last = data[data.length - 1]?.p || 0;
  const up = last >= first;
  const color = up ? "#00D09C" : "#FF443A";

  return (
    <div className="relative">
      <div className="h-40" data-testid="price-chart">
        {loading ? (
          <div className="h-full flex items-center justify-center text-white/40 text-xs font-mono">loading chart…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={1} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
              <Tooltip
                contentStyle={{
                  background: "#121212",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: 12,
                  fontFamily: "Space Grotesk",
                  fontSize: 12,
                }}
                labelFormatter={(v) => new Date(data[v]?.t).toLocaleTimeString()}
                formatter={(v) => [`$${Number(v).toLocaleString()}`, "BTC"]}
              />
              <Line
                type="monotone"
                dataKey="p"
                stroke="url(#chartGrad)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex gap-1 mt-3 glass rounded-full p-1">
        {RANGES.map((r) => (
          <motion.button
            key={r.k}
            whileTap={{ scale: 0.94 }}
            onClick={() => setRange(r.k)}
            data-testid={`chart-range-${r.k}`}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors ${
              range === r.k ? "bg-[#D4AF37] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {r.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
