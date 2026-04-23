import { motion } from "framer-motion";

/**
 * Vibrant splash card — CRED-style. Solid bright background + illustration.
 * Single coherent variant so all cards in the app share visual grammar.
 */
export default function SplashCard({
  bg = "#8B5CF6",
  textColor = "#fff",
  ctaBg = "#FDE047",
  ctaText = "#000",
  eyebrow,
  title,
  subtitle,
  tag = "claim now",
  illustration,
  onClick,
  testid,
  height = 220,
  size = "lg",
}) {
  const isLg = size === "lg";
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      data-testid={testid}
      className="w-full rounded-[28px] relative overflow-hidden text-left block group"
      style={{
        background: bg,
        color: textColor,
        height,
        boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
      }}
    >
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.15) 0%, transparent 40%)",
        }}
      />

      <div className={`relative h-full flex ${isLg ? "p-5" : "p-4"}`}>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {eyebrow && (
              <div
                className="opacity-80 mb-2"
                style={{
                  fontSize: isLg ? 11 : 10,
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <h3
                className="leading-[1.05]"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: isLg ? 28 : 20,
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <div
                className="opacity-80 mt-1.5 leading-snug"
                style={{ fontSize: isLg ? 12 : 10 }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* CTA pill at bottom-left */}
          <div
            className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 self-start"
            style={{
              background: ctaBg,
              color: ctaText,
              fontSize: isLg ? 11 : 10,
              fontFamily: "Manrope, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {tag} <span className="ml-0.5">→</span>
          </div>
        </div>

        {illustration && (
          <div className="absolute right-0 bottom-0 flex items-end justify-end pointer-events-none">
            {illustration}
          </div>
        )}
      </div>
    </motion.button>
  );
}
