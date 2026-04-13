import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const TABS = [
  { key: 'dashboard',  label: 'Home',       icon: 'home',       iconActive: 'home' },
  { key: 'attendance', label: 'Attendance', icon: 'schedule',   iconActive: 'schedule' },
  { key: 'tasks',      label: 'Tasks',      icon: 'assignment', iconActive: 'assignment' },
  { key: 'leave',      label: 'Leave',      icon: 'event',      iconActive: 'event' },
  { key: 'profile',    label: 'Profile',    icon: 'person-outline', iconActive: 'person' },
];

function BottomTabBar({ activeTab = 'dashboard', onTabPress }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, spacing.sm),
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress?.(tab.key)}
            style={styles.tab}
            hitSlop={4}
          >
            {/* Active pill indicator */}
            {isActive && (
              <View style={[styles.activePill, { backgroundColor: colors.primary + '18' }]} />
            )}
            <Icon
              name={isActive ? tab.iconActive : tab.icon}
              size={24}
              color={isActive ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.primary : colors.textSecondary },
                isActive && styles.labelActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 10 },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 34,
    borderRadius: 17,
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
});

export default BottomTabBar;
