import { View, Text } from "react-native";
import tw from "../lib/tw";
import type { BetT } from "../mocks/models";
import { prettyOdds, money, when } from "../lib/format";
import Logo from "./Logo";

export default function BetRow({ bet }: { bet: BetT }) {
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

  const statusColor =
    bet.status === "won"
      ? "text-green-400"
      : bet.status === "lost"
      ? "text-red-400"
      : bet.status === "void"
      ? "text-neutral-400"
      : "text-blue-400";

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
    <View style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-3`}>
      <View style={tw`flex-row justify-between mb-1`}>
        <Text style={tw`font-semibold text-neutral-100`}>{bet.game}</Text>
        <Text style={tw`text-xs text-neutral-400`}>{when(bet.startTime)}</Text>
      </View>
      <Text style={tw`text-xs text-neutral-400 mb-2`}>{bet.league}</Text>
      
      {/* Bet type badge */}
      <View style={tw`flex-row items-center mb-2`}>
        <View style={tw`${getBetTypeColor(bet)} rounded-full px-2 py-1 mr-2`}>
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
      
      <View style={tw`flex-row items-center mb-2`}>
        <Text style={tw`text-neutral-200 mr-2`}>
          {bet.market} {bet.line} ({prettyOdds(bet.odds)})
        </Text>
        <View style={tw`flex-row items-center`}>
          <Logo book={getBookDisplayName(bet.bookId)} size="small" />
          <Text style={tw`text-neutral-200 ml-2`}>{getBookDisplayName(bet.bookId)}</Text>
        </View>
      </View>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-xs text-neutral-400`}>Stake: {money(bet.stake)}</Text>
        <Text style={tw`text-xs ${statusColor}`}>{bet.status.toUpperCase()}</Text>
      </View>
    </View>
  );
}
