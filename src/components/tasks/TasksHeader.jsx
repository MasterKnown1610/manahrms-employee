import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function TasksHeader({ onBackPress, onNotificationPress }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Pressable onPress={onBackPress} style={styles.iconButton} hitSlop={8}>
        <Icon name="arrow-back" size={24} color={colors.background} />
      </Pressable>
      <Text style={[styles.title, { color: colors.background }]}>Tasks</Text>
      <Pressable onPress={onNotificationPress} style={styles.iconButton} hitSlop={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TasksHeader;
