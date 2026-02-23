import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import Icon from '../Icon/Icon';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  inputHeight,
  iconSize,
} from '../../theme/theme';

function PasswordInput({
  label = 'PASSWORD',
  placeholder = 'Enter password',
  value,
  onChangeText,
  leftIcon,
  ...rest
}) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const defaultLeftIcon = leftIcon ?? <Icon name="lock" />;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      ) : null}
      <View style={styles.inputContainer}>
        <View style={styles.leftIcon}>{defaultLeftIcon}</View>
        <RNTextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoComplete="password"
          {...rest}
        />
        <Pressable
          style={styles.rightIcon}
          onPress={() => setSecureTextEntry((prev) => !prev)}
          hitSlop={12}
        >
          <Icon
            name={secureTextEntry ? 'visibility' : 'visibility-off'}
            color={colors.primary}
          />
        </Pressable>
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
  leftIcon: {
    width: iconSize,
    height: iconSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  rightIcon: {
    width: iconSize,
    height: iconSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});

export default PasswordInput;
