import { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView, NativeScrollEvent, NativeSyntheticEvent, Animated } from "react-native";
import tw from "../../src/lib/tw";
import { useData } from "../../src/state/data";
import BetRow from "../../src/components/BetRow";
import SegmentedTabs from "../../src/components/SegmentedTabs";
import PlaysSummaryHeader from "../../src/components/PlaysSummaryHeader";
import type { BetT } from "../../src/mocks/models";

type TabKey = "Active" | "Completed";

export default function Plays() {
  const { bets } = useData();
  const [tab, setTab] = useState<TabKey>("Active");
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values - using only JS animations to avoid conflicts
  const heightAnim = useRef(new Animated.Value(160)).current; // Start with expanded height

  const { active, completed } = useMemo(() => {
    const active = bets
      .filter(b => b.status === "active")
      .sort((a,b)=> a.startTime.getTime() - b.startTime.getTime());

    const completed = bets
      .filter(b => b.status !== "active")
      .sort((a,b)=> b.startTime.getTime() - a.startTime.getTime())
      .reverse(); // most recent first

    return { active, completed };
  }, [bets]);

  const data: BetT[] = tab === "Active" ? active : completed;

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
          <PlaysSummaryHeader collapsed={isHeaderCollapsed} />
        </Animated.View>
        
        {/* Fixed segmented tabs */}
        <View style={{ marginBottom: 16 }}>
          <SegmentedTabs
            tabs={[
              { key: "Active", label: "Active" },
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
          data.map((bet) => <BetRow key={bet.id} bet={bet} />)
        ) : (
          <View style={tw`p-6`}>
            <Text style={tw`text-center text-neutral-400`}>
              {tab === "Active" ? "No active plays yet." : "No completed plays yet."}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
