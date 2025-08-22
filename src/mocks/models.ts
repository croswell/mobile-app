import { z } from "zod";

export const Book = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().optional(),
});

export const Partner = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  isSubscribed: z.boolean(),
});

// New type for live bet progress tracking
export const LiveBetProgress = z.object({
  currentScore: z.string(), // e.g., "24-18", "3-1", "14-7"
  timeRemaining: z.string(), // e.g., "Q3 8:45", "Bottom 7th", "2nd Half 23:14"
  progressPercentage: z.number(), // 0-100, represents game completion
  keyStats: z.record(z.string(), z.any()).optional(), // e.g., { "rebounds": 8, "assists": 12, "points": 24 }
  lastUpdate: z.date(),
});

// Enhanced bet structure with live progress tracking
export const Bet = z.object({
  id: z.string(),
  league: z.enum(["NFL","NBA","MLB","NHL","NCAAF","NCAAB"]),
  game: z.string(),
  market: z.string(),   // Spread, Moneyline, Total, Player Points...
  line: z.string(),     // +3.5, O 24.5, etc
  odds: z.number(),     // -110, +145
  bookId: z.string(),
  partnerId: z.string(),
  startTime: z.date(),
  status: z.enum(["active","live","won","lost","void"]),
  stake: z.number().optional(),
  gameState: z.enum(["scheduled","in_progress","final"]).optional(), // New field for game state
  liveProgress: LiveBetProgress.optional(), // New field for live bet progress
});

// New parsed bet structure for posts with enhanced live tracking
export const ParsedBet = z.object({
  league: z.string(),        // NBA, NFL, MLB, NCAAB, etc.
  event: z.string(),         // Matchup or player-specific event
  market: z.string(),        // Moneyline, Spread, Player Prop, Parlay, etc.
  line: z.string(),          // e.g., "Over 24.5", "-2.5", "+120"
  odds: z.number(),          // actual odds, e.g., -110, +200
  book: z.string(),          // DraftKings, FanDuel, PrizePicks
  eventTime: z.string(),     // ISO string in the near future
  betType: z.enum(["moneyline", "spread", "total", "player_prop", "parlay"]).optional(), // New field for bet type
  liveProgress: LiveBetProgress.optional(), // New field for live bet progress
});

// Add attachment type
export const Attachment = z.object({
  id: z.string(),
  type: z.enum(["image","link"]),
  url: z.string(),
  title: z.string().optional(),
});

export type AttachmentT = z.infer<typeof Attachment>;

// Update Post schema
export const Post = z.object({
  id: z.string(),
  partnerId: z.string(),
  createdAt: z.date(),
  // parsed = all bets extracted; partial = some extracted; unparsed = none
  extraction: z.enum(["parsed","partial","unparsed"]),
  text: z.string().default(""),
  betIds: z.array(z.string()).optional(),   // 0..N
  parsed: z.array(ParsedBet).optional(),    // New parsed bet data
  attachments: z.array(Attachment).optional(),
  views: z.number(),
  tails: z.number(),
});

export type BookT = z.infer<typeof Book>;
export type PartnerT = z.infer<typeof Partner>;
export type BetT = z.infer<typeof Bet>;
export type ParsedBetT = z.infer<typeof ParsedBet>;
export type PostT = z.infer<typeof Post>;
