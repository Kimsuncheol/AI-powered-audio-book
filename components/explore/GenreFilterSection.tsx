import { ThemedText } from "@/components/themed-text";
import { AudioBook } from "@/types/audiobook";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { CompactBookCard } from "./CompactBookCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 3; // 3 columns for compact view

interface GenreFilterSectionProps {
  genres: string[];
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
  books: AudioBook[];
  cardBgColor: string;
  colors: {
    tint: string;
  };
}

export function GenreFilterSection({
  genres,
  selectedGenre,
  onGenreSelect,
  books,
  cardBgColor,
  colors,
}: GenreFilterSectionProps) {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Browse by Genre
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreScroll}
        contentContainerStyle={styles.genreScrollContent}
      >
        {genres.map((genre) => (
          <Pressable
            key={genre}
            style={[
              styles.genreChip,
              selectedGenre === genre && { backgroundColor: colors.tint },
              selectedGenre !== genre && { backgroundColor: cardBgColor },
            ]}
            onPress={() => onGenreSelect(genre)}
          >
            <ThemedText
              style={[
                styles.genreChipText,
                selectedGenre === genre && styles.genreChipTextActive,
              ]}
            >
              {genre}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.compactGrid}>
        {books.map((book) => (
          <CompactBookCard key={book.id} book={book} cardWidth={CARD_WIDTH} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    paddingHorizontal: 20,
  },
  genreScroll: {
    marginBottom: 16,
  },
  genreScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  genreChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  genreChipTextActive: {
    color: "#FFFFFF",
  },
  compactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
});
