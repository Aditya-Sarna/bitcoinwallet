import { motion } from "framer-motion";
import { fmtBTC, fmtUSD } from "../lib/format";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

/**
 * AbstractBalanceArt — the hero replaces a traditional card with an
 * asymmetric editorial artpiece:
 *   - organic blobs & a giant off-center sun disc in brand colors
 *   - grain texture
 *   - the amount as massive floating display typography
 *   - a cursive "the vault" label with the user's name in all-caps mono
 *   - BTC balance and 24h change drawn as annotations connected with
 *     thin hairline "leaders" (like an editorial infographic)
 *
 * Works on both dark and light themes (no solid card bg — shapes only).
 */
export default function AbstractBalanceArt({ name, balance, fiat, change24h, loading }) {
  const up = (change24h || 0) >= 0;
  const Arrow = up ? TrendUp : TrendDown;

  return (
    <div className="relative mt-4 mx-5" data-testid="balance-art" style={{ height: 300 }}>
      {/* === ART LAYER === */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        className="absolute inset-0"
        preserveAspectRatio="xMidYMid slice"
        style={{ filter: "saturate(1.05)" }}
      >
        <defs>
          <linearGradient id="sun-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF7A3A" />
            <stop offset="60%" stopColor="#FF3E8A" />
            <stop offset="100%" stopColor="#6B5CFC" />
          </linearGradient>
          <linearGradient id="blob-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4FF4F" />
            <stop offset="100%" stopColor="#34D8FF" />
          </linearGradient>
          <filter id="grain-art" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.25 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* big off-center sun disc — partial, bleeds off the right edge */}
        <motion.circle
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: 150, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          cx="330"
          cy="120"
          fill="url(#sun-grad)"
        />

        {/* thin orbital rings around sun */}
        <motion.ellipse
          initial={{ opacity: 0, rx: 0 }}
          animate={{ opacity: 0.4, rx: 190 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          cx="330" cy="120" rx="190" ry="50"
          transform="rotate(-18 330 120)"
          fill="none" stroke="var(--ink-3)" strokeWidth="0.7"
        />
        <motion.ellipse
          initial={{ opacity: 0, rx: 0 }}
          animate={{ opacity: 0.25, rx: 240 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          cx="330" cy="120" rx="240" ry="80"
          transform="rotate(-18 330 120)"
          fill="none" stroke="var(--ink-3)" strokeWidth="0.5"
        />

        {/* organic blob — lime/cyan, bottom-left */}
        <motion.path
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "80px 240px" }}
          d="M 20 260 C 20 200, 60 180, 110 200 S 180 260, 150 280 S 40 300, 20 260 Z"
          fill="url(#blob-grad)"
          opacity="0.9"
        />

        {/* little spark triangle — pink, mid */}
        <motion.path
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          d="M 170 50 L 200 70 L 170 90 Z"
          fill="#FF3E8A"
        />

        {/* grain overlay on sun */}
        <rect x="180" y="0" width="220" height="260" fill="#fff" opacity="0.08" filter="url(#grain-art)" />

        {/* thin hairline leaders */}
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          x1="40" y1="30" x2="140" y2="30"
          stroke="var(--ink-3)" strokeWidth="0.6"
        />
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          x1="260" y1="255" x2="360" y2="255"
          stroke="var(--ink-3)" strokeWidth="0.6"
        />

        {/* tick marks on hairlines */}
        <circle cx="40" cy="30" r="2" fill="var(--ink-2)" />
        <circle cx="360" cy="255" r="2" fill="var(--ink-2)" />
      </svg>

      {/* === TYPE LAYER === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* top-left cursive eyebrow */}
        <div className="absolute top-1 left-0 pr-4">
          <div className="flex items-baseline gap-3">
            <span
              className="leading-none"
              style={{
                fontFamily: "Italianno, cursive",
                fontSize: 38,
                color: "var(--ink)",
                opacity: 0.9,
              }}
            >
              the vault of
            </span>
            <span
              className="font-mono uppercase tracking-[0.2em] text-[10px] font-bold"
              style={{ color: "var(--ink-2)" }}
              data-testid="art-name"
            >
              {(name || "—").toUpperCase()}
            </span>
          </div>
        </div>

        {/* massive $ amount — center-left, dominant */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="absolute left-0 top-12"
          data-testid="art-fiat"
        >
          <div
            className="leading-[0.85] tracking-[-0.05em] lowercase"
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontWeight: 700,
              fontSize: 84,
              color: "var(--ink)",
            }}
          >
            {loading ? (
              <>—</>
            ) : (
              <>
                <span style={{ fontSize: 48, verticalAlign: "top", opacity: 0.55 }}>$</span>
                {fmtUSD(Math.floor(fiat || 0), 0)}
              </>
            )}
          </div>
          {/* decimals as subdued */}
          {!loading && (
            <div
              className="leading-none mt-1"
              style={{
                fontFamily: "Clash Display, sans-serif",
                fontWeight: 500,
                fontSize: 18,
                color: "var(--ink-2)",
              }}
            >
              .{(((fiat || 0) % 1) * 100).toFixed(0).padStart(2, "0")}{" "}
              <span
                style={{
                  fontFamily: "Italianno, cursive",
                  fontSize: 22,
                  color: "var(--ink-2)",
                }}
              >
                usd
              </span>
            </div>
          )}
        </motion.div>

        {/* BTC annotation — anchored to top-right hairline */}
        <div className="absolute top-[14px] right-4 text-right">
          <div
            className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold"
            style={{ color: "var(--ink-2)" }}
          >
            balance
          </div>
          <div
            className="font-mono mt-0.5 font-bold"
            style={{ color: "var(--ink)", fontSize: 14 }}
            data-testid="art-btc"
          >
            {loading ? "…" : `${fmtBTC(balance, 8)} btc`}
          </div>
        </div>

        {/* 24h change annotation — bottom-right */}
        <div className="absolute bottom-3 right-4 text-right">
          <div
            className="font-mono text-[9px] tracking-[0.2em] uppercase font-bold"
            style={{ color: "var(--ink-2)" }}
          >
            24h
          </div>
          {change24h !== null && change24h !== undefined && (
            <div
              className="flex items-center justify-end gap-1 mt-0.5 font-mono font-bold"
              style={{
                color: up ? "#D4FF4F" : "#FF3E8A",
                fontSize: 14,
              }}
              data-testid="art-change"
            >
              <Arrow size={12} weight="bold" />
              {up ? "+" : ""}
              {(change24h || 0).toFixed(2)}%
            </div>
          )}
        </div>

        {/* subtle cursive signature bottom-left */}
        <div
          className="absolute left-1 bottom-1"
          style={{
            fontFamily: "Italianno, cursive",
            fontSize: 22,
            color: "var(--ink-3)",
          }}
        >
          a quiet rebellion.
        </div>
      </div>
    </div>
  );
}
