import { StyleSheet, View, Pressable, FlatList, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFavorites } from '@/context/favorites-context';
import { MOCK_AUDIOBOOKS, formatDuration } from '@/data/mock-audiobooks';
import { AudioBook } from '@/types/audiobook';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isGuest } = useAuth();
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteBooks = MOCK_AUDIOBOOKS.filter((book) => favorites.includes(book.id));

  const renderFavoriteCard = ({ item }: { item: AudioBook }) => (
    <Link href={`/book/${item.id}`} asChild>
      <Pressable style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
        <Image source={{ uri: item.coverImage }} style={styles.cover} contentFit="cover" />
        <View style={styles.cardInfo}>
          <ThemedText style={styles.cardTitle} numberOfLines={2}>{item.title}</ThemedText>
          <ThemedText style={styles.cardAuthor} numberOfLines={1}>by {item.author}</ThemedText>
          <View style={styles.cardMeta}>
            <View style={styles.ratingRow}>
              <IconSymbol size={14} name="star.fill" color="#FFD700" />
              <ThemedText style={styles.metaText}>{item.rating}</ThemedText>
            </View>
            <ThemedText style={styles.metaText}>{formatDuration(item.duration)}</ThemedText>
          </View>
        </View>
        <Pressable
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}>
          <IconSymbol size={22} name="heart.fill" color="#FF3B30" />
        </Pressable>
      </Pressable>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Favorites</ThemedText>
        <ThemedText style={styles.subtitle}>
          {favoriteBooks.length} {favoriteBooks.length === 1 ? 'book' : 'books'} saved
        </ThemedText>
      </View>

      <FlatList
        data={favoriteBooks}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
              <IconSymbol size={48} name={isGuest ? "lock.fill" : "heart"} color={isGuest ? colors.tint : colors.icon} />
            </View>
            <ThemedText style={styles.emptyText}>
              {isGuest ? "Sign Up to Save Favorites" : "No favorites yet"}
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              {isGuest
                ? "Create a free account to save your favorite audiobooks and access them across all your devices."
                : "Tap the heart icon on any book to save it here"}
            </ThemedText>
            {isGuest && (
              <Pressable
                style={[styles.signUpButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/(auth)/sign-up')}
              >
                <ThemedText style={styles.signUpButtonText}>Create Free Account</ThemedText>
              </Pressable>
            )}
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
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  cardAuthor: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    opacity: 0.7,
  },
  removeButton: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  signUpButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
