// Helper function to format duration for book metadata (hours/minutes)
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Helper function to format playback time (m:ss)
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  // Format as m:ss (e.g., "5:03" or "125:47")
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Helper function to get progress percentage
export function getProgressPercentage(
  currentPosition: number,
  totalDuration: number,
): number {
  if (totalDuration <= 0) return 0;
  return Math.min(100, (currentPosition / totalDuration) * 100);
}
