import { View, Text } from "react-native";
import tw from "../lib/tw";

export default function Plays() {
  return (
    <View style={tw`flex-1 bg-neutral-950 p-4`}>
      <Text style={tw`text-2xl font-bold text-neutral-100 mb-4`}>My Plays</Text>
      <Text style={tw`text-neutral-300`}>Track your betting history and performance.</Text>
    </View>
  );
}
