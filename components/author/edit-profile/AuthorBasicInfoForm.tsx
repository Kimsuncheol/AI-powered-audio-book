import { ThemedText } from "@/components/themed-text";
import { StyleSheet, TextInput, View } from "react-native";

interface AuthorBasicInfoFormProps {
  displayName: string;
  bio: string;
  onNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  inputBgColor: string;
  inputTextColor: string;
  placeholderColor: string;
}

export function AuthorBasicInfoForm({
  displayName,
  bio,
  onNameChange,
  onBioChange,
  inputBgColor,
  inputTextColor,
  placeholderColor,
}: AuthorBasicInfoFormProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>

      <View style={styles.field}>
        <ThemedText style={styles.label}>Display Name</ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBgColor, color: inputTextColor },
          ]}
          value={displayName}
          onChangeText={onNameChange}
          placeholder="Enter your display name"
          placeholderTextColor={placeholderColor}
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={styles.label}>Bio</ThemedText>
        <TextInput
          style={[
            styles.textArea,
            { backgroundColor: inputBgColor, color: inputTextColor },
          ]}
          value={bio}
          onChangeText={onBioChange}
          placeholder="Tell readers about yourself..."
          placeholderTextColor={placeholderColor}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    marginLeft: 4,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.7,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  textArea: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 100,
  },
});
