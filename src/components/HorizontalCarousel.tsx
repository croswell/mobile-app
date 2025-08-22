import { View, Text, ScrollView } from "react-native";
import tw from "../lib/tw";

interface HorizontalCarouselProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function HorizontalCarousel({ 
  title, 
  subtitle, 
  children
}: HorizontalCarouselProps) {
  return (
    <View style={tw`mb-6`}>
      {/* Header */}
      <View style={tw`mb-4 px-4`}>
        <Text style={tw`text-white text-lg font-bold`}>{title}</Text>
        {subtitle && (
          <Text style={tw`text-neutral-400 text-sm mt-1`}>{subtitle}</Text>
        )}
      </View>
      
      {/* Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`pl-4 pr-4`}
      >
        {children}
      </ScrollView>
    </View>
  );
}
