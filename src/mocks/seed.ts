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
    const roll = faker.number.int({ min: 1, max: 10 }); // 1..10
    const isParsed = roll <= 3; // Reduced from 4 to 3
    const isPartial = roll > 3 && roll <= 6; // Reduced from 7 to 6
    const isImageOnly = roll > 6 && roll <= 8; // New category for image-only posts

    const attachCount = isPartial || isImageOnly ? faker.number.int({ min: 1, max: 6 }) : 0;
    const attachments = attachCount
      ? Array.from({ length: attachCount }).map(() => {
          // Generate different aspect ratios for variety
          const aspectRatios = [
            { width: 800, height: 600 },   // 4:3 landscape
            { width: 600, height: 800 },   // 3:4 portrait
            { width: 800, height: 800 },   // 1:1 square
            { width: 1200, height: 600 },  // 2:1 wide landscape
            { width: 1600, height: 400 },  // 4:1 ultra-wide landscape
            { width: 400, height: 1200 },  // 1:3 ultra-tall portrait
          ];
          const ratio = faker.helpers.arrayElement(aspectRatios);
          
          return {
            id: faker.string.uuid(),
            type: "image" as const,
            url: "local://placeholder", // We'll handle this in the component
            title: faker.lorem.words({ min: 2, max: 4 }),
          };
        })
      : [];

    const betCount = isParsed ? faker.number.int({ min: 1, max: 3 }) : isPartial ? faker.number.int({ min: 0, max: 1 }) : 0;
    const chosenBets = betCount ? faker.helpers.arrayElements(bets, betCount) : [];
    
    return {
      id: faker.string.uuid(),
      partnerId: pick(partners).id,
      createdAt: faker.date.recent({ days: 3 }),
      extraction: isParsed ? "parsed" : isPartial ? "partial" : "unparsed",
      text: isImageOnly ? faker.lorem.sentence({ min: 3, max: 8 }) : faker.lorem.sentences({ min: 3, max: 8 }),
      betIds: chosenBets.map(b => b.id),
      attachments,
      views: faker.number.int({ min: 20, max: 2000 }),
      tails: faker.number.int({ min: 0, max: 150 }),
    };
  });

  // Add some specific test posts to showcase the image gallery
  const testImagePosts: PostT[] = [
    {
      id: "test-single-image",
      partnerId: partners[0].id,
      createdAt: new Date(),
      extraction: "unparsed",
      text: "Check out this amazing single image post! 📸",
      betIds: [],
      attachments: [{
        id: "single-img-1",
        type: "image",
        url: "local://single",
        title: "Single image showcase"
      }],
      views: 150,
      tails: 12
    },
    {
      id: "test-two-images",
      partnerId: partners[1].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      extraction: "unparsed",
      text: "Two images side by side - perfect for comparison! 🔍",
      betIds: [],
      attachments: [
        {
          id: "two-img-1",
          type: "image",
          url: "local://two-1",
          title: "First image"
        },
        {
          id: "two-img-2",
          type: "image",
          url: "local://two-2",
          title: "Second image"
        }
      ],
      views: 89,
      tails: 7
    },
    {
      id: "test-three-images",
      partnerId: partners[0].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      extraction: "unparsed",
      text: "Three images - first two split evenly, third hangs over! 📸✨",
      betIds: [],
      attachments: [
        {
          id: "three-img-1",
          type: "image",
          url: "local://three-1",
          title: "First image"
        },
        {
          id: "three-img-2",
          type: "image",
          url: "local://three-2",
          title: "Second image"
        },
        {
          id: "three-img-3",
          type: "image",
          url: "local://three-3",
          title: "Third image (hangs over)"
        }
      ],
      views: 156,
      tails: 14
    },
    {
      id: "test-many-images",
      partnerId: partners[2].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      extraction: "unparsed",
      text: "Scroll through these amazing images! 🎨✨",
      betIds: [],
      attachments: [
        {
          id: "many-img-1",
          type: "image",
          url: "local://many-1",
          title: "Square image"
        },
        {
          id: "many-img-2",
          type: "image",
          url: "local://many-2",
          title: "Wide landscape"
        },
        {
          id: "many-img-3",
          type: "image",
          url: "local://many-3",
          title: "Portrait"
        },
        {
          id: "many-img-4",
          type: "image",
          url: "local://many-4",
          title: "Ultra-wide"
        },
        {
          id: "many-img-5",
          type: "image",
          url: "local://many-5",
          title: "Ultra-tall"
        }
      ],
      views: 234,
      tails: 18
    }
  ];

  // Add specific test posts with long text to ensure "Show more" buttons appear
  const testLongTextPosts: PostT[] = [
    {
      id: "test-long-text-1",
      partnerId: partners[0].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      extraction: "unparsed",
      text: "This is a very long post that should definitely trigger the 'Show more' button because it contains way more than 200 characters. I'm going to keep writing to make sure this post is long enough to test the truncation functionality. The idea is that when users see a long post in their feed, they should see a preview with the option to expand and read the full content. This creates a better user experience by not overwhelming the feed with extremely long posts while still giving users the choice to read more if they're interested. Let me add some more content to ensure this reaches the character limit. I think this should be sufficient now to test the 'Show more' functionality properly! 🚀",
      betIds: [],
      attachments: [],
      views: 456,
      tails: 23
    },
    {
      id: "test-long-text-2",
      partnerId: partners[1].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      extraction: "unparsed",
      text: "Another long post here to test the 'Show more' button functionality. This post is intentionally written to be longer than the 200 character limit so that we can see how the truncation works in the UI. The text should be cut off at some point and display the ellipsis followed by the green 'Show more' button that we styled earlier. This allows users to get a preview of the content without having to scroll through extremely long posts in their feed. When they tap 'Show more', it should open the modal view that slides over the current screen. Let me add a bit more content to make sure this exceeds the character limit. Perfect! Now we have multiple posts to test with. 📝",
      betIds: [],
      attachments: [],
      views: 789,
      tails: 34
    },
    {
      id: "test-long-text-3",
      partnerId: partners[2].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      extraction: "unparsed",
      text: "Here's yet another long post to ensure we have plenty of content to test the 'Show more' functionality. This post is designed to be significantly longer than the 200 character threshold so that the truncation logic kicks in and displays the 'Show more' button. The goal is to create a smooth user experience where long posts don't dominate the feed but users can still access the full content when they want to. This approach balances content discovery with readability. When users see these long posts, they'll see a preview followed by the option to expand. Tapping 'Show more' should smoothly transition to the modal view. Let me add some final content to ensure this post is definitely long enough. Excellent! Now we have three guaranteed long posts for testing. 🎯",
      betIds: [],
      attachments: [],
      views: 1234,
      tails: 56
    }
  ];

  return { books, partners, bets, posts: [...posts, ...testImagePosts, ...testLongTextPosts] };
}
