import { AuthorBasicInfoForm } from "@/components/author/edit-profile/AuthorBasicInfoForm";
import { AuthorProfilePicture } from "@/components/author/edit-profile/AuthorProfilePicture";
import { SocialLinksForm } from "@/components/author/edit-profile/SocialLinksForm";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthorEditProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, userProfile } = useAuth();

  const inputBgColor = colorScheme === "dark" ? "#2C2C2E" : "#F2F2F7";
  const inputTextColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const placeholderColor = colorScheme === "dark" ? "#8E8E93" : "#999";

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [socialLinks, setSocialLinks] = useState({
    website: "",
    twitter: "",
    instagram: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSocialLinkChange = (
    key: "website" | "twitter" | "instagram",
    value: string,
  ) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Display name is required");
      return;
    }

    setSaving(true);
    try {
      // TODO: Implement profile update with Firebase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                Edit Profile
              </ThemedText>
            </View>

            <AuthorProfilePicture
              displayName={displayName}
              tintColor={colors.tint}
            />

            <AuthorBasicInfoForm
              displayName={displayName}
              bio={bio}
              onNameChange={setDisplayName}
              onBioChange={setBio}
              inputBgColor={inputBgColor}
              inputTextColor={inputTextColor}
              placeholderColor={placeholderColor}
            />

            <SocialLinksForm
              links={socialLinks}
              onLinkChange={handleSocialLinkChange}
              inputBgColor={inputBgColor}
              inputTextColor={inputTextColor}
              placeholderColor={placeholderColor}
              iconColor={colors.icon}
            />

            <Pressable
              style={[
                styles.saveButton,
                { backgroundColor: colors.tint },
                saving && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <ThemedText style={styles.saveButtonText}>
                {saving ? "Saving..." : "Save Changes"}
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
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSpacer: {
    height: 40,
  },
});
