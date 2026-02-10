import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface NarratorCardProps {
  narrator: string;
  cardBgColor: string;
  colors: {
    icon: string;
  };
}

export function NarratorCard({
  narrator,
  cardBgColor,
  colors,
}: NarratorCardProps) {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Narrator
      </ThemedText>
      <View style={[styles.narratorCard, { backgroundColor: cardBgColor }]}>
        <IconSymbol size={32} name="mic.fill" color={colors.icon} />
        <View style={styles.narratorInfo}>
          <ThemedText style={styles.narratorName}>{narrator}</ThemedText>
          <ThemedText style={styles.narratorTitle}>Voice Artist</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  narratorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  narratorInfo: {
    flex: 1,
  },
  narratorName: {
    fontSize: 16,
    fontWeight: "600",
  },
  narratorTitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
});
