import { View, Text, Pressable } from "react-native";
import tw from "../lib/tw";
import type { ParsedBetT } from "../mocks/models";
import { formatBetRecommendation } from "../lib/bankroll";
import { Wallet, AlertTriangle } from "lucide-react-native";
import Logo from "./Logo";

export default function ParsedBetDetail({ parsedBet }: { parsedBet: ParsedBetT }) {
  // Function to validate if the bet is possible on the selected sportsbook
  const validateBetCompatibility = (bet: ParsedBetT) => {
    const { book, market, event } = bet;
    
    // Check if the bet contains moneyline components (which aren't available on daily fantasy platforms)
    const hasMoneyline = event.toLowerCase().includes('ml') || 
                        event.toLowerCase().includes('moneyline') ||
                        event.toLowerCase().includes('money line');
    
    // Check if the bet contains spread components (which aren't available on daily fantasy platforms)
    const hasSpread = event.toLowerCase().includes('spread') ||
                     (event.toLowerCase().includes('+') && event.toLowerCase().includes('-') && 
                      !event.toLowerCase().includes('over') && !event.toLowerCase().includes('under'));
    
    // Check if the bet contains total/over-under components (which aren't available on daily fantasy platforms)
    const hasTotal = event.toLowerCase().includes('total') ||
                    (event.toLowerCase().includes('over') && event.toLowerCase().includes('under') && 
                     !event.toLowerCase().includes('points') && !event.toLowerCase().includes('rebounds') && 
                     !event.toLowerCase().includes('assists') && !event.toLowerCase().includes('threes') &&
                     !event.toLowerCase().includes('yards') && !event.toLowerCase().includes('receptions') &&
                     !event.toLowerCase().includes('touchdowns') && !event.toLowerCase().includes('tds') &&
                     !event.toLowerCase().includes('goals') && !event.toLowerCase().includes('home runs') &&
                     !event.toLowerCase().includes('hrs') && !event.toLowerCase().includes('strikeouts') &&
                     !event.toLowerCase().includes('ks'));
    
    // Daily fantasy platforms only support player prop parlays
    if (book === "Sleeper" || book === "PrizePicks" || book === "Underdog") {
      if (hasMoneyline || hasSpread || hasTotal) {
        return {
          isValid: false,
          reason: `${book} only supports player prop parlays. Moneyline, spread, and total bets are not available.`
        };
      }
      
      // Check if it's actually a player prop parlay
      if (market !== "Player Prop Parlay") {
        return {
          isValid: false,
          reason: `${book} only supports player prop parlays.`
        };
      }
      
      // Additional check: ensure the bet only contains player-specific props
      const hasPlayerProps = event.toLowerCase().includes('over') || event.toLowerCase().includes('under');
      if (!hasPlayerProps) {
        return {
          isValid: false,
          reason: `${book} only supports player prop parlays with over/under lines.`
        };
      }
    }
    
    // Traditional sportsbooks support all bet types
    if (book === "DraftKings" || book === "FanDuel" || book === "BetMGM") {
      return { isValid: true };
    }
    
    return { isValid: true };
  };

  // Function to format event time for display
  const formatEventTime = (eventTime: string) => {
    const date = new Date(eventTime);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return "Tomorrow at " + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffDays === 0) {
      return "Today at " + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  // Function to extract city/team abbreviations from event string
  const extractTeamAbbreviations = (event: string): { teams: string; cleanEvent: string } => {
    // Look for pattern like "(MIL vs BOS)" or "(TB vs ATL)" at the end - handle both 2 and 3 letter codes
    const teamMatch = event.match(/\(([A-Z]{2,3}\s+vs\s+[A-Z]{2,3})\)$/);
    if (teamMatch) {
      const teams = teamMatch[1]; // "MIL vs BOS" or "TB vs ATL"
      const cleanEvent = event.replace(/\s*\([A-Z]{2,3}\s+vs\s+[A-Z]{2,3}\)$/, ''); // Remove the teams part
      return { teams, cleanEvent };
    }
    return { teams: '', cleanEvent: event };
  };

  const { teams, cleanEvent } = extractTeamAbbreviations(parsedBet.event);
  const validation = validateBetCompatibility(parsedBet);

  return (
    <View style={tw`w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4`}>
      {/* League, team abbreviations, and date/time at the top */}
      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-sm text-gray-400 mr-2`}>
            {parsedBet.league}
          </Text>
          {teams && (
            <>
              <Text style={tw`text-sm text-gray-400 mr-2`}>
                • {teams}
              </Text>
            </>
          )}
          <Text style={tw`text-sm text-gray-400`}>
            • {formatEventTime(parsedBet.eventTime)}
          </Text>
        </View>
      </View>

      {/* Bet details in text-lg font-bold */}
      <Text style={tw`text-lg font-bold text-white mb-4`}>
        {cleanEvent}
      </Text>

      {/* Validation warning if bet is not possible */}
      {!validation.isValid && (
        <View style={tw`bg-amber-900/20 border border-amber-700/30 rounded-lg p-3 mb-4`}>
          <View style={tw`flex-row items-start`}>
            <AlertTriangle size={16} color="#F59E0B" style={tw`mr-2 mt-0.5 flex-shrink-0`} />
            <Text style={tw`text-sm text-amber-200 leading-5 flex-1`}>
              {validation.reason}
            </Text>
          </View>
        </View>
      )}

      {/* Inner card section showing sportsbook name and odds */}
      <View style={tw`bg-neutral-800 rounded-lg p-3 mb-4`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-sm text-gray-400`}>Best Value</Text>
          <Text style={tw`text-sm text-gray-400`}>Odds</Text>
        </View>
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row items-center`}>
            <Logo book={parsedBet.book} size="small" />
            <Text style={tw`text-base text-white font-semibold ml-2`}>{parsedBet.book}</Text>
          </View>
          <Text style={tw`text-base text-white font-semibold`}>
            {parsedBet.odds > 0 ? `+${parsedBet.odds}` : parsedBet.odds}
          </Text>
        </View>
      </View>

      {/* Bet recommendation based on bankroll */}
      {(() => {
        const bankroll = 500; // Hardcoded for now
        let units = 1;
        
        // Simple bet-type logic
        if (parsedBet.market === "Player Prop Parlay" || 
            parsedBet.market === "Player Prop" ||
            parsedBet.book === "PrizePicks" || 
            parsedBet.book === "Underdog" || 
            parsedBet.book === "Sleeper") {
          units = 0.5; // Parlays or DFS props → 0.5u
        } else {
          units = 1; // Moneyline, spread, straight bets → 1u
        }
        
        const rec = formatBetRecommendation(bankroll, parsedBet.odds, units);
        
        return (
          <View style={tw`flex-row items-center mb-4`}>
            <Wallet size={16} color="#9CA3AF" style={tw`mr-2`} />
            <Text style={tw`text-sm text-neutral-300 leading-5`}>
              Bet {rec.units} unit (${rec.stake}) to win ${rec.payout}.
            </Text>
          </View>
        );
      })()}

      {/* Big BET NOW button - disabled if bet is not valid */}
      <Pressable 
        style={tw`w-full rounded-lg py-4 ${validation.isValid ? 'bg-brand' : 'bg-neutral-700'}`}
        disabled={!validation.isValid}
      >
        <Text style={tw`text-center text-lg font-bold ${validation.isValid ? 'text-black' : 'text-neutral-400'}`}>
          {validation.isValid ? 'BET NOW' : 'BET NOT AVAILABLE'}
        </Text>
      </Pressable>
    </View>
  );
}