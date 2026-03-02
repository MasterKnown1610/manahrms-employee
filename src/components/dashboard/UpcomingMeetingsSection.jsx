import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';
import UpcomingDeadlineCard from './UpcomingDeadlineCard';

function formatDueDate(dueDateStr) {
  if (!dueDateStr) return '—';
  const d = new Date(dueDateStr);
  if (isNaN(d.getTime())) return dueDateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDueLabel(daysUntilDue) {
  if (daysUntilDue === undefined || daysUntilDue === null) return null;
  const n = Number(daysUntilDue);
  if (n === 0) return 'Due today';
  if (n === 1) return 'In 1 day';
  if (n < 0) return 'Overdue';
  return `In ${n} days`;
}

function UpcomingMeetingsSection({
  deadlines = [],
  onDeadlinePress,
}) {
  const { colors } = useTheme();
  const list = Array.isArray(deadlines) ? deadlines : [];

  if (list.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Deadlines</Text>
      {list.map((deadline) => (
        <View key={deadline?.id ?? deadline?.title} style={styles.cardSpacing}>
          <UpcomingDeadlineCard
            title={deadline?.title ?? '—'}
            dueDate={formatDueDate(deadline?.due_date)}
            dueLabel={formatDueLabel(deadline?.days_until_due) ?? deadline?.dueLabel}
            priority={deadline?.priority}
            assignedTo={deadline?.assigned_to_employee_name}
            projectOrType={deadline?.projectOrType ?? deadline?.project_name}
            onView={() => onDeadlinePress?.(deadline)}
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  cardSpacing: {
    marginBottom: spacing.md,
  },
});

export default UpcomingMeetingsSection;
