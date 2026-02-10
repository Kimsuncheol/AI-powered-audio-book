import { BookGrid } from "@/components/library/BookGrid";
import { ContinueListeningSection } from "@/components/library/ContinueListeningSection";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { SearchBar } from "@/components/library/SearchBar";
import { SectionHeader } from "@/components/library/SectionHeader";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useProgress } from "@/context/progress-context";
import { MOCK_AUDIOBOOKS } from "@/data/mock-audiobooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AudioBook } from "@/types/audiobook";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, isGuest } = useAuth();
  const { getInProgressBooks } = useProgress();
  const [searchQuery, setSearchQuery] = useState("");

  // Get in-progress books with their details
  const inProgressList = getInProgressBooks();

  // Need to fix this implementation to match what ContinueListeningSection expects
  const continueListeningBooks = inProgressList
    .map((progress) => {
      const book = MOCK_AUDIOBOOKS.find((b) => b.id === progress.bookId);
      return book ? { book, progress } : null;
    })
    .filter(
      (
        item,
      ): item is { book: AudioBook; progress: (typeof inProgressList)[0] } =>
        item !== null,
    );

  // Filter books based on search query
  const filteredBooks = MOCK_AUDIOBOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const inputBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const inputTextColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const placeholderColor = colorScheme === "dark" ? "#8E8E93" : "#999";

  return (
    <ThemedView style={styles.container}>
      <LibraryHeader userName={user?.displayName || ""} isGuest={isGuest} />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        colors={colors}
        inputBgColor={inputBgColor}
        inputTextColor={inputTextColor}
        placeholderColor={placeholderColor}
      />

      {/* Continue Listening Section */}
      {!isGuest &&
        searchQuery.length === 0 &&
        continueListeningBooks.length > 0 && (
          <ContinueListeningSection
            books={continueListeningBooks}
            colors={colors}
            cardBgColor={inputBgColor}
          />
        )}

      <SectionHeader
        title="My Library"
        subtitle={`${filteredBooks.length} books`}
      />

      <BookGrid books={filteredBooks} colors={colors} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
