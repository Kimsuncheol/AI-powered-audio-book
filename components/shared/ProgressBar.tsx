import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface ProgressBarProps {
  progress: number; // 0 to 100
  color: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export function ProgressBar({
  progress,
  color,
  height = 3,
  style,
  backgroundColor = "rgba(128, 128, 128, 0.2)",
}: ProgressBarProps) {
  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.max(0, Math.min(100, progress))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
