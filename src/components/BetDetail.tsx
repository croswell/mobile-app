import { View, Text, Pressable } from "react-native";
import tw from "../lib/tw";
import type { BetT } from "../mocks/models";
import { prettyOdds, when } from "../lib/format";

export default function BetDetail({ bet }: { bet: BetT }) {
  // Function to format bet type details based on market type
  const getBetTypeDetails = (bet: BetT) => {
    switch (bet.market.toLowerCase()) {
      case 'moneyline':
        return `${bet.game} • ${bet.league}`;
      case 'spread':
        return `${bet.game} • ${bet.line} • ${bet.league}`;
      case 'total':
        return `${bet.game} • ${bet.line} • ${bet.league}`;
      case 'player points':
      case 'player rebounds':
      case 'player assists':
        return `${bet.game} • ${bet.market} ${bet.line} • ${bet.league}`;
      default:
        return `${bet.game} • ${bet.market} ${bet.line} • ${bet.league}`;
    }
  };

  return (
    <View style={tw`w-full bg-neutral-950 border border-neutral-800 rounded-lg p-4`}>
      {/* Bet type details */}
      <View style={tw`mb-3`}>
        <Text style={tw`text-base text-neutral-300 mb-1`}>
          {getBetTypeDetails(bet)}
        </Text>
        <Text style={tw`text-base text-neutral-300`}>
          {when(bet.startTime)}
        </Text>
      </View>

      {/* Sports book with best odds */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View style={tw`bg-neutral-900 rounded-lg px-3 py-2`}>
          <Text style={tw`text-base text-neutral-400 mb-1`}>Book</Text>
          <Text style={tw`text-base text-neutral-100 font-medium`}>{bet.bookId}</Text>
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
