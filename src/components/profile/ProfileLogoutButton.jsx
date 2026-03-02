import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, typography, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function ProfileLogoutButton({ onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { borderColor: colors.error, backgroundColor: colors.background },
        pressed && styles.pressed,
      ]}
    >
      <Icon name="logout" size={22} color={colors.error} />
      <Text style={[styles.text, { color: colors.error }]}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    ...typography.button,
    marginLeft: spacing.sm,
  },
});

export default ProfileLogoutButton;
