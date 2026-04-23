import { NavLink } from "react-router-dom";
import { House, Coins, Storefront, User, ShieldCheck } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const items = [
  { to: "/home", label: "home", Icon: House, testid: "nav-home" },
  { to: "/rewards", label: "rewards", Icon: Coins, testid: "nav-rewards" },
  { to: "/store", label: "store", Icon: Storefront, testid: "nav-store" },
  { to: "/security", label: "vault", Icon: ShieldCheck, testid: "nav-vault" },
  { to: "/profile", label: "profile", Icon: User, testid: "nav-profile" },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-3 pb-5 pt-3 z-50 pointer-events-none">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 24 }}
        className="glass rounded-full py-2 px-2 flex items-center justify-between pointer-events-auto"
        data-testid="bottom-nav"
      >
        {items.map(({ to, label, Icon, testid }) => (
          <NavLink
            key={to}
            to={to}
            data-testid={testid}
            className="flex-1"
          >
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full transition-colors ${
                  isActive ? "text-[#D4AF37]" : "text-white/50"
                }`}
              >
                <Icon size={20} weight={isActive ? "fill" : "regular"} />
                <span className="text-[9px] lowercase tracking-wider">
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
