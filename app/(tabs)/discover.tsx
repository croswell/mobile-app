import { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, ScrollView } from "react-native";
import tw from "../../src/lib/tw";
import { useData } from "../../src/state/data";
import { groupBy } from "../../src/lib/group";
import ParsedBetDetail from "../../src/components/ParsedBetDetail";
import PartnerCard from "../../src/components/PartnerCard";
import HorizontalCarousel from "../../src/components/HorizontalCarousel";
import { Compass, Search } from "lucide-react-native";
import type { BetT } from "../../src/mocks/models";

const LEAGUES: BetT["league"][] = ["NFL","NBA","MLB","NHL","NCAAF","NCAAB"];

export default function Discover() {
  const { bets, partners, posts } = useData();
  const [q, setQ] = useState("");
  const [league, setLeague] = useState<BetT["league"] | "ALL">("ALL");

  const filtered = useMemo(() => {
    let list = bets
      .filter(b => b.status === "active")
      .filter(b => (league === "ALL" ? true : b.league === league));
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter(b => b.game.toLowerCase().includes(s));
    }
    return list;
  }, [bets, q, league]);

  const grouped = useMemo(() => {
    const byKey = groupBy(filtered, b => `${b.league}|${b.game}|${b.startTime.toISOString()}`);
    return Object.entries(byKey)
      .map(([key, items]) => {
        const [lg, game, iso] = key.split("|");
        return { league: lg as BetT["league"], game, startTime: new Date(iso), bets: items };
      })
      .sort((a,b)=> a.startTime.getTime() - b.startTime.getTime());
  }, [filtered]);

  // Get recommended partners (subscribed ones first)
  const recommendedPartners = useMemo(() => {
    return partners.filter(p => !p.isSubscribed);
  }, [partners]);

  // Get posts with parsed bets for the top bets section
  const topBetPosts = useMemo(() => {
    let filteredPosts = posts
      .filter(post => post.extraction === "parsed" && post.parsed && post.parsed.length > 0);
    
    // Filter by league if a specific league is selected
    if (league !== "ALL") {
      filteredPosts = filteredPosts.filter(post => {
        if (post.parsed && post.parsed.length > 0) {
          return post.parsed[0].league === league;
        }
        return false;
      });
    }
    
    return filteredPosts.slice(0, 10); // Show top 10 posts with parsed bets
  }, [posts, league]);

  return (
    <View style={tw`flex-1 bg-neutral-950`}>
      {/* search */}
      <View style={tw`p-4 mb-1.5`}>
        <View style={tw`relative`}>
          <TextInput
            placeholder="Search DubClubs, games, and teams"
            placeholderTextColor="#a3a3a3"
            value={q}
            onChangeText={setQ}
            style={tw`bg-neutral-900 border border-neutral-800 rounded-lg px-12 py-3 text-neutral-100 text-base`}
          />
          <View style={tw`absolute left-4 top-0 bottom-0 justify-center`}>
            <Search size={20} color="#a3a3a3" />
          </View>
        </View>
      </View>

      {/* league chips */}
      <View style={tw`px-4 pb-2 mb-3`}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
          <View style={tw`flex-row gap-2`}>
            {/* Explore chip (replaces ALL) */}
            <Pressable
              onPress={() => setLeague("ALL")}
              style={tw`${league === "ALL" ? "bg-neutral-100 border-neutral-100" : "bg-neutral-900 border-neutral-700"} border rounded-full px-4 py-2 flex-row items-center`}
            >
              <Compass size={16} color={league === "ALL" ? "#0a0a0a" : "#9ca3af"} style={tw`mr-2`} />
              <Text style={tw`${league === "ALL" ? "text-neutral-950" : "text-neutral-300"} text-sm`}>Explore</Text>
            </Pressable>
            
            {/* Other league chips */}
            {LEAGUES.map((k) => {
              const on = league === k;
              return (
                <Pressable
                  key={k}
                  onPress={() => setLeague(k)}
                  style={tw`${on ? "bg-neutral-100 border-neutral-100" : "bg-neutral-900 border-neutral-700"} border rounded-full px-4 py-2`}
                >
                  <Text style={tw`${on ? "text-neutral-950" : "text-neutral-300"} text-sm`}>{k}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Explore Content */}
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Recommended DubClubs - only show when Explore is selected */}
        {league === "ALL" && (
          <HorizontalCarousel 
            title="Recommended DubClubs" 
          >
            {recommendedPartners.map(partner => (
              <PartnerCard 
                key={partner.id} 
                partner={partner}
                onPress={() => {
                  // Handle partner selection
                }}
              />
            ))}
          </HorizontalCarousel>
        )}

        {/* Top Bets For You */}
        <View style={tw`px-4 mb-6`}>
          {league === "ALL" && (
            <Text style={tw`text-white text-lg font-bold mb-4`}>Top Bets For You</Text>
          )}
          
          {topBetPosts.length > 0 ? (
            topBetPosts.map((post) => (
              <View key={post.id} style={tw`mb-4`}>
                {post.parsed && post.parsed.length > 0 && (
                  <ParsedBetDetail parsedBet={post.parsed[0]} />
                )}
              </View>
            ))
          ) : (
            <View style={tw`p-6`}>
              <Text style={tw`text-center text-neutral-400`}>No top bets available.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
