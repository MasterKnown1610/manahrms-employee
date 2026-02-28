import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import TaskItem from './TaskItem';

function TodaysTasksSection({
  tasks = [],
  onViewAll,
  onTaskPress,
  onTaskCheck,
  sectionTitle = "Today's Tasks",
}) {
  const mappedTasks = tasks.map((task) => ({
    ...task,
    completed: task.status === 'closed',
  }));

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      {mappedTasks.map((task) => (
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
      ))}
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
    color: colors.text,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default TodaysTasksSection;
