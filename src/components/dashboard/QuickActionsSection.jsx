import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';
import QuickActionButton from './QuickActionButton';

const ACTIONS = [
  { id: 'checkin',  iconName: 'fingerprint',    color: '#00897B', label: 'Attendance',  subtitle: 'Check in / out' },
  { id: 'leave',    iconName: 'beach-access',   color: '#1E88E5', label: 'Apply Leave', subtitle: 'Request time off' },
  { id: 'projects', iconName: 'folder-special', color: '#FB8C00', label: 'Projects',    subtitle: 'View all projects' },
  { id: 'aichat',   iconName: null,             color: '#7B1FA2', label: 'AI Chat',     subtitle: 'Ask anything', isLogo: true },
];

function QuickActionsSection({ onActionPress }) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      </View>

      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <View key={action.id} style={styles.cell}>
            <QuickActionButton
              iconName={action.iconName}
              isLogo={action.isLogo}
              label={action.label}
              subtitle={action.subtitle}
              accentColor={action.color}
              onPress={onActionPress ? () => onActionPress(action.id) : undefined}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  titleRow: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cell: {
    width: '48.5%',
  },
});

export default QuickActionsSection;
