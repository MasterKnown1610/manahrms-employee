import React from 'react';
import { Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

function TaskFilterTabs({ activeTab = 'all', onTabPress }) {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress?.(tab.key)}
            style={[
              styles.tab,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
              isActive && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <Text style={[styles.tabLabel, { color: colors.text }, isActive && { color: colors.background }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  tab: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TaskFilterTabs;
