import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function SummaryCard({ icon, label, value, onPress, style, valueStyle, accentColor }) {
  const { colors } = useTheme();
  const Wrapper = onPress ? Pressable : View;
  const accent = accentColor || colors.primary;

  return (
    <Wrapper
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }, style]}
    >
      {/* Colored accent strip on top */}
      <View style={[styles.accentBar, { backgroundColor: accent + '22' }]}>
        <View style={[styles.iconCircle, { backgroundColor: accent + '18' }]}>
          {icon}
        </View>
      </View>
      <View style={styles.body}>
        <Text style={[styles.value, { color: colors.text }, valueStyle]} numberOfLines={1}>{value}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>{label}</Text>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  accentBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SummaryCard;
