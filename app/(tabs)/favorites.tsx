import { FavoriteCard } from "@/components/favorites/FavoriteCard";
import { FavoritesEmptyState } from "@/components/favorites/FavoritesEmptyState";
import { FavoritesHeader } from "@/components/favorites/FavoritesHeader";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useFavorites } from "@/context/favorites-context";
import { MOCK_AUDIOBOOKS } from "@/data/mock-audiobooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AudioBook } from "@/types/audiobook";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isGuest } = useAuth();
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteBooks = MOCK_AUDIOBOOKS.filter((book) =>
    favorites.includes(book.id),
  );

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  const handleRemoveFavorite = (bookId: string) => {
    toggleFavorite(bookId);
  };

  const handleSignUpPress = () => {
    router.push("/(auth)/sign-up");
  };

  const renderFavoriteCard = ({ item }: { item: AudioBook }) => (
    <FavoriteCard
      book={item}
      onRemove={handleRemoveFavorite}
      cardBgColor={cardBgColor}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <FavoritesHeader count={favoriteBooks.length} />

      <FlatList
        data={favoriteBooks}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <FavoritesEmptyState
            isGuest={isGuest}
            colors={colors}
            onSignUpPress={handleSignUpPress}
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});
