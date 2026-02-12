import { ContextPlayerScreen } from "@/components/player/ContextPlayerScreen";
import { useAudioPlayer } from "@/context/audio-player-context";
import { router } from "expo-router";
import { useEffect } from "react";

export default function PlayerAliasScreen() {
  const { playbackState } = useAudioPlayer();
  const currentBookId = playbackState.currentBook?.id;

  useEffect(() => {
    if (!currentBookId) return;

    router.replace({
      pathname: "/player/[id]",
      params: { id: currentBookId },
    });
  }, [currentBookId]);

  if (currentBookId) {
    return null;
  }

  return <ContextPlayerScreen />;
}
