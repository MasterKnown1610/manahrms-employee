import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function getCardConfig(colors) {
  return [
    { key: 'workDays', label: 'WORK DAYS', valueKey: 'workDays', color: colors.primary },
    { key: 'present', label: 'PRESENT', valueKey: 'present', color: colors.success },
    { key: 'absent', label: 'ABSENT', valueKey: 'absent', color: colors.priorityHigh },
  ];
}

function MonthlySummaryCards({ workDays = 22, present = 18, absent = 1 }) {
  const { colors } = useTheme();
  const values = { workDays, present, absent };
  const cardConfig = getCardConfig(colors);

  return (
    <View style={styles.row}>
      {cardConfig.map(({ key, label, valueKey, color }) => (
        <View key={key} style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
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
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
});

export default MonthlySummaryCards;
