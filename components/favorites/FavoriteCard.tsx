import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { formatDuration } from "@/data/mock-audiobooks";
import { AudioBook } from "@/types/audiobook";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface FavoriteCardProps {
  book: AudioBook;
  onRemove: (bookId: string) => void;
  cardBgColor: string;
}

export function FavoriteCard({
  book,
  onRemove,
  cardBgColor,
}: FavoriteCardProps) {
  return (
    <Link href={`/book/${book.id}`} asChild>
      <Pressable style={[styles.card, { backgroundColor: cardBgColor }]}>
        <Image
          source={{ uri: book.coverImage }}
          style={styles.cover}
          contentFit="cover"
        />
        <View style={styles.cardInfo}>
          <ThemedText style={styles.cardTitle} numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.cardAuthor} numberOfLines={1}>
            by {book.author}
          </ThemedText>
          <View style={styles.cardMeta}>
            <View style={styles.ratingRow}>
              <IconSymbol size={14} name="star.fill" color="#FFD700" />
              <ThemedText style={styles.metaText}>{book.rating}</ThemedText>
            </View>
            <ThemedText style={styles.metaText}>
              {formatDuration(book.duration)}
            </ThemedText>
          </View>
        </View>
        <Pressable
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation();
            onRemove(book.id);
          }}
        >
          <IconSymbol size={22} name="heart.fill" color="#FF3B30" />
        </Pressable>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  cardAuthor: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardMeta: {
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    opacity: 0.7,
  },
  removeButton: {
    justifyContent: "center",
    paddingHorizontal: 8,
  },
});
