import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import tw from '../lib/tw';

interface RecommendedDubClub {
  id: string;
  name: string;
  avatar?: string;
  isSubscribed: boolean;
}

interface RecommendedDubClubsProps {
  clubs: RecommendedDubClub[];
  onClubPress?: (club: RecommendedDubClub) => void;
}

export default function RecommendedDubClubs({ clubs, onClubPress }: RecommendedDubClubsProps) {
  const recommendedClubs = clubs.filter(club => 
    ['StoshPicks', 'TheMoonshot', 'OnlyParlays'].includes(club.name)
  );

  if (recommendedClubs.length === 0) {
    return null;
  }

  const getClubDisplayName = (clubName: string) => {
    switch (clubName) {
      case 'StoshPicks':
        return 'Stosh Picks';
      case 'TheMoonshot':
        return 'The Moonshot';
      case 'OnlyParlays':
        return 'onlyParlays';
      default:
        return clubName;
    }
  };

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-white text-lg font-bold mb-3`}>Recommended DubClubs</Text>
      
      {/* Test image to see if Image component works at all */}
      <View style={tw`w-32 h-32 bg-blue-500 items-center justify-center mb-4 border-4 border-white`}>
        <Image
          source={require('../../assets/images/stosh-picks.png')}
          style={tw`w-28 h-28`}
          resizeMode="contain"
        />
        <Text style={tw`text-white text-lg font-bold absolute bottom-0`}>TEST IMAGE</Text>
      </View>
      
      <View style={tw`flex-row justify-between`}>
        {recommendedClubs.map((club) => (
          <Pressable
            key={club.id}
            style={tw`items-center flex-1 mx-1`}
            onPress={() => onClubPress?.(club)}
          >
            <View style={tw`w-32 h-32 bg-red-500 items-center justify-center mb-2 border-4 border-yellow-400`}>
              {club.name === 'StoshPicks' && (
                <Image
                  source={require('../../assets/images/stosh-picks.png')}
                  style={tw`w-28 h-28`}
                  resizeMode="contain"
                />
              )}
              {club.name === 'TheMoonshot' && (
                <Image
                  source={require('../../assets/images/the-moonshot.jpg')}
                  style={tw`w-28 h-28`}
                  resizeMode="contain"
                />
              )}
              {club.name === 'OnlyParlays' && (
                <Image
                  source={require('../../assets/images/only-parlays.png')}
                  style={tw`w-28 h-28`}
                  resizeMode="contain"
                />
              )}
              <Text style={tw`text-white text-lg font-bold absolute bottom-0`}>
                {club.name}
              </Text>
            </View>
            <Text style={tw`text-white text-xs text-center font-medium`} numberOfLines={2}>
              {getClubDisplayName(club.name)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
