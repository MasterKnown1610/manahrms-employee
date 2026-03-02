import React from 'react';
import { View, StyleSheet } from 'react-native';
import SummaryCard from './SummaryCard';
import Icon from '../Icon/Icon';
import { colors, spacing } from '../../theme/theme';

const CARD_CONFIG = [
  { id: 'my-tasks', icon: 'assignment', color: '#7B1FA2', label: 'My Tasks', valueKeys: ['myTasks', 'my_tasks', 'totalTasks'] },
  { id: 'todays-status', icon: 'schedule', color: '#4CAF50', label: "Today's Status", valueKeys: ['todayStatus', 'todays_status', 'attendanceStatus', 'checkInStatus'] },
  { id: 'leave-balance', icon: 'event', color: '#2196F3', label: 'Leave Balance', valueKeys: ['leaveBalance', 'leave_balance'] },
  { id: 'open-tasks', icon: 'more-horiz', color: '#FF9800', label: 'Open Tasks', valueKeys: ['openTasks', 'open_tasks'] },
  { id: 'in-progress', icon: 'schedule', color: '#2196F3', label: 'In Progress', valueKeys: ['inProgress', 'in_progress'] },
  { id: 'completed', icon: 'check-circle', color: '#4CAF50', label: 'Completed', valueKeys: ['completed'] },
];

const ADMIN_CARD_CONFIG = [
  { id: 'total-employees', icon: 'people', color: '#2196F3', label: 'Total Employees', valueKey: 'total_employees' },
  { id: 'active-employees', icon: 'person', color: '#4CAF50', label: 'Active Employees', valueKey: 'active_employees' },
  { id: 'total-departments', icon: 'business', color: '#7B1FA2', label: 'Departments', valueKey: 'total_departments' },
  { id: 'total-projects', icon: 'work', color: '#FF9800', label: 'Projects', valueKey: 'total_projects' },
  { id: 'active-projects', icon: 'folder', color: '#4CAF50', label: 'Active Projects', valueKey: 'active_projects' },
  { id: 'total-tasks', icon: 'assignment', color: '#7B1FA2', label: 'Total Tasks', valueKey: 'total_tasks' },
  { id: 'open-tasks', icon: 'more-horiz', color: '#FF9800', label: 'Open Tasks', valueKey: 'open_tasks' },
  { id: 'in-progress-tasks', icon: 'schedule', color: '#2196F3', label: 'In Progress', valueKey: 'in_progress_tasks' },
  { id: 'closed-tasks', icon: 'check-circle', color: '#4CAF50', label: 'Closed Tasks', valueKey: 'closed_tasks' },
  { id: 'overdue-tasks', icon: 'warning', color: '#f44336', label: 'Overdue Tasks', valueKey: 'overdue_tasks' },
  { id: 'pending-leave', icon: 'event', color: '#2196F3', label: 'Pending Leave', valueKey: 'pending_leave_requests' },
];

const DEFAULT_VALUES = {
  'my-tasks': '0',
  'todays-status': '—',
  'leave-balance': '0 days',
  'open-tasks': '0',
  'in-progress': '0',
  'completed': '0',
};

function isAdminDashboard(dashboard) {
  return dashboard?.overview != null;
}

function getValueFromDashboard(dashboard, valueKeys) {
  const source = dashboard?.summary ?? dashboard ?? {};
  for (const key of valueKeys) {
    const v = source[key];
    if (v !== undefined && v !== null && v !== '') return typeof v === 'number' ? String(v) : String(v);
  }
  return null;
}

function getLeaveBalanceValue(dashboard) {
  const source = dashboard?.summary ?? dashboard ?? {};
  const leaveBalance = source.leave_balance ?? source.leaveBalance;
  if (leaveBalance && typeof leaveBalance === 'object' && leaveBalance.total_available_days != null) {
    const days = Number(leaveBalance.total_available_days);
    return Number.isFinite(days) ? `${days}${days === 1 ? ' day' : ' days'}` : null;
  }
  return null;
}

function buildAdminCardsFromDashboard(dashboard) {
  const overview = dashboard?.overview ?? {};
  return ADMIN_CARD_CONFIG.map((config) => {
    const v = overview[config.valueKey];
    const value = v !== undefined && v !== null ? String(v) : '0';
    return {
      id: config.id,
      icon: <Icon name={config.icon} size={28} color={config.color} />,
      label: config.label,
      value,
    };
  });
}

function buildCardsFromDashboard(dashboard) {
  if (isAdminDashboard(dashboard)) {
    return buildAdminCardsFromDashboard(dashboard);
  }
  return CARD_CONFIG.map((config) => {
    let value = null;
    if (config.id === 'leave-balance') {
      value = getLeaveBalanceValue(dashboard);
    } else {
      value = getValueFromDashboard(dashboard, config.valueKeys);
    }
    return {
      id: config.id,
      icon: <Icon name={config.icon} size={28} color={config.color} />,
      label: config.label,
      value: value ?? DEFAULT_VALUES[config.id],
    };
  });
}

const COLS = 3;

function SummaryCardsRow({ cards: cardsProp, dashboard, onCardPress }) {
  const cards = dashboard != null ? buildCardsFromDashboard(dashboard) : (cardsProp ?? buildCardsFromDashboard(null));
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.id} style={styles.gridItem}>
            <SummaryCard
              icon={card.icon}
              label={card.label}
              value={card.value}
              onPress={onCardPress ? () => onCardPress(card.id) : undefined}
              style={styles.cardInGrid}
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
    paddingVertical: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridItem: {
    width: `${100 / COLS}%`,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  cardInGrid: {
    width: '100%',
    marginRight: 0,
    minHeight: 90,
  },
});

export default SummaryCardsRow;
