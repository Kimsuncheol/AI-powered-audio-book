import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";

export function CarModeFooter() {
  return (
    <View style={styles.footer}>
      <ThemedText style={[styles.footerText, { opacity: 0.5 }]}>
        Tap the X to exit Car Mode
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
  },
});
