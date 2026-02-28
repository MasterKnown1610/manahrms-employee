import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

const STATUS_CONFIG = {
  approved: { bg: colors.success, icon: 'check', label: 'APPROVED' },
  pending: { bg: colors.priorityMedium, icon: 'radio-button-unchecked', label: 'PENDING' },
  rejected: { bg: colors.priorityHigh, icon: 'close', label: 'REJECTED' },
};

function normalizeStatus(status) {
  const s = String(status ?? '').toLowerCase();
  if (s.includes('approve')) return 'approved';
  if (s.includes('reject') || s.includes('deny') || s.includes('decline')) return 'rejected';
  if (s.includes('pending') || s.includes('submitted') || s.includes('in_review')) return 'pending';
  return 'pending';
}

function formatPrettyDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function formatRange(start, end) {
  const s = formatPrettyDate(start);
  const e = formatPrettyDate(end);
  if (s && e) return `${s} - ${e}`;
  return s || e || '';
}

function normalizeItem(item, fallbackId) {
  const obj = item ?? {};
  const leaveType =
    obj?.leaveType ??
    obj?.leave_type_name ??
    obj?.leave_type ??
    obj?.leaveTypeName ??
    obj?.leave_type?.name ??
    obj?.leave_type?.type ??
    obj?.leave_type?.label ??
    'Leave';

  const start = obj?.start_date ?? obj?.startDate ?? obj?.from_date ?? obj?.fromDate;
  const end = obj?.end_date ?? obj?.endDate ?? obj?.to_date ?? obj?.toDate;

  return {
    id: String(obj?.id ?? obj?.request_id ?? obj?.leave_request_id ?? fallbackId),
    leaveType: String(leaveType),
    dateRange: obj?.dateRange ?? formatRange(start, end),
    status: normalizeStatus(obj?.status ?? obj?.approval_status ?? obj?.state),
  };
}

function LeaveHistoryItem({ leaveType, dateRange, status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <View style={styles.item}>
      <View style={[styles.statusIcon, { backgroundColor: config.bg }]}>
        <Icon name={config.icon} size={16} color={colors.background} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.leaveType}>{leaveType}</Text>
        <Text style={styles.dateRange}>{dateRange}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: config.bg }]}>
        <Text style={styles.badgeText}>{config.label}</Text>
      </View>
    </View>
  );
}

function LeaveHistorySection({ items = [] }) {
  const list = Array.isArray(items)
    ? items
    : (items?.data ?? items?.requests ?? items?.leaveRequests ?? items?.results ?? []);

  const normalized = (Array.isArray(list) ? list : []).map((it, idx) => normalizeItem(it, idx));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>LEAVE HISTORY</Text>
      {normalized.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No leave requests yet.</Text>
        </View>
      ) : null}
      {normalized.map((item) => (
        <View key={item.id} style={styles.card}>
          <LeaveHistoryItem
            leaveType={item.leaveType}
            dateRange={item.dateRange}
            status={item.status}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  emptyCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  leaveType: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  dateRange: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.3,
  },
});

export default LeaveHistorySection;
