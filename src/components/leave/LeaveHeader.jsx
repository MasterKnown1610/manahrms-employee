import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function LeaveHeader({ onBackPress, onNotificationPress }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Pressable onPress={onBackPress} style={styles.iconButton} hitSlop={8}>
        <Icon name="arrow-back" size={24} color={colors.background} />
      </Pressable>
      <Text style={[styles.title, { color: colors.background }]}>Leave</Text>
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
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default LeaveHeader;
