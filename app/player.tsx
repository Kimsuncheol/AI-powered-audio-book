import { SignUpPromptModal } from "@/components/auth/SignUpPromptModal";
import { AlbumArtwork } from "@/components/player/AlbumArtwork";
import { BookInfo } from "@/components/player/BookInfo";
import { ChapterListPlayer } from "@/components/player/ChapterListPlayer";
import { PlaybackControls } from "@/components/player/PlaybackControls";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { ProgressSlider } from "@/components/player/ProgressSlider";
import { SecondaryControls } from "@/components/player/SecondaryControls";
import { SleepTimerMenu } from "@/components/player/SleepTimerMenu";
import { PlaybackSettingsModal } from "@/components/settings/PlaybackSettingsModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useAuth } from "@/context/auth-context";
import { useSettings } from "@/context/settings-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GUEST_TIME_LIMIT } from "@/types/playback";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isGuest } = useAuth();
  const { settings, updateAutoPlay } = useSettings();
  const {
    playbackState,
    togglePlayPause,
    skipForward,
    skipBackward,
    nextChapter,
    previousChapter,
    seekTo,
    setPlaybackRate,
    setSleepTimer,
    cancelSleepTimer,
  } = useAudioPlayer();

  const [showPlaybackSettings, setShowPlaybackSettings] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [limitReason, setLimitReason] = useState<"time" | "chapter">("time");

  const book = playbackState.currentBook;
  const currentChapter = book?.chapters[playbackState.currentChapterIndex];
  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

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

  const handleCancelSleepTimer = () => {
    cancelSleepTimer();
    Alert.alert("Sleep Timer Cancelled");
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
              <ThemedText style={styles.closeButtonText}>Go Back</ThemedText>
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

          <SecondaryControls
            isSleepTimerActive={playbackState.isSleepTimerActive}
            onToggleSleepTimer={() => {
              if (playbackState.isSleepTimerActive) {
                handleCancelSleepTimer();
              } else {
                setShowSleepTimer(!showSleepTimer);
              }
            }}
            colors={colors}
            cardBgColor={cardBgColor}
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
