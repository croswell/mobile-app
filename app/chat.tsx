import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, MessageCircle } from "lucide-react-native";
import tw from "../src/lib/tw";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[tw`flex-1 bg-neutral-950`, { paddingTop: top }]}>
      {/* Header with back arrow */}
      <View style={tw`flex-row items-center px-4 py-4 border-b border-neutral-800`}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={tw`w-10 h-10 items-center justify-center rounded-full`}
        >
          <ArrowLeft size={24} color="white" />
        </Pressable>
        <Text style={tw`ml-3 text-white text-xl font-bold`}>Messages</Text>
      </View>

      {/* Empty state */}
      <View style={tw`flex-1 items-center justify-center px-8`}>
        <MessageCircle size={64} color="#737373" />
        <Text style={tw`text-neutral-400 text-lg font-medium mt-4 text-center`}>
          No messages yet
        </Text>
        <Text style={tw`text-neutral-500 text-base mt-2 text-center`}>
          When you start conversations with other users, they'll appear here
        </Text>
      </View>
    </View>
  );
}
