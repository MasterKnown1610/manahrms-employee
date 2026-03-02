import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function TasksFAB({ onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.fab, { backgroundColor: colors.primary }]}>
      <Icon name="add" size={28} color={colors.background} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default TasksFAB;
