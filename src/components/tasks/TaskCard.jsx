import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PRIORITY_STYLES = {
  high: { bg: colors.priorityHigh, label: 'High' },
  medium: { bg: colors.priorityMedium, label: 'Medium' },
  low: { bg: '#2196F3', label: 'Low' },
};

// API status: open, in_progress, closed
const STATUS_CONFIG = {
  open: { label: 'Open', color: colors.textSecondary, icon: 'radio-button-unchecked' },
  in_progress: { label: 'In Progress', color: colors.primary, icon: 'radio-button-checked' },
  closed: { label: 'Closed', color: colors.success, icon: 'check-circle' },
  pending: { label: 'Pending', color: colors.priorityMedium, icon: 'radio-button-unchecked' },
  completed: { label: 'Completed', color: colors.success, icon: 'check-circle' },
};

function normalizeStatus(status) {
  if (!status) return 'open';
  const s = String(status).toLowerCase().replace(/-/g, '_');
  if (s === 'in_progress') return 'in_progress';
  if (s === 'closed') return 'closed';
  return 'open';
}

function TaskCard({
  title,
  description,
  priority = 'medium',
  projectName,
  status = 'open',
  created_at,
  due_date,
  onViewDetails,
  onStart,
}) {
  const priorityKey = priority ? String(priority).toLowerCase() : 'medium';
  const priorityStyle = PRIORITY_STYLES[priorityKey] || PRIORITY_STYLES.medium;
  const statusKey = normalizeStatus(status);
  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.open;
  const createdFormatted = formatDate(created_at);
  const dueFormatted = formatDate(due_date);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onViewDetails}
      hitSlop={0}
    >
      <View style={styles.topRow}>
        <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
          <Text style={styles.priorityText}>{priorityStyle.label}</Text>
        </View>
        <Text style={[styles.statusText, { color: statusConfig.color }]}>
          {statusConfig.label}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{title || 'Untitled task'}</Text>

      {description ? (
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      ) : null}

      {projectName ? (
        <View style={styles.metaRow}>
          <Icon name="business" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>{projectName}</Text>
        </View>
      ) : null}

      <View style={styles.metaRow}>
        <Icon name="event" size={16} color={colors.textSecondary} />
        <Text style={styles.metaText}>Created: {createdFormatted}</Text>
      </View>

      {due_date ? (
        <View style={styles.metaRow}>
          <Icon name="event" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>Due: {dueFormatted}</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.detailsLink}>View Details</Text>
      </View>
    </Pressable>
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
  cardPressed: {
    opacity: 0.85,
    backgroundColor: colors.backgroundInput,
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
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
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
