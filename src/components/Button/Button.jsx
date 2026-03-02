import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Loader from '../Loader/Loader';
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from '../../theme/theme';

function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <Loader size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
          <Text
            style={[
              styles.text,
              isPrimary ? styles.primaryText : styles.secondaryText,
              (disabled || loading) && styles.disabledText,
              leftIcon && styles.textWithLeftIcon,
              rightIcon && styles.textWithRightIcon,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    ...typography.button,
  },
  textWithLeftIcon: {},
  textWithRightIcon: {},
  primaryText: {
    color: colors.background,
  },
  secondaryText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.textSecondary,
  },
});

export default Button;
