import { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_AUDIOBOOKS, formatDuration } from '@/data/mock-audiobooks';
import { Chapter } from '@/types/audiobook';
import { aiService, BookSummary } from '@/services/ai-service';
import { isOpenAIConfigured } from '@/config/openai';

const { width } = Dimensions.get('window');

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const book = MOCK_AUDIOBOOKS.find((b) => b.id === id);
  const [aiSummary, setAiSummary] = useState<BookSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  if (!book) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Book not found</ThemedText>
      </ThemedView>
    );
  }

  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';

  const handlePlayBook = () => {
    router.push({
      pathname: '/player/[id]',
      params: { id: book.id },
    });
  };

  const handlePlayChapter = (chapter: Chapter) => {
    router.push({
      pathname: '/player/[id]',
      params: { id: book.id, chapterId: chapter.id },
    });
  };

  const handleGenerateSummary = async () => {
    if (!isOpenAIConfigured()) {
      Alert.alert(
        'API Key Required',
        'Please add your OpenAI API key in config/openai.ts to use AI features.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoadingSummary(true);
    try {
      const summary = await aiService.generateBookSummary(book);
      setAiSummary(summary);
      setShowFullSummary(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate summary. Please try again.');
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerTransparent: true,
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverSection}>
          <Image source={{ uri: book.coverImage }} style={styles.coverImage} contentFit="cover" />
        </View>

        <View style={styles.infoSection}>
          <ThemedText type="title" style={styles.title}>
            {book.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <ThemedText style={styles.author}>by {book.author}</ThemedText>
            <View style={styles.dot} />
            <ThemedText style={styles.meta}>{book.publishYear}</ThemedText>
          </View>

          <ThemedText style={styles.narrator}>Narrated by {book.narrator}</ThemedText>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <IconSymbol size={16} name="star.fill" color="#FFD700" />
              <ThemedText style={styles.statText}>{book.rating}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <IconSymbol size={16} name="clock" color={colors.icon} />
              <ThemedText style={styles.statText}>{formatDuration(book.duration)}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <IconSymbol size={16} name="book" color={colors.icon} />
              <ThemedText style={styles.statText}>{book.chapters.length} chapters</ThemedText>
            </View>
          </View>

          <View style={styles.genreContainer}>
            {book.genre.map((genre, index) => (
              <View key={index} style={[styles.genreTag, { backgroundColor: cardBgColor }]}>
                <ThemedText style={styles.genreText}>{genre}</ThemedText>
              </View>
            ))}
          </View>

          <Pressable
            style={[styles.playButton, { backgroundColor: colors.tint }]}
            onPress={handlePlayBook}>
            <IconSymbol size={24} name="play.fill" color="#FFFFFF" />
            <ThemedText style={styles.playButtonText}>Play Audiobook</ThemedText>
          </Pressable>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              About
            </ThemedText>
            <ThemedText style={styles.description}>{book.description}</ThemedText>
          </View>

          <View style={styles.section}>
            <View style={styles.aiSectionHeader}>
              <View style={styles.aiTitleRow}>
                <IconSymbol size={20} name="sparkles" color={colors.tint} />
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  AI Summary
                </ThemedText>
              </View>
              {!aiSummary && !loadingSummary && (
                <Pressable
                  style={[styles.generateButton, { backgroundColor: colors.tint }]}
                  onPress={handleGenerateSummary}>
                  <IconSymbol size={16} name="wand.and.stars" color="#FFFFFF" />
                  <ThemedText style={styles.generateButtonText}>Generate</ThemedText>
                </Pressable>
              )}
            </View>

            {loadingSummary && (
              <View style={[styles.aiCard, { backgroundColor: cardBgColor }]}>
                <ActivityIndicator size="large" color={colors.tint} />
                <ThemedText style={styles.loadingText}>
                  Analyzing book with AI...
                </ThemedText>
              </View>
            )}

            {aiSummary && !loadingSummary && (
              <View style={[styles.aiCard, { backgroundColor: cardBgColor }]}>
                <ThemedText style={styles.aiSummaryText}>
                  {showFullSummary ? aiSummary.detailedSummary : aiSummary.shortSummary}
                </ThemedText>

                {aiSummary.keyThemes.length > 0 && (
                  <View style={styles.themesContainer}>
                    <ThemedText style={styles.themesLabel}>Key Themes:</ThemedText>
                    <View style={styles.themesList}>
                      {aiSummary.keyThemes.map((theme, index) => (
                        <View
                          key={index}
                          style={[
                            styles.themeTag,
                            { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#E5E5EA' },
                          ]}>
                          <ThemedText style={styles.themeText}>{theme}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {aiSummary.mainCharacters && aiSummary.mainCharacters.length > 0 && (
                  <View style={styles.charactersContainer}>
                    <ThemedText style={styles.charactersLabel}>Main Characters:</ThemedText>
                    <ThemedText style={styles.charactersList}>
                      {aiSummary.mainCharacters.join(', ')}
                    </ThemedText>
                  </View>
                )}

                <Pressable
                  style={styles.toggleButton}
                  onPress={() => setShowFullSummary(!showFullSummary)}>
                  <ThemedText style={[styles.toggleButtonText, { color: colors.tint }]}>
                    {showFullSummary ? 'Show Less' : 'Show More'}
                  </ThemedText>
                  <IconSymbol
                    size={16}
                    name={showFullSummary ? 'chevron.up' : 'chevron.down'}
                    color={colors.tint}
                  />
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Chapters ({book.chapters.length})
            </ThemedText>

            {book.chapters.map((chapter, index) => (
              <Pressable
                key={chapter.id}
                style={[styles.chapterItem, { backgroundColor: cardBgColor }]}
                onPress={() => handlePlayChapter(chapter)}>
                <View style={styles.chapterLeft}>
                  <View style={[styles.chapterNumber, { backgroundColor: colors.tint }]}>
                    <ThemedText style={styles.chapterNumberText}>{index + 1}</ThemedText>
                  </View>
                  <View style={styles.chapterInfo}>
                    <ThemedText style={styles.chapterTitle}>{chapter.title}</ThemedText>
                    <ThemedText style={styles.chapterDuration}>
                      {formatDuration(chapter.duration)}
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol size={20} name="play.circle.fill" color={colors.tint} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
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
  coverSection: {
    width: '100%',
    height: width * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  coverImage: {
    width: width * 0.6,
    height: width * 0.84,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    gap: 8,
  },
  author: {
    fontSize: 16,
    opacity: 0.8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999',
  },
  meta: {
    fontSize: 16,
    opacity: 0.8,
  },
  narrator: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    opacity: 0.8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
    justifyContent: 'center',
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    fontSize: 13,
    opacity: 0.8,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 32,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  chapterDuration: {
    fontSize: 13,
    opacity: 0.7,
  },
  aiSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  aiSummaryText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  themesContainer: {
    marginTop: 12,
    gap: 8,
  },
  themesLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  themesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  themeText: {
    fontSize: 13,
    opacity: 0.8,
  },
  charactersContainer: {
    marginTop: 12,
    gap: 4,
  },
  charactersLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  charactersList: {
    fontSize: 14,
    opacity: 0.8,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
