import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface SignUpPromptModalProps {
  visible: boolean;
  onClose: () => void;
  feature: "favorites" | "fullPlayback" | "reviews" | "download" | "progress";
  bookTitle?: string;
}

const FEATURE_CONFIG = {
  favorites: {
    icon: "heart.fill" as const,
    title: "Save Your Favorites",
    description: "Create a free account to save your favorite audiobooks and access them across all your devices.",
  },
  fullPlayback: {
    icon: "play.circle.fill" as const,
    title: "Unlock Full Access",
    description: "Sign up for a free account to listen to complete audiobooks without time limits.",
  },
  progress: {
    icon: "chart.bar.fill" as const,
    title: "Track Your Progress",
    description: "Create an account to automatically save your listening progress and resume where you left off on any device.",
  },
  reviews: {
    icon: "star.fill" as const,
    title: "Share Your Thoughts",
    description: "Sign up to write reviews and help others discover great audiobooks.",
  },
  download: {
    icon: "arrow.down.circle.fill" as const,
    title: "Download for Offline",
    description: "Create an account to download audiobooks and listen offline anytime, anywhere.",
  },
};

export function SignUpPromptModal({ visible, onClose, feature, bookTitle }: SignUpPromptModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const config = FEATURE_CONFIG[feature];

  const handleSignUp = () => {
    onClose();
    router.push("/(auth)/sign-up");
  };

  const handleLogin = () => {
    onClose();
    router.push("/(auth)/login");
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.modal, { backgroundColor: colors.background }]}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <IconSymbol name="xmark.circle.fill" size={28} color={colors.icon} />
          </Pressable>

          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: colors.tint + "20" }]}>
              <IconSymbol name={config.icon} size={48} color={colors.tint} />
            </View>

            <ThemedText type="title" style={styles.title}>
              {config.title}
            </ThemedText>

            <ThemedText style={styles.description}>{config.description}</ThemedText>

            {bookTitle && (
              <View style={[styles.bookInfo, { backgroundColor: colors.background }]}>
                <IconSymbol name="book.fill" size={16} color={colors.icon} />
                <ThemedText style={styles.bookTitle} numberOfLines={1}>
                  {bookTitle}
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.buttons}>
            <Pressable style={[styles.button, { backgroundColor: colors.tint }]} onPress={handleSignUp}>
              <ThemedText style={styles.buttonText}>Sign Up Free</ThemedText>
            </Pressable>

            <Pressable style={[styles.button, styles.buttonOutline]} onPress={handleLogin}>
              <ThemedText style={[styles.buttonText, { color: colors.tint }]}>Log In</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  content: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
    marginBottom: 16,
  },
  bookInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    maxWidth: "100%",
  },
  bookTitle: {
    fontSize: 14,
    opacity: 0.8,
    flex: 1,
  },
  buttons: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
