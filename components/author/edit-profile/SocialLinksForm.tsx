import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, TextInput, View } from "react-native";

interface SocialLinks {
  website: string;
  twitter: string;
  instagram: string;
}

interface SocialLinksFormProps {
  links: SocialLinks;
  onLinkChange: (key: keyof SocialLinks, value: string) => void;
  inputBgColor: string;
  inputTextColor: string;
  placeholderColor: string;
  iconColor: string;
}

const SOCIAL_FIELDS: {
  key: keyof SocialLinks;
  label: string;
  icon: string;
  placeholder: string;
}[] = [
  {
    key: "website",
    label: "Website",
    icon: "globe",
    placeholder: "https://yourwebsite.com",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: "at",
    placeholder: "@username",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "camera.fill",
    placeholder: "@username",
  },
];

export function SocialLinksForm({
  links,
  onLinkChange,
  inputBgColor,
  inputTextColor,
  placeholderColor,
  iconColor,
}: SocialLinksFormProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Social Links</ThemedText>
      {SOCIAL_FIELDS.map((field) => (
        <View key={field.key} style={styles.field}>
          <ThemedText style={styles.label}>{field.label}</ThemedText>
          <View style={[styles.inputRow, { backgroundColor: inputBgColor }]}>
            <IconSymbol size={18} name={field.icon} color={iconColor} />
            <TextInput
              style={[styles.input, { color: inputTextColor }]}
              value={links[field.key]}
              onChangeText={(value) => onLinkChange(field.key, value)}
              placeholder={field.placeholder}
              placeholderTextColor={placeholderColor}
              autoCapitalize="none"
              keyboardType={field.key === "website" ? "url" : "default"}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    marginLeft: 4,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.7,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
});
