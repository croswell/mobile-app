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
      case 'stosh-picks':
        return require('../../assets/images/stosh-picks.png');
      case 'the-moonshot':
        return require('../../assets/images/the-moonshot.jpg');
      case 'only-parlays':
        return require('../../assets/images/only-parlays.png');
      default:
        return { uri: avatar };
    }
  };

  return (
    <Pressable 
      onPress={onPress}
      style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-6 mr-4 min-w-[200px] active:bg-neutral-800`}
    >
      <View style={tw`items-center`}>
        {partner.avatar ? (
          <View style={tw`w-16 h-16 rounded-xl bg-white mb-4 overflow-hidden`}>
            <Image 
              source={getAvatarSource(partner.avatar)}
              style={tw`w-full h-full`} 
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={tw`w-16 h-16 rounded-xl bg-neutral-800 mb-4 items-center justify-center`}>
            <Text style={tw`text-neutral-400 text-2xl`}>👤</Text>
          </View>
        )}
        
        <Text style={tw`text-white font-semibold text-base text-center mb-3`}>
          {partner.name}
        </Text>
        
        <Text style={tw`text-neutral-400 text-sm text-center`}>
          {Math.floor(Math.random() * 500) + 50} subscribers
        </Text>
      </View>
    </Pressable>
  );
}
