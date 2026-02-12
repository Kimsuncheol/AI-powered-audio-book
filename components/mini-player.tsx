import { ProgressBar } from "@/components/shared/ProgressBar";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatTime } from "@/utils/time";
import { Image } from "expo-image";
import { router, usePathname, useSegments } from "expo-router";
import {
  Dimensions,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
      {(state) => (
        <Animated.View
          style={[
            typeof style === "function" ? style(state) : style,
            animatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      )}
    </Pressable>
  );
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MINI_PLAYER_HEIGHT = 120;
const MINI_PLAYER_WIDTH = SCREEN_WIDTH - 16;
const TAB_BAR_HEIGHT = 80;

export function MiniPlayer() {
  const { playbackState, stopPlayback } = useAudioPlayer();

  // Shared values for dragging - MUST be called before any conditional returns
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // Determine nav height based on route
  const segments = useSegments();
  const pathname = usePathname();

  // Check if we are in tabs
  const isInTabs = segments[0] === "(tabs)";
  // Determine bottom offset
  const bottomOffset = isInTabs ? TAB_BAR_HEIGHT : 20; // 20px padding for non-tab screens

  // Pan gesture handler for dragging - MUST be defined before conditional returns
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      // Snap to edges
      const maxX = (SCREEN_WIDTH - MINI_PLAYER_WIDTH) / 2;
      const minX = -(SCREEN_WIDTH - MINI_PLAYER_WIDTH) / 2;
      // Adjust maxY based on bottomOffset
      const maxY = SCREEN_HEIGHT - bottomOffset - MINI_PLAYER_HEIGHT - 20;
      const minY = -SCREEN_HEIGHT / 2 + 100;

      // Clamp values
      let finalX = Math.max(minX, Math.min(maxX, translateX.value));
      let finalY = Math.max(minY, Math.min(maxY, translateY.value));

      translateX.value = withSpring(finalX);
      translateY.value = withSpring(finalY);
      offsetX.value = finalX;
      offsetY.value = finalY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  // Update position when offset changes
  // We need to ensure the player isn't stuck below the new bottom limit if we switch from tabs to stack
  // This is a simple improvement: reset Y if we switch contexts?
  // For now, let's just apply the bottom style dynamically.

  // Now check if book exists - after all hooks
  const book = playbackState.currentBook;
  if (!book || pathname.startsWith("/player")) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.container, { bottom: bottomOffset }, animatedStyle]}
      >
        <View style={styles.wrapper}>
          {/* Close button - positioned outside card */}
          <CloseButton onPress={stopPlayback} />

          <MiniPlayerInner />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      style={[styles.closeButton, { backgroundColor: "#FF3B30" }]}
      onPress={(e) => {
        e.stopPropagation();
        onPress();
      }}
    >
      <IconSymbol size={16} name="xmark" color="#FFFFFF" />
    </Pressable>
  );
}

function MiniPlayerInner() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { playbackState, togglePlayPause, previousChapter, nextChapter } =
    useAudioPlayer();

  const book = playbackState.currentBook;
  if (!book) return null;

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const buttonBgColor =
    colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)";
  const playButtonBgColor =
    colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.08)";
  const progress =
    playbackState.duration > 0
      ? (playbackState.position / playbackState.duration) * 100
      : 0;

  return (
    <Pressable
      style={[styles.playerCard, { backgroundColor: cardBgColor }]}
      onPress={() =>
        router.push({
          pathname: "/player/[id]",
          params: { id: book.id },
        })
      }
    >
      <View style={styles.content}>
        <Image
          source={{ uri: book.coverImage }}
          style={styles.cover}
          contentFit="cover"
        />

        <View style={styles.info}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.chapter} numberOfLines={1}>
            {book.chapters[playbackState.currentChapterIndex]?.title}
          </ThemedText>
        </View>

        <View style={styles.controls}>
          {/* Previous button */}
          <Pressable
            style={[styles.controlButton, { backgroundColor: buttonBgColor }]}
            onPress={(e) => {
              e.stopPropagation();
              previousChapter();
            }}
          >
            <IconSymbol size={22} name="backward.fill" color={colors.text} />
          </Pressable>

          {/* Play/Pause button */}
          <AnimatedPressable
            style={[styles.playButton, { backgroundColor: playButtonBgColor }]}
            onPress={(e: any) => {
              e.stopPropagation();
              togglePlayPause();
            }}
          >
            <IconSymbol
              size={26}
              name={playbackState.isPlaying ? "pause.fill" : "play.fill"}
              color={colors.text}
            />
          </AnimatedPressable>

          {/* Next button */}
          <Pressable
            style={[styles.controlButton, { backgroundColor: buttonBgColor }]}
            onPress={(e) => {
              e.stopPropagation();
              nextChapter();
            }}
          >
            <IconSymbol size={22} name="forward.fill" color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Progress bar */}
      <ProgressBar progress={progress} color={colors.tint} />

      {/* Time display */}
      <View style={styles.timeContainer}>
        <ThemedText style={styles.timeText}>
          {formatTime(playbackState.position)}
        </ThemedText>
        <ThemedText style={styles.timeText}>
          {formatTime(playbackState.duration)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // bottom is set dynamically via style prop
    left: 8,
    right: 8,
    zIndex: 1000,
  },
  wrapper: {
    position: "relative",
  },
  playerCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  chapter: {
    fontSize: 12,
    opacity: 0.6,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  timeText: {
    fontSize: 10,
    opacity: 0.6,
  },
});
