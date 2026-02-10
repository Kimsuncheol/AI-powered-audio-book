import { ThemedText } from "@/components/themed-text";
import { AudioBook } from "@/types/audiobook";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface CompactBookCardProps {
  book: AudioBook;
  cardWidth: number;
}

export function CompactBookCard({ book, cardWidth }: CompactBookCardProps) {
  return (
    <Link href={`/book/${book.id}`} asChild>
      <Pressable style={styles.card}>
        <Image
          source={{ uri: book.coverImage }}
          style={[styles.cover, { width: cardWidth, height: cardWidth * 1.4 }]}
          contentFit="cover"
        />
        <View style={styles.info}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.author} numberOfLines={1}>
            {book.author}
          </ThemedText>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    // Width is controlled by the cardWidth prop
  },
  cover: {
    borderRadius: 8,
    marginBottom: 8,
  },
  info: {
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
  },
  author: {
    fontSize: 11,
    opacity: 0.7,
  },
});
