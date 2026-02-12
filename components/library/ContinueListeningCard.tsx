import { ProgressBar } from "@/components/shared/ProgressBar";
import { ThemedText } from "@/components/themed-text";
import { AudioBook } from "@/types/audiobook";
import { getProgressPercentage } from "@/utils/time";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

interface ContinueListeningCardProps {
  book: AudioBook;
  progress: {
    currentChapter: number;
    currentPosition: number;
  };
  colors: {
    tint: string;
  };
  cardBgColor: string;
}

export function ContinueListeningCard({
  book,
  progress,
  colors,
  cardBgColor,
}: ContinueListeningCardProps) {
  return (
    <Link href={`/book/${book.id}`} asChild>
      <Pressable
        style={[styles.continueCard, { backgroundColor: cardBgColor }]}
      >
        <Image
          source={{ uri: book.coverImage }}
          style={styles.continueCover}
          contentFit="cover"
        />
        <View style={styles.continueInfo}>
          <ThemedText style={styles.continueTitle} numberOfLines={1}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.continueChapter} numberOfLines={1}>
            Chapter {progress.currentChapter + 1}
          </ThemedText>
          <ProgressBar
            progress={getProgressPercentage(
              progress.currentPosition,
              book.duration,
            )}
            color={colors.tint}
            height={4}
            style={styles.progressBar}
          />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  continueCard: {
    flexDirection: "row",
    width: width * 0.75,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  continueCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  continueInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  continueTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  continueChapter: {
    fontSize: 13,
    opacity: 0.6,
  },
  progressBar: {
    marginTop: 6,
    borderRadius: 2,
  },
});
