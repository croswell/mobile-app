import { View, FlatList } from "react-native";
import tw from "../lib/tw";
import { useData } from "../src/state/data";
import PostCard from "../src/components/PostCard";

export default function Home() {
  const { posts } = useData();
  return (
    <View style={tw`flex-1 bg-neutral-950 p-4`}>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  );
}
