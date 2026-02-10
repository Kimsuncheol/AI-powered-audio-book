import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, userProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || "");
  const [isSaving, setIsSaving] = useState(false);

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Display name cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Implement profile update with Firebase
      // await updateProfile(user, { displayName, photoURL });
      // await updateDoc(doc(db, "users", user.uid), { displayName, bio, photoURL, updatedAt: new Date() });

      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol size={24} name="chevron.left" color={colors.icon} />
          </Pressable>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Edit Profile
          </ThemedText>
          <Pressable onPress={handleSave} disabled={isSaving}>
            <ThemedText
              style={[
                styles.saveButton,
                { color: colors.tint },
                isSaving && { opacity: 0.5 },
              ]}
            >
              {isSaving ? "Saving..." : "Save"}
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Picture Section */}
          <View style={styles.avatarSection}>
            <View
              style={[styles.avatarContainer, { backgroundColor: colors.tint }]}
            >
              {photoURL ? (
                <ThemedText style={styles.avatarText}>
                  {displayName?.charAt(0).toUpperCase() || "U"}
                </ThemedText>
              ) : (
                <ThemedText style={styles.avatarText}>
                  {displayName?.charAt(0).toUpperCase() || "U"}
                </ThemedText>
              )}
            </View>
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Photo upload functionality is coming soon!"
                )
              }
            >
              <ThemedText style={[styles.changePhotoButton, { color: colors.tint }]}>
                Change Profile Photo
              </ThemedText>
            </Pressable>
          </View>

          {/* Form Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Basic Information
            </ThemedText>

            <View style={styles.fieldContainer}>
              <ThemedText style={styles.fieldLabel}>Display Name *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: cardBgColor, color: colors.text },
                ]}
                placeholder="Enter your display name"
                placeholderTextColor={colors.icon}
                value={displayName}
                onChangeText={setDisplayName}
                maxLength={50}
              />
              <ThemedText style={[styles.fieldHint, { opacity: 0.6 }]}>
                {displayName.length}/50
              </ThemedText>
            </View>

            <View style={styles.fieldContainer}>
              <ThemedText style={styles.fieldLabel}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.disabledInput,
                  { backgroundColor: cardBgColor, color: colors.text },
                ]}
                value={user?.email || ""}
                editable={false}
              />
              <ThemedText style={[styles.fieldHint, { opacity: 0.6 }]}>
                Email cannot be changed
              </ThemedText>
            </View>

            <View style={styles.fieldContainer}>
              <ThemedText style={styles.fieldLabel}>Bio</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: cardBgColor, color: colors.text },
                ]}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.icon}
                multiline
                numberOfLines={4}
                value={bio}
                onChangeText={setBio}
                maxLength={200}
                textAlignVertical="top"
              />
              <ThemedText style={[styles.fieldHint, { opacity: 0.6 }]}>
                {bio.length}/200
              </ThemedText>
            </View>

            <View style={styles.fieldContainer}>
              <ThemedText style={styles.fieldLabel}>Photo URL</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: cardBgColor, color: colors.text },
                ]}
                placeholder="https://example.com/photo.jpg"
                placeholderTextColor={colors.icon}
                value={photoURL}
                onChangeText={setPhotoURL}
                autoCapitalize="none"
                keyboardType="url"
              />
              <ThemedText style={[styles.fieldHint, { opacity: 0.6 }]}>
                Optional: Enter a URL to your profile photo
              </ThemedText>
            </View>
          </View>

          {/* Account Info Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account Details</ThemedText>

            <View
              style={[styles.infoCard, { backgroundColor: cardBgColor }]}
            >
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Role</ThemedText>
                <ThemedText style={[styles.infoValue, { color: colors.tint }]}>
                  {userProfile?.role?.toUpperCase() || "USER"}
                </ThemedText>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Member Since</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString()
                    : "N/A"}
                </ThemedText>
              </View>
            </View>
          </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  changePhotoButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  disabledInput: {
    opacity: 0.6,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  fieldHint: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5EA",
    marginVertical: 4,
  },
});
