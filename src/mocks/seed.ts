import { faker } from "@faker-js/faker";
import type { BookT, PartnerT, BetT, PostT } from "./models";

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random()*arr.length)]; }

export function makeSeed(): {
  books: BookT[];
  partners: PartnerT[];
  bets: BetT[];
  posts: PostT[];
} {
  const books: BookT[] = [
    { id: "dk",  name: "DraftKings" },
    { id: "fd",  name: "FanDuel" },
    { id: "mgm", name: "BetMGM" },
  ];

  const partners: PartnerT[] = Array.from({ length: 6 }).map(() => ({
    id: faker.string.uuid(),
    name: faker.internet.displayName(),
    avatar: faker.image.avatar(),
    isSubscribed: faker.datatype.boolean(),
  }));

  const bets: BetT[] = Array.from({ length: 24 }).map(() => ({
    id: faker.string.uuid(),
    league: faker.helpers.arrayElement(["NFL","NBA","MLB","NHL","NCAAF","NCAAB"]) as BetT["league"],
    game: `${faker.location.city()} @ ${faker.location.city()}`,
    market: faker.helpers.arrayElement(["Spread","Total","Player Points","Moneyline"]),
    line: faker.helpers.arrayElement(["+3.5","-2.5","O 24.5","U 41.5"]),
    odds: faker.helpers.arrayElement([-120,-115,-110,-105,100,120,145]),
    bookId: pick(books).id,
    partnerId: pick(partners).id,
    startTime: faker.date.soon({ days: 3 }),
    status: faker.helpers.arrayElement(["active","won","lost","void"]) as BetT["status"],
    stake: faker.number.int({ min: 5, max: 100 }),
  }));

  const posts: PostT[] = Array.from({ length: 28 }).map(() => {
    const parsed = faker.datatype.boolean();
    const bet = parsed ? pick(bets) : undefined;
    return {
      id: faker.string.uuid(),
      partnerId: pick(partners).id,
      createdAt: faker.date.recent({ days: 3 }),
      type: parsed ? "parsed" : "unparsed",
      text: faker.lorem.sentence(),
      betId: bet?.id,
      views: faker.number.int({ min: 20, max: 2000 }),
      tails: faker.number.int({ min: 0, max: 150 }),
    };
  });

  return { books, partners, bets, posts };
}
