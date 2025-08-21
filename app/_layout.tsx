import { Tabs } from "expo-router";
export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen name="index"    options={{ title: "Home" }} />
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen name="plays"    options={{ title: "My Plays" }} />
      <Tabs.Screen name="account"  options={{ title: "Account" }} />
    </Tabs>
  );
}
