import { View, Text, Pressable } from "react-native";
import tw from "../lib/tw";
import type { BetT } from "../mocks/models";
import { prettyOdds, whenReadable } from "../lib/format";
import Logo from "./Logo";

export default function BetDetail({ bet }: { bet: BetT }) {
  // Helper function to map book ID to display name
  const getBookDisplayName = (bookId: string) => {
    const bookMap: Record<string, string> = {
      'dk': 'DraftKings',
      'fd': 'FanDuel',
      'pp': 'PrizePicks',
      'ud': 'Underdog',
      'sl': 'Sleeper',
      'mgm': 'BetMGM'
    };
    return bookMap[bookId] || bookId;
  };

  // Function to format bet type details based on market type
  const getBetTypeDetails = (bet: BetT) => {
    const market = bet.market.toLowerCase();
    
    switch (market) {
      case 'moneyline':
        return `${bet.game} • ${bet.league}`;
      case 'spread':
        return `${bet.game} • ${bet.line} • ${bet.league}`;
      case 'total':
        return `${bet.game} • ${bet.line} • ${bet.league}`;
      case 'parlay':
        return `${bet.game} • ${bet.line} • ${bet.league}`;
      case 'player points':
      case 'player rebounds':
      case 'player assists':
      case 'player passing yards':
      case 'player rushing yards':
      case 'player home runs':
      case 'player strikeouts':
        return `${bet.game} • ${bet.market} ${bet.line} • ${bet.league}`;
      default:
        return `${bet.game} • ${bet.market} ${bet.line} • ${bet.league}`;
    }
  };

  // Function to get bet type label with appropriate styling
  const getBetTypeLabel = (bet: BetT) => {
    const market = bet.market.toLowerCase();
    
    if (market === 'parlay') {
      return 'Parlay';
    } else if (market.includes('player')) {
      return 'Player Prop';
    } else if (market === 'moneyline') {
      return 'Moneyline';
    } else if (market === 'spread') {
      return 'Spread';
    } else if (market === 'total') {
      return 'Total';
    } else {
      return bet.market;
    }
  };

  // Function to get bet type color
  const getBetTypeColor = (bet: BetT) => {
    const market = bet.market.toLowerCase();
    
    if (market === 'parlay') {
      return 'bg-purple-600';
    } else if (market.includes('player')) {
      return 'bg-blue-600';
    } else if (market === 'moneyline') {
      return 'bg-green-600';
    } else if (market === 'spread') {
      return 'bg-orange-600';
    } else if (market === 'total') {
      return 'bg-red-600';
    } else {
      return 'bg-neutral-600';
    }
  };

  return (
    <View style={tw`w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4`}>
      {/* Bet type badge */}
      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`${getBetTypeColor(bet)} rounded-full px-3 py-1 mr-2`}>
            <Text style={tw`text-white text-xs font-bold`}>
              {getBetTypeLabel(bet)}
            </Text>
          </View>
          {bet.market.toLowerCase() === 'parlay' && (
            <View style={tw`bg-purple-800 rounded-full px-2 py-1`}>
              <Text style={tw`text-purple-200 text-xs font-bold`}>
                {bet.line}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={tw`text-base text-neutral-300 mb-1`}>
          {getBetTypeDetails(bet)}
        </Text>
        <Text style={tw`text-base text-neutral-300`}>
          {whenReadable(bet.startTime)}
        </Text>
      </View>

      {/* Sports book with best odds */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View style={tw`bg-neutral-900 rounded-2xl px-3 py-2`}>
          <Text style={tw`text-base text-neutral-400 mb-1`}>Best Value</Text>
          <View style={tw`flex-row items-center`}>
            <Logo book={getBookDisplayName(bet.bookId)} size="small" />
            <Text style={tw`text-base text-neutral-100 font-medium ml-2`}>{getBookDisplayName(bet.bookId)}</Text>
          </View>
        </View>
        <View style={tw`bg-neutral-900 rounded-lg px-3 py-2`}>
          <Text style={tw`text-base text-neutral-400 mb-1`}>Odds</Text>
          <Text style={tw`text-base text-neutral-100 font-medium`}>{prettyOdds(bet.odds)}</Text>
        </View>
      </View>

      {/* Big BET NOW button */}
      <Pressable style={tw`w-full bg-brand rounded-lg py-4`}>
        <Text style={tw`text-black text-center text-lg font-bold`}>BET NOW</Text>
      </Pressable>
    </View>
  );
}
