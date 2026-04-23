import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Keyboard, Image as ImageIcon, ArrowUpRight } from "@phosphor-icons/react";
import Header from "../components/Header";

export default function Scan() {
  const nav = useNavigate();
  const [manual, setManual] = useState("");

  return (
    <div className="shell">
      <Header title="scan & pay" />
      <div className="px-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4FF4F] font-bold">scan any bitcoin qr</div>
        <h2
          className="text-white leading-[0.95] mt-1.5 mb-4"
          style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 44, letterSpacing: "-0.035em" }}
        >
          point. <span style={{ color: "#D4FF4F" }}>tap. gone.</span>
        </h2>

        {/* Viewfinder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto rounded-[32px] overflow-hidden"
          style={{
            aspectRatio: "1 / 1",
            background: "linear-gradient(135deg, #141420, #0A0A0F)",
            border: "1px solid rgba(212,255,79,0.25)",
          }}
          data-testid="scan-viewfinder"
        >
          {/* Electric glows */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #D4FF4F 0%, transparent 40%), radial-gradient(circle at 70% 70%, #FF3E8A 0%, transparent 50%)",
            }}
          />

          {/* Corner brackets */}
          {[
            { top: 24, left: 24, rot: 0 },
            { top: 24, right: 24, rot: 90 },
            { bottom: 24, right: 24, rot: 180 },
            { bottom: 24, left: 24, rot: 270 },
          ].map((c, i) => (
            <div
              key={i}
              className="absolute w-12 h-12"
              style={{
                top: c.top, left: c.left, right: c.right, bottom: c.bottom,
                transform: `rotate(${c.rot}deg)`,
                borderTop: "3px solid #D4FF4F",
                borderLeft: "3px solid #D4FF4F",
                borderTopLeftRadius: 16,
              }}
            />
          ))}

          {/* Scanning line */}
          <motion.div
            initial={{ y: "20%" }}
            animate={{ y: ["20%", "80%", "20%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-8 right-8 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, #D4FF4F, transparent)",
              boxShadow: "0 0 24px rgba(212,255,79,0.9), 0 0 12px rgba(212,255,79,0.6)",
            }}
          />

          <div className="absolute inset-x-0 bottom-6 text-center">
            <div
              className="inline-block px-4 py-2 rounded-full text-[10px] tracking-[0.22em] uppercase font-bold"
              style={{ background: "rgba(10,10,15,0.7)", backdropFilter: "blur(10px)", color: "#D4FF4F" }}
            >
              demo · scanning simulated
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => toast("pick from gallery · demo")}
            data-testid="scan-gallery"
            className="rounded-2xl py-3 flex items-center justify-center gap-2 text-xs font-bold"
            style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
          >
            <ImageIcon size={14} /> gallery
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => document.getElementById("manual-input")?.focus()}
            data-testid="scan-manual"
            className="rounded-2xl py-3 flex items-center justify-center gap-2 text-xs font-bold"
            style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
          >
            <Keyboard size={14} /> manual
          </motion.button>
        </div>

        <div className="mt-5">
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-2 font-bold">or paste address</div>
          <input
            id="manual-input"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="bc1q…"
            data-testid="scan-manual-input"
            className="w-full bg-transparent border-b-2 border-white/10 focus:border-[#D4FF4F] outline-none text-sm font-mono py-2"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={manual.length < 20}
            onClick={() => nav("/send", { state: { address: manual } })}
            data-testid="scan-continue"
            className="mt-5 w-full disabled:opacity-30 font-bold rounded-full py-4 uppercase tracking-[0.16em] text-[12px] flex items-center justify-center gap-2"
            style={{ background: "#D4FF4F", color: "#0A0A0F" }}
          >
            continue <ArrowUpRight size={14} weight="bold" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
