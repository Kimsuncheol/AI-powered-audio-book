import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AudioBook } from "@/types/audiobook";
import { ScrollView, StyleSheet, View } from "react-native";
import { FeaturedBookCard } from "./FeaturedBookCard";

interface TopRatedSectionProps {
  books: AudioBook[];
  cardBgColor: string;
}

export function TopRatedSection({ books, cardBgColor }: TopRatedSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <IconSymbol size={20} name="star.fill" color="#FFD700" />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Top Rated
          </ThemedText>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontal}
      >
        {books.map((book) => (
          <FeaturedBookCard
            key={book.id}
            book={book}
            cardBgColor={cardBgColor}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
  },
  horizontal: {
    paddingLeft: 20,
  },
});
