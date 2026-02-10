import { StyleSheet, View } from "react-native";
import { FormField } from "../common/FormField";

interface BasicInfoFormProps {
  displayName: string;
  bio: string;
  onDisplayNameChange: (text: string) => void;
  onBioChange: (text: string) => void;
  colors: {
    text: string;
    border: string;
  };
  cardBgColor: string;
}

export function BasicInfoForm({
  displayName,
  bio,
  onDisplayNameChange,
  onBioChange,
  colors,
  cardBgColor,
}: BasicInfoFormProps) {
  return (
    <View style={styles.container}>
      <FormField
        label="Display Name"
        value={displayName}
        onChangeText={onDisplayNameChange}
        placeholder="Enter your display name"
        maxLength={50}
        showCharacterCount
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <FormField
        label="Bio"
        value={bio}
        onChangeText={onBioChange}
        placeholder="Tell us about yourself"
        hint="A brief description about you"
        multiline
        maxLength={200}
        showCharacterCount
        colors={colors}
        cardBgColor={cardBgColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
