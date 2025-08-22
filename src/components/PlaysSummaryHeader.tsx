import { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { financeApi } from "../lib/mockFinance";
import type { LinkedAccount, EarningsPoint } from "../types/finance";
import Sparkline from "./Sparkline";
import AccountsDrawer from "./AccountsDrawer";

export default function PlaysSummaryHeader() {
  const [bankroll, setBankroll] = useState(0);
  const [atRisk, setAtRisk] = useState(0);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);

  const [history, setHistory] = useState<EarningsPoint[]>([]);
  const [showAccountsDrawer, setShowAccountsDrawer] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());

  const load = async () => {
    const [accs, br, risk, hist] = await Promise.all([
      financeApi.getAccounts(),
      financeApi.getTotalBankroll(),
      financeApi.getAtRisk(),
      financeApi.getEarningsHistory(7),
    ]);
    setAccounts(accs); setBankroll(br); setAtRisk(risk); setHistory(hist);
    setLastSynced(new Date());
  };

  useEffect(() => { load(); }, []);

  const cash = accounts.reduce((s,a)=>s+a.cashBalance,0);
  const profitThisWeek = history.reduce((s,p)=>s+p.profit,0);

  return (
    <View style={{ backgroundColor: "#0f172a", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#334155", marginBottom: 12 }}>


      {/* Top row: bankroll + at risk */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <View>
          <Text style={{ color: "#94a3b8" }}>Total bankroll →</Text>
          <Text style={{ color: "#22c55e", fontSize: 24, fontWeight: "800" }}>${bankroll.toFixed(2)}</Text>
        </View>
        <View>
          <Text style={{ color: "#94a3b8" }}>At risk →</Text>
          <Text style={{ color: "#94a3b8", fontSize: 24, fontWeight: "800" }}>${atRisk.toFixed(2)}</Text>
        </View>
      </View>

      {/* Mini chart */}
      <View style={{ backgroundColor: "white", borderRadius: 12, overflow: "hidden", padding: 12, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Text style={{ fontWeight: "700" }}>This week</Text>
          <Text style={{ color: "#2563eb", fontWeight: "700" }}>View more →</Text>
        </View>
        <Sparkline data={history} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ fontWeight: "700", color: profitThisWeek >= 0 ? "#16a34a" : "#dc2626" }}>
            {profitThisWeek >= 0 ? "+" : "-"}${Math.abs(profitThisWeek).toFixed(2)}
          </Text>
          {/* simple placeholders; wire real ROI/record later */}
          <Text>ROI — • Record —</Text>
        </View>
      </View>

      {/* Accounts row */}
      <Text style={{ color: "white", fontWeight: "700", marginBottom: 8 }}>Your accounts</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {accounts.map(a => (
          <View key={a.id} style={{ marginRight: 10, alignItems: "center" }}>
            <Pressable onPress={() => setShowAccountsDrawer(true)} style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", backgroundColor: "#1e293b" }}>
              <Image source={{ uri: a.logo }} style={{ width: 36, height: 36 }} />
            </Pressable>
          </View>
        ))}
        <View style={{ marginLeft: "auto" }}>
          <Text style={{ color: "#94a3b8" }}>Last synced</Text>
          <Text style={{ color: "white", fontWeight: "700" }}>{lastSynced.toLocaleTimeString()}</Text>
        </View>
      </View>

      {/* Accounts Drawer */}
      <AccountsDrawer 
        accounts={accounts}
        visible={showAccountsDrawer}
        onClose={() => setShowAccountsDrawer(false)}
      />
    </View>
  );
}
