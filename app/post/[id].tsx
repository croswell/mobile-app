import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import tw from "../../src/lib/tw";
import { useData } from "../../src/state/data";
import { when } from "../../src/lib/format";
import BetDetail from "../../src/components/BetDetail";
import { postBets } from "../../src/lib/post";
import { ArrowLeft } from "lucide-react-native";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, partners, bets } = useData();
  
  const post = posts.find(p => p.id === id);
  if (!post) {
    return (
      <View style={tw`flex-1 bg-neutral-950 justify-center items-center`}>
        <Text style={tw`text-white text-lg`}>Post not found</Text>
        <Pressable onPress={() => router.back()} style={tw`mt-4 bg-green-500 px-4 py-2 rounded-lg`}>
          <Text style={tw`text-black font-semibold`}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const partner = partners.find(p => p.id === post.partnerId);
  
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
    <View style={tw`flex-1 bg-neutral-950`}>
      {/* Header */}
      <View style={tw`flex-row items-center p-4 border-b border-neutral-800`}>
        <Pressable onPress={() => router.back()} style={tw`mr-3`}>
          <ArrowLeft size={24} color="#ffffff" />
        </Pressable>
        <Text style={tw`text-white text-lg font-semibold`}>Post</Text>
      </View>

      <ScrollView style={tw`flex-1 p-4`}>
        {/* Author info */}
        <View style={tw`flex-row items-center mb-4`}>
          {partner?.avatar ? (
            <Image 
              source={getAvatarSource(partner.avatar)}
              style={tw`w-12 h-12 rounded-full mr-3`} 
            />
          ) : null}
          <View style={tw`flex-1`}>
            <Text style={tw`text-white font-semibold text-lg`}>
              {partner?.name ?? "Partner"}
            </Text>
            <Text style={tw`text-gray-400 text-sm`}>{when(post.createdAt)}</Text>
          </View>
        </View>

        {/* Post text */}
        {!!post.text && (
          <Text style={tw`text-white text-base leading-6 mb-4`}>
            {post.text}
          </Text>
        )}

        {/* Images */}
        {(post.attachments ?? []).filter(a => a.type === "image").map(img => (
          <Image
            key={img.id}
            source={{ uri: img.url }}
            style={tw`w-full h-56 rounded-2xl mt-3`}
          />
        ))}

        {/* All bets */}
        {(post.betIds?.length ?? 0) > 0 && (
          <View style={tw`mt-4`}>
            <Text style={tw`text-white font-semibold text-lg mb-3`}>
              Bets ({post.betIds?.length})
            </Text>
            {postBets(post, bets).map(b => (
              <View key={b.id} style={tw`mb-3`}>
                <BetDetail bet={b} />
              </View>
            ))}
          </View>
        )}

        {/* Footer stats */}
        <View style={tw`mt-6 pt-4 border-t border-neutral-800`}>
          <Text style={tw`text-gray-400 text-sm`}>
            {post.views} views • {post.tails} tailing
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
