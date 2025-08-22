import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  Pressable,
  Text,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { X } from 'lucide-react-native';
import tw from '../lib/tw';
import type { AttachmentT } from '../mocks/models';

// Generate a consistent color based on image ID
const getColorFromId = (id: string): string => {
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EF4444', // red
    '#F59E0B', // yellow
    '#10B981', // green
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#A855F7', // violet
    '#14B8A6', // teal
  ];
  
  // Simple hash function to get consistent color for same ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Check if URL is a local placeholder
const isLocalPlaceholder = (url: string) => url.startsWith('local://');

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ImageLightboxProps {
  visible: boolean;
  images: AttachmentT[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ 
  visible, 
  images, 
  initialIndex, 
  onClose 
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [imageLoading, setImageLoading] = useState<Set<string>>(new Set());

  // Reset to initial index when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, initialIndex]);

  // Scroll to current index when it changes
  useEffect(() => {
    if (visible && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * screenWidth,
        animated: true,
      });
    }
  }, [currentIndex, visible]);

  const handleImageLoad = (imageId: string) => {
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const handleImageLoadStart = (imageId: string) => {
    setImageLoading(prev => new Set(prev).add(imageId));
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };



  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View 
          style={[
            tw`flex-1 bg-black`,
            { opacity: fadeAnim }
          ]}
        >
          {/* Header with close button */}
          <View style={tw`absolute top-0 left-0 right-0 z-10 pt-12 pb-4 px-4`}>
            <Pressable
              onPress={handleClose}
              style={tw`w-10 h-10 bg-black/50 rounded-full items-center justify-center`}
            >
              <X size={24} color="white" />
            </Pressable>
          </View>

          {/* Image carousel */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={tw`flex-1`}
          >
            {images.map((image, index) => {
              const isLocal = isLocalPlaceholder(image.url);
              
              return (
                <View
                  key={image.id}
                  style={[
                    tw`items-center justify-center`,
                    { width: screenWidth, height: screenHeight }
                  ]}
                >
                  {isLocal ? (
                    // Placeholder image
                    <View 
                      style={[
                        tw`items-center justify-center rounded-2xl`,
                        { 
                          width: screenWidth * 0.8, 
                          height: screenHeight * 0.6,
                          backgroundColor: getColorFromId(image.id)
                        }
                      ]}
                    >
                      <Text style={tw`text-white text-2xl font-bold text-center px-8`}>
                        {image.title || `Image ${index + 1}`}
                      </Text>
                      <Text style={tw`text-white/80 text-lg text-center mt-4 px-8`}>
                        Placeholder Image
                      </Text>
                    </View>
                  ) : (
                    // Real image
                    <Image
                      source={{ uri: image.url }}
                      style={tw`w-full h-full`}
                      resizeMode="contain"
                      onLoadStart={() => handleImageLoadStart(image.id)}
                      onLoad={() => handleImageLoad(image.id)}
                    />
                  )}
                  
                  {/* Loading indicator - only for real images */}
                  {!isLocal && imageLoading.has(image.id) && (
                    <View style={tw`absolute inset-0 bg-black/50 items-center justify-center`}>
                      <View style={tw`w-16 h-16 bg-white/20 rounded-full items-center justify-center`}>
                        <ActivityIndicator size="large" color="white" />
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>



          {/* Bottom indicator dots */}
          {images.length > 1 && (
            <View style={tw`absolute bottom-8 left-0 right-0 flex-row justify-center`}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    tw`w-2 h-2 rounded-full mx-1`,
                    index === currentIndex ? tw`bg-white` : tw`bg-white/40`
                  ]}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}
