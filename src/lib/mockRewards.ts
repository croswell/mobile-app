import type { PromoOffer, RewardsState, ReferralProgram, RegionCode } from "../types/rewards";

const logos = {
  dk: "https://cdn.opticodds.com/sportsbook-logos/draftkings.jpg",
  fd: "https://cdn.opticodds.com/sportsbook-logos/fanduel.jpg",
  pp: "https://dummyimage.com/80x80/8B5CF6/fff&text=PP",
};

const promos: PromoOffer[] = [
  {
    id: "pp-200",
    providerId: "pp",
    providerName: "PrizePicks",
    logo: logos.pp,
    title: "Earn up to $200 in PrizePicks Cash",
    description: "Use code DUBCLUB and get 2% back on every play for 30 days (max $200).",
    rewardValueUsd: 200,
    ctaLabel: "Claim $200",
    deeplink: "https://example.org/promo/prizepicks",
    eligibleRegions: ["CA","Other"],
  },
  {
    id: "dk-250",
    providerId: "dk",
    providerName: "DraftKings",
    logo: logos.dk,
    title: "Bet $5, Get $250",
    description: "New users only. Min. $5 bet required.",
    rewardValueUsd: 250,
    ctaLabel: "Claim $250",
    deeplink: "https://example.org/promo/dk",
    eligibleRegions: ["NY","NJ","PA","CO","AZ","Other"],
  },
  {
    id: "fd-200",
    providerId: "fd",
    providerName: "FanDuel",
    logo: logos.fd,
    title: "Bet $5, Get $200",
    description: "New users only. Min. $5 bet required.",
    rewardValueUsd: 200,
    ctaLabel: "Claim $200",
    deeplink: "https://example.org/promo/fd",
    eligibleRegions: ["NY","NJ","PA","CO","AZ","Other"],
  },
];

const referral: ReferralProgram = {
  code: "SPIKE38400",
  inviteUrl: "https://dubclub.example/invite/SPIKE38400",
  weeklyTarget: 5,
  weeklyCompleted: 0,
  baseRewardUsd: 3, // $3 per friend, or show "up to $100" copy in UI
};

const sleep = (ms=300) => new Promise(res => setTimeout(res, ms));

export const rewardsApi = {
  async getRewards(region: RegionCode = "CA"): Promise<RewardsState> {
    await sleep();
    const regionPromos = promos.filter(p => p.eligibleRegions.includes(region) || p.eligibleRegions.includes("Other"));
    return { promos: regionPromos, referral: { ...referral } };
  },
  async claimPromo(id: string) {
    await sleep();
    const idx = promos.findIndex(p => p.id === id);
    if (idx >= 0) promos[idx].claimed = true;
    return promos[idx];
  },
  async incrementReferral() {
    referral.weeklyCompleted = Math.min(referral.weeklyCompleted + 1, referral.weeklyTarget);
    return { ...referral };
  }
};
