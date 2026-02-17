import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { RememberMeCheckbox } from "@/components/auth/RememberMeCheckbox";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getLoginErrorMessage,
  LOGIN_REQUIRED_FIELDS_MESSAGE,
} from "@/utils/auth-error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REMEMBER_EMAIL_KEY = "@auth:remember_email";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const errorBackgroundColor = colorScheme === "dark" ? "#3A1F22" : "#FDECEC";
  const errorBorderColor = colorScheme === "dark" ? "#6E2D35" : "#F5C2C7";

  // Load saved email on mount
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(REMEMBER_EMAIL_KEY);
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Failed to load saved email:", error);
      }
    };
    loadSavedEmail();
  }, []);

  const handleRememberMeToggle = async () => {
    const newValue = !rememberMe;
    setRememberMe(newValue);

    if (!newValue) {
      // Clear saved email when unchecking
      try {
        await AsyncStorage.removeItem(REMEMBER_EMAIL_KEY);
      } catch (error) {
        console.error("Failed to clear saved email:", error);
      }
    }
  };

  const handleEmailChange = (text: string) => {
    if (authError) {
      setAuthError(null);
    }
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    if (authError) {
      setAuthError(null);
    }
    setPassword(text);
  };

  const handleLogin = async () => {
    setAuthError(null);

    if (!email || !password) {
      setAuthError(LOGIN_REQUIRED_FIELDS_MESSAGE);
      return;
    }

    setLoading(true);
    try {
      // Save email if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBER_EMAIL_KEY, email);
      }

      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (error: unknown) {
      setAuthError(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <AuthHeader title="Welcome Back" subtitle="Log in to continue" />

            <View style={styles.form}>
              <AuthInput
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoComplete="email"
              />

              <PasswordInput
                label="Password"
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Enter your password"
                autoComplete="password"
              />

              <RememberMeCheckbox
                checked={rememberMe}
                onToggle={handleRememberMeToggle}
              />

              {authError ? (
                <View
                  style={[
                    styles.errorBanner,
                    {
                      backgroundColor: errorBackgroundColor,
                      borderColor: errorBorderColor,
                    },
                  ]}
                >
                  <ThemedText
                    style={styles.errorText}
                    lightColor="#B42318"
                    darkColor="#FCA5A5"
                  >
                    {authError}
                  </ThemedText>
                </View>
              ) : null}

              <AuthButton onPress={handleLogin} loading={loading}>
                {loading ? "Logging in..." : "Log In"}
              </AuthButton>

              <AuthFooter
                text="Don't have an account?"
                linkText="Sign Up"
                linkHref="/(auth)/sign-up"
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
  errorBanner: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
