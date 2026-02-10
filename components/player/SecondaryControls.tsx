import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface SecondaryControlsProps {
  playbackRate: number;
  isSleepTimerActive: boolean;
  onToggleRates: () => void;
  onToggleSleepTimer: () => void;
  colors: {
    tint: string;
    text: string;
  };
  cardBgColor: string;
}

export function SecondaryControls({
  playbackRate,
  isSleepTimerActive,
  onToggleRates,
  onToggleSleepTimer,
  colors,
  cardBgColor,
}: SecondaryControlsProps) {
  return (
    <View style={styles.secondaryControls}>
      <Pressable
        style={[styles.secondaryButton, { backgroundColor: cardBgColor }]}
        onPress={onToggleRates}
      >
        <ThemedText style={styles.secondaryButtonText}>
          {playbackRate}x
        </ThemedText>
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, { backgroundColor: cardBgColor }]}
        onPress={onToggleSleepTimer}
      >
        <IconSymbol
          size={20}
          name={isSleepTimerActive ? "moon.fill" : "moon"}
          color={isSleepTimerActive ? colors.tint : colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  secondaryControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
