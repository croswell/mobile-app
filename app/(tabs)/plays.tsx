import { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, NativeScrollEvent, NativeSyntheticEvent, Animated } from "react-native";
import tw from "../../src/lib/tw";
import { useData } from "../../src/state/data";
import PlayCard from "../../src/components/PlayCard";
import SegmentedTabs from "../../src/components/SegmentedTabs";
import PlaysSummaryHeader from "../../src/components/PlaysSummaryHeader";
import type { BetT, ParsedBetT } from "../../src/mocks/models";

type TabKey = "Live" | "Upcoming" | "Completed";

export default function Plays() {
  const { posts } = useData();
  const [tab, setTab] = useState<TabKey>("Live");
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values - using only JS animations to avoid conflicts
  const heightAnim = useRef(new Animated.Value(160)).current; // Start with expanded height

  const { live, upcoming, completed } = useMemo(() => {
    // Convert posts with parsed bets to a format we can use for plays
    const parsedBets: Array<{ id: string; parsedBet: ParsedBetT; status: "live" | "upcoming" | "won" | "lost"; stake: number; startTime: Date }> = [];
    
    posts.forEach((post: any) => {
      if (post.parsed && post.parsed.length > 0) {
        post.parsed.forEach((parsedBet: ParsedBetT, index: number) => {
          const startTime = new Date(parsedBet.eventTime);
          const now = new Date();
          
          // Determine if this is a live game (started within the last 3 hours and not finished)
          const isLive = startTime < now && startTime > new Date(now.getTime() - 3 * 60 * 60 * 1000);
          
          // Determine status based on time
          let status: "live" | "upcoming" | "won" | "lost";
          if (isLive) {
            status = "live";
          } else if (startTime > now) {
            status = "upcoming";
          } else {
            // For completed games, randomly assign won or lost status
            status = Math.random() > 0.5 ? "won" : "lost";
          }
          
          parsedBets.push({
            id: `${post.id}-${index}`,
            parsedBet,
            status,
            stake: 5, // Use $5 stake to match our seed data structure
            startTime
          });
        });
      }
    });

    // Live bets - games currently in progress
    const live = parsedBets
      .filter(b => b.status === "live")
      .sort((a,b)=> a.startTime.getTime() - b.startTime.getTime());
    
    // Upcoming bets - games that haven't started yet
    const upcoming = parsedBets
      .filter(b => b.status === "upcoming")
      .sort((a,b)=> a.startTime.getTime() - b.startTime.getTime());

    // Completed bets - games that have finished (won or lost)
    const completed = parsedBets
      .filter(b => b.status === "won" || b.status === "lost")
      .sort((a,b)=> b.startTime.getTime() - a.startTime.getTime())
      .reverse(); // most recent first

    return { live, upcoming, completed };
  }, [posts]);

  // Determine which data to show based on current tab
  const data = tab === "Live" ? live : tab === "Upcoming" ? upcoming : completed;

  // Calculate total at-risk amount from live and upcoming bets
  const totalAtRisk = live.reduce((sum, bet) => sum + bet.stake, 0) + 
                     upcoming.reduce((sum, bet) => sum + bet.stake, 0);

  // Animate header transition
  useEffect(() => {
    Animated.spring(heightAnim, {
      toValue: isHeaderCollapsed ? 80 : 160, // Smooth height transition with proper expanded height
      useNativeDriver: false,
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    }).start();
  }, [isHeaderCollapsed, heightAnim]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const shouldCollapse = scrollY > 10; // Collapse after 10px of scroll
    
    if (shouldCollapse !== isHeaderCollapsed) {
      setIsHeaderCollapsed(shouldCollapse);
    }
  };

  return (
    <View style={tw`flex-1 bg-neutral-950`}>
      {/* Fixed header section */}
      <View style={tw`px-4 pt-4 bg-neutral-950`}>
        {/* Animated summary header with smooth height transition */}
        <Animated.View
          style={{
            height: heightAnim,
            overflow: 'hidden', // Hide content that goes beyond the animated height
          }}
        >
          <PlaysSummaryHeader collapsed={isHeaderCollapsed} atRiskAmount={totalAtRisk} />
        </Animated.View>
        
        {/* Fixed segmented tabs */}
        <View style={tw`mt-2 mb-4`}>
          <SegmentedTabs
            tabs={[
              { key: "Live", label: "Live", count: live.length },
              { key: "Upcoming", label: "Upcoming", count: upcoming.length },
              { key: "Completed", label: "Completed" },
            ]}
            value={tab}
            onChange={(key) => setTab(key as TabKey)}
          />
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView 
        ref={scrollViewRef}
        style={tw`flex-1`}
        contentContainerStyle={tw`px-4 pb-6`}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16} // 60fps scroll detection
      >
        {data.length > 0 ? (
          data.map((bet) => <PlayCard key={bet.id} bet={bet} />)
        ) : (
          <View style={tw`p-6`}>
            <Text style={tw`text-center text-neutral-400`}>
              {tab === "Live" ? "No live plays yet." : tab === "Upcoming" ? "No upcoming plays yet." : "No completed plays yet."}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}