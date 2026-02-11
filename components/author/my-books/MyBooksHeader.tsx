import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";

interface MyBooksHeaderProps {
  bookCount: number;
}

export function MyBooksHeader({ bookCount }: MyBooksHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <ThemedText type="title" style={styles.title}>
          My Books
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {bookCount} {bookCount === 1 ? "book" : "books"} published
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.6,
  },
});
