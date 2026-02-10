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
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <View style={styles.speedGrid}>
      {PLAYBACK_RATES.map((rate) => (
        <Pressable
          key={rate}
          style={[
            styles.speedButton,
            { backgroundColor: cardBgColor },
            currentRate === rate && {
              backgroundColor: colors.tint,
            },
          ]}
          onPress={() => onRateChange(rate)}
        >
          <ThemedText
            style={[
              styles.speedButtonText,
              currentRate === rate && styles.speedButtonTextActive,
              { color: textColor },
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
  speedButtonTextActive: {
    color: "#FFFFFF",
  },
});
