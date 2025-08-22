import { View, Text, Pressable, Image, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react-native";
import tw from "../lib/tw";
import { useData } from "../state/data";
import { useEmojiPicker } from "../state/emojiPicker";
import type { PostT } from "../mocks/models";
import { when } from "../lib/format";
import BetDetail from "./BetDetail";
import ParsedBetDetail from "./ParsedBetDetail";
import { postBets, ctaLabelForPost, hasImages } from "../lib/post";
import { router } from "expo-router";
import ImageGallery from "./ImageGallery";
import ImageLightbox from "./ImageLightbox";

const MAX_CHARS = 200;

export default function PostCard({ post }: { post: PostT }) {
  const { bets, partners } = useData();
  const { openEmojiPicker, currentPostId, selectedEmoji, closeEmojiPicker } = useEmojiPicker();
  const partner = partners.find(p => p.id === post.partnerId);
  const betsForPost = postBets(post, bets);
  const showImages = betsForPost.length === 0 && hasImages(post);
  const images = (post.attachments ?? []).filter(a => a.type === "image").slice(0,3);
  
  // State to track if this post is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // Lightbox state
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  // Emoji reaction state - unique per post
  const [reactions, setReactions] = useState<Record<string, number>>({
    '🔥': Math.floor(Math.random() * 20) + 5,
    '💪': Math.floor(Math.random() * 15) + 3,
    '🎯': Math.floor(Math.random() * 25) + 8,
    '✅': Math.floor(Math.random() * 12) + 2,
    '💎': Math.floor(Math.random() * 8) + 1
  });

  // User's selected reactions - unique per post
  const [selectedReactions, setSelectedReactions] = useState<Set<string>>(new Set());
  
  // Available emojis for selection (moved to parent component)
  // const availableEmojis = ['🚀', '⚡', '💯', '🎯', '🔥', '💪', '✅', '💎', '🏆', '🎊', '👏', '❤️'];
  
  // Animation refs - unique per post
  const scaleAnimations = useRef<Record<string, Animated.Value>>({}).current;

  // Initialize animations for existing reactions
  Object.keys(reactions).forEach(emoji => {
    if (!scaleAnimations[emoji]) {
      scaleAnimations[emoji] = new Animated.Value(1);
    }
  });

  // Listen for emoji selections and apply them to this post
  useEffect(() => {
    if (currentPostId === post.id && selectedEmoji) {
      // Apply the selected emoji to this post's reactions
      setReactions(prev => ({
        ...prev,
        [selectedEmoji]: (prev[selectedEmoji] || 0) + 1
      }));
      
      // Add to selected reactions
      setSelectedReactions(prev => new Set([...prev, selectedEmoji]));
      
      // Clear the selected emoji from global state
      closeEmojiPicker();
    }
  }, [currentPostId, selectedEmoji, post.id, closeEmojiPicker]);

  // Handle emoji reaction with animation
  const handleReaction = (emoji: string) => {
    // Animate scale
    if (!scaleAnimations[emoji]) {
      scaleAnimations[emoji] = new Animated.Value(1);
    }
    
    Animated.sequence([
      Animated.timing(scaleAnimations[emoji], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[emoji], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Toggle selection
    const isSelected = selectedReactions.has(emoji);
    const newSelected = new Set(selectedReactions);
    
    if (isSelected) {
      newSelected.delete(emoji);
      setReactions(prev => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] || 0) - 1)
      }));
    } else {
      newSelected.add(emoji);
      setReactions(prev => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1
      }));
    }
    
    setSelectedReactions(newSelected);
  };

  // Handle adding new emoji reaction (moved to parent component)
  const handleAddEmoji = (emoji: string) => {
    if (!scaleAnimations[emoji]) {
      scaleAnimations[emoji] = new Animated.Value(1);
    }
    
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
    
    const newSelected = new Set(selectedReactions);
    newSelected.add(emoji);
    setSelectedReactions(newSelected);
  };

  // Function to handle image tap and open lightbox
  const handleImagePress = (image: any, index: number) => {
    setLightboxInitialIndex(index);
    setLightboxVisible(true);
  };

  // Function to get avatar source
  const getAvatarSource = (avatar: string) => {
    switch (avatar) {
      case 'secured-picks':
        return require('../../assets/images/secured-picks.jpg');
      case 'hammering-hank':
        return require('../../assets/images/hammering-hank.jpg');
      case 'chilly-bets':
        return require('../../assets/images/chilly-bets.jpg');
      default:
        return { uri: avatar };
    }
  };

  return (
    <>
      <View style={tw`bg-neutral-950 py-6 mb-0 border-b border-neutral-800`}>
      {/* Header: Partner logo + name on left, timestamp on right */}
      <View style={tw`flex-row items-center justify-between mb-6 px-4`}>
        <View style={tw`flex-row items-center`}>
          {partner?.avatar ? (
            <Image 
              source={getAvatarSource(partner.avatar)}
              style={tw`w-10 h-10 rounded-lg mr-3`} 
            />
          ) : null}
          <Text style={tw`text-base font-semibold text-white`}>
            {partner?.name ?? "Partner"}
          </Text>
        </View>
        <Text style={tw`text-xs text-neutral-400`}>{when(post.createdAt)}</Text>
      </View>

      {/* Post text with show more logic */}
      {!!post.text && (
        <View style={tw`px-4 mb-4`}>
          <Text style={tw`text-neutral-100 text-base leading-6 mb-3`} numberOfLines={!isExpanded && post.text.length > MAX_CHARS ? 3 : undefined}>
            {post.text}
          </Text>
          {post.text.length > MAX_CHARS && (
            <Pressable onPress={() => setIsExpanded(!isExpanded)} style={tw`mb-3`}>
              <Text style={tw`text-green-500 font-semibold`}>
                {isExpanded ? 'Show less' : 'Show more'}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Bet details (if parsed) or images (if not parsed) */}
      {post.parsed && post.parsed.length > 0 ? (
        // Render parsed bet details - each post only has 1 parsed bet
        <View style={tw`mb-6 mt-2 px-4`}>
          <ParsedBetDetail parsedBet={post.parsed[0]} />
        </View>
      ) : betsForPost.length > 0 ? (
        // Fallback to old bet structure for backward compatibility
        <View style={tw`mb-4 px-4`}>
          <BetDetail bet={betsForPost[0]} />
        </View>
      ) : showImages ? (
        // Render images using Threads-like gallery
        <View style={tw`mb-4 px-4`}>
          <ImageGallery 
            images={isExpanded ? (post.attachments ?? []).filter(a => a.type === "image") : images} 
            onImagePress={handleImagePress}
          />
        </View>
      ) : (
        // Text-only posts without parsed bets
        <View style={tw`mb-4 px-4`}>
        </View>
      )}

      {/* Footer: Emoji reactions with wrapping */}
      <View style={tw`pt-0 px-4`}>
        <View style={tw`flex-row items-center gap-2 flex-wrap`}>
          {/* Emoji reactions with counts */}
          {Object.entries(reactions).map(([emoji, count]) => {
            const isSelected = selectedReactions.has(emoji);
            const animatedStyle = scaleAnimations[emoji] ? {
              transform: [{ scale: scaleAnimations[emoji] }]
            } : {};
            
            return (
              <Animated.View key={emoji} style={animatedStyle}>
                <Pressable 
                  style={[
                    tw`flex-row items-center rounded-md px-2 py-1 border h-8`,
                    isSelected 
                      ? { backgroundColor: '#003d12', borderColor: '#00D639' }
                      : tw`bg-neutral-900 border-transparent`
                  ]}
                  onPress={() => handleReaction(emoji)}
                >
                  <Text style={tw`text-sm mr-1`}>{emoji}</Text>
                  <Text style={[
                    tw`text-xs font-bold`,
                    isSelected ? tw`text-brand` : tw`text-neutral-400`
                  ]}>{count}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
          
          {/* Add reaction button */}
          <Pressable 
            style={tw`w-8 h-8 items-center justify-center rounded-md bg-neutral-800`}
            onPress={() => openEmojiPicker(post.id)}
          >
            <Smile size={16} color="#9CA3AF" />
          </Pressable>
        </View>
      </View>

      {/* Image Lightbox */}
      <ImageLightbox
        visible={lightboxVisible}
        images={(post.attachments ?? []).filter(a => a.type === "image")}
        initialIndex={lightboxInitialIndex}
        onClose={() => setLightboxVisible(false)}
      />
      </View>
    </>
  );
}
