import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, Linking, RefreshControl } from 'react-native';
import { rewardsApi } from '../lib/mockRewards';
import type { PromoOffer, RewardsState } from '../types/rewards';
import tw from '../lib/tw';
import SegmentedTabs from '../components/SegmentedTabs';
import GradientButton from '../components/GradientButton';
import GradientProgressBar from '../components/GradientProgressBar';

function Dollar({ value }: { value: number }) {
  return <Text style={tw`font-semibold`}>${value.toLocaleString()}</Text>;
}

function PromoItem({ item, onClaim }: { item: PromoOffer; onClaim: (id: string) => void }) {
  return (
    <View style={tw`bg-neutral-900 rounded-xl p-4 mb-4 border border-neutral-800`}>
      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center mb-3`}>
          <Image source={{ uri: item.logo }} style={{ width: 32, height: 32, borderRadius: 8, marginRight: 12 }} />
          <Text style={tw`text-white text-lg font-bold`}>{item.providerName}</Text>
        </View>
        <Text style={tw`text-neutral-300 text-base mb-2`}>{item.title}</Text>
        <Text style={tw`text-neutral-400 text-sm leading-5`}>{item.description}</Text>
      </View>
      <GradientButton
        onPress={() => onClaim(item.id)}
        title={item.claimed ? "CLAIMED" : `CLAIM $${item.rewardValueUsd.toFixed(0)}`}
        disabled={!!item.claimed}
        style={tw`w-full`}
      />
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
          <Text style={tw`text-white text-2xl font-bold mb-3`}>Get <Text style={tw`font-extrabold text-brand`}>$25</Text> when a friend joins</Text>
          <Text style={tw`text-neutral-300 mb-6 text-base leading-6`}>
            Share your code and get $25 per friend, or unlock larger bonuses with weekly streaks.
          </Text>

          <View style={tw`bg-neutral-900 rounded-xl p-4 mb-6 border border-neutral-800 items-center`}>
            <Text style={tw`text-neutral-300 text-sm mb-3`}>Your referral code</Text>
            <Text style={tw`text-neutral-50 font-mono text-2xl font-bold text-center mb-4 uppercase`}>{state.referral.code || "—"}</Text>
            <GradientButton
              onPress={() => Linking.openURL(state.referral.inviteUrl)}
              title="COPY"
              style={tw`w-full uppercase`}
            />
          </View>

          {/* Progress section */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <Text style={tw`text-neutral-300 text-base`}>Weekly Progress</Text>
              <Text style={tw`text-white font-semibold text-lg`}>{state.referral.weeklyCompleted} / {state.referral.weeklyTarget}</Text>
            </View>
            <GradientProgressBar
              progress={state.referral.weeklyCompleted / state.referral.weeklyTarget}
              height={12}
              style={tw`mb-2`}
            />
            <Text style={tw`text-brand text-sm`}>Complete {state.referral.weeklyTarget} referrals this week for bonus rewards</Text>
          </View>
        </View>
      )}
    </View>
  );
}