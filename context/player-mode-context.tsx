import React, { createContext, useContext, useState } from "react";

export type PlayerMode = "bar" | "circular";

interface PlayerModeContextValue {
  playerMode: PlayerMode;
  setPlayerMode: (mode: PlayerMode) => void;
}

const PlayerModeContext = createContext<PlayerModeContextValue>({
  playerMode: "bar",
  setPlayerMode: () => {},
});

export function PlayerModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [playerMode, setPlayerMode] = useState<PlayerMode>("bar");

  return (
    <PlayerModeContext.Provider value={{ playerMode, setPlayerMode }}>
      {children}
    </PlayerModeContext.Provider>
  );
}

export function usePlayerMode() {
  return useContext(PlayerModeContext);
}
