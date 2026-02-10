import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";

interface ProfilePictureSectionProps {
  photoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
  colors: {
    tint: string;
    text: string;
    icon: string;
  };
  cardBgColor: string;
}

export function ProfilePictureSection({
  photoUrl,
  onPhotoChange,
  colors,
  cardBgColor,
}: ProfilePictureSectionProps) {
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "You need to allow access to your photos to change your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      onPhotoChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.avatarSection}>
      <View style={styles.avatarContainer}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.avatar} />
        ) : (
          <ThemedView
            style={[styles.avatarPlaceholder, { backgroundColor: cardBgColor }]}
          >
            <IconSymbol size={48} name="person.fill" color={colors.icon} />
          </ThemedView>
        )}
        <Pressable
          style={[styles.editAvatarButton, { backgroundColor: colors.tint }]}
          onPress={pickImage}
        >
          <IconSymbol size={16} name="camera.fill" color="#FFFFFF" />
        </Pressable>
      </View>
      <Pressable onPress={pickImage}>
        <ThemedText style={[styles.changePhotoText, { color: colors.tint }]}>
          Change Photo
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000000",
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
});
