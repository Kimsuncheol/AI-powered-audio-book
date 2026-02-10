import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAudioPlayer } from '@/context/audio-player-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_PLAYER_HEIGHT = 80;
const MINI_PLAYER_WIDTH = SCREEN_WIDTH - 16;
const TAB_BAR_HEIGHT = 80;

export function MiniPlayer() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { playbackState, togglePlayPause, previousChapter, nextChapter } = useAudioPlayer();

  // Shared values for dragging - MUST be called before any conditional returns
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

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
      const maxY = SCREEN_HEIGHT - TAB_BAR_HEIGHT - MINI_PLAYER_HEIGHT - 20;
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

  // Now check if book exists - after all hooks
  const book = playbackState.currentBook;
  if (!book) return null;

  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';
  const progress = playbackState.duration > 0
    ? (playbackState.position / playbackState.duration) * 100
    : 0;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Pressable
          style={[styles.playerCard, { backgroundColor: cardBgColor }]}
          onPress={() => router.push('/player')}
        >
          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.tint }]} />
          </View>

          <View style={styles.content}>
            <Image source={{ uri: book.coverImage }} style={styles.cover} contentFit="cover" />

            <View style={styles.info}>
              <ThemedText style={styles.title} numberOfLines={1}>{book.title}</ThemedText>
              <ThemedText style={styles.chapter} numberOfLines={1}>
                {book.chapters[playbackState.currentChapterIndex]?.title}
              </ThemedText>
            </View>

            <View style={styles.controls}>
              {/* Previous button */}
              <Pressable
                style={styles.controlButton}
                onPress={(e) => {
                  e.stopPropagation();
                  previousChapter();
                }}
              >
                <IconSymbol
                  size={24}
                  name="backward.fill"
                  color={colors.text}
                />
              </Pressable>

              {/* Play/Pause button */}
              <Pressable
                style={styles.playButton}
                onPress={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
              >
                <IconSymbol
                  size={28}
                  name={playbackState.isPlaying ? 'pause.fill' : 'play.fill'}
                  color={colors.text}
                />
              </Pressable>

              {/* Next button */}
              <Pressable
                style={styles.controlButton}
                onPress={(e) => {
                  e.stopPropagation();
                  nextChapter();
                }}
              >
                <IconSymbol
                  size={24}
                  name="forward.fill"
                  color={colors.text}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 8,
    right: 8,
    zIndex: 1000,
  },
  playerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
  },
  chapter: {
    fontSize: 12,
    opacity: 0.6,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
