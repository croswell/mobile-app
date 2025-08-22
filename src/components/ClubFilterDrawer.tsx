import { View, Text, Pressable, FlatList } from "react-native";
import tw from "../lib/tw";
import BottomSheet from "./BottomSheet";
import { useUI } from "../state/ui";
import { useData } from "../state/data";
import { useFeedFilter } from "../state/feedFilter";
import { Check } from "lucide-react-native";

export default function ClubFilterDrawer() {
  const { clubFilterOpen, closeClubFilter } = useUI();
  const { partners } = useData();
  const { selected, setSelected } = useFeedFilter();

  // Options: default + followed partners first, then the rest
  const followed = partners.filter(p => p.isSubscribed);
  const others = partners.filter(p => !p.isSubscribed);
  const options = ["All", ...followed.map(p=>p.name), ...others.map(p=>p.name)];

  return (
    <BottomSheet open={clubFilterOpen} onClose={closeClubFilter} initialHeight={300}>
      <Text style={tw`text-white text-xl font-bold mb-4`}>Filter feed</Text>
      <FlatList
        data={options}
        keyExtractor={(s) => s}
        renderItem={({ item, index }) => {
          const active = selected === item;
          return (
            <Pressable
              onPress={() => { setSelected(item); closeClubFilter(); }}
              style={tw`${index < options.length-1 ? "border-b border-neutral-800" : ""} py-3`}
              accessibilityRole="button" 
              accessibilityLabel={`Filter by ${item}`}
            >
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-white text-base flex-1`}>{item}</Text>
                {active ? <Check size={18} color="#22C55E" /> : null}
              </View>
            </Pressable>
          );
        }}
      />
    </BottomSheet>
  );
}
