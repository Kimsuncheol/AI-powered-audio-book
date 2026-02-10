import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { RememberMeCheckbox } from "@/components/auth/RememberMeCheckbox";
import { ThemedView } from "@/components/themed-view";
import { auth, db } from "@/config/firebase";
import { useAuth } from "@/context/auth-context";
import { UserProfile } from "@/types/user";
import { getRoleBasedRoute } from "@/utils/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const REMEMBER_EMAIL_KEY = "@auth:remember_email";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Save email if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBER_EMAIL_KEY, email);
      }

      await signIn(email, password);

      // Wait a bit for auth state to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get user profile to determine role
      const user = await new Promise<User | null>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      });

      if (user) {
        const profileDoc = await getDoc(doc(db, "users", user.uid));
        if (profileDoc.exists()) {
          const profile = profileDoc.data() as UserProfile;
          const route = getRoleBasedRoute(profile.role);
          router.replace(route as any);
        } else {
          router.replace("/(tabs)");
        }
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
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
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoComplete="email"
            />

            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              autoComplete="password"
            />

            <RememberMeCheckbox
              checked={rememberMe}
              onToggle={handleRememberMeToggle}
            />

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
});
