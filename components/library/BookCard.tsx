import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { formatDuration } from "@/data/mock-audiobooks";
import { AudioBook } from "@/types/audiobook";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

interface BookCardProps {
  book: AudioBook;
  colors: {
    icon: string;
  };
}

export function BookCard({ book, colors }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`} asChild>
      <Pressable style={styles.bookCard}>
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.coverImage}
            contentFit="cover"
          />
          <View style={styles.ratingBadge}>
            <IconSymbol size={12} name="star.fill" color="#FFD700" />
            <ThemedText style={styles.ratingText}>{book.rating}</ThemedText>
          </View>
        </View>
        <View style={styles.bookInfo}>
          <ThemedText style={styles.bookTitle} numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.bookAuthor} numberOfLines={1}>
            {book.author}
          </ThemedText>
          <View style={styles.bookMeta}>
            <IconSymbol size={14} name="clock" color={colors.icon} />
            <ThemedText style={styles.duration}>
              {formatDuration(book.duration)}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    width: CARD_WIDTH,
  },
  coverContainer: {
    position: "relative",
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bookInfo: {
    gap: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  bookAuthor: {
    fontSize: 14,
    opacity: 0.7,
  },
  bookMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  duration: {
    fontSize: 12,
    opacity: 0.7,
  },
});
