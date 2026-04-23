import { useEffect, useState } from "react";
import Header from "../components/Header";
import TxnItem from "../components/TxnItem";
import { api } from "../lib/api";

export default function Transactions() {
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/wallet/transactions").then((r) => setTxns(r.data.items || []));
  }, []);

  const filtered = txns.filter((t) => {
    if (filter === "all") return true;
    if (filter === "sent") return t.type === "sent" || t.type === "bill";
    if (filter === "received") return t.type === "received";
    if (filter === "rewards") return t.type === "reward" || t.type === "redeem";
    return true;
  });

  const tabs = [
    { k: "all", label: "all" },
    { k: "sent", label: "sent" },
    { k: "received", label: "received" },
    { k: "rewards", label: "rewards" },
  ];

  return (
    <div className="shell">
      <Header title="activity" subtitle={`${txns.length} transactions`} />
      <div className="px-6">
        <div
          className="flex gap-1 rounded-full p-1"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)" }}
        >
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setFilter(t.k)}
              data-testid={`txn-filter-${t.k}`}
              className="flex-1 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors"
              style={
                filter === t.k
                  ? { background: "#D4FF4F", color: "#0A0A0F" }
                  : { color: "rgba(255,255,255,0.6)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-4" data-testid="txn-list">
          {filtered.map((t) => <TxnItem key={t.id} t={t} />)}
          {filtered.length === 0 && (
            <div className="text-center text-white/40 py-16 text-sm">nothing here yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
