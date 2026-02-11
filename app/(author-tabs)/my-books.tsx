import { BookCard, BookData } from "@/components/author/my-books/BookCard";
import { EmptyBooksState } from "@/components/author/my-books/EmptyBooksState";
import { MyBooksHeader } from "@/components/author/my-books/MyBooksHeader";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_BOOKS: BookData[] = [
  {
    id: "1",
    title: "The Silent Echo",
    narrator: "Sarah Mitchell",
    status: "published",
    listens: 15234,
    rating: 4.8,
    earnings: "$1,245",
  },
  {
    id: "2",
    title: "Midnight Whispers",
    narrator: "James Turner",
    status: "published",
    listens: 10120,
    rating: 4.6,
    earnings: "$890",
  },
  {
    id: "3",
    title: "Ocean Dreams",
    narrator: "Emily Chen",
    status: "published",
    listens: 8450,
    rating: 4.9,
    earnings: "$720",
  },
  {
    id: "4",
    title: "Beneath the Stars",
    narrator: "David Kim",
    status: "in_review",
    listens: 0,
    rating: 0,
    earnings: "$0",
  },
  {
    id: "5",
    title: "Forgotten Paths",
    narrator: "Lisa Park",
    status: "draft",
    listens: 0,
    rating: 0,
    earnings: "$0",
  },
];

export default function MyBooksScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  const handleBookPress = (book: BookData) => {
    Alert.alert(book.title, `Status: ${book.status}\nListens: ${book.listens}`);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MyBooksHeader bookCount={MOCK_BOOKS.length} />

          {MOCK_BOOKS.length === 0 ? (
            <EmptyBooksState tintColor={colors.tint} />
          ) : (
            MOCK_BOOKS.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                cardBgColor={cardBgColor}
                tintColor={colors.tint}
                onPress={() => handleBookPress(book)}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
});
