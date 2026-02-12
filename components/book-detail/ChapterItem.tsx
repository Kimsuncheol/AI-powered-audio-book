import { ThemedText } from "@/components/themed-text";
import { formatDuration } from "@/utils/time";
import { Pressable, StyleSheet, View } from "react-native";

interface ChapterItemProps {
  chapter: {
    id: string;
    title: string;
    duration: number;
  };
  index: number;
  onPress: () => void;
  colors: {
    tint: string;
    text: string;
  };
  cardBgColor: string;
}

export function ChapterItem({
  chapter,
  index,
  onPress,
  colors,
  cardBgColor,
}: ChapterItemProps) {
  return (
    <Pressable
      style={[styles.chapterItem, { backgroundColor: cardBgColor }]}
      onPress={onPress}
    >
      <View style={styles.chapterLeft}>
        <View style={styles.chapterNumber}>
          <ThemedText style={styles.chapterNumberText}>{index + 1}</ThemedText>
        </View>
        <View style={styles.chapterInfo}>
          <ThemedText style={styles.chapterTitle}>{chapter.title}</ThemedText>
          <ThemedText style={styles.chapterDuration}>
            {formatDuration(chapter.duration)}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chapterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  chapterLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(128, 128, 128, 0.2)",
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  chapterDuration: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
});
