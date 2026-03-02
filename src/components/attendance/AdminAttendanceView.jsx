import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function formatTime(value) {
  if (!value) return '—';
  if (typeof value === 'string') {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return value;
  }
  return '—';
}

function getEmployeeList(data) {
  if (Array.isArray(data)) return data;
  const list =
    data?.members ??
    data?.employees ??
    data?.attendance ??
    data?.list ??
    data?.data ??
    [];
  return Array.isArray(list) ? list : [];
}

function getStats(statsData, presentData) {
  const fallback = {
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    checkedInButNotOut: 0,
  };
  const members = getEmployeeList(presentData);
  const fromStats = statsData
    ? {
        totalEmployees: statsData.total_employees ?? statsData.totalEmployees ?? 0,
        presentToday: statsData.present_today ?? statsData.presentToday ?? 0,
        absentToday: statsData.absent_today ?? statsData.absentToday ?? 0,
        checkedInButNotOut:
          statsData.checked_in_but_not_out ?? statsData.checkedInButNotOut ?? 0,
      }
    : fallback;
  const fromPresent = presentData
    ? {
        totalEmployees: presentData.total_employees ?? presentData.totalEmployees ?? members.length,
        presentToday:
          presentData.total_present ??
          presentData.totalPresent ??
          presentData.present_today ??
          presentData.presentToday ??
          members.length,
      }
    : {};
  return {
    ...fallback,
    ...fromStats,
    ...fromPresent,
  };
}

const SUMMARY_BOXES = [
  {
    id: 'total-employees',
    label: 'Total Employees',
    icon: 'people',
    color: '#2196F3',
    key: 'totalEmployees',
  },
  {
    id: 'present-today',
    label: 'Present Today',
    icon: 'person',
    color: '#4CAF50',
    key: 'presentToday',
  },
  {
    id: 'absent-today',
    label: 'Absent Today',
    icon: 'block',
    color: '#F44336',
    key: 'absentToday',
  },
];

function AdminAttendanceView({
  attendanceStats,
  presentAttendance,
  loading,
  error,
  onRefresh,
  dateLabel = 'Today',
}) {
  const { colors } = useTheme();
  const stats = getStats(attendanceStats, presentAttendance);
  const employees = getEmployeeList(presentAttendance);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[colors.primary]} />
        ) : undefined
        }
    >
      <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>{dateLabel}</Text>

      {/* Summary Boxes */}
      <View style={styles.summaryRow}>
        {SUMMARY_BOXES.map((box) => (
          <View key={box.id} style={[styles.summaryBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[styles.summaryIconWrap, { backgroundColor: `${box.color}20` }]}>
              <Icon name={box.icon} size={24} color={box.color} />
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{stats[box.key] ?? 0}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]} numberOfLines={2}>
              {box.label}
            </Text>
          </View>
        ))}
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Icon name="error" size={20} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : null}

      {/* Employee List */}
      <View style={[styles.listSection, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Employee Attendance</Text>

        {loading && employees.length === 0 ? (
          <View style={styles.loadingWrap}>
            <Loader size="large" />
          </View>
        ) : employees.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Icon name="people" size={48} color={colors.placeholder} />
            <Text style={[styles.emptyText, { color: colors.placeholder }]}>No attendance records for this date</Text>
          </View>
        ) : (
          <View style={styles.employeeList}>
            {employees.map((emp, index) => (
              <View key={emp.id ?? emp.employee_id ?? index} style={[styles.employeeCard, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
                <View style={styles.employeeHeader}>
                  <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                      {(emp.full_name ?? emp.fullName ?? emp.employee_name ?? emp.employeeName ?? emp.name ?? ([emp.first_name, emp.last_name].filter(Boolean).join(' ') || '?')).charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text style={[styles.employeeName, { color: colors.text }]} numberOfLines={1}>
                      {emp.full_name ?? emp.fullName ?? emp.employee_name ?? emp.employeeName ?? emp.name ?? ([emp.first_name, emp.last_name].filter(Boolean).join(' ') || '—')}
                    </Text>
                    {(emp.position ?? emp.designation ?? emp.role) ? (
                      <Text style={[styles.employeePosition, { color: colors.textSecondary }]} numberOfLines={1}>
                        {emp.position ?? emp.designation ?? emp.role ?? '—'}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View style={[styles.timeRow, { backgroundColor: colors.background }]}>
                  <View style={styles.timeBlock}>
                    <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Punch In</Text>
                    <Text style={[styles.timeValue, { color: colors.primary }]}>{formatTime(emp.punch_in_time ?? emp.punchInTime ?? emp.punch_in ?? emp.punchIn ?? emp.in_time ?? emp.inTime)}</Text>
                  </View>
                  <View style={[styles.timeDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.timeBlock}>
                    <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Punch Out</Text>
                    <Text style={[styles.timeValue, { color: colors.primary }]}>{formatTime(emp.punch_out_time ?? emp.punchOutTime ?? emp.punch_out ?? emp.punchOut ?? emp.out_time ?? emp.outTime)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  dateLabel: {
    fontSize: 15,
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  summaryBox: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  listSection: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.lg,
    letterSpacing: 0.3,
  },
  loadingWrap: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyWrap: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: spacing.sm,
  },
  employeeList: {
    gap: spacing.md,
  },
  employeeCard: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  employeeInfo: {
    flex: 1,
    minWidth: 0,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  employeePosition: {
    fontSize: 13,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeDivider: {
    width: 1,
    height: 32,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AdminAttendanceView;
