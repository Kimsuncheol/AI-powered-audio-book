import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { UserRole } from "@/types/user";
import {
  getPasswordStrength,
  validatePassword,
} from "@/utils/password-validation";
import { getRoleBasedRoute } from "@/utils/navigation";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      await signUp(email, password, displayName, role);
      const route = getRoleBasedRoute(role);
      router.replace(route as any);
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const inputTextColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const buttonTextColor = colorScheme === "dark" ? "#000000" : "#FFFFFF";
  const activeRoleTextColor = colorScheme === "dark" ? "#000000" : "#FFFFFF";

  const roles: {
    value: UserRole;
    label: string;
    description: string;
    icon: string;
  }[] = [
    {
      value: "user",
      label: "Listener",
      description: "Enjoy audiobooks",
      icon: "headphones",
    },
    {
      value: "author",
      label: "Author",
      description: "Publish your audiobooks",
      icon: "pencil",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Manage platform",
      icon: "shield.fill",
    },
  ];

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
            <View style={styles.header}>
              <IconSymbol size={60} name="book.fill" color={colors.tint} />
              <ThemedText type="title" style={styles.title}>
                Create Account
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign up to get started
              </ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Full Name</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: inputBgColor, color: inputTextColor },
                  ]}
                  placeholder="Enter your name"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#8E8E93" : "#999"
                  }
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: inputBgColor, color: inputTextColor },
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#8E8E93" : "#999"
                  }
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Account Type</ThemedText>
                <View style={styles.roleContainer}>
                  {roles.map((r) => (
                    <Pressable
                      key={r.value}
                      style={[
                        styles.roleCard,
                        { backgroundColor: inputBgColor },
                        role === r.value && {
                          backgroundColor: colors.tint,
                          borderColor: colors.tint,
                          ...styles.shadow,
                        },
                      ]}
                      onPress={() => setRole(r.value)}
                    >
                      <IconSymbol
                        size={24}
                        name={r.icon as any}
                        color={
                          role === r.value ? activeRoleTextColor : colors.icon
                        }
                      />
                      <ThemedText
                        style={[
                          styles.roleLabel,
                          role === r.value && { color: activeRoleTextColor },
                        ]}
                      >
                        {r.label}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.roleDescription,
                          role === r.value && {
                            color: activeRoleTextColor,
                            opacity: 0.9,
                          },
                        ]}
                      >
                        {r.description}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Password</ThemedText>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      { backgroundColor: inputBgColor, color: inputTextColor },
                    ]}
                    placeholder="Create a password"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#8E8E93" : "#999"
                    }
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password-new"
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

                {password.length > 0 && (
                  <View style={styles.passwordRequirements}>
                    {passwordStrength && (
                      <View style={styles.strengthIndicator}>
                        <View
                          style={[
                            styles.strengthBar,
                            {
                              width:
                                passwordStrength.strength === "weak"
                                  ? "33%"
                                  : passwordStrength.strength === "medium"
                                    ? "66%"
                                    : "100%",
                              backgroundColor: passwordStrength.color,
                            },
                          ]}
                        />
                      </View>
                    )}
                    <View style={styles.requirementsList}>
                      {[
                        { key: "minLength", text: "At least 8 characters" },
                        { key: "hasUpperCase", text: "One uppercase letter" },
                        { key: "hasLowerCase", text: "One lowercase letter" },
                        { key: "hasNumber", text: "One number" },
                        {
                          key: "hasSpecialChar",
                          text: "One special character",
                        },
                      ].map((req) => (
                        <View key={req.key} style={styles.requirementItem}>
                          <IconSymbol
                            size={14}
                            name={
                              passwordValidation.requirements[
                                req.key as keyof typeof passwordValidation.requirements
                              ]
                                ? "checkmark.circle.fill"
                                : "circle"
                            }
                            color={
                              passwordValidation.requirements[
                                req.key as keyof typeof passwordValidation.requirements
                              ]
                                ? "#34C759"
                                : colors.icon
                            }
                          />
                          <ThemedText
                            style={[
                              styles.requirementText,
                              passwordValidation.requirements[
                                req.key as keyof typeof passwordValidation.requirements
                              ] && styles.requirementMet,
                            ]}
                          >
                            {req.text}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Confirm Password</ThemedText>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      { backgroundColor: inputBgColor, color: inputTextColor },
                    ]}
                    placeholder="Confirm your password"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#8E8E93" : "#999"
                    }
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password-new"
                  />
                  <Pressable
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <IconSymbol
                      size={20}
                      name={showConfirmPassword ? "eye.slash" : "eye"}
                      color={colors.icon}
                    />
                  </Pressable>
                </View>
                {confirmPassword.length > 0 && (
                  <View style={styles.matchIndicator}>
                    <IconSymbol
                      size={14}
                      name={
                        password === confirmPassword
                          ? "checkmark.circle.fill"
                          : "xmark.circle.fill"
                      }
                      color={
                        password === confirmPassword ? "#34C759" : "#FF3B30"
                      }
                    />
                    <ThemedText
                      style={[
                        styles.matchText,
                        {
                          color:
                            password === confirmPassword
                              ? "#34C759"
                              : "#FF3B30",
                        },
                      ]}
                    >
                      {password === confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </ThemedText>
                  </View>
                )}
              </View>

              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: colors.tint },
                  styles.shadow,
                ]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <ThemedText
                  style={[styles.buttonText, { color: buttonTextColor }]}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </ThemedText>
              </Pressable>

              <View style={styles.footer}>
                <ThemedText style={styles.footerText}>
                  Already have an account?{" "}
                </ThemedText>
                <Link href="/(auth)/login" asChild>
                  <Pressable>
                    <ThemedText style={[styles.link, { color: colors.tint }]}>
                      Log In
                    </ThemedText>
                  </Pressable>
                </Link>
              </View>
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
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    gap: 20,
  },
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
  roleContainer: {
    flexDirection: "row",
    gap: 10,
  },
  roleCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  roleDescription: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: "center",
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
  passwordRequirements: {
    gap: 8,
    marginTop: 4,
  },
  strengthIndicator: {
    height: 4,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    borderRadius: 2,
  },
  requirementsList: {
    gap: 6,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
    opacity: 0.7,
  },
  requirementMet: {
    opacity: 1,
    color: "#34C759",
  },
  matchIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  matchText: {
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
  },
  link: {
    fontSize: 16,
    fontWeight: "600",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
