import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_AUDIOBOOKS, formatDuration } from '@/data/mock-audiobooks';
import { AudioBook } from '@/types/audiobook';
import { aiService } from '@/services/ai-service';
import { isOpenAIConfigured } from '@/config/openai';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 3; // 3 columns for compact view

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [aiRecommendations, setAiRecommendations] = useState<AudioBook[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const genres = ['All', 'Classic', 'Fiction', 'Romance', 'Horror', 'Mystery', 'Fantasy'];

  const filteredBooks =
    selectedGenre === 'All'
      ? MOCK_AUDIOBOOKS
      : MOCK_AUDIOBOOKS.filter((book) => book.genre.includes(selectedGenre));

  const topRatedBooks = [...MOCK_AUDIOBOOKS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  useEffect(() => {
    loadAIRecommendations();
  }, []);

  const loadAIRecommendations = async () => {
    if (!isOpenAIConfigured()) {
      return;
    }

    setLoadingRecommendations(true);
    try {
      const userPreferences = ['Classic', 'Fiction'];
      const recommendations = await aiService.getPersonalizedRecommendations(
        userPreferences,
        MOCK_AUDIOBOOKS
      );
      setAiRecommendations(recommendations);
    } catch (error: any) {
      console.error('Error loading AI recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';

  const renderCompactBookCard = (book: AudioBook) => (
    <Link key={book.id} href={`/book/${book.id}`} asChild>
      <Pressable style={styles.compactCard}>
        <Image source={{ uri: book.coverImage }} style={styles.compactCover} contentFit="cover" />
        <View style={styles.compactInfo}>
          <ThemedText style={styles.compactTitle} numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.compactAuthor} numberOfLines={1}>
            {book.author}
          </ThemedText>
        </View>
      </Pressable>
    </Link>
  );

  const renderFeaturedBookCard = (book: AudioBook) => (
    <Link key={book.id} href={`/book/${book.id}`} asChild>
      <Pressable style={[styles.featuredCard, { backgroundColor: cardBgColor }]}>
        <Image source={{ uri: book.coverImage }} style={styles.featuredCover} contentFit="cover" />
        <View style={styles.featuredInfo}>
          <ThemedText style={styles.featuredTitle} numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText style={styles.featuredAuthor} numberOfLines={1}>
            by {book.author}
          </ThemedText>
          <View style={styles.featuredMeta}>
            <View style={styles.ratingRow}>
              <IconSymbol size={14} name="star.fill" color="#FFD700" />
              <ThemedText style={styles.ratingText}>{book.rating}</ThemedText>
            </View>
            <ThemedText style={styles.durationText}>
              {formatDuration(book.duration)}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Discover
          </ThemedText>
          <ThemedText style={styles.subtitle}>Find your next great audiobook</ThemedText>
        </View>

        {/* AI Recommendations Section */}
        {isOpenAIConfigured() && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <IconSymbol size={20} name="sparkles" color={colors.tint} />
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  AI Picks For You
                </ThemedText>
              </View>
              {!loadingRecommendations && aiRecommendations.length === 0 && (
                <Pressable onPress={loadAIRecommendations}>
                  <IconSymbol size={20} name="arrow.clockwise" color={colors.tint} />
                </Pressable>
              )}
            </View>

            {loadingRecommendations ? (
              <View style={[styles.loadingCard, { backgroundColor: cardBgColor }]}>
                <ActivityIndicator size="large" color={colors.tint} />
                <ThemedText style={styles.loadingText}>
                  Generating personalized recommendations...
                </ThemedText>
              </View>
            ) : aiRecommendations.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontal}>
                {aiRecommendations.map(renderFeaturedBookCard)}
              </ScrollView>
            ) : (
              <Pressable
                style={[styles.emptyAICard, { backgroundColor: cardBgColor }]}
                onPress={loadAIRecommendations}>
                <IconSymbol size={32} name="wand.and.stars" color={colors.icon} />
                <ThemedText style={styles.emptyAIText}>Tap to get AI recommendations</ThemedText>
              </Pressable>
            )}
          </View>
        )}

        {/* Top Rated Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <IconSymbol size={20} name="star.fill" color="#FFD700" />
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Top Rated
              </ThemedText>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontal}>
            {topRatedBooks.map(renderFeaturedBookCard)}
          </ScrollView>
        </View>

        {/* Browse by Genre */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Browse by Genre
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.genreScroll}
            contentContainerStyle={styles.genreScrollContent}>
            {genres.map((genre) => (
              <Pressable
                key={genre}
                style={[
                  styles.genreChip,
                  selectedGenre === genre && { backgroundColor: colors.tint },
                  selectedGenre !== genre && { backgroundColor: cardBgColor },
                ]}
                onPress={() => setSelectedGenre(genre)}>
                <ThemedText
                  style={[
                    styles.genreChipText,
                    selectedGenre === genre && styles.genreChipTextActive,
                  ]}>
                  {genre}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.compactGrid}>
            {filteredBooks.map(renderCompactBookCard)}
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
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
  },
  horizontal: {
    paddingLeft: 20,
  },
  loadingCard: {
    marginHorizontal: 20,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyAICard: {
    marginHorizontal: 20,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyAIText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  featuredCard: {
    width: width * 0.7,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    marginRight: 16,
    gap: 12,
  },
  featuredCover: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  featuredInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  featuredAuthor: {
    fontSize: 14,
    opacity: 0.7,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 13,
    opacity: 0.7,
  },
  genreScroll: {
    marginBottom: 16,
  },
  genreScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  genreChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  genreChipTextActive: {
    color: '#FFFFFF',
  },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  compactCard: {
    width: CARD_WIDTH,
  },
  compactCover: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 8,
    marginBottom: 8,
  },
  compactInfo: {
    gap: 2,
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  compactAuthor: {
    fontSize: 11,
    opacity: 0.7,
  },
});
