import { Tabs, Stack } from "expo-router";
import { Home, Search, DollarSign } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StatusBar, Pressable } from "react-native";
import tw from "../src/lib/tw";
import AppHeader from "../src/components/AppHeader";
import AccountDrawer from "../src/components/AccountDrawer";
import ClubFilterDrawer from "../src/components/ClubFilterDrawer";
import BookDrawer from "../src/components/BookDrawer";
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
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="post-modal" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right'
            }} 
          />
        </Stack>
        <AccountDrawer />
        <ClubFilterDrawer />
        <BookDrawer />
        
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
