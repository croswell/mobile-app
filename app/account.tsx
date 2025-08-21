import { View, Text } from "react-native";
import tw from "../lib/tw";

export default function Account() {
  return (
    <View style={tw`flex-1 bg-neutral-950 p-4`}>
      <Text style={tw`text-2xl font-bold text-neutral-100 mb-4`}>Account</Text>
      <Text style={tw`text-neutral-300`}>Manage your profile and preferences.</Text>
    </View>
  );
}
