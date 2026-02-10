import { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';
import { useProgress } from '@/context/progress-context';
import { MOCK_AUDIOBOOKS, formatDuration, getProgressPercentage } from '@/data/mock-audiobooks';
import { AudioBook } from '@/types/audiobook';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // 2 columns with padding

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const { getInProgressBooks, getProgress } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');

  const inProgressList = getInProgressBooks();
  const continueListeningBooks = inProgressList
    .map((progress) => {
      const book = MOCK_AUDIOBOOKS.find((b) => b.id === progress.bookId);
      return book ? { book, progress } : null;
    })
    .filter(Boolean) as { book: AudioBook; progress: any }[];

  const filteredBooks = MOCK_AUDIOBOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';
  const inputTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  const renderBookCard = ({ item }: { item: AudioBook }) => (
    <Link href={`/book/${item.id}`} asChild>
      <Pressable style={styles.bookCard}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} contentFit="cover" />
          <View style={styles.ratingBadge}>
            <IconSymbol size={12} name="star.fill" color="#FFD700" />
            <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
          </View>
        </View>
        <View style={styles.bookInfo}>
          <ThemedText style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.bookAuthor} numberOfLines={1}>
            {item.author}
          </ThemedText>
          <View style={styles.bookMeta}>
            <IconSymbol size={14} name="clock" color={colors.icon} />
            <ThemedText style={styles.duration}>{formatDuration(item.duration)}</ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.greeting}>
            Hello, {user?.displayName || 'Reader'}!
          </ThemedText>
          <ThemedText style={styles.subtitle}>What will you listen to today?</ThemedText>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: inputBgColor }]}>
        <IconSymbol size={20} name="magnifyingglass" color={colors.icon} />
        <TextInput
          style={[styles.searchInput, { color: inputTextColor }]}
          placeholder="Search books or authors..."
          placeholderTextColor={colorScheme === 'dark' ? '#8E8E93' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <IconSymbol size={20} name="xmark.circle.fill" color={colors.icon} />
          </Pressable>
        )}
      </View>

      {/* Continue Listening Section */}
      {continueListeningBooks.length > 0 && searchQuery.length === 0 && (
        <View style={styles.continueSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Continue Listening
            </ThemedText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.continueScroll}>
            {continueListeningBooks.map(({ book, progress }) => (
              <Link key={book.id} href={`/book/${book.id}`} asChild>
                <Pressable style={[styles.continueCard, { backgroundColor: inputBgColor }]}>
                  <Image source={{ uri: book.coverImage }} style={styles.continueCover} contentFit="cover" />
                  <View style={styles.continueInfo}>
                    <ThemedText style={styles.continueTitle} numberOfLines={1}>{book.title}</ThemedText>
                    <ThemedText style={styles.continueChapter} numberOfLines={1}>
                      Chapter {progress.currentChapter + 1}
                    </ThemedText>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${getProgressPercentage(progress.currentPosition, book.duration)}%`,
                            backgroundColor: colors.tint,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          My Library
        </ThemedText>
        <ThemedText style={styles.bookCount}>{filteredBooks.length} books</ThemedText>
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderBookCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol size={60} name="book" color={colors.icon} />
            <ThemedText style={styles.emptyText}>No books found</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Try adjusting your search query
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  bookCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  bookCard: {
    width: CARD_WIDTH,
  },
  coverContainer: {
    position: 'relative',
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookInfo: {
    gap: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  bookAuthor: {
    fontSize: 14,
    opacity: 0.7,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  duration: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  continueSection: {
    marginBottom: 8,
  },
  continueScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  continueCard: {
    flexDirection: 'row',
    width: width * 0.75,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  continueCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  continueInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  continueTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  continueChapter: {
    fontSize: 13,
    opacity: 0.6,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128,128,128,0.2)',
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
