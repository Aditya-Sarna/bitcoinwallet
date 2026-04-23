import { motion } from "framer-motion";
import { Fleuron, FourStar } from "./Ornaments";

/**
 * SatVault Design Language — tonal palette.
 * Editorial/quiet luxury. Pure CSS — no stock photography.
 */
export const TONES = {
  bone: {
    bg: "linear-gradient(150deg, #ECE2CD 0%, #D9CCB1 100%)",
    ink: "#241B10",
    rule: "rgba(36,27,16,0.3)",
    accent: "#4A3A1F",
    tagBg: "#241B10",
    tagText: "#ECE2CD",
    grainOpacity: 0.35,
  },
  moss: {
    bg: "linear-gradient(150deg, #3A4A3D 0%, #1F2823 100%)",
    ink: "#E8DFCF",
    rule: "rgba(232,223,207,0.25)",
    accent: "#C9B896",
    tagBg: "#E8DFCF",
    tagText: "#1F2823",
    grainOpacity: 0.4,
  },
  oxblood: {
    bg: "linear-gradient(160deg, #4A1518 0%, #2A0A0C 70%, #1A0608 100%)",
    ink: "#F0E0D0",
    rule: "rgba(240,224,208,0.22)",
    accent: "#D4A574",
    tagBg: "#F0E0D0",
    tagText: "#2A0A0C",
    grainOpacity: 0.45,
  },
  slate: {
    bg: "linear-gradient(150deg, #2A2F36 0%, #141821 100%)",
    ink: "#D5DCE0",
    rule: "rgba(213,220,224,0.22)",
    accent: "#A8B3BD",
    tagBg: "#D5DCE0",
    tagText: "#141821",
    grainOpacity: 0.4,
  },
  brass: {
    bg: "linear-gradient(150deg, #7A6238 0%, #4A3A1F 70%, #2A1F10 100%)",
    ink: "#F0E0C0",
    rule: "rgba(240,224,192,0.25)",
    accent: "#E8CF94",
    tagBg: "#F0E0C0",
    tagText: "#2A1F10",
    grainOpacity: 0.4,
  },
  fog: {
    bg: "linear-gradient(160deg, #4A4F54 0%, #2A2D32 100%)",
    ink: "#E8EBEE",
    rule: "rgba(232,235,238,0.22)",
    accent: "#C5CDD4",
    tagBg: "#E8EBEE",
    tagText: "#2A2D32",
    grainOpacity: 0.4,
  },
};

/**
 * Grain overlay — SVG turbulence noise. Premium editorial texture.
 */
function Grain({ opacity = 0.4, blend = "overlay" }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        mixBlendMode: blend,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/**
 * SplashCard — three variants following the SatVault design language.
 * Variants:
 *   - "editorial": headline card (hero promos)
 *   - "numeric": giant italic serif number as art (coin earn cards)
 *   - "chapter": index-style card (labels + small prose)
 *
 * Props:
 *   variant, tone (key of TONES), eyebrow, title, subtitle, tag, index
 *   height, onClick, testid
 */
export default function SplashCard({
  variant = "editorial",
  tone = "bone",
  eyebrow,
  title,
  subtitle,
  tag = "explore",
  index,
  height = 240,
  onClick,
  testid,
}) {
  const t = TONES[tone] || TONES.bone;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      data-testid={testid}
      className="w-full rounded-[28px] relative overflow-hidden text-left block"
      style={{
        background: t.bg,
        color: t.ink,
        height,
        boxShadow: "0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      <Grain opacity={t.grainOpacity} />

      {variant === "numeric" && (
        <NumericVariant t={t} eyebrow={eyebrow} title={title} subtitle={subtitle} tag={tag} index={index} />
      )}
      {variant === "editorial" && (
        <EditorialVariant t={t} eyebrow={eyebrow} title={title} subtitle={subtitle} tag={tag} index={index} />
      )}
      {variant === "chapter" && (
        <ChapterVariant t={t} eyebrow={eyebrow} title={title} subtitle={subtitle} tag={tag} index={index} />
      )}
    </motion.button>
  );
}

/* ----- NUMERIC: oversized italic number as art ----- */
function NumericVariant({ t, eyebrow, title, subtitle, tag, index }) {
  return (
    <div className="relative h-full p-5 flex flex-col justify-between">
      {/* Top: index + eyebrow */}
      <div className="flex items-center gap-2">
        {index && (
          <>
            <span className="text-[10px] font-mono" style={{ color: t.ink, opacity: 0.55 }}>
              № {index}
            </span>
            <span className="h-px flex-none w-4" style={{ background: t.rule }} />
          </>
        )}
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: t.ink, opacity: 0.6 }}>
          {eyebrow}
        </span>
      </div>

      {/* Oversized number bleeding from bottom-left */}
      <div className="relative">
        <div
          className="leading-[0.85] tracking-tight"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontStyle: "italic",
            fontSize: 72,
            color: t.ink,
            textShadow: "0 2px 10px rgba(0,0,0,0.15)",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div className="text-[10px] tracking-[0.2em] uppercase mt-2" style={{ color: t.ink, opacity: 0.55 }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Bottom right tag */}
      <div className="flex items-end justify-between">
        <FourStar size={10} color={t.accent} />
        <div
          className="rounded-full px-3 py-1.5 text-[10px] tracking-wider lowercase font-medium"
          style={{ background: t.tagBg, color: t.tagText }}
        >
          {tag} →
        </div>
      </div>
    </div>
  );
}

