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
import { colors, spacing, borderRadius } from '../../theme/theme';

const STATUS_OPTIONS = [
  { label: 'Open', value: 'open', color: colors.textSecondary },
  { label: 'In Progress', value: 'in_progress', color: colors.primary },
  { label: 'Closed', value: 'closed', color: colors.success },
];

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

function getStatusColor(statusValue) {
  const opt = STATUS_OPTIONS.find((o) => o.value === statusValue);
  return opt?.color ?? colors.textSecondary;
}

function getPriorityColor(priority) {
  const p = String(priority || '').toLowerCase();
  if (p === 'high') return colors.priorityHigh;
  if (p === 'medium') return colors.priorityMedium;
  return colors.primary;
}

function TaskDetailsModal({ visible, onClose, task, loading, error, statusUpdating, onUpdateStatus }) {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

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
  const statusColor = getStatusColor(statusValue);
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
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <View style={styles.headerAccent} />
          <View style={styles.header}>
            <Text style={styles.title}>Task Details</Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
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
              <View style={styles.errorCard}>
                <Icon name="error-outline" size={32} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </View>
          ) : raw ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scroll}
              contentContainerStyle={styles.body}
            >
              <View style={styles.hero}>
                <Text style={styles.taskTitle} numberOfLines={3}>{taskTitle}</Text>
                <View style={styles.priorityBadgeWrap}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
                    <Text style={styles.priorityBadgeText}>{priority}</Text>
                  </View>
                </View>
              </View>

              {taskDescription ? (
                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionLabel}>Description</Text>
                  <Text style={styles.descriptionText}>{taskDescription}</Text>
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Update status</Text>
                <View style={styles.statusControlWrap}>
                  <Pressable
                    style={[
                      styles.statusSelect,
                      statusUpdating && styles.statusSelectDisabled,
                      { borderColor: statusColor },
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
                    <View style={styles.statusDropdown}>
                      {STATUS_OPTIONS.map((opt) => (
                        <Pressable
                          key={opt.value}
                          style={[styles.statusOption, opt.value === statusValue && styles.statusOptionActive]}
                          onPress={() => handleSelectStatus(opt)}
                        >
                          <View style={[styles.statusOptionDot, { backgroundColor: opt.color }]} />
                          <Text style={[styles.statusOptionText, opt.value === statusValue && styles.statusOptionTextActive]}>
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

              <View style={styles.detailsCard}>
                <Text style={styles.detailsCardTitle}>Details</Text>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconWrap}>
                    <Icon name="person" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Assignment</Text>
                    <Text style={styles.detailValue}>{assignee}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconWrap}>
                    <Icon name="business" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Project</Text>
                    <Text style={styles.detailValue}>
                      {projectName}
                      {projectClient ? ` · ${projectClient}` : ''}
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailRow, styles.detailRowLast]}>
                  <View style={styles.detailIconWrap}>
                    <Icon name="event" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Due date</Text>
                    <Text style={styles.detailValue}>{dueDate}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No task data</Text>
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.primary,
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
    color: colors.text,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnPressed: {
    backgroundColor: colors.border,
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
    color: colors.textSecondary,
  },
  errorCard: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 14,
  },
  hero: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
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
    color: colors.background,
    textTransform: 'capitalize',
  },
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  statusOptionActive: {
    backgroundColor: colors.primaryLight,
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
    color: colors.text,
  },
  statusOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
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
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});

export default TaskDetailsModal;
