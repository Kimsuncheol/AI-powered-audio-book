import { ThemedText } from "@/components/themed-text";
import { PLAYBACK_RATES } from "@/types/playback";
import { Pressable, StyleSheet, View } from "react-native";

interface PlaybackRateMenuProps {
  visible: boolean;
  currentRate: number;
  onSelect: (rate: number) => void;
  colors: {
    tint: string;
  };
  cardBgColor: string;
}

export function PlaybackRateMenu({
  visible,
  currentRate,
  onSelect,
  colors,
  cardBgColor,
}: PlaybackRateMenuProps) {
  if (!visible) return null;
  const tintButtonTextColor =
    colors.tint.toLowerCase() === "#fff" || colors.tint.toLowerCase() === "#ffffff"
      ? "#000000"
      : "#FFFFFF";

  return (
    <View style={[styles.menuContainer, { backgroundColor: cardBgColor }]}>
      <ThemedText style={styles.menuTitle}>Playback Speed</ThemedText>
      <View style={styles.menuGrid}>
        {PLAYBACK_RATES.map((rate) => (
          <Pressable
            key={rate}
            style={[
              styles.menuItem,
              currentRate === rate && {
                backgroundColor: colors.tint,
              },
            ]}
            onPress={() => onSelect(rate)}
          >
            <ThemedText
              style={[
                styles.menuItemText,
                currentRate === rate && { color: tintButtonTextColor },
              ]}
            >
              {rate}x
            </ThemedText>
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
