import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing } from '../../theme/theme';

function TasksHeader({ onBackPress, onNotificationPress }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBackPress} style={styles.iconButton} hitSlop={8}>
        <Icon name="arrow-back" size={24} color={colors.background} />
      </Pressable>
      <Text style={styles.title}>Tasks</Text>
      <Pressable onPress={onNotificationPress} style={styles.iconButton} hitSlop={8}>
        <Icon name="notifications" size={24} color={colors.background} />
      </Pressable>
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
    backgroundColor:  colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius:20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.background,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TasksHeader;
