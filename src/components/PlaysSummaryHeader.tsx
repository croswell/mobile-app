import { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import tw from "../lib/tw";
import { financeApi } from "../lib/mockFinance";
import type { LinkedAccount } from "../types/finance";
import { useUI } from "../state/ui";
import { BookOpen } from "lucide-react-native";

export default function PlaysSummaryHeader() {
  const [bankroll, setBankroll] = useState(0);
  const [atRisk, setAtRisk] = useState(0);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  
  const { openBookDrawer } = useUI();

  const load = async () => {
    const [accs, br, risk] = await Promise.all([
      financeApi.getAccounts(),
      financeApi.getTotalBankroll(),
      financeApi.getAtRisk(),
    ]);
    setAccounts(accs); setBankroll(br); setAtRisk(risk);
    setLastSynced(new Date());
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={tw`bg-neutral-900 p-4 rounded-2xl border border-neutral-800 mb-6`}>
      {/* Top row: bankroll + at risk */}
      <View style={tw`flex-row justify-between mb-6`}>
        <View>
          <Text style={tw`text-neutral-400 mb-1`}>Total Bankroll</Text>
          <Text style={tw`text-brand text-2xl font-bold`}>${bankroll.toFixed(2)}</Text>
        </View>
        <View>
          <Text style={tw`text-neutral-400 mb-1`}>At Risk</Text>
          <Text style={tw`text-neutral-300 text-2xl font-bold`}>${atRisk.toFixed(2)}</Text>
        </View>
      </View>

      {/* Accounts row */}
      <View style={tw`flex-row items-center`}>
        {accounts.map(a => (
          <View key={a.id} style={tw`mr-2.5 items-center`}>
            <Pressable 
              onPress={openBookDrawer} 
              style={tw`w-8 h-8 rounded-md overflow-hidden bg-neutral-800`}
              accessibilityRole="button"
              accessibilityLabel={`Open book drawer for ${a.name}`}
            >
              <Image source={{ uri: a.logo }} style={tw`w-8 h-8`} />
            </Pressable>
          </View>
        ))}
        
        <View style={tw`ml-auto`}>
          <Pressable
            style={tw`bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2`}
            onPress={openBookDrawer}
            accessibilityRole="button"
            accessibilityLabel="Manage accounts"
          >
            <Text style={tw`text-neutral-300 text-sm font-medium`}>Manage</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
