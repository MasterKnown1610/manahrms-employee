import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, iconSize } from '../../theme/theme';

function Icon({
  name,
  size = iconSize,
  color = colors.primary,
  style,
}) {
  return (
    <MaterialIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
}

export default Icon;
