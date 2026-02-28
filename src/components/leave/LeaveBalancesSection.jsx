import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

const BALANCES = [
  {
    key: 'annual',
    label: 'Annual Leave',
    icon: 'event',
    iconColor: colors.primary,
    used: 12,
    total: 15,
    barColor: colors.primary,
  },
  {
    key: 'sick',
    label: 'Sick Leave',
    icon: 'work',
    iconColor: colors.success,
    used: 5,
    total: 7,
    barColor: colors.success,
  },
  {
    key: 'casual',
    label: 'Casual Leave',
    icon: 'wb-sunny',
    iconColor: colors.priorityMedium,
    used: 2,
    total: 5,
    barColor: colors.priorityMedium,
  },
];

function pickMetaForKeyOrLabel(key, label) {
  const k = String(key ?? '').toLowerCase();
  const l = String(label ?? '').toLowerCase();
  const text = `${k} ${l}`;
  if (text.includes('sick')) {
    return { icon: 'work', iconColor: colors.success, barColor: colors.success };
  }
  if (text.includes('casual')) {
    return { icon: 'wb-sunny', iconColor: colors.priorityMedium, barColor: colors.priorityMedium };
  }
  if (text.includes('annual') || text.includes('vacation')) {
    return { icon: 'event', iconColor: colors.primary, barColor: colors.primary };
  }
  return { icon: 'event-available', iconColor: colors.primary, barColor: colors.primary };
}

function normalizeBalanceItem(item, fallbackKey) {
  const obj = item ?? {};
  const key =
    obj.key ??
    obj.code ??
    obj.type ??
    obj.leave_type_id ??
    obj.leaveTypeId ??
    fallbackKey;
  const label =
    obj.label ??
    obj.name ??
    obj.type ??
    obj.leave_type_name ??
    obj.leaveTypeName ??
    obj.leaveType ??
    'Leave';

  const rawTotal =
    obj.total ??
    obj.total_leave ??
    obj.totalLeaves ??
    obj.entitled ??
    obj.entitlement ??
    obj.total_days ??
    0;
  const rawUsed =
    obj.used ??
    obj.used_leave ??
    obj.usedLeaves ??
    obj.taken ??
    obj.consumed ??
    obj.used_days ??
    0;

  const totalNum = parseFloat(rawTotal);
  const usedNum = parseFloat(rawUsed);
  const total = Number.isFinite(totalNum) ? totalNum : 0;
  const used = Number.isFinite(usedNum) ? usedNum : 0;

  const remainingRaw =
    obj.remaining ??
    obj.remaining_leave ??
    obj.remainingLeaves ??
    obj.balance ??
    (total - used);

  const remaining = remainingRaw < 0 ? 0 : remainingRaw;

  const meta = pickMetaForKeyOrLabel(key, label);

  return {
    key: String(key ?? fallbackKey),
    label: String(label),
    total: Number.isFinite(total) ? total : 0,
    used: Number.isFinite(used) ? used : 0,
    remaining: Number.isFinite(remaining) ? remaining : 0,
    icon: meta.icon,
    iconColor: meta.iconColor,
    barColor: meta.barColor,
  };
}

function BalanceCard({ label, icon, iconColor, used, total, remaining, barColor }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  return (
    <View style={styles.card}>
      <Icon name={icon} size={24} color={iconColor} style={styles.cardIcon} />
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={styles.ratioRow}>
        <Text style={[styles.ratioUsed, { color: barColor }]}>{used}</Text>
        <Text style={styles.ratioTotal}> / {total}</Text>
      </View>
      <Text style={styles.remainingText}>Remaining: {remaining}</Text>
      <View style={styles.progressWrap}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

function LeaveBalancesSection({ items }) {
  const source = items ?? BALANCES;
  const list = Array.isArray(source)
    ? source
    : (source?.data ?? source?.balances ?? source?.leaveBalances ?? source?.leave_balances ?? []);

  const normalized =
    list && Array.isArray(list)
      ? list.map((it, idx) => normalizeBalanceItem(it, idx))
      : BALANCES;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>YOUR BALANCES</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {normalized.map((b) => (
          <BalanceCard
            key={b.key}
            label={b.label}
            icon={b.icon}
            iconColor={b.iconColor}
            used={b.used}
            total={b.total}
            remaining={b.remaining}
            barColor={b.barColor}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: 4,
  },
  card: {
    width: 160,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: {
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  ratioRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  ratioUsed: {
    fontSize: 22,
    fontWeight: '700',
  },
  ratioTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressWrap: {
    height: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default LeaveBalancesSection;
