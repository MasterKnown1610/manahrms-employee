import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function ApplyForLeaveButton({ onPress, loading = false, disabled = false }) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.button, { backgroundColor: colors.primary }, isDisabled && styles.buttonDisabled]}
    >
      {loading ? (
        <Loader size="small" />
      ) : (
        <Icon name="add" size={22} color={colors.background} />
      )}
      <Text style={[styles.label, { color: colors.background }]}>{loading ? 'Applying...' : 'Apply for Leave'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});

export default ApplyForLeaveButton;
