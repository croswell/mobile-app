import { faker } from "@faker-js/faker";
import type { BookT, PartnerT, BetT, PostT, ParsedBetT } from "./models";

/**
 * BETTING PLATFORM RESTRICTIONS:
 * 
 * Traditional Sportsbooks (DraftKings, FanDuel, BetMGM):
 * - Support all bet types: Moneyline, Spread, Total, Player Prop, Player Prop Parlay
 * 
 * Daily Fantasy Platforms (PrizePicks, Underdog, Sleeper):
 * - ONLY support Player Prop Parlay bets
 * - NO Moneyline, Spread, or Total bets
 * - Must be player-specific over/under props (points, rebounds, assists, etc.)
 * 
 * This ensures realistic bet combinations that users can actually place.
 */

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
    { id: "pp",  name: "PrizePicks" },
    { id: "ud",  name: "Underdog" },
    { id: "sl",  name: "Sleeper" },
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
    },
    {
      id: faker.string.uuid(),
      name: "EliteOdds",
      avatar: undefined,
      isSubscribed: false,
    },
    {
      id: faker.string.uuid(),
      name: "VegasInsider",
      avatar: undefined,
      isSubscribed: false,
    },
    {
      id: faker.string.uuid(),
      name: "SharpShooter",
      avatar: undefined,
      isSubscribed: false,
    }
  ];

  // Create realistic parsed bet data for posts
  const createParsedBet = (): ParsedBetT => {
    // Generate event time in the near future
    const eventTime = faker.date.soon({ days: faker.number.int({ min: 1, max: 7 }) }).toISOString();
    
    // Different bet types with realistic data and proper league mapping
    const betTypes = [
      // Moneyline bets (only traditional sportsbooks)
      {
        market: "Moneyline",
        event: faker.helpers.arrayElement([
          "Lakers vs Warriors",
          "Cowboys vs Eagles", 
          "Yankees vs Red Sox",
          "Bruins vs Maple Leafs",
          "Michigan vs Ohio State",
          "Duke vs UNC",
          "Chiefs vs Bills",
          "Heat vs Celtics"
        ]),
        line: faker.helpers.arrayElement(["+120", "-150", "+180", "-200", "+110", "-130"]),
        odds: faker.helpers.arrayElement([-110, -115, -120, +110, +120, +150, +180]),
        allowedBooks: ["DraftKings", "FanDuel", "BetMGM"],
        league: faker.helpers.arrayElement(["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"])
      },
      // Spread bets (only traditional sportsbooks)
      {
        market: "Spread",
        event: faker.helpers.arrayElement([
          "Lakers -2.5 vs Suns",
          "Cowboys +3.5 @ Eagles",
          "Yankees -1.5 vs Red Sox",
          "Bruins +1.5 @ Maple Leafs",
          "Michigan -7.5 vs Ohio State",
          "Duke +2.5 @ UNC"
        ]),
        line: faker.helpers.arrayElement(["-2.5", "+3.5", "-1.5", "+1.5", "-7.5", "+2.5"]),
        odds: faker.helpers.arrayElement([-110, -115, -120, -105]),
        allowedBooks: ["DraftKings", "FanDuel", "BetMGM"],
        league: faker.helpers.arrayElement(["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"])
      },
      // Single player props (only traditional sportsbooks)
      {
        market: "Player Prop",
        event: faker.helpers.arrayElement([
          "LeBron James Over 24.5 Points (LAL vs GSW)",
          "Patrick Mahomes Over 275.5 Passing Yards (KC vs BUF)",
          "Aaron Judge Over 0.5 Home Runs (NYY vs BOS)",
          "Connor McDavid Over 1.5 Points (EDM vs TOR)",
          "Zion Williamson Over 8.5 Rebounds (NOP vs LAL)",
          "Tom Brady Over 2.5 Touchdowns (TB vs ATL)"
        ]),
        line: faker.helpers.arrayElement(["Over 24.5", "Over 275.5", "Over 0.5", "Over 1.5", "Over 8.5", "Over 2.5"]),
        odds: faker.helpers.arrayElement([-110, -105, +100, +110, +120]),
        allowedBooks: ["DraftKings", "FanDuel", "BetMGM"],
        league: faker.helpers.arrayElement(["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"])
      },
      // Multi-leg player prop parlays (PrizePicks, Underdog, Sleeper)
      {
        market: "Player Prop Parlay",
        event: faker.helpers.arrayElement([
          "LeBron Over 24.5 Points + Curry Over 3.5 Threes (LAL vs GSW)",
          "Mahomes Over 275.5 Yards + Kelce Over 6.5 Receptions (KC vs BUF)",
          "Judge Over 0.5 HRs + Cole Over 6.5 Ks (NYY vs BOS)",
          "McDavid Over 1.5 Points + Draisaitl Over 0.5 Goals (EDM vs TOR)",
          "Zion Over 8.5 Rebounds + Ingram Over 20.5 Points (NOP vs LAL)",
          "Brady Over 2.5 TDs + Evans Over 75.5 Receiving Yards (TB vs ATL)"
        ]),
        line: faker.helpers.arrayElement(["2-Leg", "3-Leg", "4-Leg"]),
        odds: faker.helpers.arrayElement([+200, +300, +450, +600, +800, +1000]),
        allowedBooks: ["PrizePicks", "Underdog", "Sleeper"],
        league: faker.helpers.arrayElement(["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"])
      },
      // Straight bets (totals, etc.) - only traditional sportsbooks
      {
        market: "Total",
        event: faker.helpers.arrayElement([
          "Lakers vs Warriors Over 224.5",
          "Cowboys vs Eagles Under 48.5",
          "Yankees vs Red Sox Over 8.5",
          "Bruins vs Maple Leafs Under 5.5"
        ]),
        line: faker.helpers.arrayElement(["Over 224.5", "Under 48.5", "Over 8.5", "Under 5.5"]),
        odds: faker.helpers.arrayElement([-110, -115, -120, -105]),
        allowedBooks: ["DraftKings", "FanDuel", "BetMGM"],
        league: faker.helpers.arrayElement(["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF"])
      }
    ];
    
    const selectedType = faker.helpers.arrayElement(betTypes);
    const book = faker.helpers.arrayElement(selectedType.allowedBooks);
    
    // Function to determine the correct league based on bet content
    const determineLeague = (event: string, market: string): string => {
      const eventLower = event.toLowerCase();
      
      // Baseball bets
      if (eventLower.includes('yankees') || eventLower.includes('red sox') || 
          eventLower.includes('home runs') || eventLower.includes('hrs') ||
          eventLower.includes('strikeouts') || eventLower.includes('ks') ||
          eventLower.includes('nyy') || eventLower.includes('bos')) {
        return "MLB";
      }
      
      // Basketball bets
      if (eventLower.includes('lakers') || eventLower.includes('warriors') || 
          eventLower.includes('points') || eventLower.includes('rebounds') ||
          eventLower.includes('assists') || eventLower.includes('threes') ||
          eventLower.includes('lal') || eventLower.includes('gsw') ||
          eventLower.includes('pelicans') || eventLower.includes('nop') ||
          eventLower.includes('bucks') || eventLower.includes('mil') ||
          eventLower.includes('nuggets') || eventLower.includes('den') ||
          eventLower.includes('celtics') || eventLower.includes('bos') ||
          eventLower.includes('mavs') || eventLower.includes('dal') ||
          eventLower.includes('suns') || eventLower.includes('phx') ||
          eventLower.includes('clippers') || eventLower.includes('lac')) {
        return "NBA";
      }
      
      // Football bets - more comprehensive detection
      if (eventLower.includes('cowboys') || eventLower.includes('eagles') || 
          eventLower.includes('chiefs') || eventLower.includes('bills') ||
          eventLower.includes('passing yards') || eventLower.includes('touchdowns') ||
          eventLower.includes('tds') || eventLower.includes('receptions') ||
          eventLower.includes('receiving yards') || eventLower.includes('rushing yards') ||
          eventLower.includes('kc') || eventLower.includes('buf') ||
          eventLower.includes('buccaneers') || eventLower.includes('tb') ||
          eventLower.includes('falcons') || eventLower.includes('atl') ||
          eventLower.includes('brady') || eventLower.includes('mahomes') ||
          eventLower.includes('kelce') || eventLower.includes('evans')) {
        return "NFL";
      }
      
      // Hockey bets
      if (eventLower.includes('bruins') || eventLower.includes('maple leafs') || 
          eventLower.includes('oilers') || eventLower.includes('toronto') ||
          eventLower.includes('goals') || eventLower.includes('points') ||
          eventLower.includes('edm') || eventLower.includes('tor')) {
        return "NHL";
      }
      
      // College sports
      if (eventLower.includes('michigan') || eventLower.includes('ohio state') ||
          eventLower.includes('duke') || eventLower.includes('unc')) {
        return eventLower.includes('football') ? "NCAAF" : "NCAAB";
      }
      
      // Default fallback
      return "NBA";
    };
    


    return {
      league: determineLeague(selectedType.event, selectedType.market),
      event: selectedType.event,
      market: selectedType.market,
      line: selectedType.line,
      odds: selectedType.odds,
      book,
      eventTime
    };
  };

  // Create posts with realistic parsed bet data
  const posts: PostT[] = [];
  
  // Create 12 posts with different bet types (mix of parsed and unparsed, favoring parsed)
  for (let i = 0; i < 12; i++) {
    const roll = faker.number.int({ min: 1, max: 10 }); // 1..10
    const shouldHaveParsedBet = roll <= 8; // 80% chance of having a parsed bet
    
    const partner = pick(partners);
    
    if (shouldHaveParsedBet) {
      const parsedBet = createParsedBet();
      
      // SecuredPicks only offers daily fantasy bets
      if (partner.name === "SecuredPicks") {
        // Force SecuredPicks to only have daily fantasy bets
        const dailyFantasyBet = createParsedBet();
        // Ensure it's a player prop parlay on daily fantasy platforms
        dailyFantasyBet.market = "Player Prop Parlay";
        dailyFantasyBet.book = faker.helpers.arrayElement(["PrizePicks", "Underdog", "Sleeper"]);
        dailyFantasyBet.event = faker.helpers.arrayElement([
          "LeBron Over 24.5 Points + Curry Over 3.5 Threes (LAL vs GSW)",
          "Mahomes Over 275.5 Yards + Kelce Over 6.5 Receptions (KC vs BUF)",
          "Judge Over 0.5 HRs + Cole Over 6.5 Ks (NYY vs BOS)",
          "McDavid Over 1.5 Points + Draisaitl Over 0.5 Goals (EDM vs TOR)",
          "Zion Over 8.5 Rebounds + Ingram Over 20.5 Points (NOP vs LAL)",
          "Brady Over 2.5 TDs + Evans Over 75.5 Receiving Yards (TB vs ATL)"
        ]);
        dailyFantasyBet.line = faker.helpers.arrayElement(["2-Leg", "3-Leg", "4-Leg"]);
        dailyFantasyBet.odds = faker.helpers.arrayElement([+200, +300, +450, +600, +800, +1000]);
        // Ensure proper league assignment for daily fantasy bets based on content
        const determineDailyFantasyLeague = (event: string): string => {
          const eventLower = event.toLowerCase();
          
          // Baseball bets
          if (eventLower.includes('yankees') || eventLower.includes('red sox') || 
              eventLower.includes('home runs') || eventLower.includes('hrs') ||
              eventLower.includes('strikeouts') || eventLower.includes('ks') ||
              eventLower.includes('nyy') || eventLower.includes('bos')) {
            return "MLB";
          }
          
          // Basketball bets
          if (eventLower.includes('giannis') || eventLower.includes('bucks') || 
              eventLower.includes('jokic') || eventLower.includes('nuggets') ||
              eventLower.includes('tatum') || eventLower.includes('brown') ||
              eventLower.includes('embiid') || eventLower.includes('76ers') ||
              eventLower.includes('doncic') || eventLower.includes('mavs') ||
              eventLower.includes('booker') || eventLower.includes('durant') ||
              eventLower.includes('suns') || eventLower.includes('mil') ||
              eventLower.includes('den') || eventLower.includes('bos') ||
              eventLower.includes('phi') || eventLower.includes('nyk') ||
              eventLower.includes('dal') || eventLower.includes('gsw') ||
              eventLower.includes('phx') || eventLower.includes('lac')) {
            return "NBA";
          }
          
          // Football bets
          if (eventLower.includes('mahomes') || eventLower.includes('chiefs') || 
              eventLower.includes('kelce') || eventLower.includes('kc')) {
            return "NFL";
          }
          
          // Default to NBA for daily fantasy
          return "NBA";
        };
        
        dailyFantasyBet.league = determineDailyFantasyLeague(dailyFantasyBet.event);
        
        // Generate simple caption for daily fantasy posts
        const postText = faker.helpers.arrayElement([
          "🎲 Daily fantasy special! The value is incredible here.",
          "🚀 Multi-leg parlay with amazing odds!",
          "💎 The best combination for today's slate.",
          "⭐ I love these parlays. Multiple players, one bet!"
        ]);
        
        posts.push({
          id: faker.string.uuid(),
          partnerId: partner.id,
          createdAt: faker.date.recent({ days: 3 }),
          extraction: "parsed" as const,
          text: postText,
          betIds: [],
          parsed: [dailyFantasyBet],
          attachments: [],
          views: faker.number.int({ min: 50, max: 500 }),
          tails: faker.number.int({ min: 5, max: 50 }),
        });
      } else {
        // Other partners can have any type of bet
        // Generate simple, generic captions for parsed bet posts
        const postText = faker.helpers.arrayElement([
          "🔥 This is my lock of the day. The value is too good to pass up!",
          "⚡ I've been watching this matchup all season and I love the spot.",
          "🎯 The numbers don't lie. This is a strong play based on recent trends.",
          "🏈 I've been waiting for this matchup. The setup is perfect.",
          "📊 This bet has been printing money lately. I'm not stopping now.",
          "⭐ The matchup favors us here. Time to capitalize."
        ]);
        
        posts.push({
          id: faker.string.uuid(),
          partnerId: partner.id,
          createdAt: faker.date.recent({ days: 3 }),
          extraction: "parsed" as const,
          text: postText,
          betIds: [],
          parsed: [parsedBet],
          attachments: [],
          views: faker.number.int({ min: 50, max: 500 }),
          tails: faker.number.int({ min: 5, max: 50 }),
        });
      }
    } else {
      // Create a post without parsed bets but with betting-related content
      const hasImages = faker.number.int({ min: 1, max: 10 }) <= 3; // 30% chance
      const isLongText = faker.number.int({ min: 1, max: 10 }) <= 2; // 20% chance
      
      const attachCount = hasImages ? faker.number.int({ min: 1, max: 3 }) : 0;
      const attachments = attachCount
        ? Array.from({ length: attachCount }).map(() => ({
            id: faker.string.uuid(),
            type: "image" as const,
            url: "local://placeholder",
            title: faker.lorem.words({ min: 2, max: 4 }),
          }))
        : [];

      // Generate betting-related text for unparsed posts
      const bettingTexts = [
        "🔥 Looking at the spreads for tonight's games. Some interesting value plays out there!",
        "📊 Been analyzing the player props all morning. The over/under lines are looking juicy today.",
        "🎯 Tonight's slate has some great betting opportunities. I'm eyeing a few specific matchups.",
        "🏈 The moneyline odds are shifting in our favor. Time to lock in some bets!",
        "⚡ Player prop parlays are where the real money is made. Love these multi-leg bets.",
        "💎 Found some incredible value on the totals tonight. The books are giving us free money.",
        "⭐ The early lines are out and I'm seeing some serious value. Let's capitalize on these odds.",
        "🚀 Tonight's games are setting up perfectly for some strategic betting. The value is everywhere!",
        "📈 The line movement is telling us everything we need to know. Smart money is flowing in.",
        "🎲 Daily fantasy and traditional betting both have great opportunities tonight. Let's get it!",
        "🏀 Basketball props are my favorite. The over/under lines are so predictable this season.",
        "⚽ Soccer betting is heating up. The goal totals are looking very attractive right now.",
        "🎯 I've been tracking this team's performance against the spread. The numbers don't lie.",
        "🔥 The parlay potential tonight is insane. Multiple games with great value.",
        "💪 Player performance trends are pointing to some easy money tonight. Let's ride the wave!"
      ];
      
      const text = isLongText 
        ? faker.helpers.arrayElement(bettingTexts) + " " + faker.lorem.sentences({ min: 6, max: 10 })
        : faker.helpers.arrayElement(bettingTexts);

      posts.push({
        id: faker.string.uuid(),
        partnerId: partner.id,
        createdAt: faker.date.recent({ days: 3 }),
        extraction: "unparsed" as const,
        text,
        betIds: [],
        parsed: [],
        attachments,
        views: faker.number.int({ min: 20, max: 300 }),
        tails: faker.number.int({ min: 0, max: 25 }),
      });
    }
  }

  // Add some additional posts without parsed bets for variety
  for (let i = 0; i < 2; i++) {
    const roll = faker.number.int({ min: 1, max: 10 }); // 1..10
    const hasImages = roll <= 3; // 30% chance of having images
    const isLongText = roll > 3 && roll <= 5; // 20% chance of long text
    
    const attachCount = hasImages ? faker.number.int({ min: 1, max: 4 }) : 0;
    const attachments = attachCount
      ? Array.from({ length: attachCount }).map(() => ({
          id: faker.string.uuid(),
          type: "image" as const,
          url: "local://placeholder", // We'll handle this in the component
          title: faker.lorem.words({ min: 2, max: 4 }),
        }))
      : [];

    // Generate betting-related text for these additional posts
    const additionalBettingTexts = [
      "🎯 The analytics are showing some incredible betting value tonight. I've been crunching the numbers all day and the patterns are clear. The line movements are telling us exactly where the smart money is going. When you see this kind of consistent movement, it's usually a sign that the books are adjusting to real market pressure. I'm particularly excited about the player props tonight - there are some over/under lines that are way off from what the advanced metrics suggest. This is exactly the kind of edge we look for in profitable betting. The key is to act quickly before the lines adjust further.",
      "🔥 Tonight's slate is absolutely loaded with betting opportunities. I've been tracking the line movements since this morning and the value is incredible. The spreads are shifting in our favor on multiple games, and the player prop totals are looking very attractive. When you combine this with the recent performance trends, we're looking at some seriously profitable betting scenarios. I'm especially bullish on the parlay potential tonight - there are several correlated bets that could pay off big. The key is to identify which games have the strongest value and build your bets around those opportunities.",
      "📊 The betting landscape tonight is absolutely perfect for strategic plays. I've analyzed every game on the slate and the value is everywhere you look. The moneyline odds are shifting in our favor, the spread lines are offering great value, and the player props are looking very predictable based on recent trends. This is the kind of night where smart betting can really pay off. I'm particularly excited about the over/under totals - there are several games where the lines seem way off from what the advanced analytics suggest. When you see this kind of discrepancy, it's usually a sign that the books are behind on the latest data.",
      "⚡ Tonight's games are setting up perfectly for some serious betting action. I've been monitoring the odds all day and the value is incredible. The early lines are showing some serious opportunities, especially in the player prop markets. When you combine the recent performance data with the current odds, we're looking at some very profitable betting scenarios. I'm particularly excited about the multi-leg parlays tonight - there are several correlated bets that could pay off big. The key is to identify which games have the strongest value and build your bets strategically around those opportunities."
    ];

    const text = isLongText 
      ? faker.helpers.arrayElement(additionalBettingTexts)
      : faker.helpers.arrayElement([
          "🎯 The betting value tonight is incredible. Lines are moving in our favor!",
          "🔥 Tonight's slate has some serious betting opportunities. The value is everywhere!",
          "📊 The analytics are showing some great betting value tonight. Let's capitalize!",
          "⚡ Tonight's games are perfect for strategic betting. The odds are in our favor!"
        ]);

    posts.push({
      id: faker.string.uuid(),
      partnerId: pick(partners).id,
      createdAt: faker.date.recent({ days: 3 }),
      extraction: "unparsed" as const,
      text,
      betIds: [],
      parsed: [],
      attachments,
      views: faker.number.int({ min: 20, max: 200 }),
      tails: faker.number.int({ min: 0, max: 20 }),
    });
  }

  // Add some specific test posts to showcase the image gallery
  const testImagePosts: PostT[] = [
    {
      id: "test-single-image",
      partnerId: partners[0].id,
      createdAt: new Date(),
      extraction: "unparsed",
      text: "📊 Check out these betting analytics! The line movement is showing incredible value tonight. 📸",
      betIds: [],
      parsed: [],
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
      text: "🎯 Two betting charts side by side - perfect for comparing the odds and line movements! 🔍",
      betIds: [],
      parsed: [],
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
      text: "🔥 Three betting insights - first two show the spread analysis, third reveals the player prop value! 📸✨",
      betIds: [],
      parsed: [],
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
      text: "📈 Scroll through these betting charts and analytics! The value is everywhere tonight! 🎨✨",
      betIds: [],
      parsed: [],
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
      text: "🔥 Tonight's betting analysis is absolutely incredible! I've been crunching the numbers all day and the value is everywhere you look. The line movements are showing some serious opportunities, especially in the player prop markets. When you combine the recent performance data with the current odds, we're looking at some very profitable betting scenarios. I'm particularly excited about the multi-leg parlays tonight - there are several correlated bets that could pay off big. The key is to identify which games have the strongest value and build your bets strategically around those opportunities. The analytics are showing some incredible betting value tonight. I've been tracking the line movements since this morning and the value is incredible. The spreads are shifting in our favor on multiple games, and the player prop totals are looking very attractive. When you combine this with the recent performance trends, we're looking at some seriously profitable betting scenarios. This is exactly the kind of edge we look for in profitable betting! 🚀",
      betIds: [],
      parsed: [],
      attachments: [],
      views: 456,
      tails: 23
    },
    {
      id: "test-long-text-2",
      partnerId: partners[1].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      extraction: "unparsed",
      text: "📊 The betting landscape tonight is absolutely perfect for strategic plays. I've analyzed every game on the slate and the value is everywhere you look. The moneyline odds are shifting in our favor, the spread lines are offering great value, and the player props are looking very predictable based on recent trends. This is the kind of night where smart betting can really pay off. I'm particularly excited about the over/under totals - there are several games where the lines seem way off from what the advanced analytics suggest. When you see this kind of discrepancy, it's usually a sign that the books are behind on the latest data. The early lines are showing some serious opportunities, especially in the player prop markets. When you combine the recent performance data with the current odds, we're looking at some very profitable betting scenarios. This allows users to get a preview of the content without having to scroll through extremely long posts in their feed. Perfect! Now we have multiple posts to test with. 📝",
      betIds: [],
      parsed: [],
      attachments: [],
      views: 789,
      tails: 34
    },
    {
      id: "test-long-text-3",
      partnerId: partners[2].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      extraction: "unparsed",
      text: "🎯 Tonight's slate is absolutely loaded with betting opportunities. I've been tracking the line movements since this morning and the value is incredible. The spreads are shifting in our favor on multiple games, and the player prop totals are looking very attractive. When you combine this with the recent performance trends, we're looking at some seriously profitable betting scenarios. I'm especially bullish on the parlay potential tonight - there are several correlated bets that could pay off big. The key is to identify which games have the strongest value and build your bets around those opportunities. The goal is to create a smooth user experience where long posts don't dominate the feed but users can still access the full content when they want to. This approach balances content discovery with readability. When users see these long posts, they'll see a preview followed by the option to expand. Tapping 'Show more' should smoothly transition to the modal view. Excellent! Now we have three guaranteed long posts for testing. 🎯",
      betIds: [],
      parsed: [],
      attachments: [],
      views: 1234,
      tails: 56
    }
  ];

  // Add additional SecuredPicks daily fantasy posts to ensure good representation
  // Note: These are player prop parlays only - no moneyline bets for Sleeper
  const securedPicksPartner = partners.find(p => p.name === "SecuredPicks");
  if (securedPicksPartner) {
    for (let i = 0; i < 2; i++) {
      const dailyFantasyBet = createParsedBet();
      dailyFantasyBet.market = "Player Prop Parlay";
      dailyFantasyBet.book = faker.helpers.arrayElement(["PrizePicks", "Underdog", "Sleeper"]);
      dailyFantasyBet.event = faker.helpers.arrayElement([
        "Giannis Over 30.5 Points + Giannis Over 8.5 Rebounds (MIL vs BOS)",
        "Jokic Over 10.5 Assists + Murray Over 20.5 Points + Jokic Over 25.5 Points (DEN vs LAL)",
        "Tatum Over 25.5 Points + Brown Over 22.5 Points + Tatum Over 3.5 Assists (BOS vs MIA)",
        "Embiid Over 28.5 Points + Harden Over 8.5 Assists + Embiid Over 10.5 Rebounds (PHI vs NYK)",
        "Doncic Over 8.5 Assists + Doncic Over 30.5 Points + Doncic Over 8.5 Rebounds (DAL vs GSW)",
        "Booker Over 24.5 Points + Durant Over 26.5 Points + Booker Over 4.5 Assists (PHX vs LAC)"
      ]);
      dailyFantasyBet.line = faker.helpers.arrayElement(["2-Leg", "3-Leg", "4-Leg"]);
      dailyFantasyBet.odds = faker.helpers.arrayElement([+200, +300, +450, +600, +800, +1000]);
      
      // Ensure proper league assignment for daily fantasy bets based on content
      const determineDailyFantasyLeague = (event: string): string => {
        const eventLower = event.toLowerCase();
        
        // Baseball bets
        if (eventLower.includes('yankees') || eventLower.includes('red sox') || 
            eventLower.includes('home runs') || eventLower.includes('hrs') ||
            eventLower.includes('strikeouts') || eventLower.includes('ks') ||
            eventLower.includes('nyy') || eventLower.includes('bos')) {
          return "MLB";
        }
        
        // Football bets - check this BEFORE basketball to avoid conflicts
        if (eventLower.includes('passing yards') || eventLower.includes('touchdowns') ||
            eventLower.includes('tds') || eventLower.includes('receptions') ||
            eventLower.includes('receiving yards') || eventLower.includes('rushing yards') ||
            eventLower.includes('brady') || eventLower.includes('mahomes') ||
            eventLower.includes('kelce') || eventLower.includes('evans') ||
            eventLower.includes('buccaneers') || eventLower.includes('tb') ||
            eventLower.includes('falcons') || eventLower.includes('atl') ||
            eventLower.includes('chiefs') || eventLower.includes('kc') ||
            eventLower.includes('bills') || eventLower.includes('buf')) {
          return "NFL";
        }
        
        // Basketball bets
        if (eventLower.includes('lebron') || eventLower.includes('curry') || 
            eventLower.includes('lal') || eventLower.includes('gsw') ||
            eventLower.includes('giannis') || eventLower.includes('jokic') ||
            eventLower.includes('tatum') || eventLower.includes('embiid') ||
            eventLower.includes('doncic') || eventLower.includes('booker') ||
            eventLower.includes('durant') || eventLower.includes('points') ||
            eventLower.includes('rebounds') || eventLower.includes('assists') ||
            eventLower.includes('threes') || eventLower.includes('pelicans') ||
            eventLower.includes('nop') || eventLower.includes('bucks') ||
            eventLower.includes('mil') || eventLower.includes('nuggets') ||
            eventLower.includes('den') || eventLower.includes('celtics') ||
            eventLower.includes('bos') || eventLower.includes('mavs') ||
            eventLower.includes('dal') || eventLower.includes('suns') ||
            eventLower.includes('phx') || eventLower.includes('clippers') ||
            eventLower.includes('lac')) {
          return "NBA";
        }
        
        // Hockey bets
        if (eventLower.includes('mcdavid') || eventLower.includes('draisaitl') ||
            eventLower.includes('goals') || eventLower.includes('oilers') ||
            eventLower.includes('edm') || eventLower.includes('toronto') ||
            eventLower.includes('tor')) {
          return "NHL";
        }
        
        // Default to NBA for daily fantasy
        return "NBA";
      };
      
      dailyFantasyBet.league = determineDailyFantasyLeague(dailyFantasyBet.event);
      
      const postText = faker.helpers.arrayElement([
        "🎲 Daily fantasy special! The value is incredible here.",
        "🚀 Multi-leg parlay with amazing odds!",
        "💎 The best combination for today's slate.",
        "⭐ I love these parlays. Multiple players, one bet!",
        "🔥 Daily fantasy parlay that's been printing money!",
        "📊 The analytics show this has a 65% hit rate."
      ]);
      
      posts.push({
        id: faker.string.uuid(),
        partnerId: securedPicksPartner.id,
        createdAt: faker.date.recent({ days: 3 }),
        extraction: "parsed" as const,
        text: postText,
        betIds: [],
        parsed: [dailyFantasyBet],
        attachments: [],
        views: faker.number.int({ min: 50, max: 500 }),
        tails: faker.number.int({ min: 5, max: 50 }),
      });
    }
  }

  // Keep the existing bet structure for backward compatibility
  const bets: BetT[] = [];

  // Generate actual bets from the parsed bet data in posts
  for (const post of posts) {
    if (post.extraction === "parsed" && post.parsed && post.parsed.length > 0) {
      for (const parsedBet of post.parsed) {
        // Convert ParsedBet to BetT format
        const bet: BetT = {
          id: faker.string.uuid(),
          league: parsedBet.league as BetT["league"],
          game: parsedBet.event,
          market: parsedBet.market,
          line: parsedBet.line,
          odds: parsedBet.odds,
          bookId: (() => {
            // Map book names to book IDs
            const bookMap: Record<string, string> = {
              'DraftKings': 'dk',
              'FanDuel': 'fd', 
              'PrizePicks': 'pp',
              'Underdog': 'ud',
              'Sleeper': 'sl',
              'BetMGM': 'mgm'
            };
            return bookMap[parsedBet.book] || 'dk';
          })(),
          partnerId: post.partnerId,
          startTime: new Date(parsedBet.eventTime),
          status: "won", // All parsed bets are completed for now
          stake: faker.number.int({ min: 10, max: 1000 })
        };
        bets.push(bet);
      }
    }
  }

  // Add some additional standalone bets for variety
  // Create exactly $25 worth of active bets
  const activeStakes = [5, 8, 12]; // These sum to exactly $25
  let activeBetCount = 0;
  
  for (let i = 0; i < 25; i++) { // Increased from 15 to 25 for more variety
    const league = faker.helpers.arrayElement(["NFL", "NBA", "MLB", "NHL", "NCAAF", "NCAAB"] as const);
    const market = faker.helpers.arrayElement(["Moneyline", "Spread", "Total", "Player Prop", "Parlay"]);
    
    // Ensure Sleeper only gets player prop and parlay bets
    let bookId: string;
    if (market === "Moneyline" || market === "Spread" || market === "Total") {
      // Traditional sportsbook bets - exclude Sleeper
      bookId = faker.helpers.arrayElement(["dk", "fd", "pp", "ud", "mgm"] as const);
    } else {
      // Player prop and parlay bets - can include Sleeper
      bookId = faker.helpers.arrayElement(["dk", "fd", "pp", "ud", "sl", "mgm"] as const);
    }
    
    let line = "";
    let odds = 0;
    
    if (market === "Moneyline") {
      line = faker.helpers.arrayElement(["+120", "-150", "+180", "-200", "+110", "-130"]);
      odds = faker.helpers.arrayElement([-110, -115, -120, +110, +120, +150, +180]);
    } else if (market === "Spread") {
      line = faker.helpers.arrayElement(["-2.5", "+3.5", "-1.5", "+1.5", "-7.5", "+2.5"]);
      odds = faker.helpers.arrayElement([-110, -115, -120, -105]);
    } else if (market === "Total") {
      line = faker.helpers.arrayElement(["Over 224.5", "Under 48.5", "Over 8.5", "Under 5.5"]);
      odds = faker.helpers.arrayElement([-110, -115, -120, -105]);
    } else if (market === "Player Prop") {
      line = faker.helpers.arrayElement(["Over 24.5", "Over 275.5", "Over 0.5", "Over 1.5"]);
      odds = faker.helpers.arrayElement([-110, -105, +100, +110, +120]);
    } else if (market === "Parlay") {
      line = faker.helpers.arrayElement(["2-Leg", "3-Leg", "4-Leg"]);
      odds = faker.helpers.arrayElement([+200, +300, +450, +600, +800, +1000]);
    }
    
    const games = [
      "Lakers vs Warriors",
      "Cowboys vs Eagles", 
      "Yankees vs Red Sox",
      "Bruins vs Maple Leafs",
      "Michigan vs Ohio State",
      "Duke vs UNC",
      "Chiefs vs Bills",
      "Heat vs Celtics",
      "Bucks vs Celtics",
      "Nuggets vs Lakers",
      "Suns vs Clippers",
      "Mavs vs Warriors",
      "76ers vs Knicks",
      "Pelicans vs Lakers",
      "Oilers vs Maple Leafs",
      "Bruins vs Rangers"
    ];
    
    // Determine status and stake
    let status: "active" | "won" | "lost";
    let stake: number;
    
    if (activeBetCount < 8) { // Increased from 3 to 8 active bets
      // First 8 bets are active with future start times
      status = "active";
      stake = activeBetCount < 3 ? activeStakes[activeBetCount] : faker.number.int({ min: 10, max: 100 });
      activeBetCount++;
    } else {
      // Remaining bets are completed with random stakes
      status = faker.helpers.arrayElement(["won", "lost"] as const);
      stake = faker.number.int({ min: 10, max: 1000 });
    }
    
    // Ensure active bets have future start times
    let startTime: Date;
    if (status === "active") {
      // Active bets start between 1 hour and 7 days from now
      const hoursFromNow = faker.number.int({ min: 1, max: 168 }); // 1 hour to 7 days
      startTime = new Date(Date.now() + (hoursFromNow * 60 * 60 * 1000));
    } else {
      // Completed bets can be in the past or future
      startTime = faker.date.soon({ days: faker.number.int({ min: 1, max: 7 }) });
    }
    
    const bet: BetT = {
      id: faker.string.uuid(),
      league,
      game: faker.helpers.arrayElement(games),
      market,
      line,
      odds,
      bookId,
      partnerId: pick(partners).id,
      startTime,
      status,
      stake
    };
    
    bets.push(bet);
  }

  // Shuffle all posts together for a more natural mixed feed
  const allPosts = [...posts, ...testImagePosts, ...testLongTextPosts];
  
  // Fisher-Yates shuffle to randomize the order
  for (let i = allPosts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPosts[i], allPosts[j]] = [allPosts[j], allPosts[i]];
  }

  // Spread out creation times more naturally after shuffling
  allPosts.forEach((post, index) => {
    // Spread posts across the last 5 days with more recent posts being more common
    const hoursAgo = faker.number.int({ min: 1, max: 120 }); // 1 hour to 5 days ago
    post.createdAt = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
  });

  return { books, partners, bets, posts: allPosts };
}
