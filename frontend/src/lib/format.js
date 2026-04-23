export const fmtBTC = (v, dp = 8) => {
  const n = Number(v || 0);
  return n.toFixed(dp).replace(/0+$/, "").replace(/\.$/, "") || "0";
};

export const fmtUSD = (v, dp = 2) => {
  const n = Number(v || 0);
  return n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
};

export const fmtCoins = (v) => {
  const n = Number(v || 0);
  return n.toLocaleString("en-US");
};

export const shortAddr = (a, head = 6, tail = 6) => {
  if (!a) return "";
  if (a.length <= head + tail) return a;
  return `${a.slice(0, head)}…${a.slice(-tail)}`;
};

export const relTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString();
};
