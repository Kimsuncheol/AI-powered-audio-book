import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { formatDuration } from "@/utils/time";
import { StyleSheet, View } from "react-native";

interface BookMetadataProps {
  title: string;
  author: string;
  rating: number;
  duration: number;
  chaptersCount: number;
  colors: {
    text: string;
    icon: string;
  };
}

export function BookMetadata({
  title,
  author,
  rating,
  duration,
  chaptersCount,
  colors,
}: BookMetadataProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={styles.author}>by {author}</ThemedText>

      <View style={styles.metadata}>
        <View style={styles.metadataItem}>
          <IconSymbol size={16} name="star.fill" color="#FFD700" />
          <ThemedText style={styles.metadataText}>{rating}</ThemedText>
        </View>
        <View style={styles.metadataItem}>
          <IconSymbol size={16} name="clock" color={colors.icon} />
          <ThemedText style={styles.metadataText}>
            {formatDuration(duration)}
          </ThemedText>
        </View>
        <View style={styles.metadataItem}>
          <IconSymbol size={16} name="book.closed" color={colors.icon} />
          <ThemedText style={styles.metadataText}>
            {chaptersCount} chapters
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginTop: 16,
  },
  author: {
    fontSize: 16,
    opacity: 0.7,
  },
  metadata: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    opacity: 0.8,
  },
});
