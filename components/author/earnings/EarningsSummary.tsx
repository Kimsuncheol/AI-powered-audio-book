import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface EarningsSummaryProps {
  totalEarnings: string;
  thisMonth: string;
  lastMonth: string;
  cardBgColor: string;
}

export function EarningsSummary({
  totalEarnings,
  thisMonth,
  lastMonth,
  cardBgColor,
}: EarningsSummaryProps) {
  return (
    <View style={[styles.card, { backgroundColor: cardBgColor }]}>
      <View style={styles.totalRow}>
        <View style={styles.iconContainer}>
          <IconSymbol size={28} name="dollarsign.circle.fill" color="#34C759" />
        </View>
        <View>
          <ThemedText style={styles.totalLabel}>Total Earnings</ThemedText>
          <ThemedText style={styles.totalValue}>{totalEarnings}</ThemedText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.periodRow}>
        <View style={styles.period}>
          <ThemedText style={styles.periodLabel}>This Month</ThemedText>
          <ThemedText style={styles.periodValue}>{thisMonth}</ThemedText>
        </View>
        <View style={styles.periodSeparator} />
        <View style={styles.period}>
          <ThemedText style={styles.periodLabel}>Last Month</ThemedText>
          <ThemedText style={styles.periodValue}>{lastMonth}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#34C75920",
    alignItems: "center",
    justifyContent: "center",
  },
  totalLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(128,128,128,0.3)",
    marginVertical: 16,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  period: {
    flex: 1,
    alignItems: "center",
  },
  periodSeparator: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: "rgba(128,128,128,0.3)",
  },
  periodLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 4,
  },
  periodValue: {
    fontSize: 20,
    fontWeight: "600",
  },
});
