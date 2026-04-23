import { fmtCoins, fmtBTC } from "../lib/format";
import { CurrencyBtc, Coins, Diamond, Ticket } from "@phosphor-icons/react";

/**
 * Balance stat row — CRED-style "welcome John" header stats.
 * Shows 4 small tiles: balance · coins · gems · vouchers, each with a colored icon box.
 */
export default function BalanceStatRow({ balance, coins, gems, vouchers }) {
  const items = [
    { label: "balance", value: fmtBTC(balance, 4), unit: "BTC", icon: CurrencyBtc, iconBg: "#F2A900", testid: "stat-balance" },
    { label: "coins", value: fmtCoins(coins), unit: "", icon: Coins, iconBg: "#D4AF37", testid: "stat-coins" },
    { label: "gems", value: gems ?? 0, unit: "", icon: Diamond, iconBg: "#3B82F6", testid: "stat-gems" },
    { label: "vouchers", value: vouchers ?? 0, unit: "", icon: Ticket, iconBg: "#00D09C", testid: "stat-vouchers" },
  ];

  return (
    <div className="flex items-start gap-2" data-testid="balance-stat-row">
      {items.map((i) => {
        const Icon = i.icon;
        return (
          <div key={i.label} className="flex-1 flex flex-col items-start gap-1" data-testid={i.testid}>
            <div className="flex items-center gap-1.5 rounded-full glass px-2 py-1 max-w-full">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: i.iconBg }}
              >
                <Icon size={9} weight="fill" className="text-black" />
              </div>
              <span className="font-mono text-[11px] font-semibold truncate">{i.value}</span>
            </div>
            <span className="text-[9px] tracking-wider text-white/40 lowercase pl-1">{i.label}</span>
          </div>
        );
      })}
    </div>
  );
}
