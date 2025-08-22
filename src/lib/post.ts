import type { PostT, BetT } from "../mocks/models";

export function postBets(post: PostT, allBets: BetT[]): BetT[] {
  const ids = post.betIds ?? [];
  return ids.map(id => allBets.find(b => b.id === id)).filter(Boolean) as BetT[];
}

export function ctaLabelForPost(post: PostT) {
  const count = (post.betIds?.length ?? 0);
  if (count >= 2) return `Bet ${count} Picks (mock)`;
  if (count === 1) return "Bet Now (mock)";
  return "View Play";
}

export function hasImages(post: PostT) {
  return (post.attachments ?? []).some(a => a.type === "image");
}
