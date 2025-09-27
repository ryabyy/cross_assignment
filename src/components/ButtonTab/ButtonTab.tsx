import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { styles } from './ButtonTab.styles';

interface ButtonTabProps {
  title: string;
  active?: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

const ButtonTab: React.FC<ButtonTabProps> = ({ title, active = false, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: active ? '#c5deff' : '#f7f8fc' },
      ]}
    >
      <Text style={[styles.text, { color: active ? '#000' : '#707279', fontWeight: active ? '700' as const : '500' as const }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(ButtonTab);
