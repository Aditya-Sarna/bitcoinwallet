import { fmtCoins } from "../lib/format";
import { CurrencyBtc, Diamond, Ticket } from "@phosphor-icons/react";

export default function ChipRow({ coins = 0, gems = 0, vouchers = 0 }) {
  return (
    <div className="flex items-center gap-2" data-testid="chip-row">
      <Chip icon={<CurrencyBtc size={13} weight="fill" className="text-[#F0C850]" />} value={fmtCoins(coins)} label="coins" bg="#2a220a" testid="chip-coins" />
      <Chip icon={<Diamond size={13} weight="fill" className="text-[#8ec5ff]" />} value={gems} label="gems" bg="#14223a" testid="chip-gems" />
      <Chip icon={<Ticket size={13} weight="fill" className="text-[#00D09C]" />} value={vouchers} label="vouchers" bg="#0a2a1d" testid="chip-vouchers" />
    </div>
  );
}

function Chip({ icon, value, label, bg, testid }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{ background: bg, border: "1px solid rgba(255,255,255,0.06)" }}
      data-testid={testid}
    >
      {icon}
      <span className="font-mono text-xs font-semibold">{value}</span>
      <span className="text-[9px] tracking-wider text-white/50 lowercase">{label}</span>
    </div>
  );
}
