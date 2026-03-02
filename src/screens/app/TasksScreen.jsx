import React, { useState, useMemo, useContext, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { Loader } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  TasksHeader,
  SearchFilterBar,
  TaskFilterTabs,
  TaskCard,
  TaskDetailsModal,
  ProjectFilterModal,
  TasksFAB,
} from '../../components/tasks';
import Icon from '../../components/Icon/Icon';
import { spacing } from '../../theme/theme';
import Context from '../../context/Context';
import { useTheme } from '../../context/ThemeContext';

function TasksScreen({ navigation, route }) {
  const { colors } = useTheme();
  const projectId = route?.params?.projectId;
  const projectName = route?.params?.projectName ?? '';

  const {
    task: {
      getTasks,
      getTasksByQuery,
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
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);

  const tabToApiStatus = {
    pending: 'open',
    inProgress: 'in_progress',
    completed: 'closed',
  };

  const fetchTasksForTab = useCallback(
    (tab) => {
      const status = tabToApiStatus[tab];
      if (projectId != null && projectId !== '') {
        if (typeof getTasksByQuery === 'function') {
          const filter = [
            { field: 'project_id', operator: 'eq', value: Number(projectId) || projectId },
          ];
          if (status) {
            filter.push({ field: 'status', operator: 'eq', value: status });
          }
          getTasksByQuery({
            filter,
            page: 1,
            page_size: 20,
            sort: [{ field: 'created_at', order: 'desc' }],
          });
        }
      } else {
        if (typeof getTasks === 'function') {
          getTasks(1, 20, status);
        }
      }
    },
    [projectId, getTasks, getTasksByQuery]
  );

  useFocusEffect(
    useCallback(() => {
      fetchTasksForTab(activeTab);
    }, [activeTab])
  );

  const clearProjectFilter = useCallback(() => {
    navigation.setParams({ projectId: undefined, projectName: undefined });
    if (typeof getTasks === 'function') {
      const status = tabToApiStatus[activeTab];
      getTasks(1, 20, status);
    }
  }, [navigation, activeTab, getTasks]);

  const handleFilter = useCallback(() => {
    setIsProjectModalVisible(true);
  }, []);

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
  const handleSelectProject = useCallback(
    (project) => {
      if (!project) return;
      const id = project?.id ?? project?.project_id;
      const name = project?.name ?? '';
      if (!id) return;

      // update params so the chip reflects the selected project
      navigation.setParams({ projectId: id, projectName: name });

      // fetch tasks immediately for the chosen project
      if (typeof getTasksByQuery === 'function') {
        const status = tabToApiStatus[activeTab];
        const filter = [
          { field: 'project_id', operator: 'eq', value: Number(id) || id },
        ];
        if (status) {
          filter.push({ field: 'status', operator: 'eq', value: status });
        }
        getTasksByQuery({
          filter,
          page: 1,
          page_size: 20,
          sort: [{ field: 'created_at', order: 'desc' }],
        });
      }

      setIsProjectModalVisible(false);
    },
    [navigation, activeTab]
  );
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
      if (result?.success) {
        fetchTasksForTab(activeTab);
      }
    },
    [updateTaskStatus, activeTab, fetchTasksForTab]
  );
  const handleStart = (task) => {};
  const handleAddTask = () => {};

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.primary }]} edges={['top']} />
      <TasksHeader onBackPress={handleBack} onNotificationPress={handleNotification} />

      <View style={styles.fixedTop}>
        <SearchFilterBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={handleFilter}
          isoptionalFilter={true}
        />
        <View style={styles.projectFilterRow}>
          {projectId != null && projectId !== '' && (
            <Pressable
              onPress={clearProjectFilter}
              style={[styles.projectChip, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
            >
              <Text style={[styles.projectChipText, { color: colors.primary }]} numberOfLines={1}>
                Project: {projectName || `#${projectId}`}
              </Text>
              <Icon name="close" size={18} color={colors.primary} style={styles.chipClose} />
            </Pressable>
          )}
        </View>
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
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
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

      <ProjectFilterModal
        visible={isProjectModalVisible}
        onClose={() => setIsProjectModalVisible(false)}
        onSelectProject={handleSelectProject}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {},
  fixedTop: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  projectFilterRow: {
    marginBottom: spacing.md,
  },
  projectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: '100%',
    flexShrink: 1,
  },
  projectChipText: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    maxWidth: 200,
  },
  chipClose: {
    marginLeft: spacing.xs,
  },
  projectFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    gap: spacing.sm,
  },
  projectFilterButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
    textAlign: 'center',
  },
});

export default TasksScreen;
