import type { PromoOffer, RewardsState, ReferralProgram, RegionCode } from "../types/rewards";

const logos = {
  dk: "https://cdn.opticodds.com/sportsbook-logos/draftkings.jpg",
  fd: "https://cdn.opticodds.com/sportsbook-logos/fanduel.jpg",
  px: "https://dummyimage.com/80x80/1e293b/fff&text=PX",
  ud: "https://dummyimage.com/80x80/0f172a/fff&text=UD",
  nv: "https://dummyimage.com/80x80/111827/fff&text=NV",
  cb: "https://dummyimage.com/80x80/0b3c49/fff&text=CHALK",
};

const promos: PromoOffer[] = [
  {
    id: "px-200",
    providerId: "px",
    providerName: "ProphetX",
    logo: logos.px,
    title: "Earn up to $200 in Prophet Cash",
            description: "Use code DUBCLUB and get 2% back on every play for 30 days (max $200).",
    rewardValueUsd: 200,
    ctaLabel: "Claim $200",
    deeplink: "https://example.org/promo/prophetx",
    eligibleRegions: ["CA","Other"],
  },
  {
    id: "nv-100",
    providerId: "nv",
    providerName: "Novig Sportsbook",
    logo: logos.nv,
    title: "10% off first purchase up to $100",
            description: "Use code DUBCLUB on sign up.",
    rewardValueUsd: 100,
    ctaLabel: "Claim $100",
    deeplink: "https://example.org/promo/novig",
    eligibleRegions: ["CA","CO","AZ","Other"],
  },
  {
    id: "cb-100",
    providerId: "cb",
    providerName: "Chalkboard Fantasy",
    logo: logos.cb,
    title: "100% deposit match up to $100",
            description: "Use code DUBCLUB to unlock.",
    rewardValueUsd: 100,
    ctaLabel: "Claim $100",
    deeplink: "https://example.org/promo/chalkboard",
    eligibleRegions: ["CA","Other"],
  },
  {
    id: "dk-50",
    providerId: "dk",
    providerName: "DraftKings",
    logo: logos.dk,
    title: "Bet $5, Get $50",
    description: "New users only. Min. $5 bet required.",
    rewardValueUsd: 50,
    ctaLabel: "Claim $50",
    deeplink: "https://example.org/promo/dk",
    eligibleRegions: ["NY","NJ","PA","CO","AZ","Other"],
  },
  {
    id: "fd-75",
    providerId: "fd",
    providerName: "FanDuel",
    logo: logos.fd,
    title: "No Sweat First Bet up to $75",
    description: "Refund in bonus bets if your first bet loses.",
    rewardValueUsd: 75,
    ctaLabel: "Claim $75",
    deeplink: "https://example.org/promo/fd",
    eligibleRegions: ["CA","NJ","PA","Other"],
  },
  {
    id: "ud-25",
    providerId: "ud",
    providerName: "Underdog Fantasy",
    logo: logos.ud,
    title: "Deposit Match $25",
    description: "New DFS users get a small match.",
    rewardValueUsd: 25,
    ctaLabel: "Claim $25",
    deeplink: "https://example.org/promo/ud",
    eligibleRegions: ["CA","Other"],
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
