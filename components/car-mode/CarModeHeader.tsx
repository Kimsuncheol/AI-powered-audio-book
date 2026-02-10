import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface CarModeHeaderProps {
  onExit: () => void;
  colors: {
    icon: string;
    tint: string;
  };
}

export function CarModeHeader({ onExit, colors }: CarModeHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onExit} style={styles.exitButton}>
        <IconSymbol size={32} name="xmark.circle.fill" color={colors.icon} />
      </Pressable>
      <View style={styles.carModeIndicator}>
        <IconSymbol size={24} name="car.fill" color={colors.tint} />
        <ThemedText style={[styles.carModeText, { color: colors.tint }]}>
          Car Mode
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  exitButton: {
    padding: 8,
  },
  carModeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  carModeText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
