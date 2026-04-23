import { useEffect, useRef, useState } from "react";

/**
 * AmountWheel — iOS-style horizontal scroll picker for BTC presets.
 * User scrolls; the centered value snaps and is reported via onChange.
 * Pairs with the text input — selecting a preset fills the input,
 * typing in the input does NOT scroll the wheel (one-way).
 */
const PRESETS = [
  0.0001, 0.0005, 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.15, 0.2, 0.25, 0.5,
];

export default function AmountWheel({ onPick, current }) {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(2);
  const itemWidth = 90;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        const idx = Math.round((center - itemWidth / 2) / itemWidth);
        const clamped = Math.max(0, Math.min(PRESETS.length - 1, idx));
        if (clamped !== activeIdx) setActiveIdx(clamped);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [activeIdx]);

  const pick = (i) => {
    setActiveIdx(i);
    onPick && onPick(PRESETS[i]);
    const el = trackRef.current;
    if (el) {
      el.scrollTo({ left: i * itemWidth - el.clientWidth / 2 + itemWidth / 2, behavior: "smooth" });
    }
  };

  // Snap on scroll end
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let timer;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Snap to active
        el.scrollTo({ left: activeIdx * itemWidth - el.clientWidth / 2 + itemWidth / 2, behavior: "smooth" });
        onPick && onPick(PRESETS[activeIdx]);
      }, 180);
    };
    el.addEventListener("scroll", handler);
    return () => {
      el.removeEventListener("scroll", handler);
      clearTimeout(timer);
    };
  }, [activeIdx, onPick]);

  return (
    <div className="relative mt-2">
      {/* Center indicator */}
      <div
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[88px] rounded-2xl pointer-events-none"
        style={{
          border: "1px solid rgba(212,255,79,0.5)",
          background: "linear-gradient(180deg, rgba(212,255,79,0.1), transparent)",
        }}
      />
      {/* Edge fade overlays */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10"
        style={{ background: "linear-gradient(90deg, #0A0A0F 0%, transparent 100%)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10"
        style={{ background: "linear-gradient(-90deg, #0A0A0F 0%, transparent 100%)" }}
      />

      <div
        ref={trackRef}
        className="overflow-x-auto no-scrollbar flex items-center"
        style={{ scrollSnapType: "x mandatory" }}
        data-testid="amount-wheel"
      >
        <div style={{ minWidth: "calc(50% - 44px)" }} />
        {PRESETS.map((v, i) => (
          <button
            key={v}
            onClick={() => pick(i)}
            data-testid={`wheel-preset-${v}`}
            className="shrink-0 flex flex-col items-center justify-center"
            style={{
              width: itemWidth,
              scrollSnapAlign: "center",
              opacity: i === activeIdx ? 1 : 0.35,
              transform: `scale(${i === activeIdx ? 1 : 0.9})`,
              transition: "opacity 0.2s, transform 0.2s",
            }}
          >
            <div className="font-mono text-base font-semibold text-white">
              {v < 0.001 ? v.toFixed(4) : v.toString()}
            </div>
            <div className="text-[8px] tracking-[0.22em] uppercase text-white/40 mt-0.5">btc</div>
          </button>
        ))}
        <div style={{ minWidth: "calc(50% - 44px)" }} />
      </div>
    </div>
  );
}
