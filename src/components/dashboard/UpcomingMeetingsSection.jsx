import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import UpcomingDeadlineCard from './UpcomingDeadlineCard';

const DEFAULT_DEADLINES = [
  {
    id: '1',
    title: 'Q1 Report Submission',
    dueDate: 'Mar 15, 2025 • 5:00 PM',
    dueLabel: 'In 2 weeks',
    projectOrType: 'Finance Report',
  },
  {
    id: '2',
    title: 'Project Alpha Deliverable',
    dueDate: 'Mar 8, 2025 • 11:59 PM',
    dueLabel: 'In 1 week',
    projectOrType: 'Engineering',
  },
];

function UpcomingMeetingsSection({
  deadlines = DEFAULT_DEADLINES,
  onDeadlinePress,
}) {
  const deadline = deadlines[0];
  if (!deadline) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
      <UpcomingDeadlineCard
        title={deadline.title}
        dueDate={deadline.dueDate}
        dueLabel={deadline.dueLabel}
        projectOrType={deadline.projectOrType}
        onView={() => onDeadlinePress?.(deadline)}
      />
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
    color: colors.text,
    marginBottom: spacing.md,
  },
});

export default UpcomingMeetingsSection;
