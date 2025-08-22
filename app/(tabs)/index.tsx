import { View, FlatList } from "react-native";
import tw from "../../src/lib/tw";
import { useData } from "../../src/state/data";
import { useFeedFilter } from "../../src/state/feedFilter";
import PostCard from "../../src/components/PostCard";

export default function Home() {
  const { posts, partners } = useData();
  const { selected } = useFeedFilter();

  const subscribedIds = partners.filter(p=>p.isSubscribed).map(p=>p.id);

  const filtered = (() => {
    if (selected === "All") {
      const hasSubs = subscribedIds.length > 0;
      return hasSubs
        ? posts.filter(p => subscribedIds.includes(p.partnerId))
        : posts; // fallback if none subscribed
    }
    const partner = partners.find(p => p.name === selected);
    return partner ? posts.filter(p => p.partnerId === partner.id) : posts;
  })();

  return (
    <View style={tw`flex-1 bg-neutral-950`}>
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={tw`pb-8`}
      />
    </View>
  );
}
