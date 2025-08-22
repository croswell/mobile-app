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

  const partners: PartnerT[] = [
    {
      id: faker.string.uuid(),
      name: "SecuredPicks",
      avatar: "secured-picks",
      isSubscribed: true,
    },
    {
      id: faker.string.uuid(),
      name: "HammeringHank", 
      avatar: "hammering-hank",
      isSubscribed: true,
    },
    {
      id: faker.string.uuid(),
      name: "ChillyBets",
      avatar: "chilly-bets",
      isSubscribed: true,
    }
  ];

  // Create more realistic game data with better market distribution
  const games = [
    "Lakers @ Warriors",
    "Cowboys @ Eagles", 
    "Yankees @ Red Sox",
    "Bruins @ Maple Leafs",
    "Michigan @ Ohio State",
    "Duke @ UNC",
    "Chiefs @ Bills",
    "Heat @ Celtics",
    "Dodgers @ Giants",
    "Penguins @ Capitals"
  ];

  const bets: BetT[] = [];
  
  // Generate multiple bets per game to test grouping
  games.forEach((game, gameIndex) => {
    const league = faker.helpers.arrayElement(["NFL","NBA","MLB","NHL","NCAAF","NCAAB"]) as BetT["league"];
    const startTime = faker.date.soon({ days: gameIndex % 3 + 1 }); // Spread games across different days
    
    // Generate multiple markets per game
    const markets = ["Moneyline", "Spread", "Total"];
    markets.forEach((market, marketIndex) => {
      const line = market === "Spread" ? faker.helpers.arrayElement(["+3.5","-2.5","+7.0","-1.5"]) :
                   market === "Total" ? faker.helpers.arrayElement(["O 24.5","U 41.5","O 52.5","U 38.5"]) : "";
      
      bets.push({
        id: faker.string.uuid(),
        league,
        game,
        market,
        line,
        odds: faker.helpers.arrayElement([-120,-115,-110,-105,100,120,145,180]),
        bookId: pick(books).id,
        partnerId: pick(partners).id,
        startTime,
        status: "active" as const,
        stake: faker.number.int({ min: 5, max: 100 }),
      });
    });
  });

  // Add some additional random bets for variety
  for (let i = 0; i < 10; i++) {
    bets.push({
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
    });
  }

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
