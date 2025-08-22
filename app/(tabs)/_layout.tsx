import { Tabs } from "expo-router";
import { Home, Search, DollarSign } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: "#0a0a0a",
          borderTopColor: "#262626",
          borderTopWidth: 1,
          paddingTop: 8,
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

    </Tabs>
  );
}
