import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { UserCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '../lib/tw';

interface CustomHeaderProps {
  onAccountPress: () => void;
}

export default function CustomHeader({ onAccountPress }: CustomHeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={tw`bg-neutral-950`}>
      {/* Top padding to account for status bar */}
      <View style={{ height: insets.top }} />
      
      {/* Header content with significant padding */}
      <View style={tw`flex-row items-center justify-between px-5`}>
        {/* App Icon - Left Side with extra spacing */}
        <View style={tw`w-8 h-8 rounded-md overflow-hidden`}>
          <Image 
            source={require('../../assets/images/ios-app-icon.png')}
            style={tw`w-8 h-8`}
            resizeMode="cover"
          />
        </View>
        
        {/* Right Side - Account Icon with extra spacing */}
        <TouchableOpacity onPress={onAccountPress} style={tw`p-2`}>
          <UserCircle size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
