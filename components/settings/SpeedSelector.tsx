import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { PLAYBACK_RATES } from "@/types/playback";
import { Pressable, StyleSheet, View } from "react-native";

interface SpeedSelectorProps {
  currentRate: number;
  onRateChange: (rate: number) => void;
  colors: {
    tint: string;
    text: string;
  };
  cardBgColor: string;
}

export function SpeedSelector({
  currentRate,
  onRateChange,
  colors,
  cardBgColor,
}: SpeedSelectorProps) {
  const theme = useColorScheme();

  // Unselected: semi-transparent tint background with theme text
  // Selected: full tint background with white text
  const unselectedBgColor =
    theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(10, 126, 164, 0.1)";
  const textColor = theme === "dark" ? "#000000" : "#FFFFFF";

  return (
    <View style={styles.speedGrid}>
      {PLAYBACK_RATES.map((rate) => (
        <Pressable
          key={rate}
          style={[
            styles.speedButton,
            { backgroundColor: unselectedBgColor },

            currentRate === rate && {
              backgroundColor: colors.tint,
            },
          ]}
          onPress={() => onRateChange(rate)}
        >
          <ThemedText
            style={[
              styles.speedButtonText,
              currentRate === rate && { color: textColor },
            ]}
          >
            {rate}x
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  speedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  speedButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  speedButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
