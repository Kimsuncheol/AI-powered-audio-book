import { StyleSheet, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAudioPlayer } from '@/context/audio-player-context';

export function MiniPlayer() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { playbackState, togglePlayPause } = useAudioPlayer();

  const book = playbackState.currentBook;
  if (!book) return null;

  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';
  const progress = playbackState.duration > 0
    ? (playbackState.position / playbackState.duration) * 100
    : 0;

  return (
    <Pressable style={[styles.container, { backgroundColor: cardBgColor }]} onPress={() => router.push('/player')}>
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

        <Pressable
          style={styles.playButton}
          onPress={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}>
          <IconSymbol
            size={28}
            name={playbackState.isPlaying ? 'pause.fill' : 'play.fill'}
            color={colors.text}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 8,
    right: 8,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
    padding: 10,
    gap: 12,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 8,
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
  playButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
