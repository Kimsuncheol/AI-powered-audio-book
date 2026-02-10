import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoComplete?: string;
}

export function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
  autoComplete = "password",
}: PasswordInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [showPassword, setShowPassword] = useState(false);

  const inputBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const inputTextColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const placeholderColor = colorScheme === "dark" ? "#8E8E93" : "#999";

  return (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            { backgroundColor: inputBgColor, color: inputTextColor },
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoComplete={autoComplete as any}
        />
        <Pressable
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <IconSymbol
            size={20}
            name={showPassword ? "eye.slash" : "eye"}
            color={colors.icon}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
});
