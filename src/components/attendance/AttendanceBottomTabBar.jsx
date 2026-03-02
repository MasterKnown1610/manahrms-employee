import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const TABS = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'Attendance', label: 'Attendance', icon: 'event' },
  { key: 'Add', label: '', icon: 'add', isCenter: true },
  { key: 'Tasks', label: 'Tasks', icon: 'assignment' },
  { key: 'Profile', label: 'Profile', icon: 'person' },
];

function AttendanceBottomTabBar({ activeTab = 'Attendance', onTabPress }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, spacing.sm);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding, backgroundColor: colors.background, borderTopColor: colors.border }]}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key && !tab.isCenter;
          if (tab.isCenter) {
            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabPress?.(tab.key)}
                style={[styles.centerButton, { backgroundColor: colors.primary }]}
                hitSlop={8}
              >
                <Icon name="add" size={28} color={colors.background} />
              </Pressable>
            );
          }
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress?.(tab.key)}
              style={styles.tab}
              hitSlop={8}
            >
              <Icon
                name={tab.icon}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: colors.textSecondary },
                  isActive && [styles.tabLabelActive, { color: colors.primary }],
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    minWidth: 56,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '600',
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});

export default AttendanceBottomTabBar;
