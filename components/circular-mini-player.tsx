import { DeleteZoneStripes } from "@/components/shared/DeleteZoneStripes";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatTime } from "@/utils/time";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { router, usePathname, useSegments } from "expo-router";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CIRCLE_SIZE = 90;
const STROKE_WIDTH = 4;
const IMAGE_INSET = STROKE_WIDTH + 2;
const IMAGE_SIZE = CIRCLE_SIZE - IMAGE_INSET * 2;
const TAB_BAR_HEIGHT = 80;
const INITIAL_RIGHT = 20;
const EDGE_PAD = CIRCLE_SIZE / 2 + 8;

const DELETE_ZONE_SIZE = 76;
const DELETE_ZONE_RIGHT_MARGIN = 18;
const DELETE_ZONE_BOTTOM_MARGIN_TABS = TAB_BAR_HEIGHT + 14;
const DELETE_ZONE_BOTTOM_MARGIN_STACK = 24;
const DELETE_HIT_RADIUS = (CIRCLE_SIZE + DELETE_ZONE_SIZE) * 0.38;

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

const hapticHeavy = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

export function CircularMiniPlayer() {
  const { playbackState, stopPlayback, togglePlayPause } = useAudioPlayer();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const segments = useSegments();
  const pathname = usePathname();

  const isInTabs = segments[0] === "(tabs)";
  const bottomOffset = isInTabs ? TAB_BAR_HEIGHT + 20 : 40;
  const deleteZoneRight = DELETE_ZONE_RIGHT_MARGIN;
  const deleteZoneBottom = isInTabs
    ? DELETE_ZONE_BOTTOM_MARGIN_TABS
    : DELETE_ZONE_BOTTOM_MARGIN_STACK;

  const initialCenterX = SCREEN_WIDTH - INITIAL_RIGHT - CIRCLE_SIZE / 2;
  const initialCenterY = SCREEN_HEIGHT - bottomOffset - CIRCLE_SIZE / 2;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const isDragging = useSharedValue(0);
  const isOverDeleteZone = useSharedValue(0);
  const scale = useSharedValue(1);
  const pausedOverlay = useSharedValue(playbackState.isPlaying ? 0 : 1);

  useEffect(() => {
    pausedOverlay.value = withTiming(playbackState.isPlaying ? 0 : 1, {
      duration: 200,
    });
  }, [playbackState.isPlaying]);

  const handleDismiss = useCallback(() => {
    void stopPlayback();
  }, [stopPlayback]);

  const handleTogglePlayPause = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    togglePlayPause();
  }, [togglePlayPause]);

  const handleOpenPlayer = useCallback(() => {
    const book = playbackState.currentBook;
    if (!book) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: "/player/[id]", params: { id: book.id } });
  }, [playbackState.currentBook]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = 1;
      isOverDeleteZone.value = 0;
      scale.value = withSpring(1.12);
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
      const nextOverDelete = distance <= DELETE_HIT_RADIUS ? 1 : 0;

      if (isOverDeleteZone.value !== nextOverDelete) {
        isOverDeleteZone.value = nextOverDelete;
        // Haptics must cross to JS thread — only usage of runOnJS
        if (nextOverDelete === 1) {
          runOnJS(hapticHeavy)();
        }
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
        handleDismiss();
        return;
      }

      const snappedX =
        absCenterX >= SCREEN_WIDTH / 2
          ? SCREEN_WIDTH - EDGE_PAD
          : EDGE_PAD;

      const clampedY = Math.max(
        EDGE_PAD + 40,
        Math.min(SCREEN_HEIGHT - EDGE_PAD, absCenterY),
      );

      const finalX = snappedX - initialCenterX;
      const finalY = clampedY - initialCenterY;

      translateX.value = withSpring(finalX, { damping: 20, stiffness: 200 });
      translateY.value = withSpring(finalY, { damping: 20, stiffness: 200 });
      offsetX.value = finalX;
      offsetY.value = finalY;
    })
    .onFinalize(() => {
      isDragging.value = 0;
      isOverDeleteZone.value = 0;
      scale.value = withSpring(1);
    });

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      handleTogglePlayPause();
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .runOnJS(true)
    .onStart(() => {
      handleOpenPlayer();
    });

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

  // Animated icon swap — no JS state needed
  const deleteIconActiveStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOverDeleteZone.value, { duration: 150 }),
    position: "absolute",
  }));
  const deleteIconInactiveStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1 - isOverDeleteZone.value, { duration: 150 }),
    position: "absolute",
  }));

  const pausedOverlayStyle = useAnimatedStyle(() => ({
    opacity: pausedOverlay.value,
  }));

  const book = playbackState.currentBook;
  if (!book || pathname.startsWith("/player")) return null;

  const isBuffering = playbackState.duration === 0;

  const progress =
    playbackState.duration > 0
      ? playbackState.position / playbackState.duration
      : 0;

  const bgColor =
    colorScheme === "dark" ? "rgba(28,28,30,0.92)" : "rgba(242,242,247,0.92)";

  const overlayBgColor =
    colorScheme === "dark" ? "rgba(0, 0, 0, 0.50)" : "rgba(0, 0, 0, 0.35)";

  const remainingTime = playbackState.duration - playbackState.position;

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.deleteZone,
          { right: deleteZoneRight, bottom: deleteZoneBottom },
          deleteZoneStyle,
        ]}
      >
        {/* Inactive icon + stripes — fades out as player enters zone */}
        <Animated.View style={deleteIconInactiveStyle}>
          <MaterialIcons size={28} name="delete-outline" color="#FF3B30" />
        </Animated.View>
        {/* Active icon — fades in as player enters zone */}
        <Animated.View style={deleteIconActiveStyle}>
          <MaterialIcons size={28} name="delete" color="#FFFFFF" />
        </Animated.View>
        {/* Stripes hidden when active via parent opacity animation */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, deleteIconInactiveStyle]}
        >
          <DeleteZoneStripes active={false} borderRadius={DELETE_ZONE_SIZE / 2} />
        </Animated.View>
      </Animated.View>

      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[
            styles.container,
            { bottom: bottomOffset, right: INITIAL_RIGHT },
            playerStyle,
          ]}
        >
          <View style={[styles.ringContainer, { backgroundColor: bgColor }]}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: book.coverImage }}
                style={styles.cover}
                contentFit="cover"
              />
            </View>

            <ProgressRing progress={progress} color={colors.tint} />

            {/* Buffering overlay */}
            {isBuffering && (
              <View
                style={[
                  styles.statusOverlay,
                  { backgroundColor: overlayBgColor },
                ]}
              >
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}

            {/* Paused overlay — visible only when paused and not buffering */}
            {!isBuffering && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.statusOverlay,
                  { backgroundColor: overlayBgColor },
                  pausedOverlayStyle,
                ]}
              >
                <MaterialIcons size={32} name="play-arrow" color="#FFFFFF" />
              </Animated.View>
            )}
          </View>

          <ThemedText style={styles.duration}>
            {isBuffering ? "..." : `-${formatTime(remainingTime)}`}
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
  statusOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
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
