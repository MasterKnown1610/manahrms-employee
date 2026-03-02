import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/theme';

function SummaryCard({ icon, label, value, onPress, style }) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper onPress={onPress} style={[styles.card, style]}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    minHeight: 100,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginRight: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  iconWrap: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
});

export default SummaryCard;
