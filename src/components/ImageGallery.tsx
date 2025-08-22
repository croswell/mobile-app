import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Dimensions, ActivityIndicator, Text, Pressable } from 'react-native';
import tw from '../lib/tw';
import type { AttachmentT } from '../mocks/models';

const { width: screenWidth } = Dimensions.get('window');
const POST_PADDING = 32; // 16px on each side
const AVAILABLE_WIDTH = screenWidth - POST_PADDING;

interface ImageGalleryProps {
  images: AttachmentT[];
  onImagePress?: (image: AttachmentT, index: number) => void;
}

// Simple colored placeholder component
const PlaceholderImage = ({ 
  width, 
  height, 
  color, 
  text, 
  textSize = "text-sm" 
}: { 
  width: number; 
  height: number; 
  color: string; 
  text: string; 
  textSize?: string;
}) => (
  <View 
    style={[
      tw`rounded-2xl items-center justify-center`,
      { width, height, backgroundColor: color }
    ]}
  >
    <Text style={tw`text-white font-bold ${textSize}`}>{text}</Text>
  </View>
);

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

export default function ImageGallery({ images, onImagePress }: ImageGalleryProps) {
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);

  if (images.length === 0) return null;

  const handleImageLoad = (imageId: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
    setLoadedImages(prev => new Set(prev).add(imageId));
  };

  const handleImageError = (imageId: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
    setErrorImages(prev => new Set(prev).add(imageId));
  };

  // Check if URL is a local placeholder
  const isLocalPlaceholder = (url: string) => url.startsWith('local://');

  // Preload images for better performance
  useEffect(() => {
    // Start loading all images immediately
    images.forEach(image => {
      if (!loadedImages.has(image.id) && !errorImages.has(image.id)) {
        setLoadingImages(prev => new Set(prev).add(image.id));
      }
    });
  }, [images, loadedImages, errorImages]);

  // Add timeout to loading state (reduced from 10s to 5s)
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    
    images.forEach(image => {
      if (loadingImages.has(image.id)) {
        const timeout = setTimeout(() => {
          handleImageError(image.id);
        }, 5000); // 5 second timeout for faster fallbacks
        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [loadingImages, images]);

  // Single image: full-width square
  if (images.length === 1) {
    const image = images[0];
    const isLoading = loadingImages.has(image.id);
    const hasError = errorImages.has(image.id);
    const isLocal = isLocalPlaceholder(image.url);

    return (
      <View style={tw`mb-4 px-4`}>
        <Pressable 
          onPress={() => onImagePress?.(image, 0)}
          style={tw`w-full aspect-square rounded-2xl overflow-hidden`}
        >
          {isLocal ? (
            <PlaceholderImage
              width={AVAILABLE_WIDTH}
              height={AVAILABLE_WIDTH}
              color={getColorFromId(image.id)}
              text={image.title || "Single Image"}
              textSize="text-lg"
            />
          ) : (
            <Image
              source={{ uri: image.url }}
              style={tw`w-full h-full`}
              resizeMode="cover"
              accessible
              accessibilityLabel={image.title || 'Post image'}
              onLoadStart={() => setLoadingImages(prev => new Set(prev).add(image.id))}
              onLoad={() => handleImageLoad(image.id)}
              onError={() => handleImageError(image.id)}
              // Performance optimizations
              fadeDuration={0}
              progressiveRenderingEnabled={true}
            />
          )}
          {isLoading && !isLocal && (
            <View style={tw`absolute inset-0 bg-neutral-800 rounded-2xl items-center justify-center`}>
              <ActivityIndicator size="large" color="#00D639" />
            </View>
          )}
          {hasError && !isLocal && (
            <View style={tw`absolute inset-0 bg-neutral-800 rounded-2xl items-center justify-center`}>
              <View style={tw`items-center`}>
                <View style={tw`w-16 h-16 bg-neutral-700 rounded-full items-center justify-center mb-2`}>
                  <View style={tw`w-8 h-8 bg-neutral-600 rounded`} />
                </View>
                <Text style={tw`text-neutral-400 text-sm`}>Image unavailable</Text>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  // Multiple images: dynamic layout
  const gap = 8; // Gap between images
  
  // For 2 images: split evenly
  if (images.length === 2) {
    const imageWidth = (AVAILABLE_WIDTH - gap) / 2;
    const imageHeight = imageWidth; // Square aspect ratio

    return (
      <View style={tw`mb-4 px-4`}>
        <View style={tw`flex-row gap-2`}>
          {images.map((image, index) => {
            const isLoading = loadingImages.has(image.id);
            const hasError = errorImages.has(image.id);
            const isLocal = isLocalPlaceholder(image.url);

            return (
              <Pressable
                key={image.id}
                onPress={() => onImagePress?.(image, index)}
                style={[
                  tw`rounded-2xl overflow-hidden`,
                  { width: imageWidth, height: imageHeight }
                ]}
              >
                {isLocal ? (
                  <PlaceholderImage
                    width={imageWidth}
                    height={imageHeight}
                    color={getColorFromId(image.id)}
                    text={image.title || `Image ${index + 1}`}
                  />
                ) : (
                  <Image
                    source={{ uri: image.url }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                    accessible
                    accessibilityLabel={image.title || `Post image ${index + 1}`}
                    onLoadStart={() => setLoadingImages(prev => new Set(prev).add(image.id))}
                    onLoad={() => handleImageLoad(image.id)}
                    onError={() => handleImageError(image.id)}
                    // Performance optimizations
                    fadeDuration={0}
                    progressiveRenderingEnabled={true}
                  />
                )}
                {isLoading && !isLocal && (
                  <View style={tw`absolute inset-0 bg-neutral-800 items-center justify-center`}>
                    <ActivityIndicator size="small" color="#00D639" />
                  </View>
                )}
                {hasError && !isLocal && (
                  <View style={tw`absolute inset-0 bg-neutral-800 items-center justify-center`}>
                    <View style={tw`items-center`}>
                      <View style={tw`w-8 h-8 bg-neutral-700 rounded-full items-center justify-center mb-1`}>
                        <View style={tw`w-4 h-4 bg-neutral-600 rounded`} />
                      </View>
                      <Text style={tw`text-neutral-400 text-xs`}>Image unavailable</Text>
                    </View>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  // For 3+ images: first 2 same size as 2-image layout, additional images same size but hang over
  const firstTwoWidth = (AVAILABLE_WIDTH - gap) / 2; // Same size as 2-image layout
  const firstTwoHeight = firstTwoWidth; // Square aspect ratio
  const additionalImageSize = firstTwoWidth; // Same size as first two

  return (
    <View style={tw`mb-6`}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4`}
        snapToInterval={firstTwoWidth + gap}
        decelerationRate="fast"
        bounces={false}
        pagingEnabled={false}
      >
        {/* First two images - same size as 2-image layout */}
        {images.slice(0, 2).map((image, index) => {
          const isLoading = loadingImages.has(image.id);
          const hasError = errorImages.has(image.id);
          const isLocal = isLocalPlaceholder(image.url);

          return (
            <Pressable
              key={image.id}
              onPress={() => onImagePress?.(image, index)}
              style={[
                tw`rounded-2xl overflow-hidden`,
                { 
                  width: firstTwoWidth, 
                  height: firstTwoHeight,
                  marginRight: gap
                }
              ]}
            >
              {isLocal ? (
                <PlaceholderImage
                  width={firstTwoWidth}
                  height={firstTwoHeight}
                  color={getColorFromId(image.id)}
                  text={image.title || `Image ${index + 1}`}
                />
              ) : (
                <Image
                  source={{ uri: image.url }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                  accessible
                  accessibilityLabel={image.title || `Post image ${index + 1}`}
                  onLoadStart={() => setLoadingImages(prev => new Set(prev).add(image.id))}
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image.id)}
                  // Performance optimizations
                  fadeDuration={0}
                  progressiveRenderingEnabled={true}
                />
              )}
              {isLoading && !isLocal && (
                <View style={tw`absolute inset-0 bg-neutral-800 items-center justify-center`}>
                  <ActivityIndicator size="small" color="#00D639" />
                </View>
              )}
              {hasError && !isLocal && (
                <View style={tw`absolute inset-0 bg-neutral-800 items-center justify-center`}>
                  <View style={tw`items-center`}>
                    <View style={tw`w-8 h-8 bg-neutral-700 rounded-full items-center justify-center mb-1`}>
                      <View style={tw`w-4 h-4 bg-neutral-600 rounded`} />
                    </View>
                    <Text style={tw`text-neutral-400 text-xs`}>Image unavailable</Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Additional images - same size as first two but hang over */}
        {images.slice(2).map((image, index) => {
          const isLoading = loadingImages.has(image.id);
          const hasError = errorImages.has(image.id);
          const isLocal = isLocalPlaceholder(image.url);

          return (
            <Pressable
              key={image.id}
              onPress={() => onImagePress?.(image, index + 2)}
              style={[
                tw`rounded-2xl overflow-hidden`,
                { 
                  width: additionalImageSize, 
                  height: additionalImageSize,
                  marginRight: index === images.slice(2).length - 1 ? 0 : gap
                }
              ]}
            >
              {isLocal ? (
                <PlaceholderImage
                  width={additionalImageSize}
                  height={additionalImageSize}
                  color={getColorFromId(image.id)}
                  text={image.title || `Image ${index + 3}`}
                />
              ) : (
                <Image
                  source={{ uri: image.url }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                  accessible
                  accessibilityLabel={image.title || `Post image ${index + 3}`}
                  onLoadStart={() => setLoadingImages(prev => new Set(prev).add(image.id))}
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image.id)}
                  // Performance optimizations
                  fadeDuration={0}
                  progressiveRenderingEnabled={true}
                />
              )}
              {isLoading && !isLocal && (
                <View style={tw`absolute inset-0 bg-neutral-800 items-center justify-center`}>
                  <ActivityIndicator size="small" color="#00D639" />
                </View>
              )}
              {hasError && !isLocal && (
                <View style={tw`absolute inset-0 bg-neutral-800 items-center justify-center`}>
                  <View style={tw`items-center`}>
                    <View style={tw`w-8 h-8 bg-neutral-700 rounded-full items-center justify-center mb-1`}>
                      <View style={tw`w-4 h-4 bg-neutral-600 rounded`} />
                    </View>
                    <Text style={tw`text-neutral-400 text-xs`}>Image unavailable</Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
