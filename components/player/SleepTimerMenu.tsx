import { ThemedText } from "@/components/themed-text";
import { Pressable, StyleSheet, View } from "react-native";

interface SleepTimerMenuProps {
  visible: boolean;
  onSelect: (minutes: number) => void;
  colors: {
    tint: string;
  };
  cardBgColor: string;
}

export function SleepTimerMenu({
  visible,
  onSelect,
  colors,
  cardBgColor,
}: SleepTimerMenuProps) {
  if (!visible) return null;

  const timerOptions = [5, 10, 15, 30, 45, 60];

  return (
    <View style={[styles.menuContainer, { backgroundColor: cardBgColor }]}>
      <ThemedText style={styles.menuTitle}>Sleep Timer</ThemedText>
      <View style={styles.menuGrid}>
        {timerOptions.map((minutes) => (
          <Pressable
            key={minutes}
            style={styles.menuItem}
            onPress={() => onSelect(minutes)}
          >
            <ThemedText style={styles.menuItemText}>{minutes}m</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    marginTop: 24,
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
