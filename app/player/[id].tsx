import { ContextPlayerScreen } from "@/components/player/ContextPlayerScreen";
import { useLocalSearchParams } from "expo-router";

export default function PlayerByIdScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const bookId = Array.isArray(id) ? id[0] : id;

  return <ContextPlayerScreen bookId={bookId} />;
}
