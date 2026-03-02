import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PRIORITY_BG = {
  high: 'priorityHigh',
  medium: 'priorityMedium',
  low: '#2196F3',
};

function getStatusConfig(colors) {
  return {
    open: { label: 'Open', color: colors.textSecondary, icon: 'radio-button-unchecked' },
    in_progress: { label: 'In Progress', color: colors.primary, icon: 'radio-button-checked' },
    closed: { label: 'Closed', color: colors.success, icon: 'check-circle' },
    pending: { label: 'Pending', color: colors.priorityMedium, icon: 'radio-button-unchecked' },
    completed: { label: 'Completed', color: colors.success, icon: 'check-circle' },
  };
}

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
  const { colors } = useTheme();
  const priorityKey = priority ? String(priority).toLowerCase() : 'medium';
  const priorityBg = typeof PRIORITY_BG[priorityKey] === 'string' && PRIORITY_BG[priorityKey].startsWith('#')
    ? PRIORITY_BG[priorityKey]
    : colors[PRIORITY_BG[priorityKey]] ?? colors.priorityMedium;
  const priorityLabels = { high: 'High', medium: 'Medium', low: 'Low' };
  const statusConfigMap = getStatusConfig(colors);
  const statusKey = normalizeStatus(status);
  const statusConfig = statusConfigMap[statusKey] || statusConfigMap.open;
  const createdFormatted = formatDate(created_at);
  const dueFormatted = formatDate(due_date);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
        pressed && { opacity: 0.85, backgroundColor: colors.backgroundInput },
      ]}
      onPress={onViewDetails}
      hitSlop={0}
    >
      <View style={styles.topRow}>
        <View style={[styles.priorityBadge, { backgroundColor: priorityBg }]}>
          <Text style={[styles.priorityText, { color: colors.background }]}>{priorityLabels[priorityKey] || 'Medium'}</Text>
        </View>
        <Text style={[styles.statusText, { color: statusConfig.color }]}>
          {statusConfig.label}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title || 'Untitled task'}</Text>

      {description ? (
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{description}</Text>
      ) : null}

      {projectName ? (
        <View style={styles.metaRow}>
          <Icon name="business" size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{projectName}</Text>
        </View>
      ) : null}

      <View style={styles.metaRow}>
        <Icon name="event" size={16} color={colors.textSecondary} />
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>Created: {createdFormatted}</Text>
      </View>

      {due_date ? (
        <View style={styles.metaRow}>
          <Icon name="event" size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>Due: {dueFormatted}</Text>
        </View>
      ) : null}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.detailsLink, { color: colors.primary }]}>View Details</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
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
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
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
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TaskCard;
