/**
 * Vibrant flat illustrations — custom SVG, no stock photography.
 * Each is tuned for a specific splash card background.
 */

export function TreasureChest({ color = "gold", size = 110 }) {
  const palettes = {
    gold: { base: "#F59E0B", trim: "#92400E", glow: "#FDE68A", coin: "#FFF1A1" },
    pink: { base: "#EC4899", trim: "#831843", glow: "#FBCFE8", coin: "#FCA5E7" },
    purple: { base: "#8B5CF6", trim: "#4C1D95", glow: "#DDD6FE", coin: "#C4B5FD" },
    teal: { base: "#14B8A6", trim: "#115E59", glow: "#A7F3D0", coin: "#5EEAD4" },
  };
  const p = palettes[color] || palettes.gold;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id={`chest-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.glow} />
          <stop offset="100%" stopColor={p.base} />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="60" cy="108" rx="40" ry="4" fill="rgba(0,0,0,0.35)" />

      {/* Coins spilling */}
      <circle cx="30" cy="96" r="7" fill={p.coin} />
      <circle cx="30" cy="96" r="5" fill={p.base} opacity="0.5" />
      <circle cx="90" cy="98" r="6" fill={p.coin} />
      <circle cx="78" cy="100" r="4" fill={p.coin} />
      <circle cx="44" cy="100" r="4" fill={p.coin} />

      {/* Chest body */}
      <rect x="22" y="60" width="76" height="45" rx="5" fill={`url(#chest-${color})`} />
      <rect x="22" y="60" width="76" height="8" fill={p.trim} opacity="0.5" />

      {/* Chest lid (open, tilted back) */}
      <path
        d="M22 62 Q22 36 60 30 Q98 36 98 62 Z"
        fill={`url(#chest-${color})`}
      />
      <path
        d="M22 62 Q22 36 60 30 Q98 36 98 62"
        stroke={p.trim}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Lock plate */}
      <rect x="54" y="76" width="12" height="14" rx="2" fill={p.trim} />
      <circle cx="60" cy="82" r="2" fill={p.coin} />

      {/* Sparkles */}
      <g fill={p.coin}>
        <circle cx="100" cy="30" r="1.5" />
        <circle cx="18" cy="42" r="2" />
        <circle cx="106" cy="68" r="1.5" />
      </g>
      <g stroke={p.coin} strokeWidth="1.2" fill="none">
        <path d="M100 24 V36 M94 30 H106" />
        <path d="M18 34 V50 M10 42 H26" />
      </g>

      {/* Inside glow */}
      <path
        d="M32 62 Q32 48 60 44 Q88 48 88 62 Z"
        fill={p.glow}
        opacity="0.4"
      />
    </svg>
  );
}

export function GiftStack({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="108" rx="38" ry="4" fill="rgba(0,0,0,0.35)" />

      {/* Back card (small) */}
      <g transform="rotate(-15 60 70)">
        <rect x="20" y="35" width="62" height="40" rx="4" fill="#1F1F1F" />
        <rect x="26" y="58" width="30" height="4" rx="1" fill="#FF9900" opacity="0.9" />
        <text x="26" y="52" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="8" fill="#FF9900">amazon</text>
      </g>

      {/* Front card */}
      <g transform="rotate(8 60 60)">
        <rect x="30" y="28" width="70" height="45" rx="5" fill="#0A0A0A" stroke="#333" />
        <text x="40" y="44" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="10" fill="#FF9900">amazon</text>
        <text x="40" y="58" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="6" fill="#FFF" opacity="0.6" letterSpacing="2">GIFT CARD</text>
        <circle cx="88" cy="58" r="3" fill="#FF9900" />
      </g>

      {/* Hand (minimalist silhouette) */}
      <path
        d="M 35 75 Q 30 85, 35 95 L 55 100 Q 75 102, 85 95 L 85 80"
        fill="#E8B29D"
      />
      <rect x="42" y="72" width="8" height="26" rx="4" fill="#E8B29D" />

      {/* Sparkles */}
      <g fill="#FDE68A">
        <circle cx="20" cy="22" r="2" />
        <circle cx="108" cy="40" r="1.5" />
        <circle cx="98" cy="18" r="1.2" />
      </g>
    </svg>
  );
}

