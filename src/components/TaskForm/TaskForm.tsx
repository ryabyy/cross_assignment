import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import DatePicker from '../DatePicker/DatePicker';
import Button from '../Button/Button';
import { styles } from './TaskForm.styles';

const TaskForm: React.FC = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDetails, setTaskDetails] = useState('');

  const handleSave = () => {
    console.log('Task saved!');
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Task name"
        value={taskName}
        onChangeText={setTaskName}
        style={styles.input}
      />
      <TextInput
        placeholder="Task details"
        value={taskDetails}
        onChangeText={setTaskDetails}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
      />

      <View style={styles.dates}>
        <DatePicker
          selectedDate={''}
          onDateChange={function (date: string): void {
            throw new Error('Function not implemented.');
          }}
        />
        <DatePicker
          selectedDate={''}
          onDateChange={function (date: string): void {
            throw new Error('Function not implemented.');
          }}
        />
      </View>
      <View style={styles.buttons}>
        <Button title="Discard" onPress={handleSave} color={'#7e7e7e'} />
        <Button title="Save Task" onPress={handleSave} color={'#006dfc'} />
      </View>
    </View>
  );
};

export default TaskForm;
