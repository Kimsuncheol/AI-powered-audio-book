import { AudioBook } from "@/types/audiobook";
import { FlatList, StyleSheet } from "react-native";
import { BookCard } from "./BookCard";
import { EmptyState } from "./EmptyState";

interface BookGridProps {
  books: AudioBook[];
  colors: {
    icon: string;
  };
}

export function BookGrid({ books, colors }: BookGridProps) {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookCard book={item} colors={colors} />}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<EmptyState colors={colors} />}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
