import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";

interface MonthlyItem {
  month: string;
  amount: string;
  books: number;
}

interface MonthlyBreakdownProps {
  months: MonthlyItem[];
  cardBgColor: string;
}

export function MonthlyBreakdown({
  months,
  cardBgColor,
}: MonthlyBreakdownProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Monthly Breakdown</ThemedText>
      <View style={[styles.list, { backgroundColor: cardBgColor }]}>
        {months.map((item, index) => (
          <View
            key={item.month}
            style={[
              styles.item,
              index < months.length - 1 && styles.itemBorder,
            ]}
          >
            <View>
              <ThemedText style={styles.month}>{item.month}</ThemedText>
              <ThemedText style={styles.booksText}>
                {item.books} {item.books === 1 ? "book" : "books"} earning
              </ThemedText>
            </View>
            <ThemedText style={styles.amount}>{item.amount}</ThemedText>
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
  list: {
    borderRadius: 16,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.2)",
  },
  month: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  booksText: {
    fontSize: 13,
    opacity: 0.6,
  },
  amount: {
    fontSize: 17,
    fontWeight: "600",
    color: "#34C759",
  },
});
