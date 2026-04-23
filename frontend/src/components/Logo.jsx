/**
 * NOVA Logo — custom, NOT bitcoin-related.
 * A diamond prism fractured by a horizontal lightning seam.
 * Two triangles stacked (up + down) with the NOVA spark line through the middle.
 */
export default function Logo({ size = 40, primary = "#D4FF4F", secondary = "#FF3E8A" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id={`nova-grad-${primary.replace('#','')}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      {/* Top triangle */}
      <path
        d="M20 3 L35 20 L5 20 Z"
        fill={`url(#nova-grad-${primary.replace('#','')})`}
      />
      {/* Bottom triangle (inverted, slightly darker) */}
      <path
        d="M20 37 L35 20 L5 20 Z"
        fill={secondary}
        opacity="0.85"
      />
      {/* Spark seam — horizontal bolt bisecting the diamond */}
      <path
        d="M5 20 L13 20 L16 17 L24 23 L27 20 L35 20"
        stroke="#0A0A0F"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner highlight */}
      <path
        d="M20 6 L32 19 L8 19 Z"
        fill="rgba(255,255,255,0.25)"
      />
    </svg>
  );
}

export function LogoMark({ size = 24, primary, secondary }) {
  return <Logo size={size} primary={primary} secondary={secondary} />;
}

export function Wordmark({ size = 14, color = "#fff" }) {
  return (
    <div className="flex items-center gap-2">
      <Logo size={size * 1.7} />
      <span
        style={{
          fontFamily: "Clash Display, Manrope, sans-serif",
          fontWeight: 700,
          letterSpacing: "0.22em",
          fontSize: size,
          color,
          textTransform: "uppercase",
        }}
      >
        nova
      </span>
    </div>
  );
}
