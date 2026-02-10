import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface SkipControlsProps {
  onSkipBackward: () => void;
  onSkipForward: () => void;
  colors: {
    tint: string;
  };
}

export function SkipControls({
  onSkipBackward,
  onSkipForward,
  colors,
}: SkipControlsProps) {
  return (
    <View style={styles.skipControls}>
      <Pressable
        onPress={onSkipBackward}
        style={[styles.skipButton, { backgroundColor: colors.tint + "20" }]}
      >
        <IconSymbol size={48} name="gobackward.30" color={colors.tint} />
      </Pressable>

      <Pressable
        onPress={onSkipForward}
        style={[styles.skipButton, { backgroundColor: colors.tint + "20" }]}
      >
        <IconSymbol size={48} name="goforward.30" color={colors.tint} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  skipControls: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 40,
  },
  skipButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
