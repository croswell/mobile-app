export const prettyOdds = (o: number) => (o > 0 ? `+${o}` : `${o}`);

export const money = (n?: number) =>
  typeof n === "number"
    ? Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
    : "—";

export const when = (d: Date) => {
  const ms = d.getTime() - Date.now();
  const absMs = Math.abs(ms);
  const s = Math.max(1, Math.floor(absMs / 1000));
  
  if (s < 60) return ms >= 0 ? `in ${s}s` : `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return ms >= 0 ? `in ${m}m` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return ms >= 0 ? `in ${h}h` : `${h}h ago`;
  const days = Math.floor(h / 24);
  return ms >= 0 ? `in ${days}d` : `${days}d ago`;
};

export const whenReadable = (d: Date) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(d);
  targetDate.setHours(0, 0, 0, 0);
  
  if (targetDate.getTime() === today.getTime()) {
    return `Today at ${d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`;
  } else if (targetDate.getTime() === tomorrow.getTime()) {
    return `Tomorrow at ${d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`;
  } else {
    return d.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
};
