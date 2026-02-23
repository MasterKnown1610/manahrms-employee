import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import TaskItem from './TaskItem';

const DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Submit Monthly Expense Report',
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    title: 'Update CRM Client Contacts',
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    title: 'Draft Q4 Strategic Roadmap',
    priority: 'completed',
    completed: true,
  },
];

function TodaysTasksSection({
  tasks = DEFAULT_TASKS,
  onViewAll,
  onTaskPress,
  onTaskCheck,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          title={task.title}
          priority={task.priority}
          completed={task.completed}
          onPress={() => onTaskPress?.(task)}
          onCheckPress={() => onTaskCheck?.(task)}
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
