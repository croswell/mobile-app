import { View, Text, Pressable } from "react-native";
import tw from "../lib/tw";
import type { BetT } from "../mocks/models";
import { prettyOdds, when } from "../lib/format";

type Props = {
  game: string;
  startTime: Date;
  league: BetT["league"];
  bets: BetT[];
};

// pick the most favorable odds for tailing: highest positive, otherwise closest to zero negative
function bestByMarket(bets: BetT[], market: string) {
  const candidates = bets.filter(b => b.market === market);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  
  return candidates.reduce((best, cur) => {
    const score = cur.odds >= 0 ? cur.odds : -Math.abs(cur.odds);
    const bestScore = best.odds >= 0 ? best.odds : -Math.abs(best.odds);
    return score > bestScore ? cur : best;
  });
}

export default function GameRow({ game, startTime, league, bets }: Props) {
  const ml = bestByMarket(bets, "Moneyline");
  const sp = bestByMarket(bets, "Spread");
  const tot = bestByMarket(bets, "Total");

  return (
    <View style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4`}>
      <View style={tw`flex-row justify-between mb-1`}>
        <Text style={tw`font-semibold text-neutral-100`}>{game}</Text>
        <Text style={tw`text-xs text-neutral-400`}>{when(startTime)}</Text>
      </View>
      <Text style={tw`text-xs text-neutral-400 mb-3`}>{league}</Text>

      <View style={tw`flex-row gap-2`}>
        {ml && (
          <View style={tw`border border-neutral-700 rounded-lg px-3 py-2 bg-neutral-800`}>
            <Text style={tw`text-xs text-neutral-400 mb-1`}>Moneyline</Text>
            <Text style={tw`font-semibold text-neutral-100`}>{prettyOdds(ml.odds)}</Text>
            <Text style={tw`text-xs text-neutral-400`}>Book: {ml.bookId}</Text>
          </View>
        )}
        {sp && (
          <View style={tw`border border-neutral-700 rounded-lg px-3 py-2 bg-neutral-800`}>
            <Text style={tw`text-xs text-neutral-400 mb-1`}>Spread</Text>
            <Text style={tw`font-semibold text-neutral-100`}>{sp.line} • {prettyOdds(sp.odds)}</Text>
            <Text style={tw`text-xs text-neutral-400`}>Book: {sp.bookId}</Text>
          </View>
        )}
        {tot && (
          <View style={tw`border border-neutral-700 rounded-lg px-3 py-2 bg-neutral-800`}>
            <Text style={tw`text-xs text-neutral-400 mb-1`}>Total</Text>
            <Text style={tw`font-semibold text-neutral-100`}>{tot.line} • {prettyOdds(tot.odds)}</Text>
            <Text style={tw`text-xs text-neutral-400`}>Book: {tot.bookId}</Text>
          </View>
        )}
      </View>

      <Pressable style={tw`mt-3 bg-brand rounded-lg px-3 py-2`}>
        <Text style={tw`text-neutral-950 text-center text-sm font-medium`}>Bet Now</Text>
      </Pressable>
    </View>
  );
}
