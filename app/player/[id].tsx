import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_AUDIOBOOKS, formatDuration } from '@/data/mock-audiobooks';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const { id, chapterId } = useLocalSearchParams<{ id: string; chapterId?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const book = MOCK_AUDIOBOOKS.find((b) => b.id === id);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  useEffect(() => {
    if (book && chapterId) {
      const chapterIndex = book.chapters.findIndex((ch) => ch.id === chapterId);
      if (chapterIndex >= 0) {
        setCurrentChapterIndex(chapterIndex);
      }
    }
  }, [book, chapterId]);

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const loadAudio = async () => {
    if (!book) return;

    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: book.audioUrl },
        { shouldPlay: true, rate: playbackSpeed },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading audio:', error);
      Alert.alert('Error', 'Failed to load audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        handleNextChapter();
      }
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      try {
        await sound.setPositionAsync(value * 1000);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  const handleSkipForward = async () => {
    if (sound) {
      const newPosition = Math.min(position + 15, duration);
      await handleSeek(newPosition);
    }
  };

  const handleSkipBackward = async () => {
    if (sound) {
      const newPosition = Math.max(position - 15, 0);
      await handleSeek(newPosition);
    }
  };

  const handleNextChapter = async () => {
    if (!book || currentChapterIndex >= book.chapters.length - 1) return;

    setCurrentChapterIndex(currentChapterIndex + 1);
    Alert.alert('Chapter Changed', `Now playing: ${book.chapters[currentChapterIndex + 1].title}`);
  };

  const handlePreviousChapter = async () => {
    if (!book || currentChapterIndex <= 0) return;

    setCurrentChapterIndex(currentChapterIndex - 1);
    Alert.alert('Chapter Changed', `Now playing: ${book.chapters[currentChapterIndex - 1].title}`);
  };

  const cyclePlaybackSpeed = async () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];

    setPlaybackSpeed(nextSpeed);
    if (sound) {
      try {
        await sound.setRateAsync(nextSpeed, true);
      } catch (error) {
        console.error('Error changing speed:', error);
      }
    }
  };

  if (!book) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Book not found</ThemedText>
      </ThemedView>
    );
  }

  const currentChapter = book.chapters[currentChapterIndex];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Now Playing',
          headerBackTitle: 'Back',
        }}
      />

      <View style={styles.content}>
        <View style={styles.coverSection}>
          <Image source={{ uri: book.coverImage }} style={styles.coverImage} contentFit="cover" />
        </View>

        <View style={styles.infoSection}>
          <ThemedText style={styles.chapterLabel}>
            Chapter {currentChapterIndex + 1} of {book.chapters.length}
          </ThemedText>
          <ThemedText type="title" style={styles.bookTitle} numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.chapterTitle} numberOfLines={1}>
            {currentChapter.title}
          </ThemedText>
          <ThemedText style={styles.author}>{book.author}</ThemedText>
        </View>

        <View style={styles.progressSection}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={colors.tint}
            maximumTrackTintColor={colorScheme === 'dark' ? '#333' : '#DDD'}
            thumbTintColor={colors.tint}
          />
          <View style={styles.timeRow}>
            <ThemedText style={styles.timeText}>{formatDuration(Math.floor(position))}</ThemedText>
            <ThemedText style={styles.timeText}>{formatDuration(Math.floor(duration))}</ThemedText>
          </View>
        </View>

        <View style={styles.controlsSection}>
          <Pressable onPress={cyclePlaybackSpeed} style={styles.speedButton}>
            <ThemedText style={styles.speedText}>{playbackSpeed}x</ThemedText>
          </Pressable>

          <View style={styles.mainControls}>
            <Pressable onPress={handlePreviousChapter} style={styles.controlButton}>
              <IconSymbol size={32} name="backward.end.fill" color={colors.text} />
            </Pressable>

            <Pressable onPress={handleSkipBackward} style={styles.controlButton}>
              <IconSymbol size={28} name="gobackward.15" color={colors.text} />
            </Pressable>

            <Pressable
              onPress={togglePlayPause}
              style={[styles.playButton, { backgroundColor: colors.tint }]}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <IconSymbol
                  size={40}
                  name={isPlaying ? 'pause.fill' : 'play.fill'}
                  color="#FFFFFF"
                />
              )}
            </Pressable>

            <Pressable onPress={handleSkipForward} style={styles.controlButton}>
              <IconSymbol size={28} name="goforward.15" color={colors.text} />
            </Pressable>

            <Pressable onPress={handleNextChapter} style={styles.controlButton}>
              <IconSymbol size={32} name="forward.end.fill" color={colors.text} />
            </Pressable>
          </View>

          <Pressable
            onPress={() => Alert.alert('Coming Soon', 'Sleep timer feature coming soon!')}
            style={styles.speedButton}>
            <IconSymbol size={24} name="moon" color={colors.icon} />
          </Pressable>
        </View>

        <View style={styles.additionalControls}>
          <Pressable
            style={styles.actionButton}
            onPress={() => Alert.alert('Coming Soon', 'Bookmarks feature coming soon!')}>
            <IconSymbol size={22} name="bookmark" color={colors.icon} />
            <ThemedText style={styles.actionButtonText}>Bookmark</ThemedText>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push(`/book/${book.id}`)}>
            <IconSymbol size={22} name="list.bullet" color={colors.icon} />
            <ThemedText style={styles.actionButtonText}>Chapters</ThemedText>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => Alert.alert('Coming Soon', 'Share feature coming soon!')}>
            <IconSymbol size={22} name="square.and.arrow.up" color={colors.icon} />
            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  coverSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  coverImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chapterLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    opacity: 0.7,
  },
  progressSection: {
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 13,
    opacity: 0.7,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  speedButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 13,
    opacity: 0.7,
  },
});
