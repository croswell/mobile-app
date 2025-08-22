import { View, Text } from "react-native";
import tw from "../lib/tw";
import type { BetT } from "../mocks/models";
import { prettyOdds } from "../lib/format";

export default function BetDetail({ bet }: { bet: BetT }) {
  return (
    <View style={tw`border border-neutral-700 rounded-lg p-3 bg-neutral-800`}>
      <Text style={tw`font-semibold text-neutral-100 text-sm`}>{bet.game}</Text>
      <Text style={tw`text-neutral-300 text-xs`}>
        {bet.market} {bet.line} ({prettyOdds(bet.odds)}) • {bet.league}
      </Text>
      {bet.stake && (
        <Text style={tw`text-green-400 text-xs mt-1`}>
          Stake: ${bet.stake}
        </Text>
      )}
    </View>
  );
}
