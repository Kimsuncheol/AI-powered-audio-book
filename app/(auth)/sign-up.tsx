import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordMatchIndicator } from "@/components/auth/PasswordMatchIndicator";
import { PasswordRequirementsList } from "@/components/auth/PasswordRequirementsList";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import {
  getPasswordStrength,
  validatePassword,
} from "@/utils/password-validation";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordValidation = validatePassword(password);
  const passwordStrength =
    password.length > 0 ? getPasswordStrength(password) : null;

  const handleSignUp = async () => {
    if (!displayName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!passwordValidation.isValid) {
      Alert.alert(
        "Weak Password",
        `Your password must meet the following requirements:\n\n• ${passwordValidation.errors.join("\n• ")}`,
      );
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, displayName);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <AuthHeader
              title="Create Account"
              subtitle="Sign up to get started"
            />

            <View style={styles.form}>
              <AuthInput
                label="Full Name"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
                autoCapitalize="words"
              />

              <AuthInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoComplete="email"
              />

              <View style={styles.passwordSection}>
                <PasswordInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  autoComplete="password-new"
                />
                {password.length > 0 && (
                  <View style={styles.passwordFeedback}>
                    <PasswordStrengthIndicator strength={passwordStrength} />
                    <PasswordRequirementsList
                      requirements={passwordValidation.requirements}
                    />
                  </View>
                )}
              </View>

              <View style={styles.passwordSection}>
                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  autoComplete="password-new"
                />
                <PasswordMatchIndicator
                  password={password}
                  confirmPassword={confirmPassword}
                />
              </View>

              <AuthButton onPress={handleSignUp} loading={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </AuthButton>

              <AuthFooter
                text="Already have an account?"
                linkText="Log In"
                linkHref="/(auth)/login"
              />
            </View>
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
    flexGrow: 1,
    padding: 20,
  },
  form: {
    gap: 20,
  },
  passwordSection: {
    gap: 8,
  },
  passwordFeedback: {
    gap: 8,
    marginTop: 4,
  },
});
