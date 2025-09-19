import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { styles } from './TaskForm.styles';
import DatePicker from '../DatePicker/DatePicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TaskFormProps {
  name: string;
  details: string;
  onChangeName: (text: string) => void;
  onChangeDetails: (text: string) => void;
  startDate: string;
  endDate: string;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
  tags: string;
  onChangeTags: (text: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  name,
  details,
  onChangeName,
  onChangeDetails,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  tags,
  onChangeTags,
}) => {
  return (
    <View style={styles.form}>
      <Text style={styles.label}>Task name</Text>
      <TextInput
        placeholder="Task name"
        value={name}
        onChangeText={onChangeName}
        style={styles.input}
      />
      <Text style={styles.label}>Task description</Text>
      <TextInput
        placeholder="Task details"
        value={details}
        onChangeText={onChangeDetails}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
      />

      <View style={styles.dateLabelsRow}>
        <Text style={styles.dateLabel}>Start date</Text>
        <Text style={styles.dateLabel}>End date</Text>
      </View>

      <View style={styles.datePickersRow}>
        <DatePicker selectedDate={startDate} onDateChange={onChangeStartDate} />
        <Text style={styles.dateHyphen}>—</Text>
        <DatePicker selectedDate={endDate} onDateChange={onChangeEndDate} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaColumn}>
          <Text style={styles.metaLabel}>Tags</Text>
          <TextInput
            placeholder="Add tags"
            value={tags}
            onChangeText={onChangeTags}
            style={styles.metaInput}
          />
        </View>
        <View style={styles.metaColumnNarrow}>
          <Text style={styles.metaLabel}>Priority</Text>
          <View style={styles.priorityBox}>
            <Icon name="drag-handle" size={32} color="#FF8C00" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default TaskForm;

