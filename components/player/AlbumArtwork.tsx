import { Image } from "expo-image";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

interface AlbumArtworkProps {
  coverImage: string;
  size?: number;
}

export function AlbumArtwork({
  coverImage,
  size = width * 0.8,
}: AlbumArtworkProps) {
  return (
    <View style={styles.artworkContainer}>
      <Image
        source={{ uri: coverImage }}
        style={[styles.artwork, { width: size, height: size }]}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artworkContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  artwork: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
});
