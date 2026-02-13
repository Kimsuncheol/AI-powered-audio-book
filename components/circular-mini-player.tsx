import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { usePlayerMode } from "@/context/player-mode-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatTime } from "@/utils/time";
import { Image } from "expo-image";
import { usePathname, useSegments } from "expo-router";
import { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CIRCLE_SIZE = 90;
const STROKE_WIDTH = 4;
const IMAGE_INSET = STROKE_WIDTH + 2;
const IMAGE_SIZE = CIRCLE_SIZE - IMAGE_INSET * 2;
const TAB_BAR_HEIGHT = 80;
const DELETE_ZONE_HEIGHT = 80;
const INITIAL_RIGHT = 20;

// Progress ring using the two-half-circle clip technique (no SVG needed).
// The full ring is split into left and right halves, each clipped by an
// overflow:hidden container. Rotating the inner circle within each clip
// progressively reveals the arc.
function ProgressRing({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) {
  const size = CIRCLE_SIZE;
  const trackColor = "rgba(255,255,255,0.3)";

  // Right half: reveals as progress goes 0 → 0.5
  const rightRotation = Math.min(progress, 0.5) * 360 - 180;
  // Left half: reveals as progress goes 0.5 → 1.0
  const leftRotation = Math.max(0, progress - 0.5) * 360 - 180;

  return (
    <View
      style={{ width: size, height: size, position: "absolute", top: 0, left: 0 }}
    >
      {/* Track ring */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: STROKE_WIDTH,
          borderColor: trackColor,
        }}
      />

      {/* Right half clip — reveals the clockwise arc from 12 o'clock to 6 */}
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: size / 2,
          height: size,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: -(size / 2), // align inner circle's center with clip's left edge
            top: 0,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: STROKE_WIDTH,
            borderColor: color,
            transform: [{ rotate: `${rightRotation}deg` }],
          }}
        />
      </View>

      {/* Left half clip — reveals the clockwise arc from 6 o'clock to 12 */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size / 2,
          height: size,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            right: -(size / 2), // align inner circle's center with clip's right edge
            top: 0,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: STROKE_WIDTH,
            borderColor: color,
            transform: [{ rotate: `${leftRotation}deg` }],
          }}
        />
      </View>
    </View>
  );
}

export function CircularMiniPlayer() {
  const { playbackState, stopPlayback } = useAudioPlayer();
  const { setPlayerMode } = usePlayerMode();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const segments = useSegments();
  const pathname = usePathname();

  const isInTabs = segments[0] === "(tabs)";
  const bottomOffset = isInTabs ? TAB_BAR_HEIGHT + 20 : 40;

  // Initial absolute center (used for delete-zone hit test)
  const initialCenterX = SCREEN_WIDTH - INITIAL_RIGHT - CIRCLE_SIZE / 2;
  const initialCenterY = SCREEN_HEIGHT - bottomOffset - CIRCLE_SIZE / 2;

  // Shared values — all declared before any conditional return
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const isDragging = useSharedValue(0); // 0 = idle, 1 = dragging
  const scale = useSharedValue(1);

  const switchToBar = useCallback(() => {
    setPlayerMode("bar");
  }, [setPlayerMode]);

  const dismiss = useCallback(() => {
    setPlayerMode("bar");
    stopPlayback();
  }, [setPlayerMode, stopPlayback]);

  // Pan gesture — drag, snap to bounds, or drop into delete zone
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = 1;
      scale.value = withSpring(1.12);
    })
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      const absCenterY = initialCenterY + translateY.value;

      // Delete zone: bottom DELETE_ZONE_HEIGHT px of screen
      if (absCenterY > SCREEN_HEIGHT - DELETE_ZONE_HEIGHT) {
        dismiss();
        return;
      }

      // Clamp to screen bounds with padding
      const absCenterX = initialCenterX + translateX.value;
      const pad = CIRCLE_SIZE / 2 + 8;
      const clampedX = Math.max(pad, Math.min(SCREEN_WIDTH - pad, absCenterX));
      const clampedY = Math.max(pad + 40, Math.min(SCREEN_HEIGHT - pad, absCenterY));

      const finalX = clampedX - initialCenterX;
      const finalY = clampedY - initialCenterY;

      translateX.value = withSpring(finalX);
      translateY.value = withSpring(finalY);
      offsetX.value = finalX;
      offsetY.value = finalY;
    })
    .onFinalize(() => {
      isDragging.value = 0;
      scale.value = withSpring(1);
    });

  // Single tap — immediately switch to bar mini-player
  const tapGesture = Gesture.Tap().onEnd(() => {
    switchToBar();
  });

  // Long press (2 s) — also switches to bar (kept for accessibility)
  const longPressGesture = Gesture.LongPress()
    .minDuration(2000)
    .onStart(() => {
      switchToBar();
    });

  // Race: tap on quick touch, longPress on hold, pan on movement
  const combinedGesture = Gesture.Race(tapGesture, longPressGesture, panGesture);

  const playerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const deleteZoneStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDragging.value, { duration: 200 }),
  }));

  // Conditional render after all hooks
  const book = playbackState.currentBook;
  if (!book || pathname.startsWith("/player")) return null;

  const progress =
    playbackState.duration > 0
      ? playbackState.position / playbackState.duration
      : 0;

  const bgColor = colorScheme === "dark" ? "rgba(28,28,30,0.92)" : "rgba(242,242,247,0.92)";

  return (
    <>
      {/* Floating delete zone — fades in while dragging */}
      <Animated.View
        pointerEvents="none"
        style={[styles.deleteZone, deleteZoneStyle]}
      >
        <IconSymbol size={28} name="trash" color="#FF3B30" />
        <ThemedText style={styles.deleteZoneLabel}>Release to remove</ThemedText>
      </Animated.View>

      {/* Circular player */}
      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[
            styles.container,
            { bottom: bottomOffset, right: INITIAL_RIGHT },
            playerStyle,
          ]}
        >
          {/* Outer ring container */}
          <View style={[styles.ringContainer, { backgroundColor: bgColor }]}>
            {/* Book cover */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: book.coverImage }}
                style={styles.cover}
                contentFit="cover"
              />
            </View>

            {/* Animated progress ring — sits on top, no overflow clip */}
            <ProgressRing progress={progress} color={colors.tint} />
          </View>

          {/* Duration label below circle */}
          <ThemedText style={styles.duration}>
            {formatTime(playbackState.duration)}
          </ThemedText>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    zIndex: 1000,
  },
  ringContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  imageContainer: {
    position: "absolute",
    top: IMAGE_INSET,
    left: IMAGE_INSET,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: "hidden",
  },
  cover: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  duration: {
    fontSize: 10,
    marginTop: 5,
    opacity: 0.75,
    fontWeight: "600",
  },
  deleteZone: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    height: DELETE_ZONE_HEIGHT,
    backgroundColor: "rgba(255, 59, 48, 0.12)",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 59, 48, 0.45)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    zIndex: 999,
  },
  deleteZoneLabel: {
    fontSize: 11,
    color: "#FF3B30",
    fontWeight: "600",
  },
});
