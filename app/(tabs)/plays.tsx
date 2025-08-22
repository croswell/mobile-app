import { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import tw from "../../src/lib/tw";
import { useData } from "../../src/state/data";
import BetRow from "../../src/components/BetRow";
import SegmentedTabs from "../../src/components/SegmentedTabs";
import PlaysSummaryHeader from "../../src/components/PlaysSummaryHeader";
import type { BetT } from "../../src/mocks/models";

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
    <View style={tw`flex-1 bg-neutral-950 px-4 pt-4`}>
      {/* Summary header */}
      <PlaysSummaryHeader />
      
      {/* Segmented tabs */}
      <View style={{ marginBottom: 12 }}>
        <SegmentedTabs
          tabs={[
            { key: "Active", label: "Active" },
            { key: "Completed", label: "Completed" },
          ]}
          value={tab}
          onChange={(key) => setTab(key as TabKey)}
        />
      </View>

      {/* Scrollable content */}
      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-6`}
        showsVerticalScrollIndicator={false}
      >
        {data.length > 0 ? (
          data.map((bet) => <BetRow key={bet.id} bet={bet} />)
        ) : (
          <View style={tw`p-6`}>
            <Text style={tw`text-center text-neutral-400`}>
              {tab === "Active" ? "No active plays yet." : "No completed plays yet."}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
