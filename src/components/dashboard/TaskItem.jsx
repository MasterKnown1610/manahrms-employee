import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const PRIORITY = {
  high:   { label: 'High',   color: '#E53935', bg: '#FFEBEE' },
  medium: { label: 'Medium', color: '#FB8C00', bg: '#FFF3E0' },
  low:    { label: 'Low',    color: '#43A047', bg: '#E8F5E9' },
};

const STATUS = {
  open:        { label: 'Open',        bg: '#ECEFF1', color: '#546E7A' },
  in_progress: { label: 'In Progress', bg: '#E3F2FD', color: '#1565C0' },
  closed:      { label: 'Closed',      bg: '#E8F5E9', color: '#2E7D32' },
  completed:   { label: 'Done',        bg: '#E8F5E9', color: '#2E7D32' },
  pending:     { label: 'Pending',     bg: '#FFF8E1', color: '#F57F17' },
};

function getStatus(status, completed) {
  if (completed) return STATUS.closed;
  const s = String(status || 'open').toLowerCase().replace(/[-\s]/g, '_');
  return STATUS[s] || { label: String(status), bg: '#ECEFF1', color: '#546E7A' };
}

function getPriority(priority) {
  return PRIORITY[String(priority || 'medium').toLowerCase()] || PRIORITY.medium;
}

function TaskItem({ title, priority = 'medium', completed = false, status, onPress }) {
  const { colors } = useTheme();
  const p = getPriority(priority);
  const s = getStatus(status, completed);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.background, borderColor: colors.border },
        pressed && { opacity: 0.88 },
      ]}
    >
      {/* Priority accent left strip */}
      <View style={[styles.strip, { backgroundColor: p.color }]} />

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>
        <View style={styles.chips}>
          <View style={[styles.chip, { backgroundColor: p.bg }]}>
            <Text style={[styles.chipText, { color: p.color }]}>{p.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <View style={[styles.statusChip, { backgroundColor: s.bg }]}>
          <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.border} style={{ marginTop: 4 }} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    minHeight: 72,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  strip: {
    width: 4,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 5,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  right: {
    alignItems: 'center',
    paddingRight: spacing.sm,
    gap: 2,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default TaskItem;
