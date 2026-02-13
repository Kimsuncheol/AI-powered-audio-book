import { ContextPlayerScreen } from "@/components/player/ContextPlayerScreen";
import { usePlayerMode } from "@/context/player-mode-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function PlayerByIdScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const bookId = Array.isArray(id) ? id[0] : id;
  const { setPlayerMode } = usePlayerMode();

  // When the full player is opened, switch to circular mode so the compact
  // circular mini-player appears when the user navigates back.
  useEffect(() => {
    setPlayerMode("circular");
  }, [setPlayerMode]);

  return <ContextPlayerScreen bookId={bookId} />;
}
