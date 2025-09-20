import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from './TaskForm.styles';
import DatePicker from '../DatePicker/DatePicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PriorityLevel } from '../../api/types';
import { getPriorityIcon } from '../../api/utils';

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
  priority?: PriorityLevel;
  onChangePriority?: (priority: PriorityLevel) => void;
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
  priority = 'medium',
  onChangePriority,
}) => {
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const priorities: PriorityLevel[] = ['low', 'medium', 'high'];
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
          <TouchableOpacity 
            style={styles.priorityBox}
            onPress={() => onChangePriority && setShowPriorityDropdown(true)}
            disabled={!onChangePriority}
          >
            <Icon 
              name={getPriorityIcon(priority)} 
              size={24} 
              color="#FF8C00" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {onChangePriority && (
        <Modal
          visible={showPriorityDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPriorityDropdown(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPriorityDropdown(false)}
          >
            <View style={styles.priorityDropdown}>
              <Text style={styles.dropdownTitle}>Select Priority</Text>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityOption,
                    priority === p && styles.priorityOptionSelected
                  ]}
                  onPress={() => {
                    onChangePriority(p);
                    setShowPriorityDropdown(false);
                  }}
                >
                  <Icon 
                    name={getPriorityIcon(p)} 
                    size={20} 
                    color={priority === p ? '#1976d2' : '#666'} 
                  />
                  <Text style={[
                    styles.priorityOptionText,
                    priority === p && styles.priorityOptionTextSelected
                  ]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default TaskForm;

