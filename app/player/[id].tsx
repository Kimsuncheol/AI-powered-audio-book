import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { formatTime, MOCK_AUDIOBOOKS } from "@/data/mock-audiobooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Slider from "@react-native-community/slider";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PlayerScreen() {
  const { id, chapterId } = useLocalSearchParams<{
    id: string;
    chapterId?: string;
  }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const book = MOCK_AUDIOBOOKS.find((b) => b.id === id);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Create audio player with the book's audio URL
  const audioSource = book ? { uri: book.audioUrl } : null;
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (book && chapterId) {
      const chapterIndex = book.chapters.findIndex((ch) => ch.id === chapterId);
      if (chapterIndex >= 0) {
        setCurrentChapterIndex(chapterIndex);
      }
    }
  }, [book, chapterId]);

  // Configure audio mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: "duckOthers",
        });
      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    };
    setupAudio();
  }, []);

  const handleNextChapter = useCallback(() => {
    if (!book || currentChapterIndex >= book.chapters.length - 1) return;
    setCurrentChapterIndex(currentChapterIndex + 1);
    Alert.alert(
      "Chapter Changed",
      `Now playing: ${book.chapters[currentChapterIndex + 1].title}`,
    );
  }, [book, currentChapterIndex]);

  // Auto-advance to next chapter when current one finishes
  useEffect(() => {
    if (player) {
      const subscription = player.addListener(
        "playbackStatusUpdate",
        (s: { didJustFinish: boolean }) => {
          if (s.didJustFinish) {
            handleNextChapter();
          }
        },
      );
      return () => subscription.remove();
    }
  }, [player, handleNextChapter]);

  const togglePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = async (value: number) => {
    try {
      await player.seekTo(value);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  const handleSkipForward = async () => {
    const newPosition = Math.min(status.currentTime + 15, status.duration);
    await handleSeek(newPosition);
  };

  const handleSkipBackward = async () => {
    const newPosition = Math.max(status.currentTime - 15, 0);
    await handleSeek(newPosition);
  };

  const handlePreviousChapter = () => {
    if (!book || currentChapterIndex <= 0) return;
    setCurrentChapterIndex(currentChapterIndex - 1);
    Alert.alert(
      "Chapter Changed",
      `Now playing: ${book.chapters[currentChapterIndex - 1].title}`,
    );
  };

  const cyclePlaybackSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentRate = player.playbackRate;
    const currentIndex = speeds.indexOf(currentRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    player.setPlaybackRate(nextSpeed);
  };

  if (!book) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Book not found</ThemedText>
      </ThemedView>
    );
  }

  const currentChapter = book.chapters[currentChapterIndex];
  const isLoading = !status.playing && !status.currentTime && !status.duration;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Now Playing",
          headerBackTitle: "Back",
        }}
      />

      <View style={styles.content}>
        <View style={styles.coverSection}>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.coverImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.infoSection}>
          <ThemedText style={styles.chapterLabel}>
            Chapter {currentChapterIndex + 1} of {book.chapters.length}
          </ThemedText>
          <ThemedText type="title" style={styles.bookTitle} numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.chapterTitle} numberOfLines={1}>
            {currentChapter.title}
          </ThemedText>
          <ThemedText style={styles.author}>{book.author}</ThemedText>
        </View>

        <View style={styles.progressSection}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={status.duration || 1}
            value={status.currentTime}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={colors.tint}
            maximumTrackTintColor={colorScheme === "dark" ? "#333" : "#DDD"}
            thumbTintColor={colors.tint}
          />
          <View style={styles.timeRow}>
            <ThemedText style={styles.timeText}>
              {formatTime(Math.floor(status.currentTime))}
            </ThemedText>
            <ThemedText style={styles.timeText}>
              {formatTime(Math.floor(status.duration))}
            </ThemedText>
          </View>
        </View>

        <View style={styles.controlsSection}>
          <Pressable onPress={cyclePlaybackSpeed} style={styles.speedButton}>
            <ThemedText style={styles.speedText}>
              {player.playbackRate}x
            </ThemedText>
          </Pressable>

          <View style={styles.mainControls}>
            <Pressable
              onPress={handlePreviousChapter}
              style={styles.controlButton}
            >
              <IconSymbol
                size={32}
                name="backward.end.fill"
                color={colors.text}
              />
            </Pressable>

            <Pressable
              onPress={handleSkipBackward}
              style={styles.controlButton}
            >
              <IconSymbol size={28} name="gobackward.15" color={colors.text} />
            </Pressable>

            <Pressable
              onPress={togglePlayPause}
              style={[styles.playButton, { backgroundColor: colors.tint }]}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <IconSymbol
                  size={40}
                  name={status.playing ? "pause.fill" : "play.fill"}
                  color="#FFFFFF"
                />
              )}
            </Pressable>

            <Pressable onPress={handleSkipForward} style={styles.controlButton}>
              <IconSymbol size={28} name="goforward.15" color={colors.text} />
            </Pressable>

            <Pressable onPress={handleNextChapter} style={styles.controlButton}>
              <IconSymbol
                size={32}
                name="forward.end.fill"
                color={colors.text}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              Alert.alert("Coming Soon", "Sleep timer feature coming soon!")
            }
            style={styles.speedButton}
          >
            <IconSymbol size={24} name="moon" color={colors.icon} />
          </Pressable>
        </View>

        <View style={styles.additionalControls}>
          <Pressable
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Coming Soon", "Bookmarks feature coming soon!")
            }
          >
            <IconSymbol size={22} name="bookmark" color={colors.icon} />
            <ThemedText style={styles.actionButtonText}>Bookmark</ThemedText>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push(`/book/${book.id}`)}
          >
            <IconSymbol size={22} name="list.bullet" color={colors.icon} />
            <ThemedText style={styles.actionButtonText}>Chapters</ThemedText>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Coming Soon", "Share feature coming soon!")
            }
          >
            <IconSymbol
              size={22}
              name="square.and.arrow.up"
              color={colors.icon}
            />
            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  coverSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  coverImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  chapterLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    opacity: 0.7,
  },
  progressSection: {
    marginBottom: 30,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 13,
    opacity: 0.7,
  },
  controlsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  speedButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  speedText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  additionalControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
  },
  actionButton: {
    alignItems: "center",
    gap: 8,
  },
  actionButtonText: {
    fontSize: 13,
    opacity: 0.7,
  },
});
