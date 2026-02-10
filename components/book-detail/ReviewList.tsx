import { StyleSheet, View } from "react-native";
import { ReviewItem } from "./ReviewItem";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
  formatTimeAgo: (dateStr: string) => string;
  colors: {
    icon: string;
  };
  cardBgColor: string;
}

export function ReviewList({
  reviews,
  formatTimeAgo,
  colors,
  cardBgColor,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <View style={styles.reviewsContainer}>
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          formatTimeAgo={formatTimeAgo}
          colors={colors}
          cardBgColor={cardBgColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewsContainer: {
    marginTop: 16,
  },
});
