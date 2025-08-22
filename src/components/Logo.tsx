import React from 'react';
import { View, Text } from 'react-native';
import tw from '../lib/tw';

interface LogoProps {
  book: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ book, size = 'medium' }: LogoProps) {
  // Define size mappings
  const sizeMap = {
    small: { width: 24, height: 24, fontSize: 10 },
    medium: { width: 32, height: 32, fontSize: 12 },
    large: { width: 40, height: 40, fontSize: 14 }
  };

  const { width, height, fontSize } = sizeMap[size];

  // Function to get logo color and initials based on sportsbook
  const getLogoStyle = (bookName: string) => {
    const normalizedName = bookName.toLowerCase();
    
    if (normalizedName.includes('draftkings') || normalizedName.includes('dk')) {
      return { backgroundColor: '#00D4AA', color: '#000000', initials: 'DK' };
    } else if (normalizedName.includes('fanduel') || normalizedName.includes('fd')) {
      return { backgroundColor: '#00D4AA', color: '#000000', initials: 'FD' };
    } else if (normalizedName.includes('prizepicks') || normalizedName.includes('pp')) {
      return { backgroundColor: '#8B5CF6', color: '#FFFFFF', initials: 'PP' };
    } else if (normalizedName.includes('underdog') || normalizedName.includes('ud')) {
      return { backgroundColor: '#F97316', color: '#FFFFFF', initials: 'UD' };
    } else if (normalizedName.includes('sleeper') || normalizedName.includes('sl')) {
      return { backgroundColor: '#3B82F6', color: '#FFFFFF', initials: 'SL' };
    } else if (normalizedName.includes('betmgm') || normalizedName.includes('mgm')) {
      return { backgroundColor: '#F59E0B', color: '#000000', initials: 'BM' };
    } else {
      // Default fallback
      return { backgroundColor: '#6B7280', color: '#FFFFFF', initials: bookName.substring(0, 2).toUpperCase() };
    }
  };

  const logoStyle = getLogoStyle(book);

  return (
    <View 
      style={[
        tw`rounded-md items-center justify-center`,
        {
          width,
          height,
          backgroundColor: logoStyle.backgroundColor,
        }
      ]}
    >
      <Text 
        style={[
          tw`font-bold`,
          {
            color: logoStyle.color,
            fontSize,
          }
        ]}
      >
        {logoStyle.initials}
      </Text>
    </View>
  );
}
