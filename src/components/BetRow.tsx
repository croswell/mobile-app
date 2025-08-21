import { View, Text } from "react-native";
import tw from "../lib/tw";
import type { BetT } from "../mocks/models";
import { prettyOdds, money, when } from "../lib/format";

export default function BetRow({ bet }: { bet: BetT }) {
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
      <View style={tw`flex-row justify-between mb-1`}>
        <Text style={tw`font-semibold text-neutral-100`}>{bet.game}</Text>
        <Text style={tw`text-xs text-neutral-400`}>{when(bet.startTime)}</Text>
      </View>
      <Text style={tw`text-xs text-neutral-400 mb-2`}>{bet.league}</Text>
      <Text style={tw`mb-2 text-neutral-200`}>
        {bet.market} {bet.line} ({prettyOdds(bet.odds)}) • Book: {bet.bookId}
      </Text>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-xs text-neutral-400`}>Stake: {money(bet.stake)}</Text>
        <Text style={tw`text-xs ${statusColor}`}>{bet.status.toUpperCase()}</Text>
      </View>
    </View>
  );
}
