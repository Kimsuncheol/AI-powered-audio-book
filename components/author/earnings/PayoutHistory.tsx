import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface PayoutItem {
  id: string;
  date: string;
  amount: string;
  status: "completed" | "pending" | "processing";
}

interface PayoutHistoryProps {
  payouts: PayoutItem[];
  cardBgColor: string;
}

const PAYOUT_STATUS: Record<
  string,
  { color: string; icon: string; label: string }
> = {
  completed: {
    color: "#34C759",
    icon: "checkmark.circle.fill",
    label: "Completed",
  },
  pending: { color: "#FF9500", icon: "clock.fill", label: "Pending" },
  processing: {
    color: "#007AFF",
    icon: "arrow.triangle.2.circlepath",
    label: "Processing",
  },
};

export function PayoutHistory({ payouts, cardBgColor }: PayoutHistoryProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Payout History</ThemedText>
      <View style={[styles.list, { backgroundColor: cardBgColor }]}>
        {payouts.map((payout, index) => {
          const status = PAYOUT_STATUS[payout.status];
          return (
            <View
              key={payout.id}
              style={[
                styles.item,
                index < payouts.length - 1 && styles.itemBorder,
              ]}
            >
              <View
                style={[
                  styles.statusIcon,
                  { backgroundColor: status.color + "20" },
                ]}
              >
                <IconSymbol size={18} name={status.icon} color={status.color} />
              </View>
              <View style={styles.itemInfo}>
                <ThemedText style={styles.amount}>{payout.amount}</ThemedText>
                <ThemedText style={styles.date}>{payout.date}</ThemedText>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: status.color + "20" },
                ]}
              >
                <ThemedText
                  style={[styles.statusText, { color: status.color }]}
                >
                  {status.label}
                </ThemedText>
              </View>
            </View>
          );
        })}
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
  list: {
    borderRadius: 16,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.2)",
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: {
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
