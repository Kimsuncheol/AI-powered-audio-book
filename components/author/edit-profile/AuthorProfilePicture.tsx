import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface AuthorProfilePictureProps {
  displayName: string;
  tintColor: string;
}

export function AuthorProfilePicture({
  displayName,
  tintColor,
}: AuthorProfilePictureProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: tintColor }]}>
        <ThemedText style={styles.avatarText}>
          {displayName?.charAt(0).toUpperCase() || "A"}
        </ThemedText>
      </View>
      <Pressable style={[styles.editButton, { backgroundColor: tintColor }]}>
        <IconSymbol size={14} name="camera.fill" color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});
