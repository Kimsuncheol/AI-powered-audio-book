import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  colors: {
    icon: string;
  };
  inputBgColor: string;
  inputTextColor: string;
  placeholderColor: string;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  colors,
  inputBgColor,
  inputTextColor,
  placeholderColor,
}: SearchBarProps) {
  return (
    <View style={[styles.searchContainer, { backgroundColor: inputBgColor }]}>
      <IconSymbol size={20} name="magnifyingglass" color={colors.icon} />
      <TextInput
        style={[styles.searchInput, { color: inputTextColor }]}
        placeholder="Search books or authors..."
        placeholderTextColor={placeholderColor}
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {searchQuery.length > 0 && (
        <Pressable onPress={() => onSearchChange("")}>
          <IconSymbol size={20} name="xmark.circle.fill" color={colors.icon} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});
