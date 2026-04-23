import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, Fingerprint, Key, Warning, CaretRight } from "@phosphor-icons/react";
import Header from "../components/Header";
import { api } from "../lib/api";

export default function Security() {
  const nav = useNavigate();
  const [status, setStatus] = useState(null);

  const load = () => api.get("/security/status").then((r) => setStatus(r.data));
  useEffect(() => { load(); }, []);

  const toggleBio = async () => {
    const { data } = await api.post("/security/biometric/toggle");
    toast.success(data.biometric_enabled ? "biometric enabled" : "biometric disabled");
    load();
  };

  const score = status?.security_score;
  const hasData = status !== null;

  return (
    <div className="shell">
      <Header title="security" />
      <div className="px-6">
        {/* Security Score Hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #D4FF4F 0%, #7CFF8A 100%)",
            color: "#0A0A0F",
          }}
          data-testid="security-score"
        >
          <div
            className="absolute -top-14 -right-14 w-48 h-48 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(#fff, transparent 70%)" }}
          />
          <div className="relative">
            <div className="text-[10px] tracking-[0.22em] uppercase font-bold opacity-70">security score</div>
            <div className="flex items-end gap-2 mt-1">
              <div
                className="tracking-[-0.04em]"
                style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 64, lineHeight: 1 }}
              >
                {hasData ? score : "—"}
              </div>
              <div className="opacity-60 text-sm pb-3 font-semibold">/ 100</div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/15 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: hasData ? `${score}%` : 0 }}
                transition={{ duration: 1.2 }}
                className="h-full"
               
              />
            </div>
            <div className="text-[12px] opacity-70 mt-2 font-bold uppercase tracking-wide">
              {!hasData ? "calculating…" : score >= 90 ? "fortress" : score >= 70 ? "strong" : score >= 40 ? "moderate" : "vulnerable"}
            </div>
          </div>
        </motion.div>

        <div className="mt-6 space-y-3">
          <Row
            testid="sec-backup"
            icon={<ShieldCheck size={20} weight="fill" color={status?.seed_backed_up ? "#D4FF4F" : "#FF3E8A"} />}
            color={status?.seed_backed_up ? "#D4FF4F" : "#FF3E8A"}
            title="recovery phrase"
            desc={status?.seed_backed_up ? "verified · your vault is recoverable" : "not yet verified — backup now"}
            warning={!status?.seed_backed_up}
            onClick={() => nav("/backup")}
          />
          <Toggle
            testid="sec-bio"
            icon={<Fingerprint size={20} weight="fill" color="#34D8FF" />}
            color="#34D8FF"
            title="biometric unlock"
            desc="use face or fingerprint"
            value={status?.biometric_enabled || false}
            onChange={toggleBio}
          />
          <Row
            testid="sec-pin"
            icon={<Key size={20} weight="fill" color="#6B5CFC" />}
            color="#6B5CFC"
            title="change pin"
            desc="update your 6-digit entry code"
            onClick={() => toast("coming soon · demo")}
          />
        </div>

        <div
          className="mt-8 rounded-3xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
          data-testid="security-tips"
        >
          <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4FF4F] mb-2 font-bold">pro tip</div>
          <div
            className="text-white"
            style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: "-0.03em", lineHeight: 1 }}
          >
            not your keys,<br /><span style={{ color: "#D4FF4F" }}>not your coins.</span>
          </div>
          <p className="text-xs text-white/55 mt-3 leading-relaxed">
            your recovery phrase is your sovereignty. store it offline, split it across locations, and never commit it to digital memory.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, title, desc, onClick, warning, testid, color }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      data-testid={testid}
      className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
      style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold flex items-center gap-2 lowercase">
          {title}
          {warning && <Warning size={12} color="#FF3E8A" weight="fill" />}
        </div>
        <div className="text-[11px] text-white/50 truncate">{desc}</div>
      </div>
      <CaretRight size={16} className="text-white/30" />
    </motion.button>
  );
}

function Toggle({ icon, title, desc, value, onChange, testid, color }) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
      data-testid={testid}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold lowercase">{title}</div>
        <div className="text-[11px] text-white/50">{desc}</div>
      </div>
      <button
        onClick={onChange}
        className="w-11 h-6 rounded-full transition-colors p-0.5"
        style={{ background: value ? "#D4FF4F" : "rgba(255,255,255,0.1)" }}
        data-testid={`${testid}-toggle`}
      >
        <motion.div
          animate={{ x: value ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 rounded-full bg-white"
        />
      </button>
    </div>
  );
}
