import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function SummaryCard({ icon, label, value, onPress, style, valueStyle }) {
  const { colors } = useTheme();
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper onPress={onPress} style={[styles.card, { backgroundColor: colors.cardBackground }, style]}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }, valueStyle]} numberOfLines={1}>{value}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    minHeight: 110,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginRight: spacing.md,
    overflow: 'hidden',
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
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
});

export default SummaryCard;
