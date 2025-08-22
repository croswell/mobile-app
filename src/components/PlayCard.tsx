import { View, Text, Pressable } from "react-native";
import tw from "../lib/tw";
import type { ParsedBetT } from "../mocks/models";
import { prettyOdds, money, whenReadable } from "../lib/format";
import Logo from "./Logo";
import { Share } from "lucide-react-native";

interface PlayCardProps {
  bet: {
    id: string;
    parsedBet: ParsedBetT;
    status: "live" | "upcoming" | "won" | "lost";
    stake: number;
    startTime: Date;
  };
  onPress?: () => void;
}

export default function PlayCard({ bet, onPress }: PlayCardProps) {

  // Function to get status color and label
  const getStatusInfo = (bet: { status: string; startTime: Date }) => {
    switch (bet.status) {
      case "live":
        return { color: "text-rose-400", bgColor: "bg-rose-900/20", label: "LIVE" };
      case "upcoming":
        return { color: "text-orange-400", bgColor: "bg-orange-900/20", label: "UPCOMING" };
      case "won":
        return { color: "text-green-400", bgColor: "bg-green-900/20", label: "WON" };
      case "lost":
        return { color: "text-red-400", bgColor: "bg-red-900/20", label: "LOST" };
      default:
        return { color: "text-neutral-400", bgColor: "bg-neutral-800/50", label: "UNKNOWN" };
    }
  };

  const statusInfo = getStatusInfo(bet) || { color: "text-neutral-400", bgColor: "bg-neutral-800/50", label: "UNKNOWN" };

  // Helper function to determine if bet is live (game in progress)
  const isLive = bet.status === "live";
  
  // Helper function to determine if bet is upcoming (game not started)
  const isUpcoming = bet.status === "upcoming";
  
  // Helper function to determine if bet is completed (won or lost)
  const isCompleted = bet.status === "won" || bet.status === "lost";

  return (
    <Pressable 
      onPress={onPress}
      style={tw`bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4`}
    >
      {/* Header row with dollar amounts and status badge */}
      <View style={tw`mb-3`}>
        <View style={tw`flex-row justify-between items-start mb-4`}>
          {/* Dollar amounts */}
          <View style={tw`flex-1 mr-3`}>
            <View style={tw`flex-row items-center mb-1`}>
              <Text style={tw`text-sm text-neutral-50 font-bold`}>${bet.stake.toFixed(2)}</Text>
              <Text style={tw`text-sm text-neutral-400 ml-1`}>to win</Text>
              <Text style={tw`text-sm font-bold text-brand ml-1`}>
                ${(bet.stake * (bet.parsedBet.odds > 0 ? bet.parsedBet.odds / 100 : 1)).toFixed(2)}
              </Text>
            </View>
          </View>
          
          {/* Status badge */}
          <View style={tw`${statusInfo.bgColor} rounded-full px-3 py-1 flex-shrink-0 flex-row items-center`}>
            {/* Live indicator dot inside the badge */}
            {isLive && (
              <View style={tw`bg-rose-500 rounded-full w-2 h-2 mr-2`} />
            )}
            <Text style={tw`${statusInfo.color} text-xs font-bold`}>
              {statusInfo.label}
            </Text>
          </View>
        </View>
        
        {/* Full-width border separator */}
        <View style={tw`h-px bg-neutral-800 w-full`} />
      </View>

      {/* Metadata row - league, cities, timestamp */}
      <View style={tw`mb-1`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-sm text-neutral-400`}>{bet.parsedBet.league}</Text>
          <Text style={tw`text-sm text-neutral-400 ml-2`}>•</Text>
          <Text style={tw`text-sm text-neutral-400 ml-2`} numberOfLines={1}>
            {bet.parsedBet.event.includes('(') ? bet.parsedBet.event.split('(')[1].split(')')[0] : ''}
          </Text>
          <Text style={tw`text-sm text-neutral-400 ml-2`}>•</Text>
          <Text style={tw`text-sm text-neutral-400 ml-2`}>
            {whenReadable(bet.startTime)}
          </Text>
        </View>
      </View>

      {/* Bet details */}
      <View style={tw`mb-3`}>
        <Text style={tw`text-lg text-neutral-50 font-bold mb-2`}>
          {bet.parsedBet.event.split('(')[0].trim()}
        </Text>
      </View>

      {/* Live game progress indicator */}
      {isLive && (
        <View style={tw`mb-3 bg-neutral-800 rounded-lg p-3`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Text style={tw`text-sm text-neutral-400`}>Game Progress</Text>
            <Text style={tw`text-sm text-rose-400 font-medium`}>LIVE</Text>
          </View>
          <View style={tw`bg-neutral-700 rounded-full h-2 mb-2`}>
            <View style={tw`bg-brand h-2 rounded-full w-1/3`} />
          </View>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-xs text-neutral-400`}>0</Text>
            <Text style={tw`text-xs text-neutral-400`}>FINAL</Text>
          </View>
        </View>
      )}



      {/* Bottom row with book info and stake */}
      <View style={tw`flex-row items-center justify-between mt-2 mb-4`}>
        <View style={tw`flex-row items-center`}>
          <Logo book={bet.parsedBet.book} size="small" />
          <Text style={tw`text-neutral-300 ml-2 text-sm`}>
            {bet.parsedBet.book}
          </Text>
        </View>
        
        {/* Odds information */}
        <View style={tw`items-end`}>
          <Text style={tw`text-sm text-neutral-200 font-medium`}>
            {prettyOdds(bet.parsedBet.odds)}
          </Text>
        </View>
      </View>

      {/* Share button */}
      <View style={tw`w-full`}>
        <Pressable
          style={tw`border border-neutral-600 rounded-lg px-4 py-2 flex-row items-center justify-center`}
          onPress={() => {
            // TODO: Implement share functionality
            console.log('Share bet:', bet.id);
          }}
        >
          <Share size={16} color="#9CA3AF" />
          <Text style={tw`text-neutral-400 text-sm ml-2 font-medium`}>Share</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

