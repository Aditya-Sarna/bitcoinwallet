import { NavLink } from "react-router-dom";
import { House, Coins, Storefront, User, ShieldCheck } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const items = [
  { to: "/home", label: "home", Icon: House, testid: "nav-home" },
  { to: "/rewards", label: "rewards", Icon: Coins, testid: "nav-rewards" },
  { to: "/store", label: "store", Icon: Storefront, testid: "nav-store" },
  { to: "/security", label: "vault", Icon: ShieldCheck, testid: "nav-vault" },
  { to: "/profile", label: "you", Icon: User, testid: "nav-profile" },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-3 pb-5 pt-3 z-50 pointer-events-none">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 24 }}
        className="rounded-full py-2 px-2 flex items-center justify-between pointer-events-auto"
        style={{
          background: "rgba(20,20,32,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        }}
        data-testid="bottom-nav"
      >
        {items.map(({ to, label, Icon, testid }) => (
          <NavLink key={to} to={to} data-testid={testid} className="flex-1">
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full relative"
                style={{ color: isActive ? "#D4FF4F" : "rgba(255,255,255,0.5)" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(212,255,79,0.1)", border: "1px solid rgba(212,255,79,0.25)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  />
                )}
                <Icon size={19} weight={isActive ? "fill" : "regular"} className="relative" />
                <span className="text-[9px] lowercase tracking-[0.14em] relative font-semibold">
                  {label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </motion.div>
    </div>
  );
}
