import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useSettings } from "@/context/settings-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export default function CarModeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const {
    currentBook,
    currentChapter,
    isPlaying,
    playbackRate,
    togglePlayback,
    skipForward,
    skipBackward,
    changePlaybackRate,
  } = useAudioPlayer();
  const { settings } = useSettings();

  useEffect(() => {
    // Lock orientation to landscape if desired
    // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // Keep screen awake if setting is enabled
    if (settings.carMode.keepScreenOn) {
      activateKeepAwakeAsync();
    }

    return () => {
      // ScreenOrientation.unlockAsync();
      if (settings.carMode.keepScreenOn) {
        deactivateKeepAwake();
      }
    };
  }, [settings.carMode.keepScreenOn]);

  const handleExit = () => {
    router.back();
  };

  const playbackRates = [0.75, 1.0, 1.25, 1.5, 2.0];
  const currentRateIndex = playbackRates.indexOf(playbackRate);
  const nextRate =
    playbackRates[(currentRateIndex + 1) % playbackRates.length];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleExit} style={styles.exitButton}>
            <IconSymbol size={32} name="xmark.circle.fill" color={colors.icon} />
          </Pressable>
          <View style={styles.carModeIndicator}>
            <IconSymbol size={24} name="car.fill" color={colors.tint} />
            <ThemedText style={[styles.carModeText, { color: colors.tint }]}>
              Car Mode
            </ThemedText>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Book Info */}
          <View style={styles.bookInfo}>
            <ThemedText type="title" style={styles.bookTitle} numberOfLines={2}>
              {currentBook?.title || "No Book Playing"}
            </ThemedText>
            <ThemedText style={styles.author} numberOfLines={1}>
              {currentBook?.author || "Select a book to play"}
            </ThemedText>
            {currentChapter && (
              <ThemedText style={[styles.chapter, { opacity: 0.7 }]} numberOfLines={1}>
                Chapter {currentChapter.number}: {currentChapter.title}
              </ThemedText>
            )}
          </View>

          {/* Large Play/Pause Button */}
          <View style={styles.playbackSection}>
            <Pressable
              onPress={togglePlayback}
              style={[
                styles.largePlayButton,
                { backgroundColor: colors.tint },
              ]}
            >
              <IconSymbol
                size={80}
                name={isPlaying ? "pause.fill" : "play.fill"}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          {/* Large Skip Controls */}
          <View style={styles.skipControls}>
            <Pressable
              onPress={() => skipBackward(30)}
              style={[styles.skipButton, { backgroundColor: colors.tint + "20" }]}
            >
              <IconSymbol size={48} name="gobackward.30" color={colors.tint} />
            </Pressable>

            <Pressable
              onPress={() => skipForward(30)}
              style={[styles.skipButton, { backgroundColor: colors.tint + "20" }]}
            >
              <IconSymbol size={48} name="goforward.30" color={colors.tint} />
            </Pressable>
          </View>

          {/* Playback Speed */}
          <View style={styles.speedControl}>
            <Pressable
              onPress={() => changePlaybackRate(nextRate)}
              style={[
                styles.speedButton,
                { backgroundColor: colors.tint + "20" },
              ]}
            >
              <ThemedText style={[styles.speedText, { color: colors.tint }]}>
                {playbackRate}x
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Footer Hint */}
        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { opacity: 0.5 }]}>
            Tap the X to exit Car Mode
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  exitButton: {
    padding: 8,
  },
  carModeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  carModeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  bookInfo: {
    alignItems: "center",
    marginBottom: 60,
  },
  bookTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  author: {
    fontSize: 24,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 8,
  },
  chapter: {
    fontSize: 18,
    textAlign: "center",
  },
  playbackSection: {
    marginBottom: 40,
  },
  largePlayButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  skipControls: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 40,
  },
  skipButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  speedControl: {
    alignItems: "center",
  },
  speedButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  speedText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
  },
});
