import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";

interface GenreTagsProps {
  genres: string[];
  cardBgColor: string;
}

export function GenreTags({ genres, cardBgColor }: GenreTagsProps) {
  return (
    <View style={styles.genreTags}>
      {genres.map((genre, index) => (
        <View
          key={index}
          style={[styles.genreTag, { backgroundColor: cardBgColor }]}
        >
          <ThemedText style={styles.genreTagText}>{genre}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  genreTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
  },
  genreTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  genreTagText: {
    fontSize: 13,
    opacity: 0.8,
  },
});
