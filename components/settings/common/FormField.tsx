import { ThemedText } from "@/components/themed-text";
import { StyleSheet, TextInput, View } from "react-native";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  multiline?: boolean;
  editable?: boolean;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "url";
  colors: {
    text: string;
    icon: string;
  };
  cardBgColor: string;
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  maxLength,
  multiline = false,
  editable = true,
  secureTextEntry = false,
  autoCapitalize,
  keyboardType = "default",
  colors,
  cardBgColor,
}: FormFieldProps) {
  const showCharCount = maxLength && editable;
  const displayHint = showCharCount ? `${value.length}/${maxLength}` : hint;

  return (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          !editable && styles.disabledInput,
          { backgroundColor: cardBgColor, color: colors.text },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.icon}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        editable={editable}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {displayHint && (
        <ThemedText style={[styles.fieldHint, { opacity: 0.6 }]}>
          {displayHint}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
