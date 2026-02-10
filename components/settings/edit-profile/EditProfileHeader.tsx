import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface EditProfileHeaderProps {
  onSave: () => void;
  hasChanges: boolean;
  colors: {
    text: string;
    icon: string;
  };
}

export function EditProfileHeader({
  onSave,
  hasChanges,
  colors,
}: EditProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()}>
        <IconSymbol size={24} name="chevron.left" color={colors.icon} />
      </Pressable>
      <ThemedText type="subtitle" style={styles.headerTitle}>
        Edit Profile
      </ThemedText>
      <Pressable onPress={onSave} disabled={!hasChanges}>
        <ThemedText
          style={[
            styles.saveText,
            { color: hasChanges ? colors.text : colors.text + "60" },
          ]}
        >
          Save
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
