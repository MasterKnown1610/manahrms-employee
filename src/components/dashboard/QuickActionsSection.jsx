import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing } from '../../theme/theme';
import QuickActionButton from './QuickActionButton';

const DEFAULT_ACTIONS = [
  {
    id: 'checkin',
    icon: <Icon name="fingerprint" size={26} color={colors.background} />,
    label: 'Check In/Out',
    primary: true,
  },
  {
    id: 'leave',
    icon: <Icon name="event" size={26} color={colors.primary} />,
    label: 'Apply Leave',
    primary: false,
  },
  {
    id: 'payslip',
    icon: <Icon name="receipt-long" size={26} color={colors.primary} />,
    label: 'My Payslip',
    primary: false,
  },
  {
    id: 'directory',
    icon: <Icon name="people" size={26} color={colors.primary} />,
    label: 'Directory',
    primary: false,
  },
];

function QuickActionsSection({ actions = DEFAULT_ACTIONS, onActionPress }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsRow}
      >
        {actions.map((action) => (
          <QuickActionButton
            key={action.id}
            icon={action.icon}
            label={action.label}
            primary={action.primary}
            onPress={onActionPress ? () => onActionPress(action.id) : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
  },
});

export default QuickActionsSection;
