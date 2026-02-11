import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface ListeningTrendsProps {
  tintColor: string;
  cardBgColor: string;
}

export function ListeningTrends({
  tintColor,
  cardBgColor,
}: ListeningTrendsProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Listening Trends</ThemedText>
      <View style={[styles.placeholder, { backgroundColor: cardBgColor }]}>
        <IconSymbol
          size={48}
          name="chart.line.uptrend.xyaxis"
          color={tintColor}
        />
        <ThemedText style={styles.placeholderTitle}>
          Trends Coming Soon
        </ThemedText>
        <ThemedText style={styles.placeholderSubtitle}>
          Detailed listening trends and charts will be available here
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },
  placeholder: {
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    gap: 10,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholderSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
});
