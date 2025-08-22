import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '../lib/tw';
import type { BetT } from "../mocks/models";
import { prettyOdds, whenReadable } from "../lib/format";
import GradientButton from './GradientButton';
import Logo from "./Logo";

interface BetCardProps {
  bet: BetT;
  onPress?: () => void;
}

export default function BetCard({ bet, onPress }: BetCardProps) {
  // Helper function to map book ID to display name
  const getBookDisplayName = (bookId: string) => {
    const bookMap: Record<string, string> = {
      'dk': 'DraftKings',
      'fd': 'FanDuel',
      'pp': 'PrizePicks',
      'ud': 'Underdog',
      'sl': 'Sleeper',
      'mgm': 'BetMGM'
    };
    return bookMap[bookId] || bookId;
  };

  // Function to get bet type label with appropriate styling
  const getBetTypeLabel = (bet: BetT) => {
    const market = bet.market.toLowerCase();
    
    if (market === 'parlay') {
      return 'Parlay';
    } else if (market.includes('player')) {
      return 'Player Prop';
    } else if (market === 'moneyline') {
      return 'Moneyline';
    } else if (market === 'spread') {
      return 'Spread';
    } else if (market === 'total') {
      return 'Total';
    } else {
      return bet.market;
    }
  };

  // Function to get bet type color
  const getBetTypeColor = (bet: BetT) => {
    const market = bet.market.toLowerCase();
    
    if (market === 'parlay') {
      return 'bg-purple-600';
    } else if (market.includes('player')) {
      return 'bg-blue-600';
    } else if (market === 'moneyline') {
      return 'bg-green-600';
    } else if (market === 'spread') {
      return 'bg-orange-600';
    } else if (market === 'total') {
      return 'bg-red-600';
    } else {
      return 'bg-neutral-600';
    }
  };

  return (
    <Pressable 
      onPress={onPress}
      style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-4 mr-4 min-w-[280px]`}
    >
      {/* Bet type badge */}
      <View style={tw`mb-3`}>
        <View style={tw`${getBetTypeColor(bet)} rounded-full px-3 py-1 self-start`}>
          <Text style={tw`text-white text-xs font-bold`}>
            {getBetTypeLabel(bet)}
          </Text>
        </View>
      </View>
      
      {/* Game and league info */}
      <View style={tw`mb-3`}>
        <Text style={tw`text-base text-neutral-100 font-semibold mb-1`} numberOfLines={2}>
          {bet.game}
        </Text>
        <Text style={tw`text-sm text-neutral-400 mb-1`}>{bet.league}</Text>
        <Text style={tw`text-xs text-neutral-500`}>{whenReadable(bet.startTime)}</Text>
      </View>

      {/* Bet details */}
      <View style={tw`mb-3`}>
        <Text style={tw`text-base text-neutral-200 mb-2`}>
          {bet.market} {bet.line}
        </Text>
        <Text style={tw`text-lg text-white font-bold`}>
          {prettyOdds(bet.odds)}
        </Text>
      </View>

      {/* Book info */}
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Logo book={getBookDisplayName(bet.bookId)} size="small" />
          <Text style={tw`text-neutral-300 ml-2 text-sm`}>
            {getBookDisplayName(bet.bookId)}
          </Text>
        </View>
        
        <GradientButton
          onPress={() => {
            // Handle bet action
            console.log('Bet placed!');
          }}
          title="BET"
          style={tw`px-3 py-2`}
        />
      </View>
    </Pressable>
  );
}
