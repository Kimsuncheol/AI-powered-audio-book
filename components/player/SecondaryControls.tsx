import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface SecondaryControlsProps {
  isSleepTimerActive: boolean;
  onToggleSleepTimer: () => void;
  colors: {
    tint: string;
    text: string;
  };
  cardBgColor: string;
}

export function SecondaryControls({
  isSleepTimerActive,
  onToggleSleepTimer,
  colors,
  cardBgColor,
}: SecondaryControlsProps) {
  return (
    <View style={styles.secondaryControls}>
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
});
