import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
  onOpenPlaybackSettings: () => void;
  isPlaybackSettingsOpen?: boolean;
  isGuest: boolean;
  chapterIndex: number;
  onGuestLimit: () => void;
  colors: {
    tint: string;
    text: string;
    icon: string;
  };
}

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onPreviousChapter,
  onNextChapter,
  onOpenPlaybackSettings,
  isPlaybackSettingsOpen = false,
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

      <Pressable
        style={styles.controlButton}
        onPress={onOpenPlaybackSettings}
        accessibilityLabel="Open playback settings"
      >
        <Ionicons
          size={30}
          name="options"
          color={isPlaybackSettingsOpen ? colors.tint : colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 32,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
