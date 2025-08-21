import { View, Text, Pressable } from "react-native";
import tw from "@/lib/tw";
import { useData } from "../src/state/data";

export default function Home() {
  const { partners, posts, bets } = useData();
  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold mb-2`}>Home</Text>
      <Text style={tw`text-base mb-4`}>
        {partners.length} partners • {posts.length} posts • {bets.length} bets
      </Text>
      <Pressable style={tw`bg-brand rounded-lg py-3 px-4`}>
        <Text style={tw`text-white text-center`}>it works</Text>
      </Pressable>
    </View>
  );
}
