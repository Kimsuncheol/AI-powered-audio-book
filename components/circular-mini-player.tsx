import { DeleteZoneStripes } from "@/components/shared/DeleteZoneStripes";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatTime } from "@/utils/time";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router, usePathname, useSegments } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
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
const INITIAL_RIGHT = 20;

const DELETE_ZONE_SIZE = 76;
const DELETE_ZONE_RIGHT_MARGIN = 18;
const DELETE_ZONE_BOTTOM_MARGIN_TABS = TAB_BAR_HEIGHT + 14;
const DELETE_ZONE_BOTTOM_MARGIN_STACK = 24;
const DELETE_HIT_RADIUS = (CIRCLE_SIZE + DELETE_ZONE_SIZE) * 0.38;

// Progress ring using the two-half-circle clip technique (no SVG needed).
function ProgressRing({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) {
  const size = CIRCLE_SIZE;
  const trackColor = "rgba(255,255,255,0.3)";

  const rightRotation = Math.min(progress, 0.5) * 360 - 180;
  const leftRotation = Math.max(0, progress - 0.5) * 360 - 180;

  return (
    <View
      style={{
        width: size,
        height: size,
        position: "absolute",
        top: 0,
        left: 0,
      }}
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

      {/* Right half clip */}
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
            left: -(size / 2),
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

      {/* Left half clip */}
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
            right: -(size / 2),
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
  const { playbackState, stopPlayback, togglePlayPause } = useAudioPlayer();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const segments = useSegments();
  const pathname = usePathname();
  const [isOverDeleteZoneState, setIsOverDeleteZoneState] = useState(false);
  const isMountedRef = useRef(true);

  const isInTabs = segments[0] === "(tabs)";
  const bottomOffset = isInTabs ? TAB_BAR_HEIGHT + 20 : 40;
  const deleteZoneRight = DELETE_ZONE_RIGHT_MARGIN;
  const deleteZoneBottom = isInTabs
    ? DELETE_ZONE_BOTTOM_MARGIN_TABS
    : DELETE_ZONE_BOTTOM_MARGIN_STACK;

  const initialCenterX = SCREEN_WIDTH - INITIAL_RIGHT - CIRCLE_SIZE / 2;
  const initialCenterY = SCREEN_HEIGHT - bottomOffset - CIRCLE_SIZE / 2;

  // Shared values — all declared before any conditional return
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const isDragging = useSharedValue(0);
  const isOverDeleteZone = useSharedValue(0);
  const scale = useSharedValue(1);
  const isTouching = useSharedValue(0); // 1 when finger is on the circle (hover)

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

  const handleTogglePlayPause = useCallback(() => {
    togglePlayPause();
  }, [togglePlayPause]);

  const handleOpenPlayer = useCallback(() => {
    const book = playbackState.currentBook;
    if (!book) return;
    router.push({ pathname: "/player/[id]", params: { id: book.id } });
  }, [playbackState.currentBook]);

  // Pan gesture — drag, snap to bounds, or drop into delete zone
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = 1;
      isOverDeleteZone.value = 0;
      scale.value = withSpring(1.12);
      // Hide hover overlay once dragging starts
      isTouching.value = withTiming(0, { duration: 100 });
      runOnJS(setDeleteZoneActiveSafe)(false);
    })
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;

      const absCenterX = initialCenterX + translateX.value;
      const absCenterY = initialCenterY + translateY.value;
      const zoneCenterX = SCREEN_WIDTH - deleteZoneRight - DELETE_ZONE_SIZE / 2;
      const zoneCenterY =
        SCREEN_HEIGHT - deleteZoneBottom - DELETE_ZONE_SIZE / 2;

      const dx = absCenterX - zoneCenterX;
      const dy = absCenterY - zoneCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const insideDeleteZone = distance <= DELETE_HIT_RADIUS;
      const nextOverDelete = insideDeleteZone ? 1 : 0;

      if (isOverDeleteZone.value !== nextOverDelete) {
        isOverDeleteZone.value = nextOverDelete;
        runOnJS(setDeleteZoneActiveSafe)(insideDeleteZone);
      }
    })
    .onEnd(() => {
      const absCenterX = initialCenterX + translateX.value;
      const absCenterY = initialCenterY + translateY.value;
      const zoneCenterX = SCREEN_WIDTH - deleteZoneRight - DELETE_ZONE_SIZE / 2;
      const zoneCenterY =
        SCREEN_HEIGHT - deleteZoneBottom - DELETE_ZONE_SIZE / 2;
      const dx = absCenterX - zoneCenterX;
      const dy = absCenterY - zoneCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= DELETE_HIT_RADIUS) {
        runOnJS(handleDismiss)();
        return;
      }

      const pad = CIRCLE_SIZE / 2 + 8;
      const clampedX = Math.max(pad, Math.min(SCREEN_WIDTH - pad, absCenterX));
      const clampedY = Math.max(
        pad + 40,
        Math.min(SCREEN_HEIGHT - pad, absCenterY),
      );

      const finalX = clampedX - initialCenterX;
      const finalY = clampedY - initialCenterY;

      translateX.value = withSpring(finalX);
      translateY.value = withSpring(finalY);
      offsetX.value = finalX;
      offsetY.value = finalY;
    })
    .onFinalize(() => {
      isDragging.value = 0;
      isOverDeleteZone.value = 0;
      isTouching.value = 0;
      scale.value = withSpring(1);
      runOnJS(setDeleteZoneActiveSafe)(false);
    });

  // Short tap — show hover overlay on begin, toggle play/pause on end
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      isTouching.value = withTiming(1, { duration: 100 });
    })
    .onEnd(() => {
      runOnJS(handleTogglePlayPause)();
    })
    .onFinalize(() => {
      isTouching.value = withTiming(0, { duration: 150 });
    });

  // Long press — show hover overlay then open full player
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onBegin(() => {
      isTouching.value = withTiming(1, { duration: 100 });
    })
    .onStart(() => {
      runOnJS(handleOpenPlayer)();
    })
    .onFinalize(() => {
      isTouching.value = withTiming(0, { duration: 150 });
    });

  // Race: tap on quick touch, longPress on hold, pan on movement
  const combinedGesture = Gesture.Race(
    tapGesture,
    longPressGesture,
    panGesture,
  );

  const playerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const deleteZoneStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDragging.value, { duration: 200 }),
    transform: [{ scale: withSpring(isOverDeleteZone.value ? 1.08 : 1) }],
    backgroundColor: isOverDeleteZone.value
      ? "#FF3B30"
      : "rgba(255, 59, 48, 0.12)",
    borderColor: isOverDeleteZone.value ? "#FF3B30" : "rgba(255, 59, 48, 0.45)",
  }));

  const hoverOverlayStyle = useAnimatedStyle(() => ({
    opacity: isTouching.value,
  }));

  // Conditional render after all hooks
  const book = playbackState.currentBook;
  if (!book || pathname.startsWith("/player")) return null;

  const progress =
    playbackState.duration > 0
      ? playbackState.position / playbackState.duration
      : 0;

  const bgColor =
    colorScheme === "dark" ? "rgba(28,28,30,0.92)" : "rgba(242,242,247,0.92)";

  return (
    <>
      {/* Floating delete zone — fades in while dragging */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.deleteZone,
          { right: deleteZoneRight, bottom: deleteZoneBottom },
          deleteZoneStyle,
        ]}
      >
        <MaterialIcons
          size={28}
          name={isOverDeleteZoneState ? "delete" : "delete-outline"}
          color={isOverDeleteZoneState ? "#FFFFFF" : "#FF3B30"}
        />
        <DeleteZoneStripes
          active={isOverDeleteZoneState}
          borderRadius={DELETE_ZONE_SIZE / 2}
        />
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

            {/* Animated progress ring */}
            <ProgressRing progress={progress} color={colors.tint} />

            {/* Hover overlay — shows play/pause icon on touch */}
            <Animated.View
              pointerEvents="none"
              style={[styles.hoverOverlay, hoverOverlayStyle]}
            >
              <MaterialIcons
                size={32}
                name={playbackState.isPlaying ? "pause" : "play-arrow"}
                color="#FFFFFF"
              />
            </Animated.View>
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
  hoverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  duration: {
    fontSize: 10,
    marginTop: 5,
    opacity: 0.75,
    fontWeight: "600",
  },
  deleteZone: {
    position: "absolute",
    width: DELETE_ZONE_SIZE,
    height: DELETE_ZONE_SIZE,
    borderRadius: DELETE_ZONE_SIZE / 2,
    backgroundColor: "rgba(255, 59, 48, 0.12)",
    borderWidth: 2,
    borderColor: "rgba(255, 59, 48, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1100,
  },
});
