import { View, Text, Pressable } from "react-native";
import tw from "@/lib/tw";
export default function Home() {
  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>Home</Text>
      <Pressable style={tw`bg-brand rounded-lg py-3 px-4`}>
        <Text style={tw`text-white text-center`}>it works</Text>
      </Pressable>
    </View>
  );
}
