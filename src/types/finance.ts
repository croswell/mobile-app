export type LinkedAccount = {
  id: string;                 // 'dk' | 'fd' | 'pp'
  name: string;               // DraftKings, FanDuel...
  logo: string;               // url or local require later
  cashBalance: number;        // available cash
};

export type EarningsPoint = {
  date: string;               // ISO day
  profit: number;             // net profit for that day
};
