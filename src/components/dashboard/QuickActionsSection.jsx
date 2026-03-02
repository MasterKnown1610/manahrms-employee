import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';
import QuickActionButton from './QuickActionButton';

const AI_CHAT_ICON_SIZE = 40;

function buildDefaultActions(colors) {
  return [
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
}

function QuickActionsSection({ actions, onActionPress }) {
  const { colors } = useTheme();
  const defaultActions = React.useMemo(() => buildDefaultActions(colors), [colors]);
  const actionList = actions ?? defaultActions;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>QUICK ACTIONS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsRow}
      >
        {actionList.map((action) => (
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
