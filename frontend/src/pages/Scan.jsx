import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QrCode, Keyboard, Image as ImageIcon, ArrowUpRight } from "@phosphor-icons/react";
import Header from "../components/Header";

export default function Scan() {
  const nav = useNavigate();
  const [manual, setManual] = useState("");

  return (
    <div className="shell grain">
      <Header title="Scan & Pay" />
      <div className="px-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">scan any bitcoin QR</div>
        <h2 className="font-cursive text-6xl text-white/95 leading-none mt-1 mb-4">point. tap. gone.</h2>

        {/* Mock viewfinder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto rounded-[32px] overflow-hidden"
          style={{
            aspectRatio: "1 / 1",
            background: "linear-gradient(135deg, #111, #000)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
          data-testid="scan-viewfinder"
        >
          {/* Animated gradient "lens" */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #F0C850 0%, transparent 40%), radial-gradient(circle at 70% 70%, #EC4899 0%, transparent 50%)",
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
                borderTop: "3px solid #D4AF37",
                borderLeft: "3px solid #D4AF37",
                borderTopLeftRadius: 16,
              }}
            />
          ))}

          {/* Scanning line */}
          <motion.div
            initial={{ y: "20%" }}
            animate={{ y: ["20%", "80%", "20%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-8 right-8 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
              boxShadow: "0 0 24px rgba(212,175,55,0.8), 0 0 12px rgba(212,175,55,0.5)",
            }}
          />

          <div className="absolute inset-x-0 bottom-6 text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-[10px] tracking-[0.3em] uppercase text-white/70">
              demo · scanning simulated
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => toast("Pick from gallery · demo")}
            data-testid="scan-gallery"
            className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-xs"
          >
            <ImageIcon size={14} /> gallery
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => document.getElementById("manual-input")?.focus()}
            data-testid="scan-manual"
            className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-xs"
          >
            <Keyboard size={14} /> manual
          </motion.button>
        </div>

        {/* Manual paste */}
        <div className="mt-5">
          <div className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-2">or paste address</div>
          <input
            id="manual-input"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="bc1q…"
            data-testid="scan-manual-input"
            className="w-full bg-transparent border-b-2 border-white/10 focus:border-[#D4AF37] outline-none text-sm font-mono py-2"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={manual.length < 20}
            onClick={() => nav("/send", { state: { address: manual } })}
            data-testid="scan-continue"
            className="mt-5 w-full gold-gradient disabled:opacity-30 text-black font-semibold rounded-full py-4 uppercase tracking-[0.22em] text-sm flex items-center justify-center gap-2"
          >
            continue <ArrowUpRight size={14} weight="bold" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
