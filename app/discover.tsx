import { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import tw from "../src/lib/tw";
import { useData } from "../src/state/data";
import { groupBy } from "../src/lib/group";
import GameRow from "../src/components/GameRow";
import type { BetT } from "../src/mocks/models";

const LEAGUES: BetT["league"][] = ["NFL","NBA","MLB","NHL","NCAAF","NCAAB"];

export default function Discover() {
  const { bets } = useData();
  const [q, setQ] = useState("");
  const [league, setLeague] = useState<BetT["league"] | "ALL">("ALL");

  const filtered = useMemo(() => {
    let list = bets
      .filter(b => b.status === "active")
      .filter(b => (league === "ALL" ? true : b.league === league));
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter(b => b.game.toLowerCase().includes(s));
    }
    return list;
  }, [bets, q, league]);

  const grouped = useMemo(() => {
    const byKey = groupBy(filtered, b => `${b.league}|${b.game}|${b.startTime.toISOString()}`);
    return Object.entries(byKey)
      .map(([key, items]) => {
        const [lg, game, iso] = key.split("|");
        return { league: lg as BetT["league"], game, startTime: new Date(iso), bets: items };
      })
      .sort((a,b)=> a.startTime.getTime() - b.startTime.getTime());
  }, [filtered]);

  return (
    <View style={tw`flex-1 bg-neutral-950`}>
      {/* search */}
      <View style={tw`p-4`}>
        <TextInput
          placeholder="Search games or teams"
          placeholderTextColor="#9ca3af"
          value={q}
          onChangeText={setQ}
          style={tw`bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100`}
        />
      </View>

      {/* league chips */}
      <FlatList
        horizontal
        data={["ALL", ...LEAGUES] as const}
        keyExtractor={(k)=>String(k)}
        contentContainerStyle={tw`px-4 pb-2`}
        renderItem={({ item }) => {
          const on = league === item;
          return (
            <Pressable
              onPress={()=>setLeague(item as any)}
              style={tw`${on ? "bg-neutral-100 border-neutral-100" : "bg-neutral-900 border-neutral-700"} border rounded-full px-3 py-1 mr-2`}
            >
              <Text style={tw`${on ? "text-neutral-950" : "text-neutral-300"} text-xs font-medium`}>{item}</Text>
            </Pressable>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />

      {/* results */}
      <FlatList
        data={grouped}
        keyExtractor={(g)=> `${g.league}-${g.game}-${g.startTime.toISOString()}`}
        contentContainerStyle={tw`p-4 pt-2`}
        renderItem={({ item }) => (
          <GameRow
            league={item.league}
            game={item.game}
            startTime={item.startTime}
            bets={item.bets}
          />
        )}
        ListEmptyComponent={
          <View style={tw`p-6`}>
            <Text style={tw`text-center text-neutral-400`}>No games match your filters.</Text>
          </View>
        }
      />
    </View>
  );
}
