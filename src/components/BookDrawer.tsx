import { View, Text, Pressable, FlatList } from "react-native";
import tw from "../lib/tw";
import BottomSheet from "./BottomSheet";
import { useUI } from "../state/ui";
import { ChevronRight, RefreshCw } from "lucide-react-native";
import Logo from "./Logo";

export default function BookDrawer() {
  const { bookDrawerOpen, closeBookDrawer } = useUI();

  // Sportsbook data - only showing synced accounts: DraftKings, FanDuel, PrizePicks
  const sportsbooks = [
    { id: "1", name: "DraftKings", balance: 250, isActive: true },
    { id: "2", name: "FanDuel", balance: 200, isActive: true },
    { id: "3", name: "PrizePicks", balance: 50, isActive: true },
  ];

  const totalBalance = sportsbooks.reduce((sum, book) => sum + book.balance, 0);

  const Row = ({ sportsbook, onPress, last = false }: any) => (
    <Pressable
      onPress={onPress}
      style={tw`${last ? "" : "border-b border-neutral-800"} py-3`}
      accessibilityRole="button"
      accessibilityLabel={`Select ${sportsbook.name} sportsbook`}
    >
      <View style={tw`flex-row items-center`}>
        <Logo book={sportsbook.name} size="small" />
        <View style={tw`ml-3 flex-1`}>
          <Text style={tw`text-white text-base font-medium`}>{sportsbook.name}</Text>
        </View>
        <Text style={tw`text-white text-base font-medium mr-3`}>
          ${sportsbook.balance.toFixed(2)}
        </Text>
        <ChevronRight size={16} color="#9CA3AF" />
      </View>
    </Pressable>
  );

  return (
    <BottomSheet open={bookDrawerOpen} onClose={closeBookDrawer} initialHeight={300}>
      <Text style={tw`text-white text-xl font-bold mb-4`}>Select Sportsbook</Text>
      
      <FlatList
        data={sportsbooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Row 
            sportsbook={item} 
            onPress={() => {
              // TODO: Implement sportsbook selection logic
              closeBookDrawer();
            }}
            last={index === sportsbooks.length - 1}
          />
        )}
      />
      
      {/* Resync Accounts button */}
      <Pressable
        style={tw`mt-4 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3`}
        onPress={() => {
          // TODO: Implement resync all accounts functionality
          console.log('Resyncing all accounts');
        }}
        accessibilityRole="button"
        accessibilityLabel="Resync all accounts"
      >
        <View style={tw`flex-row items-center justify-center`}>
          <RefreshCw size={18} color="#fafafa" />
          <Text style={tw`text-neutral-50 text-base ml-2 font-medium`}>Resync Accounts</Text>
        </View>
      </Pressable>
      
      {/* Add New Account button */}
      <Pressable
        style={tw`mt-3 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3`}
        onPress={() => {
          // TODO: Implement add new account functionality
          closeBookDrawer();
        }}
        accessibilityRole="button"
        accessibilityLabel="Add new account"
      >
        <View style={tw`flex-row items-center justify-center`}>
          {/* Removed BookOpen size={18} color="#22C55E" */}
          <Text style={tw`text-green-500 text-base ml-2 font-medium`}>Add Account</Text>
        </View>
      </Pressable>
    </BottomSheet>
  );
}
