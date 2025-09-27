import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles } from './DatePicker.styles';
import { formatDateDisplay } from '../../api/utils';

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
        <Text style={styles.dateText}>{selectedDate ? formatDateDisplay(selectedDate) : 'set date'}</Text>
        {selectedDate ? (
          <TouchableOpacity onPress={() => onDateChange('')}>
            <Icon name="close" size={22} color="#666" />
          </TouchableOpacity>
        ) : (
          <Icon name="calendar-today" size={24} color="#006dfc" />
        )}
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default React.memo(DatePicker);
