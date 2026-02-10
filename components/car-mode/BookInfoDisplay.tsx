import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";

interface BookInfoDisplayProps {
  bookTitle?: string;
  author?: string;
  chapterNumber?: number;
  chapterTitle?: string;
}

export function BookInfoDisplay({
  bookTitle,
  author,
  chapterNumber,
  chapterTitle,
}: BookInfoDisplayProps) {
  return (
    <View style={styles.bookInfo}>
      <ThemedText type="title" style={styles.bookTitle} numberOfLines={2}>
        {bookTitle || "No Book Playing"}
      </ThemedText>
      <ThemedText style={styles.author} numberOfLines={1}>
        {author || "Select a book to play"}
      </ThemedText>
      {chapterNumber && chapterTitle && (
        <ThemedText
          style={[styles.chapter, { opacity: 0.7 }]}
          numberOfLines={1}
        >
          Chapter {chapterNumber}: {chapterTitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookInfo: {
    alignItems: "center",
    marginBottom: 60,
  },
  bookTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  author: {
    fontSize: 24,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 8,
  },
  chapter: {
    fontSize: 18,
    textAlign: "center",
  },
});
