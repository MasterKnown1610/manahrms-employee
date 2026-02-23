import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

const PRIORITY_STYLES = {
  high: { bg: colors.priorityHigh, label: 'HIGH PRIORITY' },
  medium: { bg: colors.priorityMedium, label: 'MEDIUM PRIORITY' },
  low: { bg: '#2196F3', label: 'LOW PRIORITY' },
};

const STATUS_CONFIG = {
  inProgress: { label: 'In Progress', color: colors.primary, icon: 'radio-button-checked' },
  pending: { label: 'Pending', color: colors.priorityMedium, icon: 'radio-button-unchecked' },
  completed: { label: 'Completed', color: colors.success, icon: 'check-circle' },
  notStarted: { label: 'Not Started', color: colors.textSecondary, icon: 'radio-button-unchecked' },
};

function TaskCard({
  title,
  priority = 'high',
  status = 'inProgress',
  progress,
  assignedBy,
  dueDate,
  completedOn,
  onViewDetails,
  onStart,
}) {
  const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.high;
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const showProgressBar = status === 'inProgress' && progress != null;
  const showStartButton = status === 'notStarted';
  const actionLabel = status === 'completed' ? 'Review >' : 'View Details >';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
          <Text style={styles.priorityText}>{priorityStyle.label}</Text>
        </View>
        {showProgressBar && (
          <Text style={styles.progressText}>{progress}%</Text>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      <View style={styles.metaRow}>
        <Icon name="person" size={16} color={colors.textSecondary} />
        <Text style={styles.metaText}>Assigned by: {assignedBy}</Text>
      </View>

      {completedOn ? (
        <View style={styles.metaRow}>
          <Icon name="check-circle" size={16} color={colors.success} />
          <Text style={styles.metaText}>Completed on {completedOn}</Text>
        </View>
      ) : dueDate ? (
        <View style={styles.metaRow}>
          <Icon name="event" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>Due: {dueDate}</Text>
        </View>
      ) : null}

      {showProgressBar && (
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.statusRow}>
          <Icon name={statusConfig.icon} size={16} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
        {showStartButton ? (
          <Pressable onPress={onStart} style={styles.startButton}>
            <Text style={styles.startButtonText}>Start</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onViewDetails} hitSlop={8}>
            <Text style={styles.detailsLink}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  progressBarWrap: {
    height: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 3,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background,
  },
});

export default TaskCard;
