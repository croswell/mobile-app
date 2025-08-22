import { View, Image, Pressable, Text, Animated } from "react-native";
import tw from "../lib/tw";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserCircle, ChevronDown } from "lucide-react-native";
import { useUI } from "../state/ui";
import { useFeedFilter } from "../state/feedFilter";
import { useData } from "../state/data";
import { useEffect, useRef } from "react";

export default function AppHeader() {
  const { top } = useSafeAreaInsets();
  const { clubFilterOpen, openClubFilter, toggleAccount } = useUI();
  const { selected } = useFeedFilter();
  const { partners } = useData();
  const chevronRotation = useRef(new Animated.Value(0)).current;

  // Animate chevron rotation when drawer opens/closes
  useEffect(() => {
    Animated.timing(chevronRotation, {
      toValue: clubFilterOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [clubFilterOpen]);

  const rotateInterpolate = chevronRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[tw`bg-neutral-950 border-b border-neutral-800`, { paddingTop: top }]}>
      <View style={tw`flex-row items-center px-4 pb-6`}>
        <Image
          source={require("../../assets/images/ios-app-icon.png")}
          style={tw`w-10 h-10 rounded-lg`}
          accessible
          accessibilityLabel="DubClub"
        />
        
        <Pressable
          onPress={openClubFilter}
          accessibilityRole="button"
          accessibilityLabel="Choose DubClub filter"
          style={tw`ml-3 flex-row items-center max-w-[60%]`}
          hitSlop={10}
        >
          <Text
            numberOfLines={1}
            style={tw`text-white text-xl font-bold mr-1`}
          >
            {selected === "All" ? "All DubClubs" : selected}
          </Text>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <ChevronDown size={24} color="white" />
          </Animated.View>
        </Pressable>
        
        <View style={tw`ml-auto`} />
        <Pressable
          onPress={toggleAccount}
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
