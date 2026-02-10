import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Review } from "@/context/reviews-context";
import { StyleSheet, View } from "react-native";

interface ReviewItemProps {
  review: Review;
  formatTimeAgo: (dateStr: string) => string;
  colors: {
    icon: string;
  };
  cardBgColor: string;
}

export function ReviewItem({
  review,
  formatTimeAgo,
  colors,
  cardBgColor,
}: ReviewItemProps) {
  return (
    <View style={[styles.reviewCard, { backgroundColor: cardBgColor }]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerAvatar}>
            <ThemedText style={styles.reviewerInitial}>
              {review.userName.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View>
            <ThemedText style={styles.reviewerName}>
              {review.userName}
            </ThemedText>
            <ThemedText style={styles.reviewDate}>
              {formatTimeAgo(review.createdAt)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.reviewRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IconSymbol
              key={star}
              size={14}
              name={star <= review.rating ? "star.fill" : "star"}
              color="#FFD700"
            />
          ))}
        </View>
      </View>
      <ThemedText style={styles.reviewText}>{review.text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(100, 100, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewerInitial: {
    fontSize: 16,
    fontWeight: "600",
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: "600",
  },
  reviewDate: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  reviewRating: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
