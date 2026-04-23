import { motion } from "framer-motion";

/**
 * SplashCard — a large vibrant promo card with big typography and an illustration.
 * Mimics CRED's "like winning an entire Apple Store" or "worth ₹1 lakh" style.
 */
export default function SplashCard({
  eyebrow = "today's bounty",
  title,
  subtitle,
  bg = "#E8DCC0",
  textColor = "#000",
  accent = "#000",
  illustration = null,
  onClick,
  testid,
  tag = "claim now",
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      data-testid={testid}
      className="w-full rounded-[28px] p-5 relative overflow-hidden text-left"
      style={{ background: bg, color: textColor, minHeight: 220 }}
    >
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(0,0,0,0.1) 0%, transparent 50%)",
        }}
      />

      <div className="relative flex h-full gap-4">
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="text-[10px] tracking-[0.25em] uppercase opacity-60 font-semibold">{eyebrow}</div>
            <h3 className="font-serif-italic text-[26px] leading-[1.1] mt-2 max-w-[220px]">{title}</h3>
            {subtitle && <div className="text-xs opacity-70 mt-1 max-w-[200px]">{subtitle}</div>}
          </div>
          <div
            className="inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-semibold lowercase"
            style={{ background: accent, color: bg === accent ? "#fff" : (textColor === "#000" ? "#fff" : "#000") }}
          >
            {tag} <span>→</span>
          </div>
        </div>
        <div className="w-[120px] shrink-0 flex items-center justify-center">
          {illustration}
        </div>
      </div>
    </motion.button>
  );
}

/** Bitcoin 3D illustration — a stylized gold coin emblem */
export function BitcoinIllustration({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <radialGradient id="coin-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="40%" stopColor="#F0C850" />
          <stop offset="80%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#4A3200" />
        </radialGradient>
        <radialGradient id="coin-inner" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFD77A" />
          <stop offset="100%" stopColor="#8B6914" />
        </radialGradient>
        <filter id="coin-glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <ellipse cx="62" cy="98" rx="32" ry="5" fill="rgba(0,0,0,0.25)" filter="url(#coin-glow)" />
      <circle cx="60" cy="55" r="45" fill="url(#coin-grad)" />
      <circle cx="60" cy="55" r="38" fill="url(#coin-inner)" />
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontSize="46"
        fontWeight="700"
        fontFamily="Clash Display, sans-serif"
        fill="#3A2800"
      >
        ₿
      </text>
      <circle cx="44" cy="38" r="7" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

/** Treasure chest illustration */
export function ChestIllustration({ color = "#A7F3D0", accent = "#065F46", size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect x="20" y="45" width="80" height="55" rx="6" fill={color} />
      <path d="M20 58 L100 58" stroke={accent} strokeWidth="3" />
      <rect x="52" y="52" width="16" height="16" rx="3" fill={accent} />
      <circle cx="60" cy="60" r="2.5" fill={color} />
      <path d="M20 45 Q60 15 100 45 L100 58 L20 58 Z" fill={color} opacity="0.85" />
      <path d="M20 45 Q60 15 100 45" stroke={accent} strokeWidth="2" fill="none" />
      {/* Sparkles */}
      <circle cx="28" cy="30" r="2" fill="#FFF" opacity="0.9" />
      <circle cx="95" cy="28" r="1.5" fill="#FFF" opacity="0.9" />
      <circle cx="108" cy="70" r="2" fill="#FFF" opacity="0.7" />
    </svg>
  );
}

/** Bill envelope illustration */
export function BillIllustration({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect x="20" y="25" width="80" height="70" rx="6" fill="#E0E7FF" />
      <path d="M20 25 L60 58 L100 25" stroke="#4338CA" strokeWidth="2" fill="none" />
      <rect x="30" y="68" width="40" height="3" fill="#4338CA" opacity="0.4" />
      <rect x="30" y="76" width="30" height="3" fill="#4338CA" opacity="0.4" />
      <circle cx="95" cy="78" r="12" fill="#FDE047" />
      <text x="95" y="83" textAnchor="middle" fontSize="14" fontWeight="700" fill="#4338CA">✓</text>
    </svg>
  );
}

/** Scan illustration */
export function ScanIllustration({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect x="22" y="22" width="76" height="76" rx="12" fill="rgba(0,0,0,0.08)" />
      <path d="M30 40 L30 30 L40 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 30 L90 30 L90 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 80 L30 90 L40 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M90 80 L90 90 L80 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <rect x="45" y="45" width="10" height="10" fill="currentColor" />
      <rect x="65" y="45" width="10" height="10" fill="currentColor" />
      <rect x="45" y="65" width="10" height="10" fill="currentColor" />
      <line x1="28" y1="60" x2="92" y2="60" stroke="#EF4444" strokeWidth="2" />
    </svg>
  );
}
