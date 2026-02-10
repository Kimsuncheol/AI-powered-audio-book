import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AudioBook } from "@/types/audiobook";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { FeaturedBookCard } from "./FeaturedBookCard";

interface AIRecommendationsSectionProps {
  recommendations: AudioBook[];
  loading: boolean;
  onRefresh: () => void;
  colors: {
    tint: string;
    icon: string;
  };
  cardBgColor: string;
}

export function AIRecommendationsSection({
  recommendations,
  loading,
  onRefresh,
  colors,
  cardBgColor,
}: AIRecommendationsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <IconSymbol size={20} name="sparkles" color={colors.tint} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            AI Picks For You
          </ThemedText>
        </View>
        {!loading && recommendations.length === 0 && (
          <Pressable onPress={onRefresh}>
            <IconSymbol size={20} name="arrow.clockwise" color={colors.tint} />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={[styles.loadingCard, { backgroundColor: cardBgColor }]}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>
            Generating personalized recommendations...
          </ThemedText>
        </View>
      ) : recommendations.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontal}
        >
          {recommendations.map((book) => (
            <FeaturedBookCard
              key={book.id}
              book={book}
              cardBgColor={cardBgColor}
            />
          ))}
        </ScrollView>
      ) : (
        <Pressable
          style={[styles.emptyCard, { backgroundColor: cardBgColor }]}
          onPress={onRefresh}
        >
          <IconSymbol size={32} name="wand.and.stars" color={colors.icon} />
          <ThemedText style={styles.emptyText}>
            Tap to get AI recommendations
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    textAlign: "center",
    opacity: 0.7,
  },
  emptyCard: {
    marginHorizontal: 20,
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
  },
});
