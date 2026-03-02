import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../Loader/Loader';
import TaskItem from './TaskItem';

function TodaysTasksSection({
  tasks = [],
  loading = false,
  onViewAll,
  onTaskPress,
  onTaskCheck,
  sectionTitle = "Today's Tasks",
}) {
  const { colors } = useTheme();
  const mappedTasks = tasks.map((task) => ({
    ...task,
    completed: task.status === 'closed',
  }));

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{sectionTitle}</Text>
        {!loading && (
          <Pressable onPress={onViewAll} hitSlop={8}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
          </Pressable>
        )}
      </View>
      {loading ? (
        <View style={styles.loaderWrap}>
          <Loader size="small" />
        </View>
      ) : (
        mappedTasks.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            priority={task.priority ?? 'medium'}
            completed={task.completed}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  loaderWrap: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TodaysTasksSection;
