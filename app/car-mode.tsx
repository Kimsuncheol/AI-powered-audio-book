import { BookInfoDisplay } from "@/components/car-mode/BookInfoDisplay";
import { CarModeFooter } from "@/components/car-mode/CarModeFooter";
import { CarModeHeader } from "@/components/car-mode/CarModeHeader";
import { PlayPauseButton } from "@/components/car-mode/PlayPauseButton";
import { SkipControls } from "@/components/car-mode/SkipControls";
import { SpeedControl } from "@/components/car-mode/SpeedControl";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useSettings } from "@/context/settings-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CarModeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const {
    playbackState,
    togglePlayPause,
    skipForward,
    skipBackward,
    setPlaybackRate,
  } = useAudioPlayer();
  const { settings } = useSettings();

  const currentBook = playbackState.currentBook;
  const currentChapter =
    currentBook?.chapters[playbackState.currentChapterIndex];

  useEffect(() => {
    // Keep screen awake if setting is enabled
    if (settings.carMode.keepScreenOn) {
      activateKeepAwakeAsync();
    }

    return () => {
      if (settings.carMode.keepScreenOn) {
        deactivateKeepAwake();
      }
    };
  }, [settings.carMode.keepScreenOn]);

  const handleExit = () => {
    router.back();
  };

  const playbackRates = [0.75, 1.0, 1.25, 1.5, 2.0];
  const currentRateIndex = playbackRates.indexOf(playbackState.playbackRate);
  const nextRate = playbackRates[(currentRateIndex + 1) % playbackRates.length];

  const handleChangeSpeed = () => {
    setPlaybackRate(nextRate);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <CarModeHeader onExit={handleExit} colors={colors} />

        <View style={styles.content}>
          <BookInfoDisplay
            bookTitle={currentBook?.title}
            author={currentBook?.author}
            chapterNumber={currentChapter?.number}
            chapterTitle={currentChapter?.title}
          />

          <PlayPauseButton
            isPlaying={playbackState.isPlaying}
            onToggle={togglePlayPause}
            colors={colors}
          />

          <SkipControls
            onSkipBackward={() => skipBackward(30)}
            onSkipForward={() => skipForward(30)}
            colors={colors}
          />

          <SpeedControl
            playbackRate={playbackState.playbackRate}
            onChangeSpeed={handleChangeSpeed}
            colors={colors}
          />
        </View>

        <CarModeFooter />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
});
