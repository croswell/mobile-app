import { View, Text, Pressable, Image } from "react-native";
import tw from "../lib/tw";
import { useData } from "../state/data";
import type { PostT } from "../mocks/models";
import { when } from "../lib/format";
import BetDetail from "./BetDetail";
import { postBets, ctaLabelForPost, hasImages } from "../lib/post";
import { router } from "expo-router";

const MAX_LINES = 4;

export default function PostCard({ post }: { post: PostT }) {
  const { bets, partners } = useData();
  const partner = partners.find(p => p.id === post.partnerId);
  const betsForPost = postBets(post, bets);
  const showImages = betsForPost.length === 0 && hasImages(post);
  const images = (post.attachments ?? []).filter(a => a.type === "image").slice(0,3);

  // Function to get avatar source
  const getAvatarSource = (avatar: string) => {
    switch (avatar) {
      case 'secured-picks':
        return require('../../assets/images/secured-picks.jpg');
      case 'hammering-hank':
        return require('../../assets/images/hammering-hank.jpg');
      case 'chilly-bets':
        return require('../../assets/images/chilly-bets.jpg');
      default:
        return { uri: avatar };
    }
  };

  return (
    <View style={tw`rounded-3xl bg-neutral-900 px-4 py-4 mb-3`}>
      {/* author row */}
      <View style={tw`flex-row items-center mb-3`}>
        {partner?.avatar ? (
          <Image 
            source={getAvatarSource(partner.avatar)}
            style={tw`w-8 h-8 rounded-full mr-2`} 
          />
        ) : null}
        <Text style={tw`text-white font-semibold flex-1`} numberOfLines={1}>
          {partner?.name ?? "Partner"}
        </Text>
        <Text style={tw`text-xs text-gray-400`}>{when(post.createdAt)}</Text>
      </View>

      {/* text preview */}
      {!!post.text && (
        <>
          <Text style={tw`text-gray-100`} numberOfLines={MAX_LINES}>
            {post.text}
          </Text>
          {post.text.length > 140 && (
            <Pressable onPress={() => router.push(`/post/${post.id}`)} style={tw`mt-2`}>
              <Text style={tw`text-green-400 font-semibold`}>Show more</Text>
            </Pressable>
          )}
        </>
      )}

      {/* images (only when no parsed bets) */}
      {showImages && (
        <View style={tw`mt-3 flex-row gap-2`}>
          {images.map(img => (
            <Pressable key={img.id} onPress={() => router.push(`/post/${post.id}`)}>
              <Image source={{ uri: img.url }} style={tw`w-24 h-24 rounded-xl`} />
            </Pressable>
          ))}
        </View>
      )}

      {/* parsed bets → render up to 2 modules; more → view detail */}
      {betsForPost.length > 0 && (
        <View style={tw`mt-3`}>
          {betsForPost.slice(0,2).map(b => (
            <View key={b.id} style={tw`mb-3`}>
              <BetDetail bet={b} />
            </View>
          ))}
          {betsForPost.length > 2 && (
            <Pressable onPress={() => router.push(`/post/${post.id}`)} style={tw`-mt-1 mb-2`}>
              <Text style={tw`text-gray-400`}>View {betsForPost.length - 2} more bet(s)…</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* footer */}
      <View style={tw`flex-row items-center justify-between mt-2`}>
        <Text style={tw`text-xs text-gray-400`}>
          {post.views} views • {post.tails} tailing
        </Text>
        <Pressable
          style={tw`bg-green-500 rounded-xl px-3 py-2`}
          onPress={() => router.push(`/post/${post.id}`)}
          accessibilityRole="button"
          accessibilityLabel={ctaLabelForPost(post)}
        >
          <Text style={tw`text-black font-semibold text-sm`}>{ctaLabelForPost(post)}</Text>
        </Pressable>
      </View>
    </View>
  );
}
