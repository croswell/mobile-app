import { View, Text, Pressable, Image } from "react-native";
import tw from "../lib/tw";
import type { PartnerT } from "../mocks/models";

interface PartnerCardProps {
  partner: PartnerT;
  onPress?: () => void;
}

export default function PartnerCard({ partner, onPress }: PartnerCardProps) {
  // Function to get avatar source
  const getAvatarSource = (avatar: string) => {
    switch (avatar) {
      case 'secured-picks':
        return require('../../assets/images/secured-picks.jpg');
      case 'hammering-hank':
        return require('../../assets/images/hammering-hank.jpg');
      case 'chilly-bets':
        return require('../../assets/images/chilly-bets.jpg');
      default:
        return { uri: avatar };
    }
  };

  return (
    <Pressable 
      onPress={onPress}
      style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-4 mr-4 min-w-[200px]`}
    >
      <View style={tw`items-center`}>
        {partner.avatar ? (
          <Image 
            source={getAvatarSource(partner.avatar)}
            style={tw`w-16 h-16 rounded-full mb-3`} 
          />
        ) : (
          <View style={tw`w-16 h-16 rounded-full bg-neutral-800 mb-3 items-center justify-center`}>
            <Text style={tw`text-neutral-400 text-2xl`}>👤</Text>
          </View>
        )}
        
        <Text style={tw`text-white font-semibold text-base text-center mb-2`}>
          {partner.name}
        </Text>
        
        <Pressable 
          style={tw`bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 w-full items-center`}
          onPress={(e) => {
            e.stopPropagation();
            // Handle view profile action
          }}
        >
          <Text style={tw`text-neutral-50 text-sm font-medium`}>View Profile</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
