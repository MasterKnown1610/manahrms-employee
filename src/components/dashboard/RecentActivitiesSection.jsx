import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function formatTimestamp(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return isoString;
  }
}

function getActivityIcon(type) {
  switch (type) {
    case 'task_created':
      return 'assignment';
    case 'employee_added':
      return 'person-add';
    case 'project_created':
      return 'work';
    default:
      return 'info';
  }
}

function RecentActivityItem({ activity, colors }) {
  const iconName = getActivityIcon(activity?.type);
  return (
    <View style={[styles.item, { backgroundColor: colors.cardBackground }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
        <Icon name={iconName} size={20} color={colors.background} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{activity?.title ?? '—'}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{activity?.description ?? ''}</Text>
        <Text style={[styles.meta, { color: colors.placeholder }]}>
          {formatTimestamp(activity?.timestamp)}
          {activity?.user_name ? ` • ${activity.user_name}` : ''}
        </Text>
      </View>
    </View>
  );
}

function RecentActivitiesSection({ activities = [] }) {
  const { colors } = useTheme();
  if (!activities?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activities</Text>
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {activities.slice(0, 10).map((activity, index) => (
          <RecentActivityItem key={`${activity?.timestamp}-${index}`} activity={activity} colors={colors} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  list: {
    maxHeight: 320,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    minHeight: 80,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    marginBottom: 2,
  },
  meta: {
    fontSize: 11,
  },
});

export default RecentActivitiesSection;
