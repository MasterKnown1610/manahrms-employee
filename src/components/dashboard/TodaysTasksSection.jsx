import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../Loader/Loader';
import TaskItem from './TaskItem';
import Icon from '../Icon/Icon';

function TodaysTasksSection({
  tasks = [],
  loading = false,
  onViewAll,
  onTaskPress,
  onTaskCheck,
  sectionTitle = "Recent Tasks",
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.titleDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{sectionTitle}</Text>
        </View>
        {!loading && tasks.length > 0 && (
          <Pressable onPress={onViewAll} hitSlop={8} style={[styles.viewAllBtn, { borderColor: colors.primary + '40', backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            <Icon name="arrow-forward" size={13} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <Loader size="small" />
        </View>
      ) : tasks.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
          <Icon name="assignment" size={32} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No tasks for now</Text>
        </View>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            priority={task.priority ?? 'medium'}
            completed={task.status === 'closed'}
            status={task.status}
            onPress={() => onTaskPress?.(task)}
            onCheckPress={() => onTaskCheck?.(task)}
            showCheckbox={false}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleDot: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loaderWrap: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default TodaysTasksSection;
