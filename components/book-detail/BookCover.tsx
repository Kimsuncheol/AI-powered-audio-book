import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

interface BookCoverProps {
  coverImage: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  colors: {
    tint: string;
  };
}

export function BookCover({
  coverImage,
  isFavorite,
  onToggleFavorite,
  colors,
}: BookCoverProps) {
  return (
    <View style={styles.coverContainer}>
      <Image
        source={{ uri: coverImage }}
        style={styles.coverImage}
        contentFit="cover"
      />
      <Pressable
        style={[
          styles.favoriteButton,
          {
            backgroundColor: isFavorite ? colors.tint : "rgba(0,0,0,0.5)",
          },
        ]}
        onPress={onToggleFavorite}
      >
        <IconSymbol
          size={24}
          name={isFavorite ? "heart.fill" : "heart"}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  coverContainer: {
    alignItems: "center",
    position: "relative",
  },
  coverImage: {
    width: 280,
    height: 280,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
