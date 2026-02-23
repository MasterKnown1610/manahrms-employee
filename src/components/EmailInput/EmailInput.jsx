import React from 'react';
import TextInput from '../TextInput/TextInput';
import Icon from '../Icon/Icon';

function EmailInput({
  label = 'EMPLOYEE ID OR EMAIL',
  placeholder = 'name@company.com',
  value,
  onChangeText,
  leftIcon,
  ...rest
}) {
  const defaultLeftIcon = leftIcon ?? <Icon name="email" />;

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      leftIcon={defaultLeftIcon}
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      {...rest}
    />
  );
}

export default EmailInput;
