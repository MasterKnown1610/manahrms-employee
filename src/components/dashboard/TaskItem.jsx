import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

const PRIORITY_STYLES = {
  high: { bg: '#E57373', text: 'HIGH PRIORITY', textColor: colors.background },
  medium: { bg: '#FFB74D', text: 'MEDIUM', textColor: colors.background },
  low: { bg: colors.textSecondary, text: 'LOW', textColor: colors.background },
  completed: { bg: colors.cardBackground, text: 'COMPLETED', textColor: colors.textSecondary },
};

function TaskItem({
  title,
  priority = 'medium',
  completed = false,
  onPress,
  onCheckPress,
}) {
  const tagStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  const isCompleted = completed || priority === 'completed';
  const tag = { ...tagStyle, textColor: tagStyle.textColor || colors.background };

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Pressable
        onPress={(e) => {
          e?.stopPropagation?.();
          onCheckPress?.();
        }}
        style={[styles.checkbox, isCompleted && styles.checkboxChecked]}
        hitSlop={8}
      >
        {isCompleted ? (
          <Icon name="check" size={16} color={colors.background} />
        ) : null}
      </Pressable>
      <View style={styles.content}>
        <Text
          style={[styles.title, isCompleted && styles.titleStrike]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <View style={[styles.tag, { backgroundColor: tag.bg }]}>
          <Text style={[styles.tagText, { color: tag.textColor }]}>{tag.text}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={22} color={colors.placeholder} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  titleStrike: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default TaskItem;
