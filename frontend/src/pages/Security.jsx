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
    toast.success(data.biometric_enabled ? "Biometric enabled" : "Biometric disabled");
    load();
  };

  const score = status?.security_score || 0;

  return (
    <div className="shell grain">
      <Header title="Security" />
      <div className="px-6">
        {/* Security Score */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a1a1a, #0a0a0a)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
          data-testid="security-score"
        >
          <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(#D4AF37, transparent 70%)" }} />
          <div className="relative">
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">security score</div>
            <div className="flex items-end gap-2 mt-1">
              <div className="font-display text-5xl font-semibold tracking-tighter">{score}</div>
              <div className="text-white/40 text-sm pb-2">/ 100</div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.2 }}
                className="h-full gold-gradient"
              />
            </div>
            <div className="font-serif-italic text-[11px] text-white/50 mt-2">
              {score >= 90 ? "fortress" : score >= 70 ? "strong" : score >= 40 ? "moderate" : "vulnerable"}
            </div>
          </div>
        </motion.div>

        <div className="mt-6 space-y-3">
          <Row
            testid="sec-backup"
            icon={<ShieldCheck size={20} weight="fill" className={status?.seed_backed_up ? "text-[#00D09C]" : "text-[#FF7A3A]"} />}
            title="recovery phrase"
            desc={status?.seed_backed_up ? "verified · your vault is recoverable" : "not yet verified — backup now"}
            warning={!status?.seed_backed_up}
            onClick={() => nav("/backup")}
          />
          <Toggle
            testid="sec-bio"
            icon={<Fingerprint size={20} weight="fill" className="text-gold" />}
            title="biometric unlock"
            desc="use your face or fingerprint"
            value={status?.biometric_enabled || false}
            onChange={toggleBio}
          />
          <Row
            testid="sec-pin"
            icon={<Key size={20} weight="fill" className="text-gold" />}
            title="change pin"
            desc="update your 6-digit entry code"
            onClick={() => toast("Coming soon · demo")}
          />
        </div>

        <div className="mt-8 rounded-3xl p-5 glass" data-testid="security-tips">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">wisdom</div>
          <div className="font-cursive text-3xl text-white/90 leading-tight">not your keys,<br />not your coins.</div>
          <p className="text-xs text-white/50 mt-3 leading-relaxed">
            Your recovery phrase is your sovereignty. Store it offline, split it across locations, and never commit it to digital memory.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, title, desc, onClick, warning, testid }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      data-testid={testid}
      className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left"
    >
      <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold flex items-center gap-2">
          {title}
          {warning && <Warning size={12} className="text-[#FF7A3A]" weight="fill" />}
        </div>
        <div className="text-[11px] text-white/50 truncate">{desc}</div>
      </div>
      <CaretRight size={16} className="text-white/30" />
    </motion.button>
  );
}

function Toggle({ icon, title, desc, value, onChange, testid }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3" data-testid={testid}>
      <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[11px] text-white/50">{desc}</div>
      </div>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors p-0.5 ${value ? "bg-[#D4AF37]" : "bg-white/10"}`}
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
