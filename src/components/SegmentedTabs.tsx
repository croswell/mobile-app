import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, LayoutChangeEvent, Animated, StyleSheet } from "react-native";

type Tab = { key: string; label: string };
type Props = {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
  paddingH?: number;   // horizontal padding inside each tab
  paddingV?: number;   // vertical padding
};

export default function SegmentedTabs({
  tabs,
  value,
  onChange,
  paddingH = 12,  // Reduced from 14
  paddingV = 6,   // Reduced from 8
}: Props) {
  const [containerX, setContainerX] = useState(0);
  const [layouts, setLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const leftAnim = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;

  const selected = useMemo(() => tabs.find(t => t.key === value) ?? tabs[0], [tabs, value]);

  // Animate pill when value or measurements change
  useEffect(() => {
    const target = layouts[selected.key];
    if (!target) return;
    
    // Calculate the target position and width
    const targetLeft = target.x - containerX;
    const targetWidth = target.width;
    
    Animated.spring(leftAnim, {
      toValue: targetLeft,
      useNativeDriver: false, // animating layout properties (left/width)
      damping: 25,
      stiffness: 300,
      mass: 0.8,
    }).start();

    Animated.timing(widthAnim, {
      toValue: targetWidth,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [selected.key, layouts, containerX]);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerX(e.nativeEvent.layout.x);
  };

  const onItemLayout =
    (key: string) =>
    (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      setLayouts(prev => ({ ...prev, [key]: { x, width } }));
    };

  return (
    <View onLayout={onContainerLayout} style={styles.wrap}>
      {/* background track */}
      <View style={styles.track} />

      {/* animated selection background */}
      {layouts[selected.key] && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.selection,
            {
              left: leftAnim,
              width: widthAnim,
              borderRadius: 8,
            },
          ]}
        />
      )}

      {/* tabs */}
      <View style={styles.row}>
        {tabs.map(t => {
          const isActive = t.key === value;
          return (
            <Pressable
              key={t.key}
              onPress={() => onChange(t.key)}
              onLayout={onItemLayout(t.key)}
              style={{ 
                flex: 1, 
                paddingHorizontal: paddingH, 
                paddingVertical: paddingV, 
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                // Ensure each tab takes exactly half the width
                width: `${100 / tabs.length}%`,
              }}
            >
              <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]} numberOfLines={1}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    alignSelf: "stretch",
    minHeight: 36,
    borderRadius: 8,
    overflow: "hidden", // Ensure clean rounded appearance
    padding: 0,
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#171717", // neutral-900
    borderRadius: 8,
  },
  selection: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "#52525b", // neutral-600
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minHeight: 36,
    position: "relative",
    zIndex: 1,
    padding: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeLabel: { color: "#fafafa" }, // neutral-50
  inactiveLabel: { color: "#d4d4d8" }, // neutral-300
});
