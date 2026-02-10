import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface RatingsOverviewProps {
  ratingInfo: {
    average: number;
    count: number;
  };
  fallbackRating: number;
  onWriteReview: () => void;
  alreadyReviewed: boolean;
  colors: {
    tint: string;
    text: string;
  };
  cardBgColor: string;
}

export function RatingsOverview({
  ratingInfo,
  fallbackRating,
  onWriteReview,
  alreadyReviewed,
  colors,
  cardBgColor,
}: RatingsOverviewProps) {
  const displayRating =
    ratingInfo.count > 0 ? ratingInfo.average : fallbackRating;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Ratings & Reviews
        </ThemedText>
      </View>

      <View style={[styles.ratingOverview, { backgroundColor: cardBgColor }]}>
        <View style={styles.ratingOverviewLeft}>
          <ThemedText style={styles.ratingBig}>{displayRating}</ThemedText>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconSymbol
                key={star}
                size={16}
                name={star <= Math.floor(displayRating) ? "star.fill" : "star"}
                color="#FFD700"
              />
            ))}
          </View>
          <ThemedText style={styles.ratingCount}>
            {ratingInfo.count > 0
              ? `${ratingInfo.count} reviews`
              : "No reviews yet"}
          </ThemedText>
        </View>
        {!alreadyReviewed && (
          <Pressable
            style={[styles.writeReviewButton, { backgroundColor: colors.tint }]}
            onPress={onWriteReview}
          >
            <IconSymbol size={18} name="pencil" color="#FFFFFF" />
            <ThemedText style={styles.writeReviewButtonText}>
              Write Review
            </ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  ratingOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  ratingOverviewLeft: {
    gap: 4,
  },
  ratingBig: {
    fontSize: 36,
    fontWeight: "700",
  },
  stars: {
    flexDirection: "row",
    gap: 4,
  },
  ratingCount: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },
  writeReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  writeReviewButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
