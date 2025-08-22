import type { LinkedAccount, EarningsPoint } from "../types/finance";
import { useData } from "../state/data";

const logos = {
  dk: "https://cdn.opticodds.com/sportsbook-logos/draftkings.jpg",
  fd: "https://cdn.opticodds.com/sportsbook-logos/fanduel.jpg",
  ud: "https://dummyimage.com/80x80/0f172a/fff&text=UD",
  px: "https://dummyimage.com/80x80/1e293b/fff&text=PX",
};

let accounts: LinkedAccount[] = [
  { id: "dk", name: "DraftKings", logo: logos.dk, cashBalance: 200.00 },
  { id: "fd", name: "FanDuel",    logo: logos.fd, cashBalance: 150.00 },
  { id: "ud", name: "Underdog",   logo: logos.ud, cashBalance: 125.00 },
];

const sleep = (ms=250) => new Promise(r => setTimeout(r, ms));

export const financeApi = {
  async getAccounts(): Promise<LinkedAccount[]> {
    await sleep(); return accounts;
  },

  // At risk = sum of stake on Active plays
  async getAtRisk(): Promise<number> {
    return 25.00; // Fixed at $25 for now
  },

  // Total bankroll = sum(accounts cash) + atRisk
  async getTotalBankroll(): Promise<number> {
    return 500.00; // Fixed at $500 for now
  },

  // Earnings history from completed plays (daily)
  async getEarningsHistory(days = 7): Promise<EarningsPoint[]> {
    const { bets } = useData.getState();
    const byDay: Record<string, number> = {};
    const now = new Date();

    // helper to compute profit of a play
    const profitOf = (stake: number, odds: number, result?: "won"|"lost"|"void") => {
      if (result === "void") return 0;
      if (result === "lost") return -(stake || 0);
      // Win
      const payout = odds > 0 ? ((stake || 0) * odds) / 100 : ((stake || 0) * 100) / Math.abs(odds);
      return payout;
    };

    // aggregate completed plays by day
    for (const b of bets) {
      if (b.status !== "won" && b.status !== "lost") continue;
      const d = new Date(b.startTime);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      byDay[key] = (byDay[key] ?? 0) + profitOf(b.stake || 0, b.odds, b.status);
    }

    // build last N days
    const out: EarningsPoint[] = [];
    for (let i = days-1; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      out.push({ date: key, profit: +(byDay[key] ?? 0) });
    }
    return out;
  },
};
