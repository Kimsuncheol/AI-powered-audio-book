import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

export interface BookData {
  id: string;
  title: string;
  narrator: string;
  status: "published" | "in_review" | "draft";
  listens: number;
  rating: number;
  earnings: string;
}

interface BookCardProps {
  book: BookData;
  cardBgColor: string;
  tintColor: string;
  onPress?: () => void;
}

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  published: { bg: "#34C75920", text: "#34C759", label: "Published" },
  in_review: { bg: "#FF950020", text: "#FF9500", label: "In Review" },
  draft: { bg: "#8E8E9320", text: "#8E8E93", label: "Draft" },
};

export function BookCard({
  book,
  cardBgColor,
  tintColor,
  onPress,
}: BookCardProps) {
  const status = STATUS_COLORS[book.status];

  return (
    <Pressable
      style={[styles.card, { backgroundColor: cardBgColor }]}
      onPress={onPress}
    >
      <View style={styles.cardTop}>
        {/* Cover placeholder */}
        <View style={[styles.cover, { backgroundColor: tintColor + "20" }]}>
          <IconSymbol size={28} name="book.fill" color={tintColor} />
        </View>

        <View style={styles.cardInfo}>
          <ThemedText style={styles.bookTitle} numberOfLines={1}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.narrator} numberOfLines={1}>
            Narrated by {book.narrator}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <ThemedText style={[styles.statusText, { color: status.text }]}>
              {status.label}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <IconSymbol size={14} name="headphones" color="#8E8E93" />
          <ThemedText style={styles.statText}>
            {book.listens.toLocaleString()}
          </ThemedText>
        </View>
        <View style={styles.stat}>
          <IconSymbol size={14} name="star.fill" color="#FFCC00" />
          <ThemedText style={styles.statText}>{book.rating}</ThemedText>
        </View>
        <View style={styles.stat}>
          <IconSymbol size={14} name="dollarsign.circle" color="#34C759" />
          <ThemedText style={styles.statText}>{book.earnings}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  cover: {
    width: 60,
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  narrator: {
    fontSize: 13,
    opacity: 0.6,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.2)",
    paddingTop: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statText: {
    fontSize: 13,
    opacity: 0.7,
  },
});
