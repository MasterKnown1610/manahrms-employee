import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

function UpcomingDeadlineCard({
  title,
  dueDate,
  dueLabel,
  projectOrType,
  onView,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {dueLabel ? (
          <View style={styles.dueBadge}>
            <Text style={styles.dueBadgeText}>{dueLabel}</Text>
          </View>
        ) : null}
      </View>
      {projectOrType ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {projectOrType}
        </Text>
      ) : null}
      <View style={styles.dateRow}>
        <Icon name="event" size={16} color={colors.background} />
        <Text style={styles.dateText}>{dueDate}</Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.spacer} />
        <Pressable onPress={onView} style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
    flex: 1,
    marginRight: spacing.sm,
  },
  dueBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dueBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.background,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: 13,
    color: colors.background,
    marginLeft: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  viewButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default UpcomingDeadlineCard;
