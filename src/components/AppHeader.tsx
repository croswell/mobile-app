import { View, Image, Pressable, Text } from "react-native";
import tw from "../lib/tw";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserCircle } from "lucide-react-native";
import { useUI } from "../state/ui";

export default function AppHeader() {
  const { top } = useSafeAreaInsets();
  const ui = useUI();

  return (
    <View style={[tw`bg-neutral-950`, { paddingTop: top }]}>
      <View style={tw`flex-row items-center px-4 pb-4`}>
        <Image
          source={require("../../assets/images/ios-app-icon.png")}
          style={tw`w-10 h-10 rounded-lg`}
          accessible
          accessibilityLabel="DubClub"
        />
        <View style={tw`ml-auto`} />
        <Pressable
          onPress={ui.toggleAccount}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Account and settings"
          style={tw`w-10 h-10 items-center justify-center rounded-full`}
        >
          <UserCircle size={28} color="#737373" />
        </Pressable>
      </View>
    </View>
  );
}
