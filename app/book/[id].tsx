import { SignUpPromptModal } from "@/components/auth/SignUpPromptModal";
import { ActionButtons } from "@/components/book-detail/ActionButtons";
import { BookCover } from "@/components/book-detail/BookCover";
import { BookDescription } from "@/components/book-detail/BookDescription";
import { BookDetailHeader } from "@/components/book-detail/BookDetailHeader";
import { BookMetadata } from "@/components/book-detail/BookMetadata";
import { ChapterList } from "@/components/book-detail/ChapterList";
import { GenreTags } from "@/components/book-detail/GenreTags";
import { NarratorCard } from "@/components/book-detail/NarratorCard";
import { RatingsOverview } from "@/components/book-detail/RatingsOverview";
import { ReviewList } from "@/components/book-detail/ReviewList";
import { WriteReviewModal } from "@/components/book-detail/WriteReviewModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useAuth } from "@/context/auth-context";
import { useFavorites } from "@/context/favorites-context";
import { useReviews } from "@/context/reviews-context";
import { MOCK_AUDIOBOOKS } from "@/data/mock-audiobooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AudioBook } from "@/types/audiobook";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isGuest } = useAuth();
  const { loadBook } = useAudioPlayer();
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const { getReviewsForBook, getAverageRating, addReview, hasUserReviewed } =
    useReviews();

  const [book, setBook] = useState<AudioBook | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpFeature, setSignUpFeature] = useState<
    "favorites" | "fullPlayback" | "reviews" | "download" | "progress"
  >("favorites");

  useEffect(() => {
    const foundBook = MOCK_AUDIOBOOKS.find((b) => b.id === id);
    setBook(foundBook || null);
  }, [id]);

  if (!book) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <IconSymbol
              size={60}
              name="exclamationmark.triangle"
              color={colors.icon}
            />
            <ThemedText style={styles.errorText}>Book not found</ThemedText>
            <ThemedText
              style={[styles.backButton, { backgroundColor: colors.tint }]}
              onPress={() => router.back()}
            >
              Go Back
            </ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  // Handlers
  const handlePlay = async (chapterIndex: number = currentChapter) => {
    if (!book) return;

    try {
      await loadBook(book, chapterIndex);
      setCurrentChapter(chapterIndex);
    } catch (error) {
      console.warn("Failed to load audiobook:", error);
    } finally {
      router.push({
        pathname: "/player/[id]",
        params: { id: book.id },
      });
    }
  };

  const handleDownload = () => {
    if (isGuest) {
      setSignUpFeature("download");
      setShowSignUpModal(true);
      return;
    }
    Alert.alert("Download", "Download functionality coming soon!");
  };

  const handleShare = () => {
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const handleToggleFavorite = () => {
    if (isGuest) {
      setSignUpFeature("favorites");
      setShowSignUpModal(true);
      return;
    }
    if (book) toggleFavorite(book.id);
  };

  const handleWriteReview = () => {
    if (isGuest) {
      setSignUpFeature("reviews");
      setShowSignUpModal(true);
      return;
    }
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      Alert.alert("Error", "Please write a review");
      return;
    }
    if (book) {
      addReview(book.id, reviewRating, reviewText.trim());
      setShowReviewModal(false);
      setReviewText("");
      setReviewRating(5);
      Alert.alert("Thank you!", "Your review has been submitted");
    }
  };

  const handleChapterPress = (index: number) => {
    handlePlay(index);
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const isFavorite = checkFavorite(book.id);
  const bookReviews = getReviewsForBook(book.id);
  const ratingInfo = getAverageRating(book.id);
  const alreadyReviewed = hasUserReviewed(book.id);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <BookDetailHeader
            onBack={() => router.back()}
            onShare={handleShare}
            colors={colors}
            cardBgColor={cardBgColor}
          />

          <View style={styles.bookHeader}>
            <BookCover
              coverImage={book.coverImage}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            <BookMetadata
              title={book.title}
              author={book.author}
              rating={book.rating}
              duration={book.duration}
              chaptersCount={book.chapters.length}
              colors={colors}
            />

            <GenreTags genres={book.genre} cardBgColor={cardBgColor} />
          </View>

          <ActionButtons
            onPlay={handlePlay}
            onDownload={handleDownload}
            colors={colors}
            cardBgColor={cardBgColor}
          />

          <BookDescription description={book.description} />

          <NarratorCard
            narrator={book.narrator}
            cardBgColor={cardBgColor}
            colors={colors}
          />

          <ChapterList
            chapters={book.chapters}
            onChapterPress={handleChapterPress}
            colors={colors}
            cardBgColor={cardBgColor}
          />

          <RatingsOverview
            ratingInfo={ratingInfo}
            fallbackRating={book.rating}
            onWriteReview={handleWriteReview}
            alreadyReviewed={alreadyReviewed}
            colors={colors}
            cardBgColor={cardBgColor}
          />

          <ReviewList
            reviews={bookReviews}
            formatTimeAgo={formatTimeAgo}
            colors={colors}
            cardBgColor={cardBgColor}
          />

          <View style={styles.bottomSpacer} />

          <WriteReviewModal
            visible={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            onSubmit={handleSubmitReview}
            rating={reviewRating}
            onRatingChange={setReviewRating}
            reviewText={reviewText}
            onReviewTextChange={setReviewText}
            colors={colors}
            cardBgColor={cardBgColor}
          />
        </ScrollView>

        <SignUpPromptModal
          visible={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          feature={signUpFeature}
          bookTitle={book.title}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    opacity: 0.7,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  bookHeader: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  bottomSpacer: {
    height: 32,
  },
});
