/**
 * SatVault Design Language — ornamental motifs (SVG-drawn).
 * Inspired by fine editorial printing: thin rules, fleurons, star motifs,
 * laurel marks. All pure SVG. Scale via `size` prop, color via `color`.
 */

export function Fleuron({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 C 14 6, 18 8, 22 10 C 18 12, 14 14, 12 18 C 10 14, 6 12, 2 10 C 6 8, 10 6, 12 2 Z"
        fill={color}
        opacity="0.85"
      />
      <circle cx="12" cy="12" r="1.2" fill={color} opacity="0.5" />
    </svg>
  );
}

export function FourStar({ size = 10, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill={color} />
    </svg>
  );
}

export function Compass({ size = 40, color = "currentColor", stroke = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth={stroke} opacity="0.4" />
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth={stroke * 0.5} opacity="0.3" />
      <path d="M24 4 L28 24 L24 44 L20 24 Z" fill={color} opacity="0.85" />
      <path d="M4 24 L24 20 L44 24 L24 28 Z" fill={color} opacity="0.35" />
      <circle cx="24" cy="24" r="1.5" fill={color} />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="2"
          x2="24"
          y2="5"
          stroke={color}
          strokeWidth={stroke}
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
    </svg>
  );
}

export function Laurel({ size = 60, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Left branch */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 15 + i * 10;
          return (
            <ellipse
              key={`l${i}`}
              cx={28 - i * 2}
              cy={y}
              rx="3"
              ry="6"
              fill={color}
              opacity={0.6 - i * 0.07}
              transform={`rotate(-30 ${28 - i * 2} ${y})`}
            />
          );
        })}
        <path d="M 35 10 Q 20 40 25 70" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
      </g>
      {/* Right branch (mirror) */}
      <g transform="scale(-1 1) translate(-80 0)">
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 15 + i * 10;
          return (
            <ellipse
              key={`r${i}`}
              cx={28 - i * 2}
              cy={y}
              rx="3"
              ry="6"
              fill={color}
              opacity={0.6 - i * 0.07}
              transform={`rotate(-30 ${28 - i * 2} ${y})`}
            />
          );
        })}
        <path d="M 35 10 Q 20 40 25 70" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
      </g>
    </svg>
  );
}

export function HairlineRule({ width = "100%", color = "rgba(255,255,255,0.18)" }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <FourStar size={6} color={color} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

/**
 * Ambient dust — floating particles for depth on editorial heroes.
 */
export function AmbientDust({ count = 8, color = "#D4B88A" }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = 1 + Math.random() * 2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const dur = 8 + Math.random() * 10;
        const delay = Math.random() * 6;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              background: color,
              opacity: 0.4 + Math.random() * 0.3,
              filter: "blur(0.5px)",
              animation: `dust-float ${dur}s ease-in-out ${delay}s infinite`,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
}
