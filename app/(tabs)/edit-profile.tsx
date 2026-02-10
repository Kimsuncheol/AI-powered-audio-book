import { AccountInfoSection } from "@/components/settings/edit-profile/AccountInfoSection";
import { BasicInfoForm } from "@/components/settings/edit-profile/BasicInfoForm";
import { EditProfileHeader } from "@/components/settings/edit-profile/EditProfileHeader";
import { ProfilePictureSection } from "@/components/settings/edit-profile/ProfilePictureSection";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, userProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [photoURL, setPhotoURL] = useState<string | null>(
    userProfile?.photoURL || "",
  );

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  const hasChanges =
    displayName !== (user?.displayName || "") ||
    bio !== (userProfile?.bio || "") ||
    photoURL !== (userProfile?.photoURL || "");

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Display name cannot be empty");
      return;
    }

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
    }
  };

  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString()
    : "N/A";

  const accountId = user?.uid?.slice(0, 8).toUpperCase() || "N/A";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <EditProfileHeader
          onSave={handleSave}
          hasChanges={hasChanges}
          colors={colors}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProfilePictureSection
            photoUrl={photoURL}
            onPhotoChange={setPhotoURL}
            colors={colors}
            cardBgColor={cardBgColor}
          />

          <BasicInfoForm
            displayName={displayName}
            bio={bio}
            onDisplayNameChange={setDisplayName}
            onBioChange={setBio}
            colors={{
              text: colors.text,
              icon: colors.icon,
            }}
            cardBgColor={cardBgColor}
          />

          <AccountInfoSection
            email={user?.email || ""}
            memberSince={memberSince}
            accountId={accountId}
            colors={colors}
            cardBgColor={cardBgColor}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
});
