import { useEffect, useRef, useMemo } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";

/**
 * StyledQR — an innovative, story-telling QR code.
 * - Gold gradient rounded dots
 * - Custom corner "finder" shields
 * - Cursive arc text around the border
 * - Center emblem with user's initial and est. year
 * - Animated reveal
 */
export default function StyledQR({
  value,
  size = 260,
  initial = "B",
  topText = "every satoshi tells a story",
  bottomText = "· the emergent vault · est. 2026 ·",
}) {
  const qrModules = useMemo(() => {
    if (!value) return null;
    const q = QRCode.create(value, { errorCorrectionLevel: "H" });
    return q.modules;
  }, [value]);

  if (!qrModules) return <div style={{ width: size, height: size }} />;

  const mods = qrModules.size;
  const dotSize = size / mods;
  const innerSize = size - 40; // leave room for border arc
  const innerDot = innerSize / mods;
  const offset = (size - innerSize) / 2;

  // Finder pattern zones are 7x7 in three corners
  const isFinderZone = (row, col) => {
    const inTL = row < 7 && col < 7;
    const inTR = row < 7 && col >= mods - 7;
    const inBL = row >= mods - 7 && col < 7;
    return inTL || inTR || inBL;
  };

  // Center logo zone (hide modules under center emblem)
  const centerStart = Math.floor(mods * 0.4);
  const centerEnd = Math.ceil(mods * 0.6);
  const isCenterZone = (row, col) =>
    row >= centerStart && row < centerEnd && col >= centerStart && col < centerEnd;

  const dots = [];
  const data = qrModules.data;
  for (let row = 0; row < mods; row++) {
    for (let col = 0; col < mods; col++) {
      if (!data[row * mods + col]) continue;
      if (isFinderZone(row, col)) continue;
      if (isCenterZone(row, col)) continue;
      dots.push({ row, col });
    }
  }

  const r = size / 2;
  const arcRadius = r - 8;

  // Arc text paths (top hemisphere and bottom hemisphere)
  const topArcPath = `M ${r - arcRadius},${r} A ${arcRadius},${arcRadius} 0 0,1 ${r + arcRadius},${r}`;
  const bottomArcPath = `M ${r - arcRadius},${r} A ${arcRadius},${arcRadius} 0 0,0 ${r + arcRadius},${r}`;

  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="qr-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
        <linearGradient id="qr-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5D97A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <radialGradient id="emblem-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F0C850" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9B7F2A" />
        </radialGradient>
        <filter id="qr-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>

      {/* Outer circular frame */}
      <circle cx={r} cy={r} r={r - 1} fill="url(#qr-bg)" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
      <circle cx={r} cy={r} r={r - 4} fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" />

      {/* Tiny gold tick marks around the outer ring (like a watch dial) */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const x1 = r + Math.cos(angle) * (r - 2);
        const y1 = r + Math.sin(angle) * (r - 2);
        const x2 = r + Math.cos(angle) * (r - (i % 5 === 0 ? 7 : 4));
        const y2 = r + Math.sin(angle) * (r - (i % 5 === 0 ? 7 : 4));
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,175,55,0.4)" strokeWidth="0.6" />;
      })}

      {/* Cursive arc text */}
      <path id="qr-top-arc" d={topArcPath} fill="none" />
      <path id="qr-bot-arc" d={bottomArcPath} fill="none" />
      <text fill="rgba(212,175,55,0.75)" style={{ fontFamily: "Italianno, serif", fontSize: 16, letterSpacing: 1 }}>
        <textPath href="#qr-top-arc" startOffset="50%" textAnchor="middle">{topText}</textPath>
      </text>
      <text fill="rgba(212,175,55,0.65)" style={{ fontFamily: "Italianno, serif", fontSize: 13, letterSpacing: 0.8 }}>
        <textPath href="#qr-bot-arc" startOffset="50%" textAnchor="middle">{bottomText}</textPath>
      </text>

      {/* QR dots (inner area) */}
      <g transform={`translate(${offset},${offset})`}>
        {dots.map((d, i) => {
          const x = d.col * innerDot;
          const y = d.row * innerDot;
          return (
            <rect
              key={i}
              x={x + innerDot * 0.1}
              y={y + innerDot * 0.1}
              width={innerDot * 0.8}
              height={innerDot * 0.8}
              rx={innerDot * 0.3}
              fill="url(#qr-gold)"
              filter="url(#qr-glow)"
            />
          );
        })}

        {/* Custom finder patterns — shield-shaped */}
        {[[0, 0], [0, mods - 7], [mods - 7, 0]].map(([fr, fc], idx) => {
          const fx = fc * innerDot;
          const fy = fr * innerDot;
          const fs = 7 * innerDot;
          return (
            <g key={idx}>
              <rect x={fx} y={fy} width={fs} height={fs} rx={fs * 0.25} fill="none" stroke="url(#qr-gold)" strokeWidth={innerDot} />
              <rect
                x={fx + innerDot * 2}
                y={fy + innerDot * 2}
                width={fs - innerDot * 4}
                height={fs - innerDot * 4}
                rx={(fs - innerDot * 4) * 0.3}
                fill="url(#qr-gold)"
              />
            </g>
          );
        })}
      </g>

      {/* Center emblem */}
      <g>
        <circle cx={r} cy={r} r={size * 0.11} fill="#000" stroke="url(#qr-gold)" strokeWidth="1.5" />
        <circle cx={r} cy={r} r={size * 0.095} fill="url(#emblem-bg)" />
        <text
          x={r}
          y={r + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 600 }}
          fontSize={size * 0.11}
          fill="#000"
        >
          {initial}
        </text>
        <text
          x={r}
          y={r + size * 0.065}
          textAnchor="middle"
          style={{ fontFamily: "Italianno, serif" }}
          fontSize={size * 0.048}
          fill="rgba(0,0,0,0.55)"
        >
          est. 2026
        </text>
      </g>
    </motion.svg>
  );
}
