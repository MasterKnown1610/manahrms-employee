import React, { useContext, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import { Loader } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../../components/Icon/Icon';
import { spacing } from '../../theme/theme';
import Context from '../../context/Context';
import { useTheme } from '../../context/ThemeContext';

function ProjectsHeader({ onBackPress, onNotificationPress }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <Pressable onPress={onBackPress} style={styles.iconButton} hitSlop={8}>
        <Icon name="arrow-back" size={24} color={colors.background} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.background }]}>Projects</Text>
      <Pressable onPress={onNotificationPress} style={styles.iconButton} hitSlop={8}>
        <Icon name="notifications" size={24} color={colors.background} />
      </Pressable>
    </View>
  );
}

function getProjectsList(projectsQuery) {
  if (!projectsQuery) return [];
  if (Array.isArray(projectsQuery)) return projectsQuery;
  return (
    projectsQuery?.data ??
    projectsQuery?.projects ??
    projectsQuery?.items ??
    []
  );
}

function getPagination(projectsQuery) {
  if (!projectsQuery || Array.isArray(projectsQuery)) return null;
  return projectsQuery?.pagination ?? null;
}

function formatTargetDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ProjectCard({ project, onPress }) {
  const { colors } = useTheme();
  const name = project?.name ?? '—';
  const client = project?.client ?? '—';
  const number_of_days = project?.number_of_days ?? 0;
  const target_date = formatTargetDate(project?.target_date);
  const is_active = project?.is_active === true;

  const cardContent = (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderLeftColor: colors.primary }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconWrap, { backgroundColor: colors.primaryLight }]}>
          <Icon name="folder" size={24} color={colors.primary} />
        </View>
        <View style={styles.cardTitleWrap}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{name}</Text>
          <View style={[styles.statusBadge, is_active ? { backgroundColor: colors.success } : { backgroundColor: colors.textSecondary }]}>
            <Text style={[styles.statusText, { color: colors.background }]}>
              {is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
      <View style={styles.cardRow}>
        <Icon name="business" size={16} color={colors.textSecondary} />
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Client</Text>
        <Text style={[styles.cardValue, { color: colors.text }]} numberOfLines={1}>{client}</Text>
      </View>
      <View style={styles.cardRow}>
        <Icon name="schedule" size={16} color={colors.textSecondary} />
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Duration</Text>
        <Text style={[styles.cardValue, { color: colors.text }]}>{number_of_days} days</Text>
      </View>
      <View style={styles.cardRow}>
        <Icon name="event" size={16} color={colors.textSecondary} />
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Target</Text>
        <Text style={[styles.cardValue, { color: colors.text }]}>{target_date}</Text>
      </View>
    </View>
  );

  if (typeof onPress === 'function') {
    return <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.cardPressed]}>{cardContent}</Pressable>;
  }
  return cardContent;
}

function ProjectsScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { projects: projectsContext } = useContext(Context);
  const {
    queryProjects,
    projectsQuery,
    loading,
    error,
  } = projectsContext ?? {};
  const selectForTaskFilter = route?.params?.selectForTaskFilter === true;

  const fetchProjects = useCallback(() => {
    if (typeof queryProjects === 'function') {
      queryProjects();
    }
  }, [queryProjects]);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects])
  );

  const handleBack = () => navigation.goBack();
  const handleNotification = () => {};
  const projectsList = getProjectsList(projectsQuery);
  const pagination = getPagination(projectsQuery);

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.primary }]} edges={['top']} />
      <ProjectsHeader onBackPress={handleBack} onNotificationPress={handleNotification} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && projectsList.length > 0}
            onRefresh={fetchProjects}
            colors={[colors.primary]}
          />
        }
      >
        {loading && !projectsList.length ? (
          <View style={styles.centered}>
            <Loader size="large" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : projectsList.length === 0 ? (
          <View style={styles.centered}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No projects found.</Text>
          </View>
        ) : (
          <>
            {pagination?.total_items != null && (
              <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                {pagination.total_items} project{pagination.total_items !== 1 ? 's' : ''}
              </Text>
            )}
            <View style={styles.list}>
              {projectsList.map((project) => (
                <ProjectCard
                  key={project?.id ?? project?.name}
                  project={project}
                  onPress={() => {
                    const projectId = project?.id ?? project?.project_id;
                    const projectName = project?.name ?? '—';
                    if (selectForTaskFilter) {
                      navigation.replace('Tasks', { projectId, projectName });
                    } else {
                      navigation.navigate('Tasks', { projectId, projectName });
                    }
                  }}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  centered: {
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  resultCount: {
    fontSize: 13,
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  list: {
    gap: spacing.md,
  },
  cardPressed: {
    opacity: 0.85,
  },
  card: {
    borderRadius: 14,
    padding: spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardLabel: {
    fontSize: 13,
    marginLeft: spacing.sm,
    width: 64,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});

export default ProjectsScreen;
