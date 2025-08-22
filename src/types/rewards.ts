export type RegionCode = 'CA' | 'NY' | 'NJ' | 'PA' | 'CO' | 'AZ' | 'TX' | 'Other';

export type PromoOffer = {
  id: string;
  providerId: string;          // 'dk' | 'fd' | 'pp'
  providerName: string;        // DraftKings, FanDuel, ProphetX...
  logo: string;                // url or require() later
  title: string;               // short headline
  description: string;         // 1–2 lines
  rewardValueUsd: number;      // numeric amount for "Total Promo Value"
  ctaLabel: string;            // "Claim $100"
  deeplink: string;            // fake for now
  eligibleRegions: RegionCode[];
  expiresAt?: string;          // ISO (optional)
  claimed?: boolean;
};

export type ReferralProgram = {
  code: string;
  inviteUrl: string;
  weeklyTarget: number;        // invites needed this week
  weeklyCompleted: number;     // done so far
  baseRewardUsd: number;       // e.g. $3 or $100 top offer
};

export type RewardsState = {
  promos: PromoOffer[];
  referral: ReferralProgram;
};
