import { ThemedText } from "@/components/themed-text";
import { formatDuration } from "@/utils/time";
import { Pressable, StyleSheet, View } from "react-native";

interface Chapter {
  id: string;
  title: string;
  duration: number;
}

interface ChapterListPlayerProps {
  chapters: Chapter[];
  currentIndex: number;
  onChapterPress: (index: number) => void;
  isGuest: boolean;
  colors: {
    tint: string;
    text: string;
  };
  cardBgColor: string;
}

export function ChapterListPlayer({
  chapters,
  currentIndex,
  onChapterPress,
  isGuest,
  colors,
  cardBgColor,
}: ChapterListPlayerProps) {
  return (
    <View style={styles.chapterList}>
      <ThemedText type="subtitle" style={styles.chapterListTitle}>
        Chapters
      </ThemedText>
      {chapters.map((chapter, index) => {
        const isLocked = isGuest && index > 0;
        const isActive = index === currentIndex;

        return (
          <Pressable
            key={chapter.id}
            style={[
              styles.chapterItem,
              { backgroundColor: cardBgColor },
              isActive && {
                borderColor: colors.tint,
                borderWidth: 2,
              },
            ]}
            onPress={() => !isLocked && onChapterPress(index)}
            disabled={isLocked}
          >
            <View style={styles.chapterInfo}>
              <ThemedText
                style={[styles.chapterNumber, isLocked && styles.chapterLocked]}
              >
                {index + 1}.
              </ThemedText>
              <ThemedText
                style={[styles.chapterTitle, isLocked && styles.chapterLocked]}
                numberOfLines={1}
              >
                {chapter.title}
              </ThemedText>
            </View>
            <ThemedText
              style={[styles.chapterDuration, isLocked && styles.chapterLocked]}
            >
              {formatDuration(chapter.duration)}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chapterList: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  chapterListTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  chapterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  chapterInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  chapterNumber: {
    fontSize: 15,
    fontWeight: "600",
    width: 32,
  },
  chapterTitle: {
    fontSize: 15,
    flex: 1,
  },
  chapterDuration: {
    fontSize: 13,
    opacity: 0.6,
  },
  chapterLocked: {
    opacity: 0.4,
  },
});
