/**
 * RememberMeCheckbox Component
 *
 * A themed checkbox component for the "Remember my email" feature in the login screen.
 * This component saves the user's email address to local storage for convenience on future logins.
 *
 * Features:
 * - Theme-aware styling (light/dark mode)
 * - Visual feedback with checkmark icon when checked
 * - Clear checked/unchecked states
 * - Accessible touch target
 * - Smooth animations and press feedback
 */

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface RememberMeCheckboxProps {
  /** Whether the checkbox is currently checked */
  checked: boolean;
  /** Callback function when checkbox is toggled */
  onToggle: () => void;
}

/**
 * RememberMeCheckbox
 *
 * @param checked - Current checked state of the checkbox
 * @param onToggle - Function to call when the checkbox is pressed
 * @returns A pressable checkbox with label
 */
export function RememberMeCheckbox({
  checked,
  onToggle,
}: RememberMeCheckboxProps) {
  // Get current color scheme and theme colors
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkOpacity = useRef(new Animated.Value(checked ? 1 : 0)).current;

  // Animate checkbox when checked state changes
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: checked ? 1.1 : 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(checkOpacity, {
        toValue: checked ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (checked) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [checked]);

  return (
    <Pressable
      style={styles.container}
      onPress={onToggle}
      android_ripple={{ color: colors.tint, radius: 150 }}
    >
      {({ pressed }) => (
        <>
          {/* Checkbox Box */}
          <Animated.View
            style={[
              styles.checkbox,
              {
                backgroundColor: checked ? colors.tint : "transparent",
                borderColor: checked ? colors.tint : colors.icon,
                borderWidth: checked ? 0 : 2,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: scaleAnim }],
              },
              checked && styles.checkboxShadow,
            ]}
          >
            {/* Checkmark Icon - Animated opacity */}
            <Animated.View style={{ opacity: checkOpacity }}>
              <IconSymbol
                size={18}
                name="checkmark"
                color={colorScheme === "dark" ? "#000000" : "#FFFFFF"}
              />
            </Animated.View>
          </Animated.View>

          {/* Label Text */}
          <ThemedText style={[styles.label, pressed && styles.labelPressed]}>
            Remember my email
          </ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Container for checkbox and label
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Space between checkbox and label
    marginTop: 4,
    paddingVertical: 8, // Increase touch target area
    paddingHorizontal: 4,
  },
  // Checkbox box styling
  checkbox: {
    width: 24, // Larger size for better visibility
    height: 24,
    borderRadius: 6, // Rounded corners for modern look
    alignItems: "center",
    justifyContent: "center",
  },
  // Shadow effect when checkbox is checked
  checkboxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  // Label text styling
  label: {
    fontSize: 15,
    fontWeight: "500", // Medium weight for better readability
  },
  // Label pressed state
  labelPressed: {
    opacity: 0.7,
  },
});
