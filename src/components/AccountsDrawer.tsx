import { View, Text, Pressable, Modal } from "react-native";
import type { LinkedAccount } from "../types/finance";

type Props = {
  accounts: LinkedAccount[];
  visible: boolean;
  onClose: () => void;
};

export default function AccountsDrawer({ accounts, visible, onClose }: Props) {
  const totalCash = accounts.reduce((sum, account) => sum + account.cashBalance, 0);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={{ 
          backgroundColor: '#0f1115', 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20,
          borderWidth: 1,
          borderColor: '#1f2430',
          padding: 20,
          paddingBottom: 40
        }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>Your Accounts</Text>
            <Pressable onPress={onClose} style={{ padding: 8 }}>
              <Text style={{ color: '#9ca3af', fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>

          {/* Total Cash */}
          <View style={{ 
            backgroundColor: '#1f2430', 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 20,
            alignItems: 'center'
          }}>
            <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 4 }}>Total Cash</Text>
            <Text style={{ color: '#22c55e', fontSize: 28, fontWeight: '800' }}>${totalCash.toFixed(2)}</Text>
          </View>

          {/* Account List */}
          {accounts.map((account) => (
            <View key={account.id} style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#1f2430'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 8, 
                  backgroundColor: '#111318',
                  marginRight: 12,
                  overflow: 'hidden'
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 16, 
                    fontWeight: '600',
                    textAlign: 'center',
                    lineHeight: 40
                  }}>
                    {account.name.charAt(0)}
                  </Text>
                </View>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  {account.name}
                </Text>
              </View>
              <Text style={{ color: '#22c55e', fontSize: 18, fontWeight: '700' }}>
                ${account.cashBalance.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}
