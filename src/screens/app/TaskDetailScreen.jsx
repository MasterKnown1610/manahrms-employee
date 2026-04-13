import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../../components/Icon/Icon';
import Loader from '../../components/Loader/Loader';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';
import Context from '../../context/Context';

// ─── helpers ────────────────────────────────────────────────────────────────

function getStatusOptions(colors) {
  return [
    { label: 'Open', value: 'open', color: colors.textSecondary },
    { label: 'In Progress', value: 'in_progress', color: colors.primary },
    { label: 'Closed', value: 'closed', color: colors.success },
  ];
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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
  return opts.find((o) => o.value === statusValue)?.color ?? colors.textSecondary;
}

function getPriorityColor(priority, colors) {
  const p = String(priority || '').toLowerCase();
  if (p === 'high') return colors.priorityHigh;
  if (p === 'medium') return colors.priorityMedium;
  return colors.primary;
}

// ─── sub-components ─────────────────────────────────────────────────────────

function SectionHeader({ title, colors }) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
  );
}

function CommentItem({ comment, colors }) {
  const initials = (comment.user?.full_name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={[styles.commentItem, { borderColor: colors.border, backgroundColor: colors.backgroundInput }]}>
      <View style={[styles.commentAvatar, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.commentAvatarText, { color: colors.primary }]}>{initials}</Text>
      </View>
      <View style={styles.commentBody}>
        <View style={styles.commentMeta}>
          <Text style={[styles.commentAuthor, { color: colors.text }]}>
            {comment.user?.full_name ?? 'Unknown'}
          </Text>
          <Text style={[styles.commentDate, { color: colors.textSecondary }]}>
            {formatDateTime(comment.created_at)}
          </Text>
        </View>
        <Text style={[styles.commentContent, { color: colors.text }]}>{comment.content}</Text>
      </View>
    </View>
  );
}

