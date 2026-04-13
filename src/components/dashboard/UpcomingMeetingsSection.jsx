import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';
import UpcomingDeadlineCard from './UpcomingDeadlineCard';
import Icon from '../Icon/Icon';

function formatDueDate(dueDateStr) {
  if (!dueDateStr) return '—';
  const d = new Date(dueDateStr);
  if (isNaN(d.getTime())) return dueDateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDueLabel(daysUntilDue) {
  if (daysUntilDue === undefined || daysUntilDue === null) return null;
  const n = Number(daysUntilDue);
  if (n < 0) return 'Overdue';
  if (n === 0) return 'Due today';
  if (n === 1) return 'In 1 day';
  return `In ${n} days`;
}

function UpcomingMeetingsSection({ deadlines = [], onDeadlinePress }) {
  const { colors } = useTheme();
  const list = Array.isArray(deadlines) ? deadlines : [];

  if (list.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: '#FB8C00' }]} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Deadlines</Text>
      </View>

      {list.map((d) => (
        <View key={d?.id ?? d?.title} style={styles.cardSpacing}>
          <UpcomingDeadlineCard
            title={d?.title ?? '—'}
            dueDate={formatDueDate(d?.due_date)}
            dueLabel={formatDueLabel(d?.days_until_due) ?? d?.dueLabel}
            priority={d?.priority}
            assignedTo={d?.assigned_to_employee_name}
            projectOrType={d?.projectOrType ?? d?.project_name}
            onView={() => onDeadlinePress?.(d)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dot: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSpacing: {
    marginBottom: spacing.sm,
  },
});

export default UpcomingMeetingsSection;
