import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '../lib/tw';
import type { BetT } from "../mocks/models";
import { prettyOdds, whenReadable } from "../lib/format";
import Logo from "./Logo";
import GradientButton from './GradientButton';

type Props = {
  game: string;
  startTime: Date;
  league: BetT["league"];
  bets: BetT[];
};

// pick the most favorable odds for tailing: highest positive, otherwise closest to zero negative
function bestByMarket(bets: BetT[], market: string) {
  const candidates = bets.filter(b => b.market === market);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  
  return candidates.reduce((best, cur) => {
    const score = cur.odds >= 0 ? cur.odds : -Math.abs(cur.odds);
    const bestScore = best.odds >= 0 ? best.odds : -Math.abs(best.odds);
    return score > bestScore ? cur : best;
  });
}

export default function GameRow({ game, startTime, league, bets }: Props) {
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

  const ml = bestByMarket(bets, "Moneyline");
  const sp = bestByMarket(bets, "Spread");
  const tot = bestByMarket(bets, "Total");
  
  // Get player props and parlay bets
  const playerProps = bets.filter(b => b.market.toLowerCase().includes('player'));
  const parlayBets = bets.filter(b => b.market.toLowerCase() === 'parlay');

  return (
    <View style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4`}>
      <View style={tw`flex-row justify-between mb-1`}>
        <Text style={tw`font-semibold text-neutral-100`}>{game}</Text>
        <Text style={tw`text-xs text-neutral-400`}>{whenReadable(startTime)}</Text>
      </View>
      <Text style={tw`text-xs text-neutral-400 mb-3`}>{league}</Text>

      <View style={tw`flex-row gap-2 flex-wrap`}>
        {ml && (
          <View style={tw`border border-neutral-700 rounded-lg px-3 py-2 bg-neutral-800`}>
            <Text style={tw`text-xs text-neutral-400 mb-1`}>Moneyline</Text>
            <Text style={tw`font-semibold text-neutral-100`}>{prettyOdds(ml.odds)}</Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Logo book={getBookDisplayName(ml.bookId)} size="small" />
              <Text style={tw`text-xs text-neutral-400 ml-2`}>{getBookDisplayName(ml.bookId)}</Text>
            </View>
          </View>
        )}
        {sp && (
          <View style={tw`border border-neutral-700 rounded-lg px-3 py-2 bg-neutral-800`}>
            <Text style={tw`text-xs text-neutral-400 mb-1`}>Spread</Text>
            <Text style={tw`font-semibold text-neutral-100`}>{sp.line} • {prettyOdds(sp.odds)}</Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Logo book={getBookDisplayName(sp.bookId)} size="small" />
              <Text style={tw`text-xs text-neutral-400 ml-2`}>{getBookDisplayName(sp.bookId)}</Text>
            </View>
          </View>
        )}
        {tot && (
          <View style={tw`border border-neutral-700 rounded-lg px-3 py-2 bg-neutral-800`}>
            <Text style={tw`text-xs text-neutral-400 mb-1`}>Total</Text>
            <Text style={tw`font-semibold text-neutral-100`}>{tot.line} • {prettyOdds(tot.odds)}</Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Logo book={getBookDisplayName(tot.bookId)} size="small" />
              <Text style={tw`text-xs text-neutral-400 ml-2`}>{getBookDisplayName(tot.bookId)}</Text>
            </View>
          </View>
        )}
        
        {/* Show first player prop if available */}
        {playerProps.length > 0 && (
          <View style={tw`border border-blue-700 rounded-lg px-3 py-2 bg-blue-900`}>
            <Text style={tw`text-xs text-blue-300 mb-1`}>Player Prop</Text>
            <Text style={tw`font-semibold text-neutral-100`}>{playerProps[0].market} {playerProps[0].line}</Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Logo book={getBookDisplayName(playerProps[0].bookId)} size="small" />
              <Text style={tw`text-xs text-blue-300 ml-2`}>{getBookDisplayName(playerProps[0].bookId)}</Text>
            </View>
          </View>
        )}
        
        {/* Show first parlay if available */}
        {parlayBets.length > 0 && (
          <View style={tw`border border-purple-700 rounded-lg px-3 py-2 bg-purple-900`}>
            <Text style={tw`text-xs text-purple-300 mb-1`}>Parlay</Text>
            <Text style={tw`font-semibold text-neutral-100`}>{parlayBets[0].line} • {prettyOdds(parlayBets[0].odds)}</Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Logo book={getBookDisplayName(parlayBets[0].bookId)} size="small" />
              <Text style={tw`text-xs text-purple-300 ml-2`}>{getBookDisplayName(parlayBets[0].bookId)}</Text>
            </View>
          </View>
        )}
      </View>

      <GradientButton
        onPress={() => {
          // Handle bet action
          console.log('Bet placed on game!');
        }}
        title="BET NOW"
        style={tw`mt-3`}
      />
    </View>
  );
}