function CommitItem({ commit, colors }) {
  return (
    <View style={[styles.commitItem, { borderColor: colors.border, backgroundColor: colors.backgroundInput }]}>
      <View style={[styles.commitIconWrap, { backgroundColor: colors.primaryLight }]}>
        <Icon name="commit" size={18} color={colors.primary} />
      </View>
      <View style={styles.commitBody}>
        <Text style={[styles.commitMessage, { color: colors.text }]} numberOfLines={2}>
          {commit.commit_message || '—'}
        </Text>
        <View style={styles.commitMeta}>
          {commit.branch ? (
            <View style={[styles.branchBadge, { backgroundColor: colors.primaryLight }]}>
              <Icon name="call-split" size={12} color={colors.primary} />
              <Text style={[styles.branchText, { color: colors.primary }]}>{commit.branch}</Text>
            </View>
          ) : null}
          <Text style={[styles.commitHash, { color: colors.textSecondary }]}>
            #{(commit.commit_hash || '').slice(0, 7)}
          </Text>
          <Text style={[styles.commitDate, { color: colors.textSecondary }]}>
            {formatDate(commit.committed_at)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Add Commit Modal ────────────────────────────────────────────────────────

function formatDateForInput(date) {
  const d = date instanceof Date ? date : new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseDateInput(str) {
  // Accept "YYYY-MM-DD HH:mm" → ISO string
  const d = new Date(str.trim().replace(' ', 'T'));
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function AddCommitModal({ visible, onClose, onSubmit, submitting, colors }) {
  const [form, setForm] = useState({
    branch: '',
    commit_hash: '',
    commit_message: '',
    author_name: '',
    commit_url: '',
    committed_at: formatDateForInput(new Date()),
  });
  const [dateError, setDateError] = useState('');

  const reset = () => {
    setForm({
      branch: '',
      commit_hash: '',
      commit_message: '',
      author_name: '',
      commit_url: '',
      committed_at: formatDateForInput(new Date()),
    });
    setDateError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!form.branch.trim() || !form.commit_hash.trim() || !form.commit_message.trim()) {
      Alert.alert('Validation', 'Branch, commit hash, and message are required.');
      return;
    }
    const isoDate = parseDateInput(form.committed_at);
    if (!isoDate) {
      setDateError('Enter date as YYYY-MM-DD HH:mm');
      return;
    }
    setDateError('');
    const payload = {
      branch: form.branch.trim(),
      commit_hash: form.commit_hash.trim(),
      commit_message: form.commit_message.trim(),
      author_name: form.author_name.trim() || null,
      commit_url: form.commit_url.trim() || null,
      committed_at: isoDate,
    };
    onSubmit(payload, reset);
  };

  const field = (label, key, placeholder, multiline = false, keyboardType = 'default') => (
    <View style={styles.formField} key={key}>
      <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.formInput,
          { color: colors.text, backgroundColor: colors.backgroundInput, borderColor: colors.border },
          multiline && styles.formInputMultiline,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={form[key]}
        onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
        multiline={multiline}
        keyboardType={keyboardType}
        editable={!submitting}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable style={[styles.modalSheet, { backgroundColor: colors.background }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.modalTitle, { color: colors.text }]}>Add Commit</Text>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {field('Branch *', 'branch', 'e.g. feature/my-branch')}
            {field('Commit Hash *', 'commit_hash', 'e.g. abc1234')}
            {field('Commit Message *', 'commit_message', 'Describe the commit...', true)}
            {field('Author Name', 'author_name', 'e.g. John Doe')}
            {field('Commit URL', 'commit_url', 'https://...')}

            {/* Committed At */}
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Committed At</Text>
              <TextInput
                style={[
                  styles.formInput,
                  { color: colors.text, backgroundColor: colors.backgroundInput, borderColor: dateError ? colors.error : colors.border },
                ]}
                placeholder="YYYY-MM-DD HH:mm"
                placeholderTextColor={colors.placeholder}
                value={form.committed_at}
                onChangeText={(v) => { setForm((f) => ({ ...f, committed_at: v })); setDateError(''); }}
                editable={!submitting}
              />
              {dateError ? (
                <Text style={[styles.fieldError, { color: colors.error }]}>{dateError}</Text>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnCancel, { borderColor: colors.border }]}
              onPress={handleClose}
              disabled={submitting}
            >
              <Text style={[styles.modalBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnSubmit, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <Loader size="small" color="#fff" />
              ) : (
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Add Commit</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

function TaskDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const taskId = route?.params?.taskId;

  const {
    task: {
      getTaskById,
      updateTaskStatus,
      createComment,
      createCommit,
      taskDetail,
      detailLoading,
      detailError,
      statusUpdating,
      commentSubmitting,
      commitSubmitting,
    } = {},
  } = useContext(Context);

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commitModalVisible, setCommitModalVisible] = useState(false);
  const scrollRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (taskId && typeof getTaskById === 'function') {
        getTaskById(taskId);
      }
    }, [taskId])
  );

  const raw = taskDetail && typeof taskDetail === 'object'
    ? (taskDetail.data && typeof taskDetail.data === 'object' ? taskDetail.data : taskDetail)
    : null;

  const assignee = raw?.assigned_to_employee?.full_name ?? '—';
  const projectName = raw?.project?.name ?? '—';
  const projectClient = raw?.project?.client;
  const priority = raw?.priority != null ? String(raw.priority) : '—';
  const statusValue = getStatusValue(raw?.status);
  const statusLabel = formatStatus(raw?.status);
  const statusColor = getStatusColor(statusValue, colors);
  const dueDate = formatDate(raw?.due_date);
  const taskTitle = raw?.title ?? 'Untitled task';
  const taskDescription = raw?.description ?? '';
  const comments = Array.isArray(raw?.comments) ? raw.comments : [];
  const commits = Array.isArray(raw?.commits) ? raw.commits : [];
  const statusOptions = getStatusOptions(colors);

  const handleSelectStatus = (option) => {
    setStatusDropdownOpen(false);
    if (option.value !== statusValue && taskId && typeof updateTaskStatus === 'function') {
      updateTaskStatus(taskId, option.value);
    }
  };

  const handleAddComment = async () => {
    const text = commentText.trim();
    if (!text || !taskId) return;
    setCommentText('');
    await createComment(taskId, text);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
  };

  const handleAddCommit = async (payload, resetForm) => {
    if (!taskId) return;
    const result = await createCommit(taskId, payload);
    if (result?.success) {
      resetForm?.();
      setCommitModalVisible(false);
    } else {
      Alert.alert('Error', result?.error ?? 'Failed to add commit');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={[styles.safeTop, { backgroundColor: colors.primary }]} edges={['top']} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>Task Details</Text>
        <View style={styles.headerRight} />
      </View>

      {detailLoading ? (
        <View style={styles.centered}>
          <Loader size="large" />
        </View>
      ) : detailError ? (
        <View style={styles.centered}>
          <Icon name="error-outline" size={40} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{detailError}</Text>
        </View>
      ) : raw ? (
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <View style={[styles.hero, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.taskTitle, { color: colors.text }]}>{taskTitle}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority, colors) }]}>
              <Text style={styles.priorityBadgeText}>{priority}</Text>
            </View>
          </View>

          {/* Description */}
          {taskDescription ? (
            <View style={[styles.card, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
              <SectionHeader title="Description" colors={colors} />
              <Text style={[styles.descriptionText, { color: colors.text }]}>{taskDescription}</Text>
            </View>
          ) : null}

          {/* Status */}
          <View style={styles.section}>
            <SectionHeader title="Status" colors={colors} />
            <View style={{ zIndex: 20 }}>
              <Pressable
                style={[
                  styles.statusSelect,
                  { backgroundColor: colors.cardBackground, borderColor: statusColor },
                  statusUpdating && { opacity: 0.7 },
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
                      {opt.value === statusValue && <Icon name="check" size={20} color={colors.primary} />}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Details card */}
          <View style={[styles.card, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
            <SectionHeader title="Details" colors={colors} />

            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.detailIcon, { backgroundColor: colors.background }]}>
                <Icon name="person" size={18} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Assigned to</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{assignee}</Text>
              </View>
            </View>

            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.detailIcon, { backgroundColor: colors.background }]}>
                <Icon name="business" size={18} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Project</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {projectName}{projectClient ? ` · ${projectClient}` : ''}
                </Text>
              </View>
            </View>

            <View style={[styles.detailRow, styles.detailRowLast, { borderBottomColor: colors.border }]}>
              <View style={[styles.detailIcon, { backgroundColor: colors.background }]}>
                <Icon name="event" size={18} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Due date</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{dueDate}</Text>
              </View>
            </View>
          </View>

          {/* Commits */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <SectionHeader title={`Commits (${commits.length})`} colors={colors} />
              <Pressable
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
                onPress={() => setCommitModalVisible(true)}
              >
                <Icon name="add" size={16} color="#fff" />
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
            </View>
            {commits.length === 0 ? (
              <Text style={[styles.emptyNote, { color: colors.textSecondary }]}>No commits yet.</Text>
            ) : (
              commits.map((c) => <CommitItem key={c.id ?? c.commit_hash} commit={c} colors={colors} />)
            )}
          </View>

          {/* Comments */}
          <View style={styles.section}>
            <SectionHeader title={`Comments (${comments.length})`} colors={colors} />
            {comments.length === 0 ? (
              <Text style={[styles.emptyNote, { color: colors.textSecondary }]}>No comments yet.</Text>
            ) : (
              comments.map((c) => <CommentItem key={c.id} comment={c} colors={colors} />)
            )}

            {/* Add comment */}
            <View style={[styles.commentInputRow, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
              <TextInput
                style={[styles.commentInput, { color: colors.text }]}
                placeholder="Write a comment..."
                placeholderTextColor={colors.placeholder}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={1000}
                editable={!commentSubmitting}
              />
              <Pressable
                style={[styles.sendBtn, { backgroundColor: colors.primary }, (!commentText.trim() || commentSubmitting) && { opacity: 0.5 }]}
                onPress={handleAddComment}
                disabled={!commentText.trim() || commentSubmitting}
              >
                {commentSubmitting ? (
                  <Loader size="small" color="#fff" />
                ) : (
                  <Icon name="send" size={18} color="#fff" />
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.centered}>
          <Text style={[styles.emptyNote, { color: colors.textSecondary }]}>No task data.</Text>
        </View>
      )}

      <AddCommitModal
        visible={commitModalVisible}
        onClose={() => setCommitModalVisible(false)}
        onSubmit={handleAddCommit}
        submitting={commitSubmitting}
        colors={colors}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeTop: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: { width: 40 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  hero: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  priorityBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  // Status
  statusSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
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
    marginTop: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
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
  // Detail rows
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailContent: { flex: 1 },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  // Add button
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyNote: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  // Commit
  commitItem: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  commitIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commitBody: { flex: 1 },
  commitMessage: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  branchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  branchText: { fontSize: 11, fontWeight: '600' },
  commitHash: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  commitDate: { fontSize: 12 },
  // Comment
  commentItem: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontSize: 13,
    fontWeight: '700',
  },
  commentBody: { flex: 1 },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: { fontSize: 13, fontWeight: '700' },
  commentDate: { fontSize: 11 },
  commentContent: { fontSize: 14, lineHeight: 20 },
  // Comment input
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    minHeight: 40,
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  formField: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  formInput: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    minHeight: 44,
  },
  formInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancel: {
    borderWidth: 1,
  },
  modalBtnSubmit: {},
  modalBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  fieldError: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TaskDetailScreen;
