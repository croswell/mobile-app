import { Tabs } from "expo-router";
import { Home, Search, DollarSign, User } from "lucide-react-native";

export default function RootLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#09090b" }, // neutral-950
        headerTintColor: "#f3f4f6", // neutral-100
        tabBarStyle: { 
          backgroundColor: "#09090b", // neutral-950
          borderTopColor: "#09090b", // neutral-800
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: "#22c55e", // green-500
        tabBarInactiveTintColor: "#6b7280", // neutral-500
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
        name="account" 
        options={{ 
          title: "Account",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />
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
  );
}
