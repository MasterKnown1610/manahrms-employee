import React from 'react';
import { View, StyleSheet } from 'react-native';
import SummaryCard from './SummaryCard';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const CARD_CONFIG = [
  { id: 'my-tasks',      icon: 'assignment',   color: '#7B1FA2', label: 'My Tasks',      valueKeys: ['myTasks', 'my_tasks', 'totalTasks'] },
  { id: 'todays-status', icon: 'fingerprint',  color: '#00897B', label: "Today's Status", valueKeys: ['todayStatus', 'todays_status', 'attendanceStatus'] },
  { id: 'leave-balance', icon: 'beach-access', color: '#1E88E5', label: 'Leave Balance',  valueKeys: ['leaveBalance', 'leave_balance'] },
  { id: 'open-tasks',    icon: 'pending-actions', color: '#F4511E', label: 'Open Tasks',  valueKeys: ['openTasks', 'open_tasks'] },
  { id: 'in-progress',   icon: 'autorenew',    color: '#FB8C00', label: 'In Progress',    valueKeys: ['inProgress', 'in_progress'] },
  { id: 'completed',     icon: 'check-circle', color: '#43A047', label: 'Completed',      valueKeys: ['completed'] },
];

const ADMIN_CARD_CONFIG = [
  { id: 'total-employees',   icon: 'people',        color: '#1E88E5', label: 'Employees',      valueKey: 'total_employees' },
  { id: 'active-employees',  icon: 'person',        color: '#43A047', label: 'Active',          valueKey: 'active_employees' },
  { id: 'total-departments', icon: 'business',      color: '#7B1FA2', label: 'Departments',     valueKey: 'total_departments' },
  { id: 'total-projects',    icon: 'work',          color: '#FB8C00', label: 'Projects',        valueKey: 'total_projects' },
  { id: 'open-tasks',        icon: 'pending-actions', color: '#F4511E', label: 'Open Tasks',    valueKey: 'open_tasks' },
  { id: 'in-progress-tasks', icon: 'autorenew',     color: '#FB8C00', label: 'In Progress',    valueKey: 'in_progress_tasks' },
  { id: 'closed-tasks',      icon: 'check-circle',  color: '#43A047', label: 'Closed',         valueKey: 'closed_tasks' },
  { id: 'overdue-tasks',     icon: 'warning',       color: '#E53935', label: 'Overdue',        valueKey: 'overdue_tasks' },
  { id: 'pending-leave',     icon: 'beach-access',  color: '#1E88E5', label: 'Pending Leave',  valueKey: 'pending_leave_requests' },
];

const DEFAULT_VALUES = {
  'my-tasks': '0', 'todays-status': '—', 'leave-balance': '0 days',
  'open-tasks': '0', 'in-progress': '0', 'completed': '0',
};

function isAdminDashboard(dashboard) { return dashboard?.overview != null; }

function getValueFromDashboard(dashboard, valueKeys) {
  const source = dashboard?.summary ?? dashboard ?? {};
  for (const key of valueKeys) {
    const v = source[key];
    if (v !== undefined && v !== null && v !== '') return String(v);
  }
  return null;
}

function getLeaveBalanceValue(dashboard) {
  const source = dashboard?.summary ?? dashboard ?? {};
  const lb = source.leave_balance ?? source.leaveBalance;
  if (lb && typeof lb === 'object' && lb.total_available_days != null) {
    const days = Number(lb.total_available_days);
    return Number.isFinite(days) ? `${days}d` : null;
  }
  return null;
}

function getTodaysStatusValue(dashboard) {
  const source = dashboard?.summary ?? dashboard ?? {};
  const ts = source.today_status ?? source.todays_status ?? source.todayStatus;
  if (!ts || typeof ts !== 'object') return null;
  return ts.is_present === true ? 'Present' : 'Absent';
}

function buildAdminCards(dashboard) {
  const overview = dashboard?.overview ?? {};
  return ADMIN_CARD_CONFIG.map((cfg) => ({
    id: cfg.id, icon: cfg.icon, color: cfg.color, label: cfg.label,
    value: overview[cfg.valueKey] !== undefined ? String(overview[cfg.valueKey]) : '0',
  }));
}

function buildCards(dashboard, colors) {
  if (isAdminDashboard(dashboard)) return buildAdminCards(dashboard);
  return CARD_CONFIG.map((cfg) => {
    let value = cfg.id === 'leave-balance'
      ? getLeaveBalanceValue(dashboard)
      : cfg.id === 'todays-status'
        ? getTodaysStatusValue(dashboard)
        : getValueFromDashboard(dashboard, cfg.valueKeys);
    const displayValue = value ?? DEFAULT_VALUES[cfg.id];
    let valueStyle;
    if (cfg.id === 'todays-status' && colors) {
      valueStyle = {
        fontSize: 15,
        color: displayValue === 'Present' ? colors.success : displayValue === 'Absent' ? colors.error : colors.textSecondary,
      };
    }
    return { id: cfg.id, icon: cfg.icon, color: cfg.color, label: cfg.label, value: displayValue, valueStyle };
  });
}

function SummaryCardsRow({ cards: cardsProp, dashboard, onCardPress }) {
  const { colors } = useTheme();
  const cards = dashboard != null
    ? buildCards(dashboard, colors)
    : (cardsProp ?? buildCards(null, colors));

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.id} style={styles.gridItem}>
            <SummaryCard
              icon={<Icon name={card.icon} size={22} color={card.color} />}
              label={card.label}
              value={card.value}
              valueStyle={card.valueStyle}
              accentColor={card.color}
              onPress={onCardPress ? () => onCardPress(card.id) : undefined}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    // 2 cols with gap
    width: '48.5%',
  },
});

export default SummaryCardsRow;
