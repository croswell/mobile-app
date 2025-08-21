import { Tabs } from "expo-router";
import { Home, Search, DollarSign } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StatusBar } from "react-native";
import tw from "../src/lib/tw";
import AppHeader from "../src/components/AppHeader";
import AccountDrawer from "../src/components/AccountDrawer";

export default function RootLayout() {
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
      </View>
    </GestureHandlerRootView>
  );
}
