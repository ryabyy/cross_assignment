import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from './Button.styles';

interface ButtonProps {
  title?: string;
  color: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ title, color, onPress, icon }) => {
  const isIconOnly = !title && icon;
  const isBoth = title && icon;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isIconOnly ? styles.iconOnlyButton : {},
        { backgroundColor: color },
      ]}
      onPress={onPress}
    >
      {icon && (
        <View style={isBoth ? styles.iconWithTitle : styles.iconOnly}>
          {icon}
        </View>
      )}
      {title && <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default Button;
