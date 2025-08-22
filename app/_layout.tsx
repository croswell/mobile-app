import { Tabs } from "expo-router";
import { Home, Search, DollarSign } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StatusBar, Pressable } from "react-native";
import tw from "../src/lib/tw";
import AppHeader from "../src/components/AppHeader";
import AccountDrawer from "../src/components/AccountDrawer";
import ClubFilterDrawer from "../src/components/ClubFilterDrawer";
import BottomSheet from "../src/components/BottomSheet";
import { useEmojiPicker } from "../src/state/emojiPicker";

export default function RootLayout() {
  const { showEmojiPicker, closeEmojiPicker, addEmojiToPost } = useEmojiPicker();
  
  // Available emojis for selection
  const availableEmojis = ['🚀', '⚡', '💯', '🎯', '🔥', '💪', '✅', '💎', '🏆', '🎊', '👏', '❤️'];

  const handleSelectEmoji = (emoji: string) => {
    // Add the emoji to the current post
    addEmojiToPost(emoji);
  };

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={tw`flex-1 bg-neutral-950`}>
        <AppHeader />
        
        <View style={tw`flex-1`}>
          <Tabs 
            screenOptions={{ 
              headerShown: false,
                          tabBarStyle: { 
              backgroundColor: "#0a0a0a",
              borderTopColor: "#262626",
              borderTopWidth: 1,
              zIndex: 1000,
              elevation: 1000,
            },
              tabBarActiveTintColor: "#00D639",
              tabBarInactiveTintColor: "#737373",
            }}
          >
            <Tabs.Screen 
              name="index" 
              options={{ 
                title: "Home",
                tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
              }} 
            />
            <Tabs.Screen 
              name="discover" 
              options={{ 
                title: "Discover",
                tabBarIcon: ({ color, size }) => <Search size={size} color={color} />
              }} 
            />
            <Tabs.Screen 
              name="plays" 
              options={{ 
                title: "My Plays",
                tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />
              }} 
            />
            <Tabs.Screen 
              name="modal" 
              options={{ 
                href: null
              }} 
            />
            <Tabs.Screen 
              name="+not-found" 
              options={{ 
                href: null
              }} 
            />
          </Tabs>
        </View>
        <AccountDrawer />
        <ClubFilterDrawer />
        
        {/* Global Emoji Picker Bottom Sheet */}
        <BottomSheet open={showEmojiPicker} onClose={closeEmojiPicker} initialHeight={280}>
          <Text style={tw`text-white text-xl font-bold mb-4`}>Add Reaction</Text>
          
          <View style={tw`flex-row flex-wrap gap-3`}>
            {availableEmojis.map((emoji) => (
              <Pressable
                key={emoji}
                style={tw`w-14 h-14 items-center justify-center rounded-xl bg-neutral-800`}
                onPress={() => handleSelectEmoji(emoji)}
              >
                <Text style={tw`text-2xl`}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}
