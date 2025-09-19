import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from './Button.styles';

interface ButtonProps {
  title?: string;
  color: string;
  onPress: () => void;
  icon?: React.ReactNode;
  shape?: 'default' | 'circle';
  size?: number;
  textColor?: string;
  iconSize?: number;
}

const Button: React.FC<ButtonProps> = ({
  title,
  color,
  onPress,
  icon,
  shape = 'default',
  size = 48,
  textColor,
  iconSize,
}) => {
  const isIconOnly = !title && icon;
  const isBoth = title && icon;

  const circleStyle =
    shape === 'circle'
      ? {
          width: size,
          height: size,
          minWidth: size,
          maxWidth: size,
          borderRadius: size / 2,
          paddingHorizontal: 0,
        }
      : {};

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isIconOnly ? styles.iconOnlyButton : {},
        { backgroundColor: color },
        circleStyle,
      ]}
      onPress={onPress}
    >
      {icon && (
        <View style={isBoth ? styles.iconWithTitle : styles.iconOnly}>
          {React.isValidElement(icon) && iconSize
            ? (React.cloneElement as any)(icon as any, { size: iconSize } as any)
            : icon}
        </View>
      )}
      {title && (
        <Text style={[styles.buttonText, textColor ? { color: textColor } : null]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
