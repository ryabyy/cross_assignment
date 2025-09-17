import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './DatePicker.styles';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleConfirm = (date: Date) => {
    onDateChange(date.toISOString().split('T')[0]);
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={styles.datePicker}
      >
        <Text style={styles.dateText}>{selectedDate || 'set date'}</Text>
        <Icon name="calendar-today" size={24} color="#006dfc" />
      </TouchableOpacity>
    </View>
  );
};

export default DatePicker;
