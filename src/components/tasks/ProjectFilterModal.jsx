import React, { useContext, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import { spacing } from '../../theme/theme';
import Context from '../../context/Context';
import { useTheme } from '../../context/ThemeContext';

function getProjectList(projectsQuery) {
  if (!projectsQuery) return [];
  if (Array.isArray(projectsQuery)) return projectsQuery;
  return (
    projectsQuery?.data ??
    projectsQuery?.projects ??
    projectsQuery?.items ??
    []
  );
}

function ProjectFilterModal({ visible, onClose, onSelectProject }) {
  const { colors } = useTheme();
  const {
    projects: {
      queryProjects,
      projectsQuery,
      loading: projectsLoading,
      error: projectsError,
    } = {},
  } = useContext(Context);

  const projectList = useMemo(() => getProjectList(projectsQuery), [projectsQuery]);

  useEffect(() => {
    if (visible && typeof queryProjects === 'function') {
      queryProjects();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.modalSheet, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Filter by project
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Icon name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
          {projectsLoading && (
            <View style={styles.modalLoading}>
              <Loader size="small" />
            </View>
          )}
          {!projectsLoading && projectList.length === 0 && !projectsError && (
            <Text style={[styles.modalEmptyText, { color: colors.textSecondary }]}>
              No projects found.
            </Text>
          )}
          {projectsError && (
            <Text style={[styles.modalEmptyText, { color: colors.error }]}>
              {projectsError}
            </Text>
          )}
          <ScrollView
            style={styles.modalList}
            contentContainerStyle={styles.modalListContent}
            showsVerticalScrollIndicator={false}
          >
            {projectList.map((project) => {
              const id = project?.id ?? project?.project_id;
              const name = project?.name ?? '—';
              if (!id && !name) return null;
              return (
                <Pressable
                  key={id ?? name}
                  style={styles.modalProjectItem}
                  onPress={() => onSelectProject?.(project)}
                >
                  <Icon name="folder" size={20} color={colors.textSecondary} />
                  <Text
                    style={[styles.modalProjectName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalSheet: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalList: {
    maxHeight: 320,
  },
  modalListContent: {
    paddingBottom: spacing.md,
  },
  modalProjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  modalProjectName: {
    flex: 1,
    fontSize: 14,
    minWidth: 0,
  },
  modalEmptyText: {
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  modalLoading: {
    marginBottom: spacing.sm,
  },
});

export default ProjectFilterModal;
