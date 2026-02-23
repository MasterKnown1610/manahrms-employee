import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

function LogEntry({ dateLabel, dayName, checkIn, checkOut, totalHours }) {
  return (
    <View style={styles.entry}>
      <View style={styles.dateBox}>
        <Text style={styles.dateBoxText}>{dateLabel}</Text>
      </View>
      <View style={styles.entryContent}>
        <Text style={styles.dayName}>{dayName}</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeChip}>
            <Icon name="schedule" size={12} color={colors.success} />
            <Text style={styles.timeText}>{checkIn}</Text>
          </View>
          <View style={styles.timeChip}>
            <Icon name="schedule" size={12} color={colors.priorityHigh} />
            <Text style={styles.timeText}>{checkOut}</Text>
          </View>
        </View>
      </View>
      <View style={styles.hoursBlock}>
        <Text style={styles.hoursValue}>{totalHours}</Text>
        <Text style={styles.hoursLabel}>TOTAL HOURS</Text>
      </View>
    </View>
  );
}

function RecentLogsSection({ logs = [], onViewAll }) {
  const defaultLogs = [
    { id: '1', dateLabel: 'OCT 23', dayName: 'Wednesday', checkIn: '08:02 AM', checkOut: '05:15 PM', totalHours: '05h 13m' },
    { id: '2', dateLabel: 'OCT 22', dayName: 'Tuesday', checkIn: '08:02 AM', checkOut: '05:02 PM', totalHours: '09h 07m' },
  ];
  const list = logs.length > 0 ? logs : defaultLogs;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Logs</Text>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      {list.map((log) => (
        <View key={log.id} style={styles.card}>
          <LogEntry
            dateLabel={log.dateLabel}
            dayName={log.dayName}
            checkIn={log.checkIn}
            checkOut={log.checkOut}
            totalHours={log.totalHours}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.md,
    alignSelf: 'flex-start',
  },
  dateBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  entryContent: {
    flex: 1,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  hoursBlock: {
    alignItems: 'flex-end',
  },
  hoursValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  hoursLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default RecentLogsSection;
