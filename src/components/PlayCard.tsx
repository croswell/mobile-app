import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Share } from 'lucide-react-native';
import tw from '../../lib/tw';
import type { ParsedBetT } from '../mocks/models';
import { prettyOdds, whenReadable } from '../lib/format';
import Logo from './Logo';
import GradientProgressBar from './GradientProgressBar';

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



  // Function to render key stats for live bets
  const renderKeyStats = () => {
    if (!bet.parsedBet.liveProgress?.keyStats) return null;
    
    const stats = bet.parsedBet.liveProgress.keyStats;
    const statEntries = Object.entries(stats);
    
    return (
      <View style={tw`mt-2`}>
        <Text style={tw`text-xs text-neutral-400 mb-1`}>Key Stats:</Text>
        <View style={tw`flex-row flex-wrap`}>
          {statEntries.map(([key, value], index) => (
            <View key={key} style={tw`bg-neutral-700 rounded px-2 py-1 mr-2 mb-1`}>
              <Text style={tw`text-xs text-neutral-300`}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Function to render simplified tracking for live bets (player props, parlays, spreads, moneyline)
  const renderSimplifiedTracking = () => {
    if (!isLive || !bet.parsedBet.liveProgress?.keyStats) return null;
    
    const stats = bet.parsedBet.liveProgress.keyStats;
    const statEntries = Object.entries(stats);
    
    // For player props and parlays, extract player names and targets
    if (bet.parsedBet.betType === "player_prop" || bet.parsedBet.betType === "parlay") {
      let eventParts = [bet.parsedBet.event];
      if (bet.parsedBet.betType === "parlay") {
        eventParts = bet.parsedBet.event.split(' + ');
      }
      
      const playerProps = eventParts.map(part => {
        // Extract player name and prop from strings like "LeBron Over 24.5 Points"
        const match = part.match(/(.+?)\s+(Over|Under)\s+([\d.]+)\s+(.+)/);
        if (match) {
          return {
            player: match[1].trim(),
            direction: match[2],
            target: parseFloat(match[3]),
            stat: match[4].trim(),
            key: `${match[1].trim()}-${match[4].trim()}` // Create unique key
          };
        }
        return null;
      }).filter((prop): prop is NonNullable<typeof prop> => prop !== null);
      
      // For parlays, show each leg individually (don't remove duplicates)
      const displayProps = bet.parsedBet.betType === "parlay" ? playerProps : 
        // For single player props, remove duplicates
        playerProps.filter((prop, index, array) => 
          array.findIndex(p => p.key === prop.key) === index
        );
      
      return (
        <View style={tw`mb-3 bg-neutral-800 rounded-lg p-3`}>
          {/* Metadata inside tracking card for parlays */}
          {bet.parsedBet.betType === "parlay" && (
            <View style={tw`mb-3 pb-2 border-b border-neutral-700`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-sm text-neutral-400`}>{bet.parsedBet.league}</Text>
                <Text style={tw`text-sm text-neutral-400 ml-1`}>•</Text>
                {bet.parsedBet.event.includes('(') && (
                  <>
                    <Text style={tw`text-sm text-neutral-400 ml-1`} numberOfLines={1}>
                      {bet.parsedBet.event.includes('(') ? bet.parsedBet.event.split('(')[1].split(')')[0] : ''}
                    </Text>
                    <Text style={tw`text-sm text-neutral-400 ml-1`}>•</Text>
                  </>
                )}
                <Text style={tw`text-sm text-neutral-400 ml-1`}>
                  {whenReadable(bet.startTime)}
                </Text>
              </View>
            </View>
          )}
          
          {displayProps.map((playerProp, index) => {
            // Find corresponding stat value - improved matching for parlay legs
            let currentValue = 0;
            if (bet.parsedBet.betType === "parlay") {
              // For parlays, try to match by player name + stat type
              const playerName = playerProp.player.toLowerCase();
              const statType = playerProp.stat.toLowerCase();
              
              const statEntry = statEntries.find(([statName]) => {
                const statKey = statName.toLowerCase();
                // Try to match by player name + stat type combination
                return statKey.includes(playerName) && statKey.includes(statType.split(' ')[0]);
              });
              
              currentValue = statEntry ? statEntry[1] : 0;
            } else {
              // For single player props, use existing logic
              const statEntry = statEntries.find(([statName]) => {
                const statKey = statName.toLowerCase();
                const propStat = playerProp.stat.toLowerCase();
                return statKey.includes(propStat.split(' ')[0]) || propStat.includes(statKey);
              });
              
              currentValue = statEntry ? statEntry[1] : 0;
            }
            
            // Calculate progress based on target value
            let progress = 0;
            if (playerProp.direction === 'Over') {
              progress = Math.min(Math.max((currentValue as number) / playerProp.target, 0), 1);
            } else {
              // For Under bets, progress increases as we get closer to target
              const remaining = Math.max(playerProp.target - (currentValue as number), 0);
              progress = Math.min(remaining / playerProp.target, 1);
            }
            
            return (
              <View key={`${playerProp.key}-${index}`} style={tw`${index > 0 ? 'mt-3' : ''}`}>
                {/* Player name and over/under - larger, bolder text for parlay legs */}
                <Text style={tw`text-base text-neutral-100 font-bold mb-2`}>
                  {`${playerProp.player} ${playerProp.direction} ${playerProp.target} ${playerProp.stat}`}
                </Text>
                
                {/* Simplified progress bar row - showing only earned value */}
                <View style={tw`flex-row items-center`}>
                  {/* Start number */}
                  <Text style={tw`text-xs text-neutral-400 mr-3`}>0</Text>
                  
                  {/* Progress bar */}
                  <View style={tw`flex-1 bg-neutral-700 rounded-full h-2 mr-3`}>
                    <GradientProgressBar
                      progress={Math.min((currentValue as number) / playerProp.target, 1)}
                      height={8}
                      backgroundColor="transparent"
                    />
                  </View>
                  
                  {/* Only show current earned value in square */}
                  <View style={tw`border border-neutral-500 rounded w-6 h-6 items-center justify-center`}>
                    <Text style={tw`text-xs text-white font-medium`}>
                      {currentValue}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      );
    }
    
    // For spread and moneyline bets, show simplified score tracking
    if (bet.parsedBet.betType === "spread" || bet.parsedBet.betType === "moneyline") {
      const currentScore = bet.parsedBet.liveProgress.currentScore;
      const progressPercentage = bet.parsedBet.liveProgress.progressPercentage;
      
      return (
        <View style={tw`mb-3 bg-neutral-800 rounded-lg p-3`}>
          {/* Metadata inside tracking card for spread/moneyline bets */}
          <View style={tw`mb-3 pb-2 border-b border-neutral-700`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-sm text-neutral-400`}>{bet.parsedBet.league}</Text>
              <Text style={tw`text-sm text-neutral-400 ml-1`}>•</Text>
              {bet.parsedBet.event.includes('(') && (
                <>
                  <Text style={tw`text-sm text-neutral-400 ml-1`} numberOfLines={1}>
                    {bet.parsedBet.event.includes('(') ? bet.parsedBet.event.split('(')[1].split(')')[0] : ''}
                  </Text>
                  <Text style={tw`text-sm text-neutral-400 ml-1`}>•</Text>
                </>
              )}
              <Text style={tw`text-sm text-neutral-400 ml-1`}>
                {whenReadable(bet.startTime)}
              </Text>
            </View>
          </View>
          
          {/* Game progress - simplified format */}
          <Text style={tw`text-base text-neutral-100 font-bold mb-2`}>
            {bet.parsedBet.event.split('(')[0].trim()}
          </Text>
          
          {/* Simplified progress bar row - showing only current progress */}
          <View style={tw`flex-row items-center`}>
            {/* Start number */}
            <Text style={tw`text-xs text-neutral-400 mr-3`}>0</Text>
            
            {/* Progress bar */}
            <View style={tw`flex-1 bg-neutral-700 rounded-full h-2 mr-3`}>
              <GradientProgressBar
                progress={progressPercentage / 100}
                height={8}
                backgroundColor="transparent"
              />
            </View>
            
            {/* Only show current progress percentage in square */}
            <View style={tw`border border-neutral-500 rounded w-6 h-6 items-center justify-center`}>
              <Text style={tw`text-xs text-white font-medium`}>
                {progressPercentage}
              </Text>
            </View>
          </View>
          
          {/* Current score below */}
          <Text style={tw`text-xs text-neutral-400 mt-2`}>
            Current: {currentScore}
          </Text>
        </View>
      );
    }
    
    return null;
  };

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





      {/* Bet details - only show for non-parlay bets */}
      {bet.parsedBet.betType !== "parlay" && (
        <View style={tw`mb-3`}>
          <Text style={tw`text-lg text-neutral-50 font-bold mb-2`}>
            {bet.parsedBet.event.split('(')[0].trim()}
          </Text>
        </View>
      )}

      {/* Enhanced live game progress indicator */}
      {isLive && bet.parsedBet.liveProgress && (
        <>
          {/* Simplified tracking for player props, parlays, spreads, and moneyline bets */}
          {(bet.parsedBet.betType === "parlay" || bet.parsedBet.betType === "player_prop" || bet.parsedBet.betType === "spread" || bet.parsedBet.betType === "moneyline") && renderSimplifiedTracking()}
          
          {/* Regular game progress for other bet types (totals, etc.) */}
          {bet.parsedBet.betType !== "parlay" && bet.parsedBet.betType !== "player_prop" && bet.parsedBet.betType !== "spread" && bet.parsedBet.betType !== "moneyline" && (
            <View style={tw`mb-3 bg-neutral-800 rounded-lg p-3`}>
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={tw`text-sm text-neutral-400`}>Game Progress</Text>
                <Text style={tw`text-sm text-rose-400 font-medium`}>LIVE</Text>
              </View>
              
              {/* Current Score */}
              <View style={tw`mb-2`}>
                <Text style={tw`text-xs text-neutral-400 mb-1`}>Current Score</Text>
                <Text style={tw`text-lg text-neutral-50 font-bold`}>
                  {bet.parsedBet.liveProgress.currentScore}
                </Text>
              </View>
              
              {/* Time Remaining */}
              <View style={tw`mb-2`}>
                <Text style={tw`text-xs text-neutral-400 mb-1`}>Time Remaining</Text>
                <Text style={tw`text-sm text-neutral-200 font-medium`}>
                  {bet.parsedBet.liveProgress.timeRemaining}
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View style={tw`bg-neutral-700 rounded-full h-2 mb-2`}>
                <GradientProgressBar
                  progress={bet.parsedBet.liveProgress.progressPercentage / 100}
                  height={8}
                  backgroundColor="transparent"
                />
              </View>
              
              {/* Progress Labels */}
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-xs text-neutral-400`}>0</Text>
                <Text style={tw`text-xs text-neutral-400`}>{bet.parsedBet.liveProgress.progressPercentage}%</Text>
                <Text style={tw`text-xs text-neutral-400`}>FINAL</Text>
              </View>
              
              {/* Key Stats for player props and parlays */}
              {renderKeyStats()}
            </View>
          )}
        </>
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