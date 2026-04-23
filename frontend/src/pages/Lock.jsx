import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PinPad from "../components/PinPad";
import Logo from "../components/Logo";
import { api } from "../lib/api";

export default function Lock() {
  const nav = useNavigate();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const walletId = localStorage.getItem("btc_wallet_id");
  const name = localStorage.getItem("btc_name") || "member";

  useEffect(() => {
    if (!walletId) nav("/onboarding");
  }, [walletId, nav]);

  useEffect(() => {
    if (pin.length === 6 && !loading) submit();
    // eslint-disable-next-line
  }, [pin]);

  const submit = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { wallet_id: walletId, pin });
      localStorage.setItem("btc_token", data.token);
      toast.success("unlocked");
      nav("/home");
    } catch (e) {
      toast.error("wrong pin");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell relative overflow-hidden" style={{ background: "#0A0A0F" }}>
      <div className="bg-radial-gold" />
      <div className="relative z-10 min-h-screen px-6 py-14 flex flex-col">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto"
        >
          <Logo size={56} />
        </motion.div>

        <div className="text-center mt-6">
          <div className="text-[10px] tracking-[0.24em] uppercase text-white/45 mb-2 font-semibold">welcome back</div>
          <h2
            className="text-white tracking-[-0.03em]"
            style={{ fontFamily: "Clash Display, sans-serif", fontWeight: 700, fontSize: 36 }}
          >
            hi, <span style={{ color: "#D4FF4F" }}>{name.toLowerCase()}</span>
          </h2>
          <p className="text-white/50 mt-2 text-[13px]">enter your 6-digit pin to unlock</p>
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full">
            <PinPad value={pin} onChange={setPin} testidPrefix="lock-pin" />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              localStorage.clear();
              nav("/onboarding");
            }}
            data-testid="logout-link"
            className="text-[10px] tracking-[0.22em] uppercase text-white/40 hover:text-white/80 transition-colors font-semibold"
          >
            not you? start over
          </button>
        </div>
      </div>
    </div>
  );
}
