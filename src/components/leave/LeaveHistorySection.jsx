import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

const STATUS_CONFIG = {
  approved: { bg: colors.success, icon: 'check', label: 'APPROVED' },
  pending: { bg: colors.priorityMedium, icon: 'radio-button-unchecked', label: 'PENDING' },
  rejected: { bg: colors.priorityHigh, icon: 'close', label: 'REJECTED' },
};

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

const MOCK_HISTORY = [
  { id: '1', leaveType: 'Sick Leave', dateRange: 'Oct 12 - Oct 14, 2023', status: 'approved' },
  { id: '2', leaveType: 'Annual Leave', dateRange: 'Dec 20 - Jan 02, 2024', status: 'pending' },
  { id: '3', leaveType: 'Casual Leave', dateRange: 'Sep 05 - Sep 06, 2023', status: 'rejected' },
];

function LeaveHistorySection({ items = MOCK_HISTORY }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>LEAVE HISTORY</Text>
      {items.map((item) => (
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
