import { useEffect, useRef } from "react";
import { View, Pressable, Animated, Dimensions, Easing, Keyboard } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import tw from "../lib/tw";

const SCREEN_H = Dimensions.get("window").height;

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialHeight?: number;
};

export default function BottomSheet({ open, onClose, children, initialHeight = SCREEN_H * 0.40 }: Props) {
  // Use the provided height but add space for navigation bar coverage
  const minHeight = Math.max(initialHeight, 250);
  const translateY = useRef(new Animated.Value(minHeight + 120)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  
  // Ensure height covers navigation bar completely
  const extendedHeight = minHeight + 120;

  // open/close animation
  useEffect(() => {
    if (open) {
      // Reset drag offset when opening
      dragY.setValue(0);
      
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0, // Slide up to completely cover navigation bar
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: extendedHeight, // Slide down below screen
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [open, initialHeight]);

  // drag-to-dismiss
  const dragY = useRef(new Animated.Value(0)).current;
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: dragY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const { translationY, velocityY } = nativeEvent;
      const shouldClose = translationY > 80 || velocityY > 800;
      
      if (shouldClose) {
        onClose();
      } else {
        // Reset drag position
        Animated.spring(dragY, { 
          toValue: 0, 
          useNativeDriver: true,
          tension: 100,
          friction: 8
        }).start();
      }
    } else if (nativeEvent.state === State.ACTIVE) {
      // Constrain drag while active to prevent going off screen
      const { translationY } = nativeEvent;
      if (translationY < -100) { // Limit upward drag
        dragY.setValue(-100);
      }
    }
  };

  // Don't render anything if not open
  if (!open) {
    return null;
  }

  return (
    <>
      {/* backdrop */}
      <Animated.View
        pointerEvents="auto"
        style={[
          tw`absolute inset-0 bg-black`,
          { 
            opacity: backdrop.interpolate({ inputRange: [0,1], outputRange: [0,0.4] }),
            zIndex: 9999
          }
        ]}
      >
        <Pressable style={tw`flex-1`} onPress={onClose} accessibilityLabel="Close emoji picker" />
      </Animated.View>

      {/* sheet */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            tw`absolute left-0 right-0 rounded-t-2xl bg-neutral-900`,
            { 
              height: extendedHeight,
              bottom: -50, // Extend below the screen edge to ensure full coverage
              transform: [{ translateY: Animated.add(translateY, dragY) }],
              zIndex: 10000
            }
          ]}
          accessibilityViewIsModal
          accessibilityLabel="Emoji picker drawer"
        >
          {/* handle */}
          <View style={tw`items-center pt-3 pb-2`}>
            <View style={tw`w-10 h-1.5 rounded-full bg-neutral-700`} />
          </View>

          <View style={tw`px-8 pb-4`}>{children}</View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}
