import { StyleSheet, View } from "react-native";

interface DeleteZoneStripesProps {
  active: boolean;
  borderRadius: number;
}

const RIPPLE_INSETS = [6, 12, 18, 24, 30, 36, 42, 48, 54];

const INACTIVE_STRIPE_COLOR = "rgba(255, 59, 48, 0.34)";

interface RippleRingProps {
  inset: number;
  opacity: number;
  color: string;
}

function RippleRing({ inset, opacity, color }: RippleRingProps) {
  return (
    <View
      style={[
        styles.ring,
        {
          top: inset,
          right: inset,
          bottom: inset,
          left: inset,
          backgroundColor: color,
          opacity,
        },
      ]}
    />
  );
}

export function DeleteZoneStripes({
  active,
  borderRadius,
}: DeleteZoneStripesProps) {
  if (active) return null;

  const stripeColor = INACTIVE_STRIPE_COLOR;

  return (
    <View pointerEvents="none" style={[styles.overlay, { borderRadius }]}>
      <View style={styles.patternLayer}>
        {RIPPLE_INSETS.map((inset, index) => (
          <RippleRing
            key={`delete-zone-ripple-${index}`}
            inset={inset}
            opacity={Math.max(active ? 0.08 : 0.1, 0.2 - index * 0.02)}
            color={stripeColor}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
  },
});
