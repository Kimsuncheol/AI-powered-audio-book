import { SignUpPromptModal } from "@/components/auth/SignUpPromptModal";
import { AlbumArtwork } from "@/components/player/AlbumArtwork";
import { BookInfo } from "@/components/player/BookInfo";
import { ChapterListPlayer } from "@/components/player/ChapterListPlayer";
import { PlaybackControls } from "@/components/player/PlaybackControls";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { ProgressSlider } from "@/components/player/ProgressSlider";
import { SleepTimerMenu } from "@/components/player/SleepTimerMenu";
import { PlaybackSettingsModal } from "@/components/settings/PlaybackSettingsModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useAuth } from "@/context/auth-context";
import { useSettings } from "@/context/settings-context";
import { MOCK_AUDIOBOOKS } from "@/data/mock-audiobooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GUEST_TIME_LIMIT } from "@/types/playback";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContextPlayerScreenProps {
  bookId?: string;
  initialChapterIndex?: number;
}

type LoadError = "not-found" | "load-failed" | null;

export function ContextPlayerScreen({
  bookId,
  initialChapterIndex = 0,
}: ContextPlayerScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isGuest } = useAuth();
  const { settings, updateAutoPlay } = useSettings();
  const {
    playbackState,
    loadBook,
    togglePlayPause,
    skipForward,
    skipBackward,
    nextChapter,
    previousChapter,
    seekTo,
    setPlaybackRate,
    setSleepTimer,
  } = useAudioPlayer();

  const [showPlaybackSettings, setShowPlaybackSettings] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [limitReason, setLimitReason] = useState<"time" | "chapter">("time");
  const [isPreparingBook, setIsPreparingBook] = useState(false);
  const [loadError, setLoadError] = useState<LoadError>(null);

  const loadBookRef = useRef(loadBook);

  useEffect(() => {
    loadBookRef.current = loadBook;
  }, [loadBook]);

  const requestedBook = useMemo(() => {
    if (!bookId) return null;
    return MOCK_AUDIOBOOKS.find((candidate) => candidate.id === bookId) ?? null;
  }, [bookId]);

  useEffect(() => {
    if (!bookId) {
      setIsPreparingBook(false);
      setLoadError(null);
      return;
    }

    if (!requestedBook) {
      setIsPreparingBook(false);
      setLoadError("not-found");
      return;
    }

    if (playbackState.currentBook?.id === bookId) {
      setIsPreparingBook(false);
      setLoadError(null);
      return;
    }

    let isActive = true;

    setIsPreparingBook(true);
    setLoadError(null);

    loadBookRef
      .current(requestedBook, initialChapterIndex)
      .catch((error) => {
        console.warn("Failed to load audiobook:", error);
        if (isActive) {
          setLoadError("load-failed");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsPreparingBook(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [
    bookId,
    initialChapterIndex,
    playbackState.currentBook?.id,
    requestedBook,
  ]);

  const book = playbackState.currentBook;
  const currentChapter = book?.chapters[playbackState.currentChapterIndex];
  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const tintButtonTextColor = colorScheme === "dark" ? "#000000" : "#FFFFFF";
  const isRouteBookLoading =
    !!bookId && playbackState.currentBook?.id !== bookId && isPreparingBook;

  // Handle preview limit reached
  useEffect(() => {
    if (isGuest && playbackState.currentBook) {
      if (
        playbackState.position > GUEST_TIME_LIMIT &&
        playbackState.isPlaying
      ) {
        setLimitReason("time");
        setShowSignUpModal(true);
      }
    }
  }, [
    isGuest,
    playbackState.position,
    playbackState.isPlaying,
    playbackState.currentBook,
  ]);

  const handleSeek = async (value: number) => {
    await seekTo(value);
  };

  const handlePlaybackRateSelect = async (rate: number) => {
    await setPlaybackRate(rate);
  };

  const handleSleepTimerSelect = (minutes: number) => {
    setSleepTimer(minutes);
    setShowSleepTimer(false);
    Alert.alert("Sleep Timer Set", `Playback will stop in ${minutes} minutes`);
  };

  const handleGuestChapterLimit = () => {
    setLimitReason("chapter");
    setShowSignUpModal(true);
  };

  const handleChapterSelect = (index: number) => {
    // Navigation to the chapter would be handled by the AudioPlayerContext
    // For now, this is a placeholder
    Alert.alert("Chapter", `Selected chapter ${index + 1}`);
  };

  if (loadError === "not-found") {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Book not found</ThemedText>
            <Pressable
              style={[styles.closeButton, { backgroundColor: colors.tint }]}
              onPress={() => router.back()}
            >
              <ThemedText
                style={[styles.closeButtonText, { color: tintButtonTextColor }]}
              >
                Go Back
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (loadError === "load-failed") {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Unable to load this audiobook
            </ThemedText>
            <Pressable
              style={[styles.closeButton, { backgroundColor: colors.tint }]}
              onPress={() => router.back()}
            >
              <ThemedText
                style={[styles.closeButtonText, { color: tintButtonTextColor }]}
              >
                Go Back
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (isRouteBookLoading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <ThemedText style={styles.emptyText}>
              Loading audiobook...
            </ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!book) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No audiobook playing
            </ThemedText>
            <Pressable
              style={[styles.closeButton, { backgroundColor: colors.tint }]}
              onPress={() => router.back()}
            >
              <ThemedText
                style={[styles.closeButtonText, { color: tintButtonTextColor }]}
              >
                Go Back
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <PlayerHeader
            onBack={() => router.back()}
            onMenuPress={() => Alert.alert("More", "Options coming soon!")}
            onCarModePress={() => router.push("/car-mode")}
            showCarMode={settings?.carMode?.enabled ?? false}
            colors={colors}
            buttonBackgroundColor={cardBgColor}
          />

          <AlbumArtwork coverImage={book.coverImage} />

          <BookInfo
            title={book.title}
            author={book.author}
            chapterTitle={currentChapter?.title}
            isGuest={isGuest}
            colors={colors}
          />

          <ProgressSlider
            position={playbackState.position}
            duration={playbackState.duration}
            onSeek={handleSeek}
            colors={colors}
            colorScheme={colorScheme ?? "light"}
          />

          <PlaybackControls
            isPlaying={playbackState.isPlaying}
            onPlayPause={togglePlayPause}
            onSkipForward={() => skipForward(15)}
            onSkipBackward={() => skipBackward(15)}
            onPreviousChapter={previousChapter}
            onNextChapter={nextChapter}
            onOpenPlaybackSettings={() =>
              setShowPlaybackSettings(!showPlaybackSettings)
            }
            isPlaybackSettingsOpen={showPlaybackSettings}
            isGuest={isGuest}
            chapterIndex={playbackState.currentChapterIndex}
            onGuestLimit={handleGuestChapterLimit}
            colors={colors}
          />

          <PlaybackSettingsModal
            visible={showPlaybackSettings}
            onClose={() => setShowPlaybackSettings(false)}
            currentRate={playbackState.playbackRate}
            onRateChange={handlePlaybackRateSelect}
            autoPlay={
              settings?.autoPlay ?? {
                autoPlayNextChapter: true,
                autoPlayOnBluetooth: false,
                autoPlayOnHeadphones: false,
                autoResumeOnReturn: true,
                continueAcrossBooks: false,
              }
            }
            onAutoPlayChange={updateAutoPlay}
            colors={colors}
            cardBgColor={cardBgColor}
          />

          <SleepTimerMenu
            visible={showSleepTimer}
            onSelect={handleSleepTimerSelect}
            colors={colors}
            cardBgColor={cardBgColor}
          />

          <ChapterListPlayer
            chapters={book.chapters}
            currentIndex={playbackState.currentChapterIndex}
            onChapterPress={handleChapterSelect}
            isGuest={isGuest}
            colors={colors}
            cardBgColor={cardBgColor}
          />
        </ScrollView>

        <SignUpPromptModal
          visible={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          feature={limitReason === "time" ? "fullPlayback" : "fullPlayback"}
          bookTitle={book.title}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
