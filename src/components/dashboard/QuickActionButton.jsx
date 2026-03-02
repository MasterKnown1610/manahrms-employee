import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const BUTTON_SIZE = 56;

function QuickActionButton({ icon, label, onPress, primary = false }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View
        style={[
          styles.circle,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
          primary && { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}
      >
        {icon}
      </View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const CARD_HEIGHT = 100;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 76,
    height: CARD_HEIGHT,
    justifyContent: 'flex-start',
  },
  circle: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
});

export default QuickActionButton;
