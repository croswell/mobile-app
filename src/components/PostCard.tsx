import { View, Text, Pressable, Image } from "react-native";
import tw from "../../lib/tw";
import { useData } from "../state/data";
import type { PostT, BetT, PartnerT } from "../mocks/models";
import { prettyOdds, when } from "../lib/format";
import { Eye, TrendingUp, User, Clock } from "lucide-react-native";

export default function PostCard({ post }: { post: PostT }) {
  const { bets, partners } = useData();
  const partner = partners.find((p: any) => p.id === post.partnerId) as PartnerT | undefined;
  const bet = post.betId ? (bets.find((b: any) => b.id === post.betId) as BetT | undefined) : undefined;

  return (
    <View style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4`}>
      <View style={tw`flex-row items-center mb-2`}>
        {partner?.avatar ? (
          <Image source={{ uri: partner.avatar }} style={tw`w-8 h-8 rounded-full mr-2`} />
        ) : (
          <View style={tw`w-8 h-8 rounded-full mr-2 bg-neutral-700 items-center justify-center`}>
            <User size={16} color="#9ca3af" />
          </View>
        )}
        <Text style={tw`font-semibold text-neutral-100`}>{partner?.name ?? "Partner"}</Text>
        <View style={tw`ml-auto flex-row items-center`}>
          <Clock size={12} color="#9ca3af" style={tw`mr-1`} />
          <Text style={tw`text-xs text-neutral-400`}>{when(post.createdAt)}</Text>
        </View>
      </View>

      <Text style={tw`mb-3 text-neutral-200`}>{post.text}</Text>

      {bet ? (
        <View style={tw`border border-neutral-700 rounded-lg p-3 mb-3 bg-neutral-800`}>
          <Text style={tw`font-semibold text-neutral-100`}>{bet.game}</Text>
          <Text style={tw`text-neutral-300`}>
            {bet.market} {bet.line} ({prettyOdds(bet.odds)}) • Book: {bet.bookId}
          </Text>
        </View>
      ) : null}

      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-row items-center`}>
          <Eye size={12} color="#9ca3af" style={tw`mr-1`} />
          <Text style={tw`text-xs text-neutral-400 mr-3`}>
            {post.views} views
          </Text>
          <TrendingUp size={12} color="#9ca3af" style={tw`mr-1`} />
          <Text style={tw`text-xs text-neutral-400`}>
            {post.tails} tails
          </Text>
        </View>
        <Pressable style={tw`bg-brand rounded-lg px-3 py-2`}>
          <Text style={tw`text-neutral-950 text-sm`}>
            {post.type === "parsed" && bet ? "Bet Now" : "Follow Play"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