export function BillEnvelope({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="108" rx="35" ry="3" fill="rgba(0,0,0,0.25)" />

      {/* Envelope body */}
      <rect x="22" y="32" width="76" height="60" rx="4" fill="#FEFCE8" stroke="#0F172A" strokeWidth="1.5" />

      {/* Flap (open) */}
      <path d="M22 32 L60 60 L98 32" stroke="#0F172A" strokeWidth="1.5" fill="none" />
      <path d="M22 32 L60 60 L98 32 L98 28 L22 28 Z" fill="#FEFCE8" stroke="#0F172A" strokeWidth="1.5" />

      {/* Content lines */}
      <rect x="32" y="72" width="30" height="3" rx="1" fill="#0F172A" opacity="0.6" />
      <rect x="32" y="80" width="42" height="3" rx="1" fill="#0F172A" opacity="0.4" />

      {/* Sparkle stamp */}
      <g transform="translate(82 78)">
        <path d="M0 0 L3 8 L11 11 L3 14 L0 22 L-3 14 L-11 11 L-3 8 Z" fill="#FACC15" />
      </g>

      {/* Floating sparkles */}
      <g fill="#FACC15">
        <path d="M18 18 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" />
        <circle cx="104" cy="54" r="2" />
        <circle cx="14" cy="68" r="1.5" />
      </g>
    </svg>
  );
}

export function ProductShelf({ size = 130 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 120" fill="none">
      {/* Podium */}
      <ellipse cx="70" cy="110" rx="50" ry="6" fill="#D6C9AA" />
      <rect x="25" y="92" width="90" height="20" rx="3" fill="#C9B78F" />
      <rect x="25" y="92" width="90" height="4" fill="#B8A57A" />

      {/* Phone (big, centered) */}
      <rect x="58" y="30" width="26" height="60" rx="5" fill="#1A1F2E" stroke="#0F1419" strokeWidth="1" />
      <rect x="60" y="34" width="22" height="50" rx="2" fill="#6B5CFC" />
      <circle cx="71" cy="40" r="1.5" fill="#0F1419" />

      {/* Watch (left) */}
      <rect x="28" y="58" width="20" height="26" rx="5" fill="#2A2A2A" />
      <rect x="30" y="60" width="16" height="22" rx="3" fill="#EC4899" />
      <rect x="33" y="52" width="10" height="8" rx="2" fill="#2A2A2A" />
      <rect x="33" y="82" width="10" height="8" rx="2" fill="#2A2A2A" />

      {/* AirPods (right) */}
      <g transform="translate(96 62)">
        <ellipse cx="0" cy="0" rx="6" ry="8" fill="#FAFAFA" />
        <rect x="-3" y="4" width="6" height="18" rx="3" fill="#FAFAFA" />
        <ellipse cx="14" cy="4" rx="6" ry="8" fill="#FAFAFA" />
        <rect x="11" y="8" width="6" height="18" rx="3" fill="#FAFAFA" />
      </g>

      {/* Sparkles */}
      <g fill="#F59E0B">
        <path d="M20 20 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" transform="scale(0.8) translate(5 5)" />
        <circle cx="120" cy="28" r="2" />
      </g>
    </svg>
  );
}

export function LaptopPrize({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 120" fill="none">
      {/* Podium */}
      <ellipse cx="70" cy="108" rx="48" ry="5" fill="rgba(0,0,0,0.35)" />
      <rect x="22" y="92" width="96" height="18" rx="3" fill="#D97706" />
      <rect x="22" y="92" width="96" height="4" fill="#92400E" />

      {/* Laptop */}
      <rect x="32" y="42" width="76" height="50" rx="3" fill="#1F2937" />
      <rect x="36" y="46" width="68" height="42" rx="2" fill="#3B82F6" />
      <rect x="36" y="46" width="68" height="42" rx="2" fill="url(#laptop-grad)" opacity="0.9" />
      <defs>
        <linearGradient id="laptop-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="24" y="90" width="92" height="4" rx="1" fill="#111827" />
      <rect x="58" y="90" width="24" height="3" rx="1" fill="#374151" />

      {/* AirPods case beside */}
      <rect x="94" y="72" width="20" height="14" rx="3" fill="#FAFAFA" />
      <circle cx="104" cy="79" r="2" fill="#374151" />
    </svg>
  );
}
