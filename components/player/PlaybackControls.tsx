import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Pressable, StyleSheet, View } from "react-native";

// ... existing imports

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onPreviousChapter,
  onNextChapter,
  isGuest,
  chapterIndex,
  onGuestLimit,
  colors,
}: PlaybackControlsProps) {
  const isNextDisabled = isGuest && chapterIndex >= 0;
  const theme = useColorScheme();
  const iconColor = theme === "dark" ? "#000000" : "#FFFFFF";

  return (
    <View style={styles.controlsContainer}>
      <Pressable style={styles.controlButton} onPress={onPreviousChapter}>
        <IconSymbol size={32} name="backward.end.fill" color={colors.text} />
      </Pressable>

      <Pressable style={styles.controlButton} onPress={onSkipBackward}>
        <IconSymbol size={32} name="gobackward.15" color={colors.text} />
      </Pressable>

      <Pressable
        style={[styles.playButton, { backgroundColor: colors.tint }]}
        onPress={onPlayPause}
      >
        <IconSymbol
          size={40}
          name={isPlaying ? "pause.fill" : "play.fill"}
          color={iconColor}
        />
      </Pressable>

      <Pressable style={styles.controlButton} onPress={onSkipForward}>
        <IconSymbol size={32} name="goforward.15" color={colors.text} />
      </Pressable>

      <Pressable
        style={styles.controlButton}
        onPress={() => {
          if (isNextDisabled) {
            onGuestLimit();
          } else {
            onNextChapter();
          }
        }}
        disabled={isNextDisabled}
      >
        <IconSymbol
          size={32}
          name="forward.end.fill"
          color={isNextDisabled ? colors.icon + "40" : colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 24,
    marginTop: 32,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
