import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";

interface TopBookItem {
  id: string;
  title: string;
  listens: number;
  revenue: string;
}

interface TopBooksProps {
  books: TopBookItem[];
  cardBgColor: string;
  tintColor: string;
}

export function TopBooks({ books, cardBgColor, tintColor }: TopBooksProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Top Performing Books</ThemedText>
      <View style={[styles.list, { backgroundColor: cardBgColor }]}>
        {books.map((book, index) => (
          <View
            key={book.id}
            style={[styles.item, index < books.length - 1 && styles.itemBorder]}
          >
            <View style={[styles.rank, { backgroundColor: tintColor + "20" }]}>
              <ThemedText style={[styles.rankText, { color: tintColor }]}>
                #{index + 1}
              </ThemedText>
            </View>
            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemTitle} numberOfLines={1}>
                {book.title}
              </ThemedText>
              <ThemedText style={styles.itemSubtitle}>
                {book.listens.toLocaleString()} listens
              </ThemedText>
            </View>
            <ThemedText style={styles.revenue}>{book.revenue}</ThemedText>
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
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.2)",
  },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  revenue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34C759",
  },
});
