import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function getStatusOptions(colors) {
  return [
    { label: 'Open', value: 'open', color: colors.textSecondary },
    { label: 'In Progress', value: 'in_progress', color: colors.primary },
    { label: 'Closed', value: 'closed', color: colors.success },
  ];
}

function formatDueDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatStatus(status) {
  if (!status) return '—';
  const s = String(status).toLowerCase().replace(/-/g, '_');
  if (s === 'open') return 'Open';
  if (s === 'in_progress') return 'In Progress';
  if (s === 'closed') return 'Closed';
  return status;
}

function getStatusValue(status) {
  if (!status) return 'open';
  const s = String(status).toLowerCase().replace(/-/g, '_');
  if (s === 'in_progress') return 'in_progress';
  if (s === 'closed') return 'closed';
  return 'open';
}

function getStatusColor(statusValue, colors) {
  const opts = getStatusOptions(colors);
  const opt = opts.find((o) => o.value === statusValue);
  return opt?.color ?? colors.textSecondary;
}

function getPriorityColor(priority, colors) {
  const p = String(priority || '').toLowerCase();
  if (p === 'high') return colors.priorityHigh;
  if (p === 'medium') return colors.priorityMedium;
  return colors.primary;
}

function TaskDetailsModal({ visible, onClose, task, loading, error, statusUpdating, onUpdateStatus }) {
  const { colors } = useTheme();
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusOptions = getStatusOptions(colors);

  useEffect(() => {
    if (!visible) setStatusDropdownOpen(false);
  }, [visible]);

  if (!visible) return null;

  // Support both raw task and API wrapper { data: task }
  const raw =
    task && typeof task === 'object'
      ? (task.data && typeof task.data === 'object' ? task.data : task)
      : null;

  const assignee = raw?.assigned_to_employee?.full_name ?? raw?.assignedBy ?? '—';
  const projectName = raw?.project?.name ?? raw?.projectName ?? '—';
  const projectClient = raw?.project?.client;
  const priority = raw?.priority != null ? String(raw.priority) : '—';
  const statusLabel = formatStatus(raw?.status);
  const statusValue = getStatusValue(raw?.status);
  const statusColor = getStatusColor(statusValue, colors);
  const dueDate = formatDueDate(raw?.due_date ?? raw?.dueDate);
  const taskTitle = raw?.title ?? 'Untitled task';
  const taskDescription = raw?.description ?? '';
  const taskId = raw?.id;

  const handleSelectStatus = (option) => {
    setStatusDropdownOpen(false);
    if (option.value !== statusValue && taskId && typeof onUpdateStatus === 'function') {
      onUpdateStatus(taskId, option.value);
    }
  };


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.dialog, { backgroundColor: colors.background }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.headerAccent, { backgroundColor: colors.primary }]} />
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Task Details</Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => [styles.closeBtn, { backgroundColor: colors.backgroundInput }, pressed && { backgroundColor: colors.border }]}
            >
              <Icon name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.contentWrap}>
          {loading ? (
            <View style={styles.centered}>
              <Loader size="large" />
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <View style={[styles.errorCard, { backgroundColor: colors.backgroundInput }]}>
                <Icon name="error-outline" size={32} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            </View>
          ) : raw ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scroll}
              contentContainerStyle={styles.body}
            >
              <View style={[styles.hero, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.taskTitle, { color: colors.text }]} numberOfLines={3}>{taskTitle}</Text>
                <View style={styles.priorityBadgeWrap}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority, colors) }]}>
                    <Text style={[styles.priorityBadgeText, { color: colors.background }]}>{priority}</Text>
                  </View>
                </View>
              </View>

              {taskDescription ? (
<View style={styles.descriptionSection}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Description</Text>
                  <Text style={[styles.descriptionText, { color: colors.text }]}>{taskDescription}</Text>
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Update status</Text>
                <View style={styles.statusControlWrap}>
                  <Pressable
                    style={[
                      styles.statusSelect,
                      { backgroundColor: colors.cardBackground, borderColor: statusColor },
                      statusUpdating && styles.statusSelectDisabled,
                    ]}
                    onPress={() => !statusUpdating && setStatusDropdownOpen((v) => !v)}
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? (
                      <Loader size="small" />
                    ) : (
                      <>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusSelectText, { color: statusColor }]}>{statusLabel}</Text>
                        <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
                      </>
                    )}
                  </Pressable>
                  {statusDropdownOpen && (
                    <View style={[styles.statusDropdown, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                      {statusOptions.map((opt) => (
                        <Pressable
                          key={opt.value}
                          style={[styles.statusOption, opt.value === statusValue && { backgroundColor: colors.primaryLight }]}
                          onPress={() => handleSelectStatus(opt)}
                        >
                          <View style={[styles.statusOptionDot, { backgroundColor: opt.color }]} />
                          <Text style={[styles.statusOptionText, { color: colors.text }, opt.value === statusValue && { color: colors.primary, fontWeight: '700' }]}>
                            {opt.label}
                          </Text>
                          {opt.value === statusValue && (
                            <Icon name="check" size={20} color={colors.primary} />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={[styles.detailsCard, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
                <Text style={[styles.detailsCardTitle, { color: colors.textSecondary }]}>Details</Text>

                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconWrap, { backgroundColor: colors.background }]}>
                    <Icon name="person" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Assignment</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{assignee}</Text>
                  </View>
                </View>

                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconWrap, { backgroundColor: colors.background }]}>
                    <Icon name="business" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Project</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {projectName}
                      {projectClient ? ` · ${projectClient}` : ''}
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailRow, styles.detailRowLast, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconWrap, { backgroundColor: colors.background }]}>
                    <Icon name="event" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Due date</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{dueDate}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No task data</Text>
            </View>
          )}
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    height: '88%',
    maxHeight: '88%',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  headerAccent: {
    height: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrap: {
    flex: 1,
    minHeight: 200,
  },
  scroll: {
    flex: 1,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  errorCard: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
  },
  errorText: {
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 14,
  },
  hero: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  priorityBadgeWrap: {
    flexDirection: 'row',
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: spacing.sm,
  },
  statusControlWrap: {
    position: 'relative',
    zIndex: 10,
  },
  statusSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  statusSelectDisabled: {
    opacity: 0.7,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  statusSelectText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  statusDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  statusOptionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusOptionText: {
    flex: 1,
    fontSize: 15,
  },
  detailsCard: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
  },
  detailsCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default TaskDetailsModal;
