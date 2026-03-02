import React, { useState, useMemo, useContext, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Loader } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  TasksHeader,
  SearchFilterBar,
  TaskFilterTabs,
  TaskCard,
  TaskDetailsModal,
  TasksFAB,
} from '../../components/tasks';
import { colors, spacing } from '../../theme/theme';
import Context from '../../context/Context';

function TasksScreen({ navigation }) {
  const {
    task: {
      getTasks,
      getTaskById,
      updateTaskStatus,
      clearTaskDetail,
      tasks,
      loading,
      error,
      taskDetail,
      detailLoading,
      detailError,
      statusUpdating,
    } = {},
  } = useContext(Context);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [detailsTaskId, setDetailsTaskId] = useState(null);



  const tabToApiStatus = {
    pending: 'open',
    inProgress: 'in_progress',
    completed: 'closed',
  };

  const fetchTasksForTab = useCallback(
    (tab) => {
      if (typeof getTasks === 'function') {
        const status = tabToApiStatus[tab];
        getTasks(1, 20, status);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      fetchTasksForTab(activeTab);
    }, [activeTab, fetchTasksForTab])
  );

  const handleTabPress = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const taskList = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = useMemo(() => {
    let list = [...taskList];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const assignee = (t) => t.assigned_to_employee?.full_name ?? t.assignedBy ?? '';
      const projectName = (t) => t.project?.name ?? '';
      list = list.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          assignee(t).toLowerCase().includes(q) ||
          projectName(t).toLowerCase().includes(q)
      );
    }
    return list;
  }, [taskList, searchQuery]);

  const handleBack = () => navigation.goBack();
  const handleNotification = () => {};
  const handleFilter = () => {};
  const handleViewDetails = (task) => {
    if (task?.id) {
      setDetailsTaskId(task.id);
      if (typeof getTaskById === 'function') {
        getTaskById(task.id);
      }
    }
  };
  const handleCloseDetails = () => {
    setDetailsTaskId(null);
    if (typeof clearTaskDetail === 'function') {
      clearTaskDetail();
    }
  };
  const handleUpdateStatus = useCallback(
    async (taskId, status) => {
      if (typeof updateTaskStatus !== 'function') return;
      const result = await updateTaskStatus(taskId, status);
      if (result?.success && typeof getTasks === 'function') {
        const statusParam = tabToApiStatus[activeTab];
        getTasks(1, 20, statusParam);
      }
    },
    [updateTaskStatus, getTasks, activeTab]
  );
  const handleStart = (task) => {};
  const handleAddTask = () => {};

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top']} />
      <TasksHeader onBackPress={handleBack} onNotificationPress={handleNotification} />

      <View style={styles.fixedTop}>
        <SearchFilterBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={handleFilter}
        />
        <TaskFilterTabs activeTab={activeTab} onTabPress={handleTabPress} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={styles.centered}>
            <Loader size="large" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                projectName={task.project?.name}
                status={task.status}
                created_at={task.created_at}
                due_date={task.due_date}
                onViewDetails={() => handleViewDetails(task)}
                onStart={() => handleStart(task)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TaskDetailsModal
        visible={detailsTaskId != null}
        onClose={handleCloseDetails}
        task={taskDetail}
        loading={detailLoading}
        error={detailError}
        statusUpdating={statusUpdating}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
  },
  fixedTop: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    // backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 80,
  },
  list: {
    marginBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  errorText: {
    color: colors.error ?? '#c00',
    textAlign: 'center',
  },
});

export default TasksScreen;
