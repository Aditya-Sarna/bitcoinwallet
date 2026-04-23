import { ArrowUpRight, ArrowDownLeft, Gift, Receipt, CurrencyCircleDollar } from "@phosphor-icons/react";
import { fmtBTC, shortAddr, relTime } from "../lib/format";

const ICONS = {
  sent: ArrowUpRight,
  received: ArrowDownLeft,
  reward: Gift,
  redeem: CurrencyCircleDollar,
  bill: Receipt,
};

const TITLE = {
  sent: "Sent",
  received: "Received",
  reward: "Reward",
  redeem: "Redeemed",
  bill: "Bill Payment",
};

export default function TxnItem({ t }) {
  const Icon = ICONS[t.type] || ArrowUpRight;
  const isPositive = t.type === "received" || t.type === "reward";
  const amountColor = isPositive ? "text-[#00D09C]" : "text-white";
  const sign = isPositive ? "+" : t.type === "sent" || t.type === "bill" ? "-" : "";

  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/5" data-testid={`txn-${t.id}`}>
      <div className="w-11 h-11 rounded-full glass flex items-center justify-center shrink-0">
        <Icon size={18} weight="bold" className={isPositive ? "text-[#00D09C]" : "text-white/80"} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{TITLE[t.type] || "Transaction"}</div>
        <div className="text-xs text-white/50 truncate font-mono">
          {t.type === "received" || t.type === "sent"
            ? shortAddr(t.counterparty, 8, 6)
            : t.counterparty}
        </div>
      </div>
      <div className="text-right shrink-0">
        {t.amount_btc > 0 ? (
          <div className={`font-mono text-sm font-semibold ${amountColor}`}>
            {sign}{fmtBTC(t.amount_btc, 6)} BTC
          </div>
        ) : (
          <div className="font-mono text-sm text-white/70">{t.note}</div>
        )}
        <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
          {t.status === "pending" ? "pending" : relTime(t.created_at)}
        </div>
      </div>
    </div>
  );
}
