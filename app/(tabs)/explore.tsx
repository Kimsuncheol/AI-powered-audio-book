import { AIRecommendationsSection } from "@/components/explore/AIRecommendationsSection";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { GenreFilterSection } from "@/components/explore/GenreFilterSection";
import { TopRatedSection } from "@/components/explore/TopRatedSection";
import { ThemedView } from "@/components/themed-view";
import { isOpenAIConfigured } from "@/config/openai";
import { Colors } from "@/constants/theme";
import { MOCK_AUDIOBOOKS } from "@/data/mock-audiobooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { aiService } from "@/services/ai-service";
import { AudioBook } from "@/types/audiobook";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [aiRecommendations, setAiRecommendations] = useState<AudioBook[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const genres = [
    "All",
    "Classic",
    "Fiction",
    "Romance",
    "Horror",
    "Mystery",
    "Fantasy",
  ];

  const filteredBooks =
    selectedGenre === "All"
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
      const userPreferences = ["Classic", "Fiction"];
      const recommendations = await aiService.getPersonalizedRecommendations(
        userPreferences,
        MOCK_AUDIOBOOKS,
      );
      setAiRecommendations(recommendations);
    } catch (error: any) {
      console.error("Error loading AI recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ExploreHeader />

          {/* AI Recommendations Section */}
          {isOpenAIConfigured() && (
            <AIRecommendationsSection
              recommendations={aiRecommendations}
              loading={loadingRecommendations}
              onRefresh={loadAIRecommendations}
              colors={colors}
              cardBgColor={cardBgColor}
            />
          )}

          {/* Top Rated Section */}
          <TopRatedSection books={topRatedBooks} cardBgColor={cardBgColor} />

          {/* Browse by Genre */}
          <GenreFilterSection
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreSelect={setSelectedGenre}
            books={filteredBooks}
            cardBgColor={cardBgColor}
            colors={colors}
          />
        </ScrollView>
      </SafeAreaView>
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
});
