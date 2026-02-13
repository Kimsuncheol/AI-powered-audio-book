import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface PlayerHeaderProps {
  onBack: () => void;
  onMenuPress: () => void;
  onCarModePress?: () => void;
  showCarMode?: boolean;
  colors: {
    text: string;
    tint: string;
  };
  buttonBackgroundColor?: string; // Add prop for button background
}

export function PlayerHeader({
  onBack,
  onMenuPress,
  onCarModePress,
  showCarMode = false,
  colors,
  buttonBackgroundColor = "transparent", // Default to transparent
}: PlayerHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        style={[
          styles.headerButton,
          { backgroundColor: buttonBackgroundColor },
        ]}
        onPress={onBack}
        hitSlop={12} // Increase hit area
      >
        <IconSymbol size={28} name="chevron.left" color={colors.text} />
      </Pressable>
      <View style={styles.headerCenter}>
        <ThemedText style={styles.headerTitle}>Now Playing</ThemedText>
        {showCarMode && onCarModePress && (
          <Pressable style={styles.carModeButton} onPress={onCarModePress}>
            <IconSymbol size={16} name="car.fill" color={colors.tint} />
            <ThemedText style={[styles.carModeText, { color: colors.tint }]}>
              Car Mode
            </ThemedText>
          </Pressable>
        )}
      </View>
      <Pressable style={styles.headerButton} onPress={onMenuPress}>
        <IconSymbol size={24} name="ellipsis.circle" color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22, // Make it circular
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  carModeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  carModeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
