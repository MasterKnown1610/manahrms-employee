import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing } from '../../theme/theme';
import QuickActionButton from './QuickActionButton';

const AI_CHAT_ICON_SIZE = 40;

const DEFAULT_ACTIONS = [
  {
    id: 'checkin',
    icon: <Icon name="fingerprint" size={28} color={colors.primary} />,
    label: 'Check In/Out',
    primary: false,
  },
  {
    id: 'leave',
    icon: <Icon name="event" size={26} color={colors.primary} />,
    label: 'Apply Leave',
    primary: false,
  },
  {
    id: 'projects',
    icon: <Icon name="folder" size={26} color={colors.primary} />,
    label: 'Projects',
    primary: false,
  },
  {
    id: 'aichat',
    icon: (
      <Image
        source={require('../../assets/theme.png')}
        style={{ width: AI_CHAT_ICON_SIZE, height: AI_CHAT_ICON_SIZE }}
        resizeMode="contain"
      />
    ),
    label: 'AI Chat',
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
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
});

export default QuickActionsSection;
