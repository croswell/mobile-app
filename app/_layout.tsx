import { Tabs } from "expo-router";
import { Home, Search, DollarSign } from "lucide-react-native";
import { useState } from "react";
import CustomHeader from "../src/components/CustomHeader";
import AccountDrawer from "../src/components/AccountDrawer";

export default function RootLayout() {
  const [isAccountDrawerVisible, setIsAccountDrawerVisible] = useState(false);

  const handleAccountPress = () => {
    setIsAccountDrawerVisible(true);
  };

  const handleCloseAccountDrawer = () => {
    setIsAccountDrawerVisible(false);
  };

  return (
    <>
      <CustomHeader onAccountPress={handleAccountPress} />
      <Tabs 
        screenOptions={{ 
          headerShown: false, // Hide default headers since we have custom header
          tabBarStyle: { 
            backgroundColor: "#09090b", // neutral-950
            borderTopColor: "#09090b", // neutral-800
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: "#00D639", // green-500
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
      
      <AccountDrawer 
        visible={isAccountDrawerVisible}
        onClose={handleCloseAccountDrawer}
      />
    </>
  );
}
