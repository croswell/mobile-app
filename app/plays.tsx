import { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import tw from "../src/lib/tw";
import { useData } from "../src/state/data";
import BetRow from "../src/components/BetRow";
import type { BetT } from "../src/mocks/models";

type TabKey = "Active" | "Completed";

export default function Plays() {
  const { bets } = useData();
  const [tab, setTab] = useState<TabKey>("Active");

  const { active, completed } = useMemo(() => {
    const active = bets
      .filter(b => b.status === "active")
      .sort((a,b)=> a.startTime.getTime() - b.startTime.getTime());

    const completed = bets
      .filter(b => b.status !== "active")
      .sort((a,b)=> b.startTime.getTime() - a.startTime.getTime())
      .reverse(); // most recent first

    return { active, completed };
  }, [bets]);

  const data: BetT[] = tab === "Active" ? active : completed;

  return (
    <View style={tw`flex-1 bg-neutral-950`}>
      {/* header summary */}
      <View style={tw`px-4 pt-4`}>
        <Text style={tw`text-xl font-bold mb-2 text-neutral-100`}>My Plays</Text>
      </View>

      {/* segmented control */}
      <View style={tw`flex-row px-4 pb-2 gap-2`}>
        {(["Active","Completed"] as const).map(k => {
          const on = tab === k;
          return (
            <Pressable
              key={k}
              onPress={()=>setTab(k)}
              style={tw`${on ? "bg-neutral-100 border-neutral-100" : "bg-neutral-900 border-neutral-700"} border rounded-full px-4 py-2`}
            >
              <Text style={tw`${on ? "text-neutral-950" : "text-neutral-300"} text-sm`}>{k}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* list */}
      <FlatList
        data={data}
        keyExtractor={(b)=>b.id}
        renderItem={({ item }) => <BetRow bet={item} />}
        contentContainerStyle={tw`px-4 pb-6`}
        ListEmptyComponent={
          <View style={tw`p-6`}>
            <Text style={tw`text-center text-neutral-400`}>
              {tab === "Active" ? "No active plays yet." : "No completed plays yet."}
            </Text>
          </View>
        }
      />
    </View>
  );
}
