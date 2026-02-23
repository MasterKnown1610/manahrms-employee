import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';

function ProfileLogoutButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Icon name="logout" size={22} color={colors.error} />
      <Text style={styles.text}>Logout</Text>
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
    borderColor: colors.error,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    ...typography.button,
    color: colors.error,
    marginLeft: spacing.sm,
  },
});

export default ProfileLogoutButton;
