import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";
import { ChapterItem } from "./ChapterItem";

interface Chapter {
  id: string;
  title: string;
  duration: number;
}

interface ChapterListProps {
  chapters: Chapter[];
  onChapterPress: (index: number) => void;
  colors: {
    tint: string;
    text: string;
  };
  cardBgColor: string;
}

export function ChapterList({
  chapters,
  onChapterPress,
  colors,
  cardBgColor,
}: ChapterListProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Chapters
        </ThemedText>
        <ThemedText style={styles.chapterCount}>
          {chapters.length} chapters
        </ThemedText>
      </View>
      {chapters.map((chapter, index) => (
        <ChapterItem
          key={chapter.id}
          chapter={chapter}
          index={index}
          onPress={() => onChapterPress(index)}
          colors={colors}
          cardBgColor={cardBgColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  chapterCount: {
    fontSize: 14,
    opacity: 0.6,
  },
});
