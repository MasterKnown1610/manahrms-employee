import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/theme';

const CARD_CONFIG = [
  { key: 'workDays', label: 'WORK DAYS', valueKey: 'workDays', color: colors.primary },
  { key: 'present', label: 'PRESENT', valueKey: 'present', color: colors.success },
  { key: 'absent', label: 'ABSENT', valueKey: 'absent', color: colors.priorityHigh },
];

function MonthlySummaryCards({ workDays = 22, present = 18, absent = 1 }) {
  const values = { workDays, present, absent };

  return (
    <View style={styles.row}>
      {CARD_CONFIG.map(({ key, label, valueKey, color }) => (
        <View key={key} style={styles.card}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, { color }]}>{String(values[valueKey]).padStart(2, '0')}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: 2,
  },
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
});

export default MonthlySummaryCards;
