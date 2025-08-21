import { Text, View, Pressable } from "react-native";
import tw from "../lib/tw";
import BottomSheet from "./BottomSheet";
import { useUI } from "../state/ui";
import { User, Bell, Settings, Plus, LogOut, ChevronRight } from "lucide-react-native";

export default function AccountDrawer() {
  const { accountOpen, closeAccount } = useUI();

  const Row = ({ icon, label, onPress, last = false }: any) => (
    <Pressable
      onPress={onPress}
      style={tw`${last ? "" : "border-b border-neutral-800"} py-4`}
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
    <BottomSheet open={accountOpen} onClose={closeAccount}>
      <Text style={tw`text-white text-xl font-bold mb-4`}>Account</Text>

      <Row icon={<User size={20} color="white" />} label="Profile" onPress={()=>{}} />
      <Row icon={<Bell size={20} color="white" />} label="Notifications" onPress={()=>{}} />
      <Row icon={<Settings size={20} color="white" />} label="More Settings" onPress={()=>{}} />
      <Row icon={<Plus size={20} color="white" />} label="Create your own DubClub" onPress={()=>{}} last />

      <Pressable
        style={tw`mt-6 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3`}
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
