import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface OverviewStat {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  change?: string;
  changePositive?: boolean;
}

interface AnalyticsOverviewProps {
  stats: OverviewStat[];
  cardBgColor: string;
}

export function AnalyticsOverview({
  stats,
  cardBgColor,
}: AnalyticsOverviewProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Overview</ThemedText>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: cardBgColor }]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: stat.iconColor + "20" },
                ]}
              >
                <IconSymbol size={18} name={stat.icon} color={stat.iconColor} />
              </View>
              {stat.change && (
                <ThemedText
                  style={[
                    styles.change,
                    { color: stat.changePositive ? "#34C759" : "#FF3B30" },
                  ]}
                >
                  {stat.change}
                </ThemedText>
              )}
            </View>
            <ThemedText style={styles.value}>{stat.value}</ThemedText>
            <ThemedText style={styles.label}>{stat.label}</ThemedText>
          </View>
        ))}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 16,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    fontSize: 13,
    opacity: 0.6,
  },
  change: {
    fontSize: 12,
    fontWeight: "600",
  },
});
