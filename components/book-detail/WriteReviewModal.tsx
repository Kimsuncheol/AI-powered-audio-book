import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";

interface WriteReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  reviewText: string;
  onReviewTextChange: (text: string) => void;
  colors: {
    tint: string;
    text: string;
    background: string;
    icon: string;
  };
  cardBgColor: string;
}

export function WriteReviewModal({
  visible,
  onClose,
  onSubmit,
  rating,
  onRatingChange,
  reviewText,
  onReviewTextChange,
  colors,
  cardBgColor,
}: WriteReviewModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <View style={styles.modalHeader}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Write a Review
            </ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol size={24} name="xmark" color={colors.icon} />
            </Pressable>
          </View>

          <View style={styles.ratingSection}>
            <ThemedText style={styles.ratingLabel}>Your Rating</ThemedText>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => onRatingChange(star)}>
                  <IconSymbol
                    size={32}
                    name={star <= rating ? "star.fill" : "star"}
                    color={star <= rating ? "#FFD700" : colors.icon}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.reviewSection}>
            <ThemedText style={styles.reviewLabel}>Your Review</ThemedText>
            <TextInput
              style={[
                styles.reviewInput,
                {
                  backgroundColor: cardBgColor,
                  color: colors.text,
                },
              ]}
              placeholder="Share your thoughts about this audiobook..."
              placeholderTextColor={colors.icon}
              multiline
              numberOfLines={6}
              value={reviewText}
              onChangeText={onReviewTextChange}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.cancelButton, { backgroundColor: cardBgColor }]}
              onPress={onClose}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.submitButton, { backgroundColor: colors.tint }]}
              onPress={onSubmit}
            >
              <ThemedText
                style={[
                  styles.submitButtonText,
                  {
                    color:
                      colors.background === "#000000" ||
                      colors.background === "#fff" ||
                      colors.background === "#151718"
                        ? cardBgColor
                        : "#ffffff",
                  },
                ]}
              >
                Submit Review
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: "row",
    gap: 12,
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  reviewInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 120,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
