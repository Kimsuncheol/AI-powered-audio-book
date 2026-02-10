import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GENRES = [
  "Fiction",
  "Classic",
  "Romance",
  "Horror",
  "Mystery",
  "Fantasy",
  "Science Fiction",
  "Biography",
  "Self-Help",
];

export default function UploadScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const inputBgColor = colorScheme === "dark" ? "#2C2C2E" : "#F2F2F7";
  const inputTextColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [narrator, setNarrator] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (selectedGenres.length === 0) {
      Alert.alert("Error", "Please select at least one genre");
      return;
    }

    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      Alert.alert("Success", "Your audiobook has been submitted for review!", [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setDescription("");
            setNarrator("");
            setSelectedGenres([]);
          },
        },
      ]);
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <ThemedText type="title">Upload Audiobook</ThemedText>
              <ThemedText style={styles.subtitle}>
                Share your audiobook with the world
              </ThemedText>
            </View>

            {/* Cover Image Upload */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Cover Image</ThemedText>
              <Pressable
                style={[styles.coverUpload, { backgroundColor: inputBgColor }]}
                onPress={() =>
                  Alert.alert("Select Image", "Image picker coming soon!")
                }
              >
                <IconSymbol size={40} name="photo" color={colors.icon} />
                <ThemedText style={styles.uploadText}>
                  Tap to select cover image
                </ThemedText>
              </Pressable>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Title</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: inputBgColor, color: inputTextColor },
                ]}
                placeholder="Enter audiobook title"
                placeholderTextColor={
                  colorScheme === "dark" ? "#8E8E93" : "#999"
                }
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Description</ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  { backgroundColor: inputBgColor, color: inputTextColor },
                ]}
                placeholder="Describe your audiobook..."
                placeholderTextColor={
                  colorScheme === "dark" ? "#8E8E93" : "#999"
                }
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Narrator */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Narrator</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: inputBgColor, color: inputTextColor },
                ]}
                placeholder="Who narrates this audiobook?"
                placeholderTextColor={
                  colorScheme === "dark" ? "#8E8E93" : "#999"
                }
                value={narrator}
                onChangeText={setNarrator}
              />
            </View>

            {/* Genre Selection */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Genres</ThemedText>
              <View style={styles.genreGrid}>
                {GENRES.map((genre) => (
                  <Pressable
                    key={genre}
                    style={[
                      styles.genreChip,
                      { backgroundColor: inputBgColor },
                      selectedGenres.includes(genre) && {
                        backgroundColor: colors.tint,
                      },
                    ]}
                    onPress={() => toggleGenre(genre)}
                  >
                    <ThemedText
                      style={[
                        styles.genreChipText,
                        selectedGenres.includes(genre) &&
                          styles.genreChipTextActive,
                      ]}
                    >
                      {genre}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Audio Files Upload */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Audio Files</ThemedText>
              <Pressable
                style={[styles.audioUpload, { backgroundColor: inputBgColor }]}
                onPress={() =>
                  Alert.alert("Upload Audio", "Audio file upload coming soon!")
                }
              >
                <IconSymbol size={40} name="waveform" color={colors.icon} />
                <ThemedText style={styles.uploadText}>
                  Tap to upload audio files
                </ThemedText>
                <ThemedText style={styles.uploadHint}>
                  Supported: MP3, M4A, WAV (max 500MB per file)
                </ThemedText>
              </Pressable>
            </View>

            {/* Submit */}
            <Pressable
              style={[styles.submitButton, { backgroundColor: colors.tint }]}
              onPress={handleUpload}
              disabled={uploading}
            >
              <ThemedText style={styles.submitButtonText}>
                {uploading ? "Uploading..." : "Submit for Review"}
              </ThemedText>
            </Pressable>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    paddingTop: 40,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  textArea: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 120,
  },
  coverUpload: {
    height: 160,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "rgba(128,128,128,0.3)",
    borderStyle: "dashed",
  },
  audioUpload: {
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "rgba(128,128,128,0.3)",
    borderStyle: "dashed",
  },
  uploadText: {
    fontSize: 15,
    opacity: 0.7,
  },
  uploadHint: {
    fontSize: 12,
    opacity: 0.5,
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  genreChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  genreChipTextActive: {
    color: "#FFFFFF",
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSpacer: {
    height: 80,
  },
});
