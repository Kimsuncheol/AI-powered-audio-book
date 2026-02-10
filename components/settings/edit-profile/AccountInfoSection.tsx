import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface AccountInfoSectionProps {
  email: string;
  memberSince: string;
  accountId: string;
  colors: {
    text: string;
    icon: string;
  };
  cardBgColor: string;
}

export function AccountInfoSection({
  email,
  memberSince,
  accountId,
  colors,
  cardBgColor,
}: AccountInfoSectionProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Account Information</ThemedText>

      <View style={[styles.infoCard, { backgroundColor: cardBgColor }]}>
        <View style={styles.infoRow}>
          <IconSymbol size={20} name="envelope.fill" color={colors.icon} />
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={[styles.infoValue]}>{email}</ThemedText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <IconSymbol size={20} name="calendar" color={colors.icon} />
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoLabel}>Member Since</ThemedText>
            <ThemedText style={[styles.infoValue]}>{memberSince}</ThemedText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <IconSymbol size={20} name="number" color={colors.icon} />
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoLabel}>Account ID</ThemedText>
            <ThemedText style={[styles.infoValue, { fontFamily: "monospace" }]}>
              {accountId}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    marginVertical: 8,
  },
});
