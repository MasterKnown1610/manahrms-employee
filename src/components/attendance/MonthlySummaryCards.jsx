import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const CARDS = [
  { key: 'workDays',  label: 'Work Days',  icon: 'calendar-today', light: '#EDE7F6', dark: '#4A3F6B', accent: '#6B4E9E' },
  { key: 'present',   label: 'Present',    icon: 'check-circle',   light: '#E8F5E9', dark: '#1B3A1F', accent: '#2E7D32' },
  { key: 'absent',    label: 'Absent',     icon: 'cancel',         light: '#FFEBEE', dark: '#3E1F1F', accent: '#C62828' },
];

function SummaryCard({ config, value, isDark }) {
  const bg = isDark ? config.dark : config.light;
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={[styles.iconWrap, { backgroundColor: config.accent + (isDark ? '30' : '20') }]}>
        <Icon name={config.icon} size={18} color={config.accent} />
      </View>
      <Text style={[styles.value, { color: config.accent }]}>
        {String(value).padStart(2, '0')}
      </Text>
      <Text style={[styles.label, { color: config.accent + (isDark ? 'CC' : 'BB') }]}>
        {config.label}
      </Text>
    </View>
  );
}

function MonthlySummaryCards({ workDays = 0, present = 0, absent = 0 }) {
  const { isDark } = useTheme();
  const values = { workDays, present, absent };

  return (
    <View style={styles.row}>
      {CARDS.map((cfg) => (
        <SummaryCard key={cfg.key} config={cfg} value={values[cfg.key]} isDark={isDark} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});

export default MonthlySummaryCards;
