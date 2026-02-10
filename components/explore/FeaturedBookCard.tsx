import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { formatDuration } from "@/data/mock-audiobooks";
import { AudioBook } from "@/types/audiobook";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

interface FeaturedBookCardProps {
  book: AudioBook;
  cardBgColor: string;
}

export function FeaturedBookCard({ book, cardBgColor }: FeaturedBookCardProps) {
  return (
    <Link href={`/book/${book.id}`} asChild>
      <Pressable style={[styles.card, { backgroundColor: cardBgColor }]}>
        <Image
          source={{ uri: book.coverImage }}
          style={styles.cover}
          contentFit="cover"
        />
        <View style={styles.info}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.author} numberOfLines={1}>
            by {book.author}
          </ThemedText>
          <View style={styles.meta}>
            <View style={styles.ratingRow}>
              <IconSymbol size={14} name="star.fill" color="#FFD700" />
              <ThemedText style={styles.ratingText}>{book.rating}</ThemedText>
            </View>
            <ThemedText style={styles.durationText}>
              {formatDuration(book.duration)}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.7,
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    marginRight: 16,
    gap: 12,
  },
  cover: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 22,
  },
  author: {
    fontSize: 14,
    opacity: 0.7,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  durationText: {
    fontSize: 13,
    opacity: 0.7,
  },
});
