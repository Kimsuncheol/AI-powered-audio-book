import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface StatItem {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
}

interface AuthorStatsGridProps {
  stats: StatItem[];
  cardBgColor: string;
}

export function AuthorStatsGrid({ stats, cardBgColor }: AuthorStatsGridProps) {
  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: cardBgColor }]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: stat.iconColor + "20" },
            ]}
          >
            <IconSymbol size={22} name={stat.icon} color={stat.iconColor} />
          </View>
          <ThemedText style={styles.value}>{stat.value}</ThemedText>
          <ThemedText style={styles.label}>{stat.label}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontSize: 13,
    opacity: 0.6,
  },
});
