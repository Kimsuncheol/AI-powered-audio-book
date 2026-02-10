import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface BookInfoProps {
  title: string;
  author: string;
  chapterTitle?: string;
  isGuest: boolean;
  colors: {
    tint: string;
  };
}

export function BookInfo({
  title,
  author,
  chapterTitle,
  isGuest,
  colors,
}: BookInfoProps) {
  return (
    <View style={styles.bookInfo}>
      <ThemedText type="title" style={styles.bookTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.bookAuthor}>{author}</ThemedText>
      {chapterTitle && (
        <ThemedText style={styles.chapterTitle}>{chapterTitle}</ThemedText>
      )}

      {/* Guest Preview Badge */}
      {isGuest && (
        <View
          style={[
            styles.previewBadge,
            {
              backgroundColor: colors.tint + "20",
              borderColor: colors.tint,
            },
          ]}
        >
          <IconSymbol size={14} name="eye.fill" color={colors.tint} />
          <ThemedText style={[styles.previewText, { color: colors.tint }]}>
            Preview Mode • First Chapter • 5 min limit
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookInfo: {
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 6,
  },
  bookTitle: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
  },
  bookAuthor: {
    fontSize: 16,
    opacity: 0.7,
  },
  chapterTitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  previewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  previewText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
