import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, PressableProps, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = ({
  style,
  onPress,
  children,
  ...props
}: PressableProps & { children: React.ReactNode }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = (e: any) => {
    if (onPress) {
      onPress(e);
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

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

      <AnimatedPressable
        style={[styles.playButton, { backgroundColor: colors.tint }]}
        onPress={onPlayPause}
      >
        <IconSymbol
          size={40}
          name={isPlaying ? "pause.fill" : "play.fill"}
          color={iconColor}
        />
      </AnimatedPressable>

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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
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
