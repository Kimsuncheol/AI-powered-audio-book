import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { usePlayerMode } from "@/context/player-mode-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatTime } from "@/utils/time";
import { Image } from "expo-image";
import { router, usePathname, useSegments } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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
const DELETE_ZONE_HEIGHT = 64;
const DELETE_ZONE_SIDE_MARGIN = 16;
const DELETE_ZONE_BOTTOM_MARGIN_TABS = TAB_BAR_HEIGHT + 14;
const DELETE_ZONE_BOTTOM_MARGIN_STACK = 24;
const DELETE_ZONE_HIT_PADDING = 16;

export function MiniPlayer() {
  const { playbackState, stopPlayback } = useAudioPlayer();
  const { setPlayerMode } = usePlayerMode();
  const [isOverDeleteZoneState, setIsOverDeleteZoneState] = useState(false);
  const isMountedRef = useRef(true);

  // Shared values for dragging - MUST be called before any conditional returns
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const isDragging = useSharedValue(0);
  const isOverDeleteZone = useSharedValue(0);

  // Determine nav height based on route
  const segments = useSegments();
  const pathname = usePathname();

  // Check if we are in tabs
  const isInTabs = segments[0] === "(tabs)";
  // Determine bottom offset
  const bottomOffset = isInTabs ? TAB_BAR_HEIGHT : 20; // 20px padding for non-tab screens
  const deleteZoneBottom = isInTabs
    ? DELETE_ZONE_BOTTOM_MARGIN_TABS
    : DELETE_ZONE_BOTTOM_MARGIN_STACK;
  const initialCenterX = SCREEN_WIDTH / 2;
  const initialCenterY = SCREEN_HEIGHT - bottomOffset - MINI_PLAYER_HEIGHT / 2;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setDeleteZoneActiveSafe = useCallback((active: boolean) => {
    if (!isMountedRef.current) return;
    setIsOverDeleteZoneState(active);
  }, []);

  const handleDismiss = useCallback(() => {
    void stopPlayback();
  }, [stopPlayback]);

  // Pan gesture handler for dragging - MUST be defined before conditional returns
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = 1;
      isOverDeleteZone.value = 0;
      runOnJS(setDeleteZoneActiveSafe)(false);
    })
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;

      const absCenterX = initialCenterX + translateX.value;
      const absCenterY = initialCenterY + translateY.value;
      const zoneLeft = DELETE_ZONE_SIDE_MARGIN - DELETE_ZONE_HIT_PADDING;
      const zoneRight =
        SCREEN_WIDTH - DELETE_ZONE_SIDE_MARGIN + DELETE_ZONE_HIT_PADDING;
      const zoneTop =
        SCREEN_HEIGHT -
        deleteZoneBottom -
        DELETE_ZONE_HEIGHT -
        DELETE_ZONE_HIT_PADDING;
      const zoneBottom =
        SCREEN_HEIGHT - deleteZoneBottom + DELETE_ZONE_HIT_PADDING;
      const insideDeleteZone =
        absCenterX >= zoneLeft &&
        absCenterX <= zoneRight &&
        absCenterY >= zoneTop &&
        absCenterY <= zoneBottom;
      const nextOverDelete = insideDeleteZone ? 1 : 0;

      if (isOverDeleteZone.value !== nextOverDelete) {
        isOverDeleteZone.value = nextOverDelete;
        runOnJS(setDeleteZoneActiveSafe)(insideDeleteZone);
      }
    })
    .onEnd(() => {
      const absCenterX = initialCenterX + translateX.value;
      const absCenterY = initialCenterY + translateY.value;
      const zoneLeft = DELETE_ZONE_SIDE_MARGIN - DELETE_ZONE_HIT_PADDING;
      const zoneRight =
        SCREEN_WIDTH - DELETE_ZONE_SIDE_MARGIN + DELETE_ZONE_HIT_PADDING;
      const zoneTop =
        SCREEN_HEIGHT -
        deleteZoneBottom -
        DELETE_ZONE_HEIGHT -
        DELETE_ZONE_HIT_PADDING;
      const zoneBottom =
        SCREEN_HEIGHT - deleteZoneBottom + DELETE_ZONE_HIT_PADDING;
      const insideDeleteZone =
        absCenterX >= zoneLeft &&
        absCenterX <= zoneRight &&
        absCenterY >= zoneTop &&
        absCenterY <= zoneBottom;

      if (insideDeleteZone) {
        runOnJS(handleDismiss)();
        return;
      }

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
    })
    .onFinalize(() => {
      isDragging.value = 0;
      isOverDeleteZone.value = 0;
      runOnJS(setDeleteZoneActiveSafe)(false);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));
  const deleteZoneStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDragging.value, { duration: 200 }),
    transform: [{ scale: withSpring(isOverDeleteZone.value ? 1.03 : 1) }],
    backgroundColor: isOverDeleteZone.value
      ? "#FF3B30"
      : "rgba(255, 59, 48, 0.12)",
    borderColor: isOverDeleteZone.value
      ? "#FF3B30"
      : "rgba(255, 59, 48, 0.45)",
  }));

  // Now check if book exists - after all hooks
  const book = playbackState.currentBook;
  if (!book || pathname.startsWith("/player")) return null;

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.deleteZoneBar,
          {
            left: DELETE_ZONE_SIDE_MARGIN,
            right: DELETE_ZONE_SIDE_MARGIN,
            bottom: deleteZoneBottom,
          },
          deleteZoneStyle,
        ]}
      >
        <View style={styles.deleteZoneContent}>
          <MaterialIcons
            size={22}
            name={isOverDeleteZoneState ? "delete" : "delete-outline"}
            color={isOverDeleteZoneState ? "#FFFFFF" : "#FF3B30"}
          />
          <ThemedText
            style={[
              styles.deleteZoneText,
              { color: isOverDeleteZoneState ? "#FFFFFF" : "#FF3B30" },
            ]}
          >
            Drop here to close
          </ThemedText>
        </View>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.container, { bottom: bottomOffset }, animatedStyle]}
        >
          <View style={styles.wrapper}>
            <MiniPlayerInner onMinimum={() => setPlayerMode("circular")} />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

function MiniPlayerInner({
  onMinimum,
}: {
  onMinimum: () => void;
}) {
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

          <Pressable
            style={[styles.minimumButton, { backgroundColor: buttonBgColor }]}
            onPress={(e) => {
              e.stopPropagation();
              onMinimum();
            }}
          >
            <MaterialIcons size={18} name="remove" color={colors.text} />
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
  minimumButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteZoneBar: {
    position: "absolute",
    height: DELETE_ZONE_HEIGHT,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: "center",
    zIndex: 1100,
  },
  deleteZoneContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  deleteZoneText: {
    fontSize: 14,
    fontWeight: "600",
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
