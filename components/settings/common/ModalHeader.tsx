import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  colors: {
    icon: string;
  };
}

export function ModalHeader({ title, onClose, colors }: ModalHeaderProps) {
  return (
    <View style={styles.modalHeader}>
      <ThemedText type="subtitle" style={styles.modalTitle}>
        {title}
      </ThemedText>
      <Pressable onPress={onClose}>
        <IconSymbol size={24} name="xmark" color={colors.icon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
});
