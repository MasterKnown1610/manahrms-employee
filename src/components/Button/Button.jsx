import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Loader from '../Loader/Loader';
import { spacing, typography, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

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
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && { backgroundColor: colors.primary },
        !isPrimary && { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary },
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
              isPrimary && { color: colors.background },
              !isPrimary && { color: colors.primary },
              (disabled || loading) && { color: colors.textSecondary },
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
});

export default Button;
