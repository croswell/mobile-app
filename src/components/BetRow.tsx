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

  const statusColor =
    bet.status === "won"
      ? "text-green-400"
      : bet.status === "lost"
      ? "text-red-400"
      : bet.status === "void"
      ? "text-neutral-400"
      : "text-blue-400";

  return (
    <View style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-3`}>
      {/* Game and league info */}
      <View style={tw`mb-3`}>
        <Text style={tw`text-base text-neutral-300 mb-1`} numberOfLines={2}>
          {bet.game} • {bet.league}
        </Text>
        <Text style={tw`text-base text-neutral-300`}>
          {when(bet.startTime)}
        </Text>
      </View>

      {/* Bet details and book info */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <View style={tw`flex-1 mr-3`}>
          <Text style={tw`text-neutral-200`} numberOfLines={2}>
            {bet.market} {bet.line} ({prettyOdds(bet.odds)})
          </Text>
        </View>
        <View style={tw`flex-row items-center flex-shrink-0`}>
          <Logo book={getBookDisplayName(bet.bookId)} size="small" />
          <Text style={tw`text-neutral-200 ml-2`} numberOfLines={1}>{getBookDisplayName(bet.bookId)}</Text>
        </View>
      </View>

      {/* Status and stake */}
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-xs text-neutral-400`}>Stake: {money(bet.stake)}</Text>
        <Text style={tw`text-xs ${statusColor}`}>{bet.status.toUpperCase()}</Text>
      </View>
    </View>
  );
}
