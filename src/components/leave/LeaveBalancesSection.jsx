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

function BalanceCard({ label, icon, iconColor, used, total, barColor }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  return (
    <View style={styles.card}>
      <Icon name={icon} size={24} color={iconColor} style={styles.cardIcon} />
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={styles.ratioRow}>
        <Text style={[styles.ratioUsed, { color: barColor }]}>{used}</Text>
        <Text style={styles.ratioTotal}> / {total}</Text>
      </View>
      <View style={styles.progressWrap}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

function LeaveBalancesSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>YOUR BALANCES</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BALANCES.map((b) => (
          <BalanceCard
            key={b.key}
            label={b.label}
            icon={b.icon}
            iconColor={b.iconColor}
            used={b.used}
            total={b.total}
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
