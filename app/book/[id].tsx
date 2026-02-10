import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { MOCK_AUDIOBOOKS, formatDuration } from "@/data/mock-audiobooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AudioBook } from "@/types/audiobook";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/context/audio-player-context";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { loadBook } = useAudioPlayer();

  const [book, setBook] = useState<AudioBook | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    // Find the book by ID
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
            <Pressable
              style={[styles.backButton, { backgroundColor: colors.tint }]}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  const handlePlay = async () => {
    if (book) {
      try {
        await loadBook(book, currentChapter);
        router.push("/player");
      } catch (error) {
        Alert.alert("Error", "Failed to load audiobook");
      }
    }
  };

  const handleDownload = () => {
    Alert.alert("Download", "Download functionality coming soon!");
  };

  const handleShare = () => {
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? "Removed from Favorites" : "Added to Favorites",
      isFavorite
        ? `${book.title} has been removed from your favorites`
        : `${book.title} has been added to your favorites`,
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <Pressable
              style={[styles.headerButton, { backgroundColor: cardBgColor }]}
              onPress={() => router.back()}
            >
              <IconSymbol size={24} name="chevron.left" color={colors.text} />
            </Pressable>
            <Pressable
              style={[styles.headerButton, { backgroundColor: cardBgColor }]}
              onPress={handleShare}
            >
              <IconSymbol
                size={24}
                name="square.and.arrow.up"
                color={colors.text}
              />
            </Pressable>
          </View>

          {/* Book Cover and Info */}
          <View style={styles.bookHeader}>
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: book.coverImage }}
                style={styles.coverImage}
                contentFit="cover"
              />
              <Pressable
                style={[
                  styles.favoriteButton,
                  {
                    backgroundColor: isFavorite
                      ? colors.tint
                      : "rgba(0,0,0,0.5)",
                  },
                ]}
                onPress={toggleFavorite}
              >
                <IconSymbol
                  size={24}
                  name={isFavorite ? "heart.fill" : "heart"}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ThemedText type="title" style={styles.title}>
              {book.title}
            </ThemedText>
            <ThemedText style={styles.author}>by {book.author}</ThemedText>

            <View style={styles.metadata}>
              <View style={styles.metadataItem}>
                <IconSymbol size={16} name="star.fill" color="#FFD700" />
                <ThemedText style={styles.metadataText}>
                  {book.rating}
                </ThemedText>
              </View>
              <View style={styles.metadataItem}>
                <IconSymbol size={16} name="clock" color={colors.icon} />
                <ThemedText style={styles.metadataText}>
                  {formatDuration(book.duration)}
                </ThemedText>
              </View>
              <View style={styles.metadataItem}>
                <IconSymbol size={16} name="book.closed" color={colors.icon} />
                <ThemedText style={styles.metadataText}>
                  {book.chapters.length} chapters
                </ThemedText>
              </View>
            </View>

            {/* Genre Tags */}
            <View style={styles.genreTags}>
              {book.genre.map((genre, index) => (
                <View
                  key={index}
                  style={[styles.genreTag, { backgroundColor: cardBgColor }]}
                >
                  <ThemedText style={styles.genreTagText}>{genre}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.playButton, { backgroundColor: colors.tint }]}
              onPress={handlePlay}
            >
              <IconSymbol size={24} name="play.fill" color="#FFFFFF" />
              <ThemedText style={styles.playButtonText}>Play Now</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.downloadButton, { backgroundColor: cardBgColor }]}
              onPress={handleDownload}
            >
              <IconSymbol
                size={24}
                name="arrow.down.circle"
                color={colors.text}
              />
            </Pressable>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              About this audiobook
            </ThemedText>
            <ThemedText style={styles.description}>
              {book.description}
            </ThemedText>
          </View>

          {/* Narrator Info */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Narrator
            </ThemedText>
            <View
              style={[styles.narratorCard, { backgroundColor: cardBgColor }]}
            >
              <IconSymbol size={32} name="mic.fill" color={colors.icon} />
              <View style={styles.narratorInfo}>
                <ThemedText style={styles.narratorName}>
                  {book.narrator}
                </ThemedText>
                <ThemedText style={styles.narratorTitle}>
                  Voice Artist
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Chapters */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Chapters
              </ThemedText>
              <ThemedText style={styles.chapterCount}>
                {book.chapters.length} chapters
              </ThemedText>
            </View>
            {book.chapters.map((chapter, index) => (
              <Pressable
                key={index}
                style={[
                  styles.chapterItem,
                  { backgroundColor: cardBgColor },
                  currentChapter === index && {
                    borderColor: colors.tint,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => {
                  setCurrentChapter(index);
                  handlePlay();
                }}
              >
                <View style={styles.chapterLeft}>
                  <View
                    style={[
                      styles.chapterNumber,
                      currentChapter === index && {
                        backgroundColor: colors.tint,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.chapterNumberText,
                        currentChapter === index &&
                          styles.chapterNumberTextActive,
                      ]}
                    >
                      {index + 1}
                    </ThemedText>
                  </View>
                  <View style={styles.chapterInfo}>
                    <ThemedText style={styles.chapterTitle}>
                      {chapter.title}
                    </ThemedText>
                    <ThemedText style={styles.chapterDuration}>
                      {formatDuration(chapter.duration)}
                    </ThemedText>
                  </View>
                </View>
                {currentChapter === index && (
                  <IconSymbol
                    size={20}
                    name="speaker.wave.2.fill"
                    color={colors.tint}
                  />
                )}
              </Pressable>
            ))}
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Ratings & Reviews
              </ThemedText>
              <Pressable>
                <ThemedText style={[styles.seeAllText, { color: colors.tint }]}>
                  See all
                </ThemedText>
              </Pressable>
            </View>

            <View
              style={[styles.ratingOverview, { backgroundColor: cardBgColor }]}
            >
              <View style={styles.ratingOverviewLeft}>
                <ThemedText style={styles.ratingBig}>{book.rating}</ThemedText>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconSymbol
                      key={star}
                      size={16}
                      name={
                        star <= Math.floor(book.rating) ? "star.fill" : "star"
                      }
                      color="#FFD700"
                    />
                  ))}
                </View>
                <ThemedText style={styles.ratingCount}>256 ratings</ThemedText>
              </View>
              <Pressable
                style={[
                  styles.writeReviewButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={() =>
                  Alert.alert("Write Review", "Review feature coming soon!")
                }
              >
                <ThemedText style={styles.writeReviewText}>
                  Write a Review
                </ThemedText>
              </Pressable>
            </View>

            {/* Sample Reviews */}
            <View style={[styles.reviewCard, { backgroundColor: cardBgColor }]}>
              <View style={styles.reviewHeader}>
                <View>
                  <ThemedText style={styles.reviewAuthor}>
                    Sarah Johnson
                  </ThemedText>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IconSymbol
                        key={star}
                        size={12}
                        name="star.fill"
                        color="#FFD700"
                      />
                    ))}
                  </View>
                </View>
                <ThemedText style={styles.reviewDate}>2 days ago</ThemedText>
              </View>
              <ThemedText style={styles.reviewText}>
                Absolutely captivating! The narrator brings the story to life
                beautifully. Couldn't stop listening.
              </ThemedText>
            </View>

            <View style={[styles.reviewCard, { backgroundColor: cardBgColor }]}>
              <View style={styles.reviewHeader}>
                <View>
                  <ThemedText style={styles.reviewAuthor}>
                    Michael Chen
                  </ThemedText>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4].map((star) => (
                      <IconSymbol
                        key={star}
                        size={12}
                        name="star.fill"
                        color="#FFD700"
                      />
                    ))}
                    <IconSymbol size={12} name="star" color="#FFD700" />
                  </View>
                </View>
                <ThemedText style={styles.reviewDate}>1 week ago</ThemedText>
              </View>
              <ThemedText style={styles.reviewText}>
                Great story and excellent narration. Highly recommend for anyone
                who enjoys this genre.
              </ThemedText>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bookHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  coverContainer: {
    position: "relative",
    width: width * 0.6,
    height: width * 0.6 * 1.4,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 16,
  },
  metadata: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    opacity: 0.8,
  },
  genreTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreTagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  playButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  downloadButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
  },
  narratorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  narratorInfo: {
    flex: 1,
  },
  narratorName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  narratorTitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  chapterCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  chapterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  chapterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(128, 128, 128, 0.2)",
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chapterNumberTextActive: {
    color: "#FFFFFF",
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 2,
  },
  chapterDuration: {
    fontSize: 13,
    opacity: 0.6,
  },
  ratingOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  ratingOverviewLeft: {
    alignItems: "center",
  },
  ratingBig: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stars: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  ratingCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  writeReviewButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  writeReviewText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 13,
    opacity: 0.6,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSpacer: {
    height: 40,
  },
});
