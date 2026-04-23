import { fmtCoins, fmtBTC } from "../lib/format";
import { CurrencyBtc, Coins, Diamond, Ticket } from "@phosphor-icons/react";

/**
 * Balance stat row — vibrant CRED-style 4 tiny stats.
 */
export default function BalanceStatRow({ balance, coins, gems, vouchers }) {
  const items = [
    { label: "balance",  value: fmtBTC(balance, 4), unit: "BTC", icon: CurrencyBtc, iconBg: "#FF7A3A", testid: "stat-balance" },
    { label: "coins",    value: fmtCoins(coins),    unit: "",    icon: Coins,       iconBg: "#D4FF4F", testid: "stat-coins" },
    { label: "gems",     value: gems ?? 0,          unit: "",    icon: Diamond,     iconBg: "#34D8FF", testid: "stat-gems" },
    { label: "vouchers", value: vouchers ?? 0,      unit: "",    icon: Ticket,      iconBg: "#FF3E8A", testid: "stat-vouchers" },
  ];

  return (
    <div className="flex items-start gap-2" data-testid="balance-stat-row">
      {items.map((i) => {
        const Icon = i.icon;
        return (
          <div key={i.label} className="flex-1 flex flex-col items-start gap-1" data-testid={i.testid}>
            <div
              className="flex items-center gap-1.5 rounded-full px-2 py-1 max-w-full"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: i.iconBg }}
              >
                <Icon size={9} weight="fill" className="text-black" />
              </div>
              <span className="font-mono text-[11px] font-bold truncate">{i.value}</span>
            </div>
            <span className="text-[9px] tracking-wider text-white/45 lowercase pl-1 font-semibold">{i.label}</span>
          </div>
        );
      })}
    </div>
  );
}
