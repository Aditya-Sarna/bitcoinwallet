import { useMemo } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";

/**
 * StyledQR — vibrant NOVA-branded QR code.
 * - Lime → pink gradient dots
 * - Rounded shield finder patterns
 * - Center emblem with user initial + NOVA bolt
 * - Arc text around the circular frame
 */
export default function StyledQR({
  value,
  size = 260,
  initial = "N",
  topText = "scan · send · secured by nova",
  bottomText = "· est. 2026 ·",
}) {
  const qrModules = useMemo(() => {
    if (!value) return null;
    const q = QRCode.create(value, { errorCorrectionLevel: "H" });
    return q.modules;
  }, [value]);

  if (!qrModules) return <div style={{ width: size, height: size }} />;

  const mods = qrModules.size;
  const innerSize = size - 40;
  const innerDot = innerSize / mods;
  const offset = (size - innerSize) / 2;

  const isFinderZone = (row, col) => {
    const inTL = row < 7 && col < 7;
    const inTR = row < 7 && col >= mods - 7;
    const inBL = row >= mods - 7 && col < 7;
    return inTL || inTR || inBL;
  };

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
          <stop offset="0%" stopColor="#1a1a24" />
          <stop offset="100%" stopColor="#0A0A0F" />
        </radialGradient>
        <linearGradient id="qr-nova" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4FF4F" />
          <stop offset="60%" stopColor="#FF3E8A" />
          <stop offset="100%" stopColor="#6B5CFC" />
        </linearGradient>
        <linearGradient id="emblem-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4FF4F" />
          <stop offset="100%" stopColor="#7CFF8A" />
        </linearGradient>
      </defs>

      {/* Outer frame */}
      <circle cx={r} cy={r} r={r - 1} fill="url(#qr-bg)" stroke="rgba(212,255,79,0.4)" strokeWidth="1.2" />
      <circle cx={r} cy={r} r={r - 4} fill="none" stroke="rgba(255,62,138,0.2)" strokeWidth="0.5" />

      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const x1 = r + Math.cos(angle) * (r - 2);
        const y1 = r + Math.sin(angle) * (r - 2);
        const x2 = r + Math.cos(angle) * (r - (i % 5 === 0 ? 7 : 4));
        const y2 = r + Math.sin(angle) * (r - (i % 5 === 0 ? 7 : 4));
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,255,79,0.5)" strokeWidth="0.7" />;
      })}

      {/* Arc text */}
      <path id="qr-top-arc" d={topArcPath} fill="none" />
      <path id="qr-bot-arc" d={bottomArcPath} fill="none" />
      <text fill="rgba(212,255,79,0.85)" style={{ fontFamily: "Clash Display, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 3 }}>
        <textPath href="#qr-top-arc" startOffset="50%" textAnchor="middle">{topText.toUpperCase()}</textPath>
      </text>
      <text fill="rgba(255,62,138,0.75)" style={{ fontFamily: "Clash Display, sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: 3 }}>
        <textPath href="#qr-bot-arc" startOffset="50%" textAnchor="middle">{bottomText.toUpperCase()}</textPath>
      </text>

      {/* QR dots */}
      <g transform={`translate(${offset},${offset})`}>
        {dots.map((d, i) => (
          <rect
            key={i}
            x={d.col * innerDot + innerDot * 0.1}
            y={d.row * innerDot + innerDot * 0.1}
            width={innerDot * 0.8}
            height={innerDot * 0.8}
            rx={innerDot * 0.35}
            fill="url(#qr-nova)"
          />
        ))}

        {/* Shield-shaped finder patterns */}
        {[[0, 0], [0, mods - 7], [mods - 7, 0]].map(([fr, fc], idx) => {
          const fx = fc * innerDot;
          const fy = fr * innerDot;
          const fs = 7 * innerDot;
          return (
            <g key={idx}>
              <rect x={fx} y={fy} width={fs} height={fs} rx={fs * 0.25} fill="none" stroke="url(#qr-nova)" strokeWidth={innerDot} />
              <rect
                x={fx + innerDot * 2}
                y={fy + innerDot * 2}
                width={fs - innerDot * 4}
                height={fs - innerDot * 4}
                rx={(fs - innerDot * 4) * 0.3}
                fill="url(#qr-nova)"
              />
            </g>
          );
        })}
      </g>

      {/* Center emblem */}
      <g>
        <circle cx={r} cy={r} r={size * 0.115} fill="#0A0A0F" stroke="url(#qr-nova)" strokeWidth="2" />
        <circle cx={r} cy={r} r={size * 0.095} fill="url(#emblem-bg)" />
        <text
          x={r}
          y={r + size * 0.035}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700 }}
          fontSize={size * 0.11}
          fill="#0A0A0F"
        >
          {initial}
        </text>
      </g>
    </motion.svg>
  );
}
