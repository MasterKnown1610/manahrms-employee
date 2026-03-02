import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function getPriorityLabel(priority) {
  if (!priority) return null;
  const p = String(priority).toLowerCase();
  if (p === 'high') return 'High';
  if (p === 'medium') return 'Medium';
  if (p === 'low') return 'Low';
  return priority;
}

function UpcomingDeadlineCard({
  title,
  dueDate,
  dueLabel,
  priority,
  assignedTo,
  projectOrType,
  onView,
}) {
  const { colors } = useTheme();
  const priorityLabel = getPriorityLabel(priority);

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: colors.background }]} numberOfLines={1}>
          {title}
        </Text>
        {dueLabel ? (
          <View style={styles.dueBadge}>
            <Text style={[styles.dueBadgeText, { color: colors.background }]}>{dueLabel}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.metaRow}>
        {priorityLabel ? (
          <View style={[styles.priorityBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <Text style={[styles.priorityText, { color: colors.background }]}>{priorityLabel}</Text>
          </View>
        ) : null}
        {(assignedTo || projectOrType) ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {assignedTo ?? projectOrType}
          </Text>
        ) : null}
      </View>
      <View style={styles.dateRow}>
        <Icon name="event" size={16} color={colors.background} />
        <Text style={[styles.dateText, { color: colors.background }]}>{dueDate}</Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.spacer} />
        <Pressable onPress={onView} style={[styles.viewButton, { backgroundColor: colors.background }]}>
          <Text style={[styles.viewButtonText, { color: colors.primary }]}>View</Text>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_HEIGHT = 160;

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    minHeight: CARD_HEIGHT,
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
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    minWidth: 0,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: 13,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default UpcomingDeadlineCard;
