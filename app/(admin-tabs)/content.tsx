import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ContentModeration } from "@/types/admin";
import { approveContent, getPendingContent, rejectContent } from "@/utils/admin";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContentScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [content, setContent] = useState<ContentModeration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentModeration | null>(
    null,
  );
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const cardBorderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";
  const modalBgColor = colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF";

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await getPendingContent();
      setContent(data);
    } catch (error) {
      console.error("Error loading content:", error);
      Alert.alert("Error", "Failed to load pending content");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadContent();
  };

  const handleApprove = (contentId: string) => {
    Alert.alert(
      "Approve Content",
      "Approve this audiobook for publishing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              await approveContent(
                contentId,
                user?.uid || "",
                user?.displayName || "Admin",
              );
              await loadContent();
              Alert.alert("Success", "Content approved successfully");
            } catch (error) {
              console.error("Error approving content:", error);
              Alert.alert("Error", "Failed to approve content");
            }
          },
        },
      ],
    );
  };

  const handleReject = (contentItem: ContentModeration) => {
    setSelectedContent(contentItem);
    setRejectModalVisible(true);
  };

  const confirmRejection = async () => {
    if (!selectedContent || !rejectionReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }

    try {
      await rejectContent(
        selectedContent.id,
        rejectionReason,
        user?.uid || "",
        user?.displayName || "Admin",
      );
      await loadContent();
      setRejectModalVisible(false);
      setRejectionReason("");
      Alert.alert("Success", "Content rejected");
    } catch (error) {
      console.error("Error rejecting content:", error);
      Alert.alert("Error", "Failed to reject content");
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Content Moderation
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {content.length} pending {content.length === 1 ? "item" : "items"}
          </ThemedText>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
        >
          {content.map((item) => (
            <View
              key={item.id}
              style={[
                styles.contentCard,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              {/* Book Cover */}
              {item.audiobook.coverImage && (
                <Image
                  source={{ uri: item.audiobook.coverImage }}
                  style={styles.coverImage}
                  contentFit="cover"
                />
              )}

              {/* Book Info */}
              <View style={styles.bookInfo}>
                <ThemedText style={styles.bookTitle}>
                  {item.audiobook.title}
                </ThemedText>
                <ThemedText style={styles.bookAuthor}>
                  by {item.submittedByName}
                </ThemedText>

                {item.audiobook.description && (
                  <ThemedText style={styles.bookDescription} numberOfLines={3}>
                    {item.audiobook.description}
                  </ThemedText>
                )}

                <View style={styles.metaInfo}>
                  <View style={styles.metaItem}>
                    <IconSymbol name="book.closed" size={16} color={colors.icon} />
                    <ThemedText style={styles.metaText}>
                      {item.audiobook.chapters?.length || 0} chapters
                    </ThemedText>
                  </View>

                  <View style={styles.metaItem}>
                    <IconSymbol name="clock" size={16} color={colors.icon} />
                    <ThemedText style={styles.metaText}>
                      {Math.floor((item.audiobook.duration || 0) / 60)} min
                    </ThemedText>
                  </View>

                  {item.audiobook.genre && (
                    <View
                      style={[
                        styles.genreBadge,
                        { backgroundColor: colors.tint + "20" },
                      ]}
                    >
                      <ThemedText style={[styles.genreText, { color: colors.tint }]}>
                        {item.audiobook.genre}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <View style={styles.submissionInfo}>
                  <ThemedText style={styles.submissionText}>
                    Submitted {item.submittedAt.toLocaleDateString()}
                  </ThemedText>
                  <ThemedText style={styles.submissionText}>
                    by {item.submittedByName}
                  </ThemedText>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.approveButton,
                    { backgroundColor: "#34C759" },
                  ]}
                  onPress={() => handleApprove(item.id)}
                >
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={20}
                    color="#FFFFFF"
                  />
                  <ThemedText style={styles.actionButtonText}>Approve</ThemedText>
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    styles.rejectButton,
                    { backgroundColor: "#FF3B30" },
                  ]}
                  onPress={() => handleReject(item)}
                >
                  <IconSymbol name="xmark.circle.fill" size={20} color="#FFFFFF" />
                  <ThemedText style={styles.actionButtonText}>Reject</ThemedText>
                </Pressable>
              </View>
            </View>
          ))}

          {content.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: cardBgColor }]}>
              <IconSymbol
                name="checkmark.circle"
                size={60}
                color={colors.icon}
              />
              <ThemedText style={styles.emptyText}>
                No pending content
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                All audiobooks have been reviewed
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Rejection Modal */}
      <Modal
        visible={rejectModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <ThemedText style={styles.modalTitle}>Reject Content</ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              Please provide a reason for rejection
            </ThemedText>

            {selectedContent && (
              <View style={styles.selectedContent}>
                <ThemedText style={styles.selectedTitle}>
                  {selectedContent.audiobook.title}
                </ThemedText>
                <ThemedText style={styles.selectedAuthor}>
                  by {selectedContent.submittedByName}
                </ThemedText>
              </View>
            )}

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: cardBgColor,
                  borderColor: cardBorderColor,
                  color: colors.text,
                },
              ]}
              placeholder="Reason for rejection"
              placeholderTextColor={colors.icon}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: cardBgColor }]}
                onPress={() => {
                  setRejectModalVisible(false);
                  setRejectionReason("");
                }}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#FF3B30" }]}
                onPress={confirmRejection}
              >
                <ThemedText style={{ color: "#FFFFFF" }}>Reject</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  contentCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  bookInfo: {
    padding: 16,
    gap: 8,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  bookAuthor: {
    fontSize: 16,
    opacity: 0.7,
  },
  bookDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
    marginTop: 4,
  },
  metaInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    opacity: 0.7,
  },
  genreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 13,
    fontWeight: "600",
  },
  submissionInfo: {
    marginTop: 8,
    gap: 4,
  },
  submissionText: {
    fontSize: 13,
    opacity: 0.6,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  approveButton: {},
  rejectButton: {},
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  selectedContent: {
    padding: 12,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 8,
    gap: 4,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectedAuthor: {
    fontSize: 14,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
