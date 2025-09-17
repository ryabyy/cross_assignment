import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './TaskItem.styles';

interface TaskItemProps {
  taskName: string;
  onMarkComplete: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  taskName,
  onMarkComplete,
  onDelete,
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onMarkComplete} style={styles.tick}>
      <Icon name="check-circle" size={24} color="gray" />
    </TouchableOpacity>
    <Text style={styles.taskName}>{taskName}</Text>
    <TouchableOpacity onPress={onDelete} style={styles.delete}>
      <Icon name="delete" size={24} color="#c04a4a" />
    </TouchableOpacity>
  </View>
);

export default TaskItem;
