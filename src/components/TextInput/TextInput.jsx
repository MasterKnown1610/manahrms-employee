import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  inputHeight,
  iconSize,
} from '../../theme/theme';

function TextInput({
  label,
  placeholder = '',
  value,
  onChangeText,
  leftIcon,
  editable = true,
  autoCapitalize = 'none',
  autoCorrect = false,
  style,
  inputStyle,
  ...rest
}) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      ) : null}
      <View style={styles.inputContainer}>
        {leftIcon ? (
          <View style={styles.leftIcon}>{leftIcon}</View>
        ) : null}
        <RNTextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          {...rest}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: inputHeight,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.input,
    height: inputHeight,
    paddingVertical: 0,
    paddingHorizontal: spacing.sm,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  leftIcon: {
    width: iconSize,
    height: iconSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
});

export default TextInput;
