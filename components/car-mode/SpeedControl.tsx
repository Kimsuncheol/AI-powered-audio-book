import { ThemedText } from "@/components/themed-text";
import { Pressable, StyleSheet, View } from "react-native";

interface SpeedControlProps {
  playbackRate: number;
  onChangeSpeed: () => void;
  colors: {
    tint: string;
  };
}

export function SpeedControl({
  playbackRate,
  onChangeSpeed,
  colors,
}: SpeedControlProps) {
  return (
    <View style={styles.speedControl}>
      <Pressable
        onPress={onChangeSpeed}
        style={[styles.speedButton, { backgroundColor: colors.tint + "20" }]}
      >
        <ThemedText style={[styles.speedText, { color: colors.tint }]}>
          {playbackRate}x
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  speedControl: {
    alignItems: "center",
  },
  speedButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  speedText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
