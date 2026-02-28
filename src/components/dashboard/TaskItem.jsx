import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

const PRIORITY_CONFIG = {
  high: { label: 'HIGH PRIORITY', color: '#D32F2F' },      // red – high priority
  medium: { label: 'MEDIUM', color: '#F57C00' },           // orange – medium
  low: { label: 'LOW', color: '#689F38' },                 // green – low
  completed: { label: 'COMPLETED', color: '#388E3C' },
};

// Status badge colors: Open (grey), In Progress (blue), Closed (green)
const STATUS_BADGE = {
  open: { label: 'Open', bg: '#757575', textColor: '#fff' },             // grey – not started
  in_progress: { label: 'In Progress', bg: '#1976D2', textColor: '#fff' }, // blue – active
  closed: { label: 'Closed', bg: '#2E7D32', textColor: '#fff' },          // green – done
  completed: { label: 'Completed', bg: '#2E7D32', textColor: '#fff' },   // same as closed
  pending: { label: 'Pending', bg: '#ED6C02', textColor: '#fff' },        // orange
  not_started: { label: 'Not Started', bg: '#757575', textColor: '#fff' },
};

function getStatusBadge(status, completed) {
  if (completed) return STATUS_BADGE.closed;
  if (!status) return STATUS_BADGE.open;
  const s = String(status).toLowerCase().replace(/-/g, '_').replace(/\s/g, '_');
  return STATUS_BADGE[s] || { label: String(status), bg: '#757575', textColor: '#fff' };
}

function TaskItem({
  title,
  priority = 'medium',
  completed = false,
  status,
  onPress,
  onCheckPress,
  showCheckbox = true,
}) {
  const priorityConfig = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const isClosed = completed || status === 'closed' || priority === 'completed';
  const statusBadge = getStatusBadge(status, isClosed);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {showCheckbox && (
        <Pressable
          onPress={(e) => {
            e?.stopPropagation?.();
            onCheckPress?.();
          }}
          style={[styles.checkbox, isClosed && styles.checkboxChecked]}
          hitSlop={8}
        >
          {isClosed ? (
            <Icon name="check" size={16} color={colors.background} />
          ) : null}
        </Pressable>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.tag}>
          <Text style={[styles.tagText, { color: priorityConfig.color }]}>
            {priorityConfig.label}
          </Text>
        </View>
      </View>
      <View style={styles.rightRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
          <Text style={[styles.statusBadgeText, { color: statusBadge.textColor }]}>
            {statusBadge.label}
          </Text>
        </View>
        <Icon name="chevron-right" size={22} color={colors.placeholder} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default TaskItem;
