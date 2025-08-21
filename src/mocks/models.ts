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
  status: z.enum(["active","won","lost","void"]),
  stake: z.number().optional(),
});

export const Post = z.object({
  id: z.string(),
  partnerId: z.string(),
  createdAt: z.date(),
  type: z.enum(["parsed","unparsed"]),
  text: z.string(),
  betId: z.string().optional(),
  views: z.number(),
  tails: z.number(),
});

export type BookT = z.infer<typeof Book>;
export type PartnerT = z.infer<typeof Partner>;
export type BetT = z.infer<typeof Bet>;
export type PostT = z.infer<typeof Post>;
