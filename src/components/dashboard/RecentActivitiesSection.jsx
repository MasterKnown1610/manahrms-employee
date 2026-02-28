import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing } from '../../theme/theme';

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

function RecentActivityItem({ activity }) {
  const iconName = getActivityIcon(activity?.type);
  return (
    <View style={styles.item}>
      <View style={styles.iconWrap}>
        <Icon name={iconName} size={20} color={colors.background} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{activity?.title ?? '—'}</Text>
        <Text style={styles.description} numberOfLines={2}>{activity?.description ?? ''}</Text>
        <Text style={styles.meta}>
          {formatTimestamp(activity?.timestamp)}
          {activity?.user_name ? ` • ${activity.user_name}` : ''}
        </Text>
      </View>
    </View>
  );
}

function RecentActivitiesSection({ activities = [] }) {
  if (!activities?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activities</Text>
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {activities.slice(0, 10).map((activity, index) => (
          <RecentActivityItem key={`${activity?.timestamp}-${index}`} activity={activity} />
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
    color: colors.text,
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
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: spacing.sm,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary,
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
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  meta: {
    fontSize: 11,
    color: colors.placeholder,
  },
});

export default RecentActivitiesSection;
