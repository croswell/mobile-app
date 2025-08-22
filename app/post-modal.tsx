import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import tw from "../src/lib/tw";
import { useData } from "../src/state/data";
import { when } from "../src/lib/format";
import BetDetail from "../src/components/BetDetail";
import ParsedBetDetail from "../src/components/ParsedBetDetail";
import { postBets } from "../src/lib/post";
import { ArrowLeft } from "lucide-react-native";
import ImageGallery from "../src/components/ImageGallery";

export default function PostModal() {
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
        return require('../assets/images/secured-picks.jpg');
      case 'hammering-hank':
        return require('../assets/images/hammering-hank.jpg');
      case 'chilly-bets':
        return require('../assets/images/chilly-bets.jpg');
      default:
        return { uri: avatar };
    }
  };

  return (
    <View style={tw`flex-1 bg-neutral-950`}>
      {/* Custom header that overlays the app header */}
      <View style={tw`absolute top-0 left-0 right-0 z-50 bg-neutral-950 pt-16 pb-4 px-4 border-b border-neutral-800`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Pressable 
            onPress={() => router.back()} 
            style={tw`bg-neutral-900 rounded-full p-3`}
          >
            <ArrowLeft size={20} color="#ffffff" />
          </Pressable>
          
          <Text style={tw`text-white font-semibold text-lg`}>
            {partner?.name ?? "Partner"}
          </Text>
          
          {/* Empty view to balance the layout */}
          <View style={tw`w-14 h-14`} />
        </View>
      </View>
      
      <ScrollView style={tw`flex-1 px-4 pt-24`}>
        
        {/* Author info with timestamp */}
        <View style={tw`flex-row items-center mb-4`}>
          {partner?.avatar ? (
            <Image 
              source={getAvatarSource(partner.avatar)}
              style={tw`w-12 h-12 rounded-full mr-3`} 
            />
          ) : null}
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-400 text-sm`}>{when(post.createdAt)}</Text>
          </View>
        </View>

        {/* Post text */}
        {!!post.text && (
          <Text style={tw`text-white text-base leading-6 mb-4`}>
            {post.text}
          </Text>
        )}

        {/* Images - stacked vertically with full width */}
        {(post.attachments ?? []).filter(a => a.type === "image").length > 0 && (
          <View style={tw`mt-3`}>
            {(post.attachments ?? [])
              .filter(a => a.type === "image")
              .map((image, index) => {
                // Handle local placeholder images
                const isLocal = image.url.startsWith('local://');
                const imageSource = isLocal 
                  ? require('../assets/images/secured-picks.jpg') // Fallback image
                  : { uri: image.url };
                
                return (
                  <View key={image.id} style={tw`mb-3`}>
                    <Image 
                      source={imageSource}
                      style={tw`w-full h-64 rounded-2xl`}
                      resizeMode="cover"
                    />
                  </View>
                );
              })}
          </View>
        )}

        {/* All bets */}
        {post.parsed && post.parsed.length > 0 ? (
          <View style={tw`mt-4`}>
            <Text style={tw`text-white font-semibold text-lg mb-3`}>
              Parsed Bet
            </Text>
            {post.parsed.map((parsedBet, index) => (
              <View key={index} style={tw`mb-3`}>
                <ParsedBetDetail parsedBet={parsedBet} />
              </View>
            ))}
          </View>
        ) : (post.betIds?.length ?? 0) > 0 ? (
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
        ) : null}
      </ScrollView>
    </View>
  );
}
