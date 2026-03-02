import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function SearchFilterBar({
  value = '',
  onChangeText,
  placeholder = 'Search tasks...',
  onFilterPress,
  isoptionalFilter = false,
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.searchRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Icon name="search" size={22} color={colors.placeholder} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          returnKeyType="search"
        />
      </View>
      {isoptionalFilter && (
        <Pressable onPress={onFilterPress} style={[styles.filterButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]} hitSlop={8}>
          <Icon name="tune" size={24} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchFilterBar;
