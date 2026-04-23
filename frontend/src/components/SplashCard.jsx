import { motion } from "framer-motion";

/**
 * SplashCard — quiet luxury promo card.
 * Uses a high-quality artistic background image with a tonal scrim overlay.
 * Restrained typography (Instrument Serif italic), no flashy gradients.
 *
 * Props:
 *   image: required Unsplash/CDN URL
 *   tone: "warm" | "cool" | "dark" — controls overlay scrim
 *   eyebrow, title, subtitle
 *   tag: button label
 *   onClick, testid
 */
const SCRIMS = {
  warm: "linear-gradient(180deg, rgba(40,28,18,0.15) 0%, rgba(20,14,10,0.85) 100%)",
  cool: "linear-gradient(180deg, rgba(18,24,30,0.15) 0%, rgba(8,12,18,0.85) 100%)",
  dark: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)",
  light: "linear-gradient(180deg, rgba(245,240,230,0.05) 0%, rgba(20,16,10,0.78) 100%)",
};

const ACCENT_BG = {
  warm: "#F5E6C8",
  cool: "#D5DCE0",
  dark: "#EDE5D3",
  light: "#EDE5D3",
};

export default function SplashCard({
  image,
  tone = "dark",
  eyebrow,
  title,
  subtitle,
  tag = "explore",
  onClick,
  testid,
  height = 240,
  size = "lg", // 'lg' or 'sm'
}) {
  const isLg = size === "lg";
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      data-testid={testid}
      className="w-full rounded-[28px] relative overflow-hidden text-left group"
      style={{
        background: "#1a1410",
        height,
        boxShadow: "0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      {/* Background image */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ filter: "saturate(0.85) contrast(1.05)" }}
      />
      {/* Scrim */}
      <div
        className="absolute inset-0"
        style={{ background: SCRIMS[tone] || SCRIMS.dark }}
      />
      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      <div className={`relative h-full flex flex-col justify-between ${isLg ? "p-6" : "p-4"}`}>
        {eyebrow && (
          <div className={`tracking-[0.28em] uppercase text-white/55 font-medium ${isLg ? "text-[10px]" : "text-[9px]"}`}>
            {eyebrow}
          </div>
        )}
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            {title && (
              <h3
                className="text-white leading-[1.05]"
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontStyle: "italic",
                  fontSize: isLg ? 30 : 22,
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <div className={`text-white/65 mt-1 ${isLg ? "text-xs" : "text-[10px]"}`}>{subtitle}</div>
            )}
          </div>
          <div
            className="shrink-0 rounded-full px-3.5 py-1.5 text-[10px] tracking-wider lowercase font-medium"
            style={{ background: ACCENT_BG[tone] || ACCENT_BG.dark, color: "#1a1410" }}
          >
            {tag} →
          </div>
        </div>
      </div>
    </motion.button>
  );
}
