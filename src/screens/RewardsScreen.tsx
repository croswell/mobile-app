import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Pressable, Linking, RefreshControl } from "react-native";
import { rewardsApi } from "../lib/mockRewards";
import type { PromoOffer, RewardsState } from "../types/rewards";
import tw from "../lib/tw";
import SegmentedTabs from "../components/SegmentedTabs";

function Dollar({ value }: { value: number }) {
  return <Text style={tw`font-semibold`}>${value.toLocaleString()}</Text>;
}

function PromoItem({ item, onClaim }: { item: PromoOffer; onClaim: (id: string) => void }) {
  return (
    <View style={tw`bg-neutral-900 rounded-xl p-4 mb-4 border border-neutral-800`}>
      <View style={tw`flex-row items-start mb-3`}>
        <Image source={{ uri: item.logo }} style={{ width: 48, height: 48, borderRadius: 12, marginRight: 12 }} />
        <View style={tw`flex-1`}>
          <Text style={tw`text-white text-lg font-bold mb-1`}>{item.providerName}</Text>
          <Text style={tw`text-neutral-300 text-base mb-2`}>{item.title}</Text>
          <Text style={tw`text-neutral-400 text-sm leading-5`}>{item.description}</Text>
        </View>
      </View>
      <View style={tw`flex-row items-center justify-between`}>  
        <Text style={tw`text-brand font-semibold text-lg`}>${item.rewardValueUsd}</Text>
        <Pressable
          onPress={() => onClaim(item.id)}
          disabled={!!item.claimed}
          style={tw`px-6 py-3 rounded-lg ${item.claimed ? "bg-neutral-700" : "bg-brand"}`}
        >
          <Text style={tw`font-semibold ${item.claimed ? "text-neutral-300" : "text-neutral-950"}`}>
            {item.claimed ? "Claimed" : item.ctaLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function RewardsScreen() {
  const [state, setState] = useState<RewardsState>({ promos: [], referral: { code: "", inviteUrl: "", weeklyTarget: 5, weeklyCompleted: 0, baseRewardUsd: 3 } });
  const [tab, setTab] = useState<"bonuses" | "refer">("bonuses");
  const [refreshing, setRefreshing] = useState(false);

  const totalValue = state.promos.filter(p => !p.claimed).reduce((acc, p) => acc + p.rewardValueUsd, 0);

  const load = async () => {
    const data = await rewardsApi.getRewards("CA");
    setState(data);
  };

  useEffect(() => {
    load();
  }, []);

  const claim = async (id: string) => {
    const updated = await rewardsApi.claimPromo(id);
    setState(prev => ({ ...prev, promos: prev.promos.map(p => p.id === id ? (updated as PromoOffer) : p) }));
    if (updated?.deeplink) Linking.openURL(updated.deeplink);
  };

  return (
    <View style={tw`flex-1 bg-neutral-950 px-4 pt-4`}>
      <Text style={tw`text-white text-3xl font-extrabold mb-1`}>Rewards</Text>
      <Text style={tw`text-neutral-400 mb-3`}>Total Promo Value <Dollar value={totalValue} /></Text>

      {/* Tabs */}
      <View style={{ marginBottom: 12 }}>
        <SegmentedTabs
          tabs={[
            { key: "bonuses", label: "Signup Bonuses" },
            { key: "refer", label: "Refer Friends" },
          ]}
          value={tab}
          onChange={(key) => setTab(key as "bonuses" | "refer")}
        />
      </View>
      {tab === "bonuses" ? (
        <FlatList
          data={state.promos}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => <PromoItem item={item} onClaim={claim} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
        />
      ) : (
        <View style={tw`bg-neutral-950 rounded-xl p-6 border border-neutral-800`}>
          <Text style={tw`text-white text-2xl font-bold mb-3`}>Get<Text style={tw`font-extrabold text-brand`}>$25</Text> when a friend joins</Text>
          <Text style={tw`text-neutral-300 mb-6 text-base leading-6`}>
            Share your code and get $25 per friend, or unlock larger bonuses with weekly streaks.
          </Text>

          <View style={tw`bg-neutral-900 rounded-xl p-4 mb-6 border border-neutral-800`}>
            <Text style={tw`text-neutral-300 text-sm mb-2`}>Your referral code</Text>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-neutral-50 font-mono text-lg font-bold`}>{state.referral.code || "—"}</Text>
              <Pressable onPress={() => Linking.openURL(state.referral.inviteUrl)} style={tw`bg-brand px-4 py-3 rounded-lg`}>
                <Text style={tw`text-neutral-950 font-semibold`}>Share</Text>
              </Pressable>
            </View>
          </View>

          {/* Progress section */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <Text style={tw`text-neutral-300 text-base`}>Weekly Progress</Text>
              <Text style={tw`text-white font-semibold text-lg`}>{state.referral.weeklyCompleted} / {state.referral.weeklyTarget}</Text>
            </View>
            <View style={tw`h-3 bg-[#2a2a2a] rounded-full overflow-hidden mb-2`}>
              <View style={[{ width: `${(state.referral.weeklyCompleted/state.referral.weeklyTarget)*100}%` }, tw`h-3 bg-brand`]}/>
            </View>
                          <Text style={tw`text-brand text-sm`}>Complete {state.referral.weeklyTarget} referrals this week for bonus rewards</Text>
          </View>


        </View>
      )}
    </View>
  );
}
