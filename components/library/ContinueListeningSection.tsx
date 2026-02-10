import { AudioBook } from "@/types/audiobook";
import { ScrollView, StyleSheet, View } from "react-native";
import { ContinueListeningCard } from "./ContinueListeningCard";
import { SectionHeader } from "./SectionHeader";

interface ContinueListeningSectionProps {
  books: Array<{
    book: AudioBook;
    progress: {
      currentChapter: number;
      currentPosition: number;
    };
  }>;
  colors: {
    tint: string;
  };
  cardBgColor: string;
}

export function ContinueListeningSection({
  books,
  colors,
  cardBgColor,
}: ContinueListeningSectionProps) {
  if (books.length === 0) return null;

  return (
    <View style={styles.continueSection}>
      <SectionHeader title="Continue Listening" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.continueScroll}
      >
        {books.map(({ book, progress }) => (
          <ContinueListeningCard
            key={book.id}
            book={book}
            progress={progress}
            colors={colors}
            cardBgColor={cardBgColor}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  continueSection: {
    marginBottom: 8,
  },
  continueScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
});
