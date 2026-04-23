import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LockKey } from "@phosphor-icons/react";
import PinPad from "../components/PinPad";
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
      toast.error("Wrong PIN");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell grain">
      <div className="bg-radial-gold" />
      <div className="relative z-10 min-h-screen px-6 py-16 flex flex-col">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto w-16 h-16 rounded-full gold-gradient flex items-center justify-center glow-gold"
        >
          <LockKey size={26} weight="fill" className="text-black" />
        </motion.div>

        <div className="text-center mt-6">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">welcome back</div>
          <h2 className="font-display text-3xl tracking-tight">hi, {name}</h2>
          <p className="text-white/50 mt-2 text-sm">enter your 6-digit PIN to unlock</p>
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
            className="text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            not you? start over
          </button>
        </div>
      </div>
    </div>
  );
}