/* ----- EDITORIAL: headline with gold-rule column ----- */
function EditorialVariant({ t, eyebrow, title, subtitle, tag, index }) {
  return (
    <div className="relative h-full p-5 flex flex-col justify-between">
      {/* Top metadata row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fleuron size={10} color={t.accent} />
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: t.ink, opacity: 0.6 }}>
            {eyebrow}
          </span>
        </div>
        {index && (
          <span className="text-[10px] font-mono" style={{ color: t.ink, opacity: 0.45 }}>
            № {index}
          </span>
        )}
      </div>

      {/* Vertical rule + headline */}
      <div className="relative flex gap-4 mt-3 mb-3">
        <div className="w-px self-stretch" style={{ background: `linear-gradient(180deg, transparent, ${t.accent}, transparent)`, opacity: 0.6 }} />
        <div className="flex-1">
          <h3
            className="leading-[1.05] tracking-tight"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              fontSize: 30,
              color: t.ink,
              maxWidth: 320,
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <div className="text-[12px] mt-2" style={{ color: t.ink, opacity: 0.65, maxWidth: 300 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Bottom tag */}
      <div className="flex items-end justify-between">
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: t.ink, opacity: 0.4 }}>
          satvault
        </span>
        <div
          className="rounded-full px-3.5 py-1.5 text-[10px] tracking-wider lowercase font-medium"
          style={{ background: t.tagBg, color: t.tagText }}
        >
          {tag} →
        </div>
      </div>
    </div>
  );
}

/* ----- CHAPTER: parchment-style with Roman numeral ----- */
function ChapterVariant({ t, eyebrow, title, subtitle, tag, index }) {
  return (
    <div className="relative h-full p-5 flex flex-col">
      <div className="flex items-center gap-3">
        <span
          className="leading-none"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontStyle: "italic",
            fontSize: 56,
            color: t.ink,
            opacity: 0.9,
          }}
        >
          {index || "I"}
        </span>
        <div className="flex-1">
          <div className="text-[9px] tracking-[0.3em] uppercase" style={{ color: t.ink, opacity: 0.55 }}>
            {eyebrow}
          </div>
          <div
            className="mt-1 leading-tight"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              fontSize: 20,
              color: t.ink,
            }}
          >
            {title}
          </div>
        </div>
      </div>

      <div className="h-px my-3" style={{ background: `linear-gradient(90deg, transparent, ${t.rule}, transparent)` }} />

      <div className="flex-1">
        {subtitle && (
          <div className="text-[12px] leading-relaxed" style={{ color: t.ink, opacity: 0.7 }}>
            {subtitle}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <div
          className="rounded-full px-3 py-1.5 text-[10px] tracking-wider lowercase font-medium"
          style={{ background: t.tagBg, color: t.tagText }}
        >
          {tag} →
        </div>
      </div>
    </div>
  );
}
