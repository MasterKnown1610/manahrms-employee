import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const PRIORITY_CFG = {
  high:   { label: 'High',   color: '#E53935', bg: '#FFEBEE' },
  medium: { label: 'Medium', color: '#FB8C00', bg: '#FFF3E0' },
  low:    { label: 'Low',    color: '#43A047', bg: '#E8F5E9' },
};

function getPriority(p) {
  return PRIORITY_CFG[String(p || 'medium').toLowerCase()] || PRIORITY_CFG.medium;
}

function getDueLabelStyle(dueLabel) {
  if (!dueLabel) return { bg: '#ECEFF1', color: '#546E7A' };
  const l = dueLabel.toLowerCase();
  if (l === 'overdue') return { bg: '#FFEBEE', color: '#C62828' };
  if (l === 'due today') return { bg: '#FFF3E0', color: '#E65100' };
  return { bg: '#E8F5E9', color: '#1B5E20' };
}

function UpcomingDeadlineCard({ title, dueDate, dueLabel, priority, assignedTo, projectOrType, onView }) {
  const { colors } = useTheme();
  const p = getPriority(priority);
  const dl = getDueLabelStyle(dueLabel);

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {/* Left accent */}
      <View style={[styles.accent, { backgroundColor: p.color }]} />

      <View style={styles.body}>
        {/* Title + due label */}
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>
          {dueLabel ? (
            <View style={[styles.dueBadge, { backgroundColor: dl.bg }]}>
              <Text style={[styles.dueBadgeText, { color: dl.color }]}>{dueLabel}</Text>
            </View>
          ) : null}
        </View>

        {/* Meta chips */}
        <View style={styles.metaRow}>
          <View style={[styles.chip, { backgroundColor: p.bg }]}>
            <Text style={[styles.chipText, { color: p.color }]}>{p.label}</Text>
          </View>
          {(assignedTo || projectOrType) ? (
            <View style={styles.assignRow}>
              <Icon name="person-outline" size={13} color={colors.textSecondary} />
              <Text style={[styles.assignText, { color: colors.textSecondary }]} numberOfLines={1}>
                {assignedTo ?? projectOrType}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Date + view button */}
        <View style={styles.bottomRow}>
          <View style={styles.dateRow}>
            <Icon name="event" size={14} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>{dueDate}</Text>
          </View>
          <Pressable
            onPress={onView}
            style={[styles.viewBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.viewBtnText}>View</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  accent: {
    width: 5,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  dueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dueBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  assignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
    minWidth: 0,
  },
  assignText: {
    fontSize: 12,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});

export default UpcomingDeadlineCard;
