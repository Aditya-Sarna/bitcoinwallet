import { ArrowUpRight, ArrowDownLeft, Gift, Receipt, CurrencyCircleDollar } from "@phosphor-icons/react";
import { fmtBTC, shortAddr, relTime } from "../lib/format";

const ICONS = {
  sent: ArrowUpRight,
  received: ArrowDownLeft,
  reward: Gift,
  redeem: CurrencyCircleDollar,
  bill: Receipt,
};

const META = {
  sent:     { title: "sent",       color: "#FF3E8A" },
  received: { title: "received",   color: "#D4FF4F" },
  reward:   { title: "reward",     color: "#D4FF4F" },
  redeem:   { title: "redeemed",   color: "#6B5CFC" },
  bill:     { title: "bill paid",  color: "#34D8FF" },
};

export default function TxnItem({ t }) {
  const Icon = ICONS[t.type] || ArrowUpRight;
  const meta = META[t.type] || { title: "transaction", color: "#ffffff" };
  const isPositive = t.type === "received" || t.type === "reward";
  const sign = isPositive ? "+" : t.type === "sent" || t.type === "bill" ? "-" : "";

  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/5" data-testid={`txn-${t.id}`}>
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${meta.color}22`, border: `1px solid ${meta.color}44` }}
      >
        <Icon size={18} weight="bold" color={meta.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold lowercase">{meta.title}</div>
        <div className="text-xs text-white/50 truncate font-mono">
          {t.type === "received" || t.type === "sent"
            ? shortAddr(t.counterparty, 8, 6)
            : t.counterparty}
        </div>
      </div>
      <div className="text-right shrink-0">
        {t.amount_btc > 0 ? (
          <div className="font-mono text-sm font-bold" style={{ color: isPositive ? "#D4FF4F" : "#fff" }}>
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
