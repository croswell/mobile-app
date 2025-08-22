import { Text, View, Pressable } from "react-native";
import tw from "../lib/tw";
import BottomSheet from "./BottomSheet";
import { useUI } from "../state/ui";
import { User, Bell, Settings, Plus, LogOut, ChevronRight, Book } from "lucide-react-native";

export default function AccountDrawer() {
  const { accountOpen, closeAccount } = useUI();

  const Row = ({ icon, label, onPress, last = false }: any) => (
    <Pressable
      onPress={onPress}
      style={tw`${last ? "" : "border-b border-neutral-800"} py-3`}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={tw`flex-row items-center`}>
        {icon}
        <Text style={tw`text-white text-base ml-3 flex-1`}>{label}</Text>
        <ChevronRight size={18} color="#9CA3AF" />
      </View>
    </Pressable>
  );

  return (
    <BottomSheet open={accountOpen} onClose={closeAccount} initialHeight={300}>
      <Text style={tw`text-white text-xl font-bold mb-3`}>Account</Text>

      <Row icon={<User size={20} color="white" />} label="Profile" onPress={()=>{}} />
      <Row icon={<Bell size={20} color="white" />} label="Notifications" onPress={()=>{}} />
      <Row icon={<Book size={20} color="white" />} label="Synced Books" onPress={()=>{}} />
      <Row icon={<Settings size={20} color="white" />} label="More Settings" onPress={()=>{}} />

      <Pressable
        style={tw`mt-4 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3`}
        onPress={()=>{}}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <View style={tw`flex-row items-center justify-center`}>
          <LogOut size={18} color="#ef4444" />
          <Text style={tw`text-red-500 text-base ml-2`}>Sign out</Text>
        </View>
      </Pressable>
    </BottomSheet>
  );
}
