import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import { colors, spacing, borderRadius } from '../../theme/theme';

function ApplyForLeaveButton({ onPress, loading = false, disabled = false }) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.button, isDisabled && styles.buttonDisabled]}
    >
      {loading ? (
        <Loader size="small" />
      ) : (
        <Icon name="add" size={22} color={colors.background} />
      )}
      <Text style={styles.label}>{loading ? 'Applying...' : 'Apply for Leave'}</Text>
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
  buttonDisabled: {
    opacity: 0.8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});

export default ApplyForLeaveButton;
