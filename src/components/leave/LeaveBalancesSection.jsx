import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function getDefaultBalances(colors) {
  return [
    { key: 'annual', label: 'Annual Leave', icon: 'event', iconColor: colors.primary, used: 12, total: 15, barColor: colors.primary },
    { key: 'sick', label: 'Sick Leave', icon: 'work', iconColor: colors.success, used: 5, total: 7, barColor: colors.success },
    { key: 'casual', label: 'Casual Leave', icon: 'wb-sunny', iconColor: colors.priorityMedium, used: 2, total: 5, barColor: colors.priorityMedium },
  ];
}

function pickMetaForKeyOrLabel(key, label, colors) {
  const k = String(key ?? '').toLowerCase();
  const l = String(label ?? '').toLowerCase();
  const text = `${k} ${l}`;
  if (text.includes('sick')) return { icon: 'work', iconColor: colors.success, barColor: colors.success };
  if (text.includes('casual')) return { icon: 'wb-sunny', iconColor: colors.priorityMedium, barColor: colors.priorityMedium };
  if (text.includes('annual') || text.includes('vacation')) return { icon: 'event', iconColor: colors.primary, barColor: colors.primary };
  return { icon: 'event-available', iconColor: colors.primary, barColor: colors.primary };
}

function normalizeBalanceItem(item, fallbackKey, colors) {
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
  const meta = pickMetaForKeyOrLabel(key, label, colors);

  return {
    key: String(key ?? fallbackKey),
    label: String(label),
    total: Number.isFinite(total) ? total : 0,
    used: Number.isFinite(used) ? used : 0,
    remaining: Number.isFinite(remaining) ? remaining : 0,
    ...meta,
  };
}

function BalanceCard({ label, icon, iconColor, used, total, remaining, barColor, colors }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Icon name={icon} size={24} color={iconColor} style={styles.cardIcon} />
      <Text style={[styles.cardLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.ratioRow}>
        <Text style={[styles.ratioUsed, { color: barColor }]}>{used}</Text>
        <Text style={[styles.ratioTotal, { color: colors.text }]}> / {total}</Text>
      </View>
      <Text style={[styles.remainingText, { color: colors.textSecondary }]}>Remaining: {remaining}</Text>
      <View style={[styles.progressWrap, { backgroundColor: colors.primaryLight }]}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

function LeaveBalancesSection({ items }) {
  const { colors } = useTheme();
  const source = items;
  const list = Array.isArray(source)
    ? source
    : (source?.data ?? source?.balances ?? source?.leaveBalances ?? source?.leave_balances ?? []);

  const defaultBalances = getDefaultBalances(colors);
  const normalized =
    list && Array.isArray(list) && list.length > 0
      ? list.map((it, idx) => normalizeBalanceItem(it, idx, colors))
      : defaultBalances;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>YOUR BALANCES</Text>
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
            colors={colors}
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
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  cardIcon: {
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  progressWrap: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default LeaveBalancesSection;
