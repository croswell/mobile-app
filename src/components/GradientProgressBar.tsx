import React from 'react';
import { View, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from '../../lib/tw';

interface GradientProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  style?: ViewStyle;
  backgroundColor?: string;
  colors?: [ColorValue, ColorValue]; // Custom gradient colors - tuple of exactly 2 colors
}

export default function GradientProgressBar({
  progress,
  height = 12,
  style,
  backgroundColor = '#2a2a2a',
  colors = ['#8DFF29', '#00D638'] // Default green gradient
}: GradientProgressBarProps) {
  const progressWidth = `${Math.min(Math.max(progress * 100, 0), 100)}%`;
  
  return (
    <View style={[tw`rounded-full overflow-hidden`, { height, backgroundColor }, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          tw`h-full rounded-full`,
          { width: progressWidth }
        ]}
      />
    </View>
  );
}
