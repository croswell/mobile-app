import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from '../../lib/tw';

interface GradientButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'horizontal' | 'vertical';
}

export default function GradientButton({
  onPress,
  title,
  disabled = false,
  style,
  textStyle,
  variant = 'vertical'
}: GradientButtonProps) {
  const colors: [string, string] = variant === 'horizontal' 
    ? ['#00D638', '#8DFF29'] 
    : ['#8DFF29', '#00D638'];
  
  const start = variant === 'horizontal' 
    ? { x: 0, y: 0 } 
    : { x: 0, y: 0 };
  
  const end = variant === 'horizontal' 
    ? { x: 1, y: 0 } 
    : { x: 0, y: 1 };

  if (disabled) {
    return (
      <Pressable 
        style={[tw`w-full rounded-lg py-3 bg-neutral-700`, style]} 
        disabled={true}
      >
        <Text style={[tw`text-neutral-950 text-center text-base font-bold`, textStyle]}>
          {title}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={tw`w-full rounded-lg py-3 items-center justify-center`}
      >
        <Text style={[tw`text-neutral-950 text-center text-base font-bold`, textStyle]}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
