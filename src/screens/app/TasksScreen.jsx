import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TasksHeader,
  SearchFilterBar,
  TaskFilterTabs,
  TaskCard,
  TasksFAB,
} from '../../components/tasks';
import { colors, spacing } from '../../theme/theme';

const MOCK_TASKS = [
  {
    id: '1',
    title: 'Draft Q4 Strategic Roadmap',
    priority: 'high',
    status: 'inProgress',
    progress: 80,
    assignedBy: 'Sarah Jenkins',
    dueDate: 'Oct 28, 2023',
  },
  {
    id: '2',
    title: 'Update CRM Client Contacts',
    priority: 'medium',
    status: 'pending',
    assignedBy: 'Marcus Thorne',
    dueDate: 'Oct 25, 2023',
  },
  {
    id: '3',
    title: 'Submit Monthly Expense Report',
    priority: 'low',
    status: 'completed',
    assignedBy: 'HR Department',
    completedOn: 'Oct 20',
  },
  {
    id: '4',
    title: 'Employee Benefit Review 2024',
    priority: 'high',
    status: 'notStarted',
    assignedBy: 'Sarah Jenkins',
    dueDate: 'Nov 05, 2025',
  },
];

function TasksScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTasks = useMemo(() => {
    let list = [...MOCK_TASKS];
    if (activeTab === 'pending') list = list.filter((t) => t.status === 'pending');
    else if (activeTab === 'inProgress') list = list.filter((t) => t.status === 'inProgress');
    else if (activeTab === 'completed') list = list.filter((t) => t.status === 'completed');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.assignedBy.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, searchQuery]);

  const handleBack = () => navigation.goBack();
  const handleNotification = () => {};
  const handleFilter = () => {};
  const handleViewDetails = (task) => {};
  const handleStart = (task) => {};
  const handleAddTask = () => {};

  return (
          <>
    <SafeAreaView style={styles.safeArea} edges={["top"]}/>
      
          <TasksHeader onBackPress={handleBack} onNotificationPress={handleNotification} />
      
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        
        <SearchFilterBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={handleFilter}
        />
        <TaskFilterTabs activeTab={activeTab} onTabPress={setActiveTab} />

        <View style={styles.list}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              priority={task.priority}
              status={task.status}
              progress={task.progress}
              assignedBy={task.assignedBy}
              dueDate={task.dueDate}
              completedOn={task.completedOn}
              onViewDetails={() => handleViewDetails(task)}
              onStart={() => handleStart(task)}
            />
          ))}
        </View>
      </ScrollView>

      <TasksFAB onPress={handleAddTask} />
   
          </>

  );
}

const styles = StyleSheet.create({
  safeArea: { 
    backgroundColor: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 80,
  },
  headerWrap: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginHorizontal: -spacing.lg,
    marginBottom: 0,
    paddingBottom: spacing.xs,
    overflow: 'hidden',
  },
  list: {
    marginBottom: spacing.xl,
  },
});

export default TasksScreen;
