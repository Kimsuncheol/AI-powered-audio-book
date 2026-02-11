import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  iconColor: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  cardBgColor: string;
}

export function RecentActivity({
  activities,
  cardBgColor,
}: RecentActivityProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
      <View style={[styles.activityList, { backgroundColor: cardBgColor }]}>
        {activities.map((activity, index) => (
          <View
            key={activity.id}
            style={[
              styles.activityItem,
              index < activities.length - 1 && styles.activityItemBorder,
            ]}
          >
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: activity.iconColor + "20" },
              ]}
            >
              <IconSymbol
                size={18}
                name={activity.icon}
                color={activity.iconColor}
              />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>
                {activity.title}
              </ThemedText>
              <ThemedText style={styles.activityDescription}>
                {activity.description}
              </ThemedText>
            </View>
            <ThemedText style={styles.activityTime}>{activity.time}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },
  activityList: {
    borderRadius: 16,
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  activityItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.2)",
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.5,
  },
});
