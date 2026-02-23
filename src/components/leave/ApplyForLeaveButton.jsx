import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

function ApplyForLeaveButton({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Icon name="add" size={22} color={colors.background} />
      <Text style={styles.label}>Apply for Leave</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});

export default ApplyForLeaveButton;
