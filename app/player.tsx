import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Slider from '@react-native-community/slider';
import { SignUpPromptModal } from '@/components/auth/SignUpPromptModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAudioPlayer } from '@/context/audio-player-context';
import { formatDuration } from '@/data/mock-audiobooks';
import { PLAYBACK_RATES, GUEST_TIME_LIMIT } from '@/types/playback';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isGuest } = useAuth();
  const {
    playbackState,
    togglePlayPause,
    skipForward,
    skipBackward,
    nextChapter,
    previousChapter,
    seekTo,
    setPlaybackRate,
    setSleepTimer,
    cancelSleepTimer,
  } = useAudioPlayer();

  const [showPlaybackRates, setShowPlaybackRates] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [limitReason, setLimitReason] = useState<'time' | 'chapter'>('time');

  const book = playbackState.currentBook;
  const currentChapter = book?.chapters[playbackState.currentChapterIndex];

  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';

  // Handle preview limit reached
  useEffect(() => {
    if (isGuest && playbackState.currentBook) {
      // Check time limit
      if (playbackState.position > GUEST_TIME_LIMIT && playbackState.isPlaying) {
        setLimitReason('time');
        setShowSignUpModal(true);
      }
    }
  }, [isGuest, playbackState.position, playbackState.isPlaying, playbackState.currentBook]);

  const handleSeek = async (value: number) => {
    await seekTo(value);
  };

  const handlePlaybackRateSelect = async (rate: number) => {
    await setPlaybackRate(rate);
    setShowPlaybackRates(false);
  };

  const handleSleepTimerSelect = (minutes: number) => {
    setSleepTimer(minutes);
    setShowSleepTimer(false);
    Alert.alert('Sleep Timer Set', `Playback will stop in ${minutes} minutes`);
  };

  const handleCancelSleepTimer = () => {
    cancelSleepTimer();
    Alert.alert('Sleep Timer Cancelled');
  };

  if (!book) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No audiobook playing</ThemedText>
          <Pressable
            style={[styles.closeButton, { backgroundColor: colors.tint }]}
            onPress={() => router.back()}>
            <ThemedText style={styles.closeButtonText}>Go Back</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <IconSymbol size={24} name="chevron.down" color={colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Now Playing</ThemedText>
          <Pressable
            style={styles.headerButton}
            onPress={() => Alert.alert('More', 'Options coming soon!')}>
            <IconSymbol size={24} name="ellipsis.circle" color={colors.text} />
          </Pressable>
        </View>

        {/* Album Art */}
        <View style={styles.artworkContainer}>
          <Image source={{ uri: book.coverImage }} style={styles.artwork} contentFit="cover" />
        </View>

        {/* Book Info */}
        <View style={styles.bookInfo}>
          <ThemedText type="title" style={styles.bookTitle}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.bookAuthor}>{book.author}</ThemedText>
          <ThemedText style={styles.chapterTitle}>{currentChapter?.title}</ThemedText>

          {/* Guest Preview Badge */}
          {isGuest && (
            <View style={[styles.previewBadge, { backgroundColor: colors.tint + '20', borderColor: colors.tint }]}>
              <IconSymbol size={14} name="eye.fill" color={colors.tint} />
              <ThemedText style={[styles.previewText, { color: colors.tint }]}>
                Preview Mode • First Chapter • 5 min limit
              </ThemedText>
            </View>
          )}
        </View>

        {/* Progress Slider */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            value={playbackState.position}
            minimumValue={0}
            maximumValue={playbackState.duration}
            minimumTrackTintColor={colors.tint}
            maximumTrackTintColor={colorScheme === 'dark' ? '#444' : '#DDD'}
            thumbTintColor={colors.tint}
            onSlidingComplete={handleSeek}
          />
          <View style={styles.timeContainer}>
            <ThemedText style={styles.timeText}>
              {formatDuration(Math.floor(playbackState.position / 1000))}
            </ThemedText>
            <ThemedText style={styles.timeText}>
              {formatDuration(Math.floor(playbackState.duration / 1000))}
            </ThemedText>
          </View>
        </View>

        {/* Main Controls */}
        <View style={styles.controlsContainer}>
          <Pressable style={styles.controlButton} onPress={previousChapter}>
            <IconSymbol size={32} name="backward.end.fill" color={colors.text} />
          </Pressable>

          <Pressable style={styles.controlButton} onPress={() => skipBackward(15)}>
            <IconSymbol size={32} name="gobackward.15" color={colors.text} />
          </Pressable>

          <Pressable
            style={[styles.playButton, { backgroundColor: colors.tint }]}
            onPress={togglePlayPause}>
            <IconSymbol
              size={40}
              name={playbackState.isPlaying ? 'pause.fill' : 'play.fill'}
              color="#FFFFFF"
            />
          </Pressable>

          <Pressable style={styles.controlButton} onPress={() => skipForward(15)}>
            <IconSymbol size={32} name="goforward.15" color={colors.text} />
          </Pressable>

          <Pressable
            style={styles.controlButton}
            onPress={() => {
              if (isGuest && playbackState.currentChapterIndex >= 0) {
                setLimitReason('chapter');
                setShowSignUpModal(true);
              } else {
                nextChapter();
              }
            }}
            disabled={isGuest && playbackState.currentChapterIndex >= 0}
          >
            <IconSymbol
              size={32}
              name="forward.end.fill"
              color={isGuest && playbackState.currentChapterIndex >= 0 ? colors.icon + '40' : colors.text}
            />
          </Pressable>
        </View>

        {/* Secondary Controls */}
        <View style={styles.secondaryControls}>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: cardBgColor }]}
            onPress={() => setShowPlaybackRates(!showPlaybackRates)}>
            <ThemedText style={styles.secondaryButtonText}>
              {playbackState.playbackRate}x
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, { backgroundColor: cardBgColor }]}
            onPress={() => {
              if (playbackState.isSleepTimerActive) {
                handleCancelSleepTimer();
              } else {
                setShowSleepTimer(!showSleepTimer);
              }
            }}>
            <IconSymbol
              size={20}
              name={playbackState.isSleepTimerActive ? 'moon.fill' : 'moon'}
              color={playbackState.isSleepTimerActive ? colors.tint : colors.text}
            />
          </Pressable>
        </View>

        {/* Playback Rates Menu */}
        {showPlaybackRates && (
          <View style={[styles.menuContainer, { backgroundColor: cardBgColor }]}>
            <ThemedText style={styles.menuTitle}>Playback Speed</ThemedText>
            <View style={styles.menuGrid}>
              {PLAYBACK_RATES.map((rate) => (
                <Pressable
                  key={rate}
                  style={[
                    styles.menuItem,
                    playbackState.playbackRate === rate && {
                      backgroundColor: colors.tint,
                    },
                  ]}
                  onPress={() => handlePlaybackRateSelect(rate)}>
                  <ThemedText
                    style={[
                      styles.menuItemText,
                      playbackState.playbackRate === rate && styles.menuItemTextActive,
                    ]}>
                    {rate}x
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Sleep Timer Menu */}
        {showSleepTimer && (
          <View style={[styles.menuContainer, { backgroundColor: cardBgColor }]}>
            <ThemedText style={styles.menuTitle}>Sleep Timer</ThemedText>
            <View style={styles.menuGrid}>
              {[5, 10, 15, 30, 45, 60].map((minutes) => (
                <Pressable
                  key={minutes}
                  style={styles.menuItem}
                  onPress={() => handleSleepTimerSelect(minutes)}>
                  <ThemedText style={styles.menuItemText}>{minutes}m</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Chapter List */}
        <View style={styles.chapterList}>
          <ThemedText type="subtitle" style={styles.chapterListTitle}>
            Chapters
          </ThemedText>
          {book.chapters.map((chapter, index) => (
            <Pressable
              key={index}
              style={[
                styles.chapterItem,
                { backgroundColor: cardBgColor },
                index === playbackState.currentChapterIndex && {
                  borderColor: colors.tint,
                  borderWidth: 2,
                },
              ]}
              onPress={() => {
                // Load and play this chapter
                Alert.alert('Coming Soon', 'Chapter selection will be available soon!');
              }}>
              <View style={styles.chapterItemLeft}>
                <View
                  style={[
                    styles.chapterNumber,
                    index === playbackState.currentChapterIndex && {
                      backgroundColor: colors.tint,
                    },
                  ]}>
                  <ThemedText
                    style={[
                      styles.chapterNumberText,
                      index === playbackState.currentChapterIndex &&
                        styles.chapterNumberTextActive,
                    ]}>
                    {index + 1}
                  </ThemedText>
                </View>
                <View style={styles.chapterItemInfo}>
                  <ThemedText style={styles.chapterItemTitle}>{chapter.title}</ThemedText>
                  <ThemedText style={styles.chapterItemDuration}>
                    {formatDuration(chapter.duration)}
                  </ThemedText>
                </View>
              </View>
              {index === playbackState.currentChapterIndex && playbackState.isPlaying && (
                <IconSymbol size={20} name="speaker.wave.2.fill" color={colors.tint} />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Sign Up Modal for Guest Users */}
      <SignUpPromptModal
        visible={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        feature="fullPlayback"
        bookTitle={book.title}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  artworkContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  artwork: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  bookInfo: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 30,
    marginBottom: 20,
  },
  bookTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 14,
    opacity: 0.5,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuItemTextActive: {
    color: '#FFFFFF',
  },
  chapterList: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  chapterListTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  chapterItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chapterNumberTextActive: {
    color: '#FFFFFF',
  },
  chapterItemInfo: {
    flex: 1,
  },
  chapterItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  chapterItemDuration: {
    fontSize: 13,
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.7,
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
  },
  previewText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
