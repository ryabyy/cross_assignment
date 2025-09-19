import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './TaskItem.styles';

interface TaskItemProps {
  taskId: string;
  taskName: string;
  completed?: boolean;
  onMarkComplete: () => void;
  onDelete: () => void;
  onPress: (taskId: string, taskName: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  taskId,
  taskName,
  completed = false,
  onMarkComplete,
  onDelete,
  onPress,
}) => (
  <TouchableOpacity 
    style={styles.container} 
    onPress={() => onPress(taskId, taskName)}
    activeOpacity={0.7}
  >
    <TouchableOpacity onPress={onMarkComplete} style={styles.tick}>
      <Icon name="checkbox-marked-circle-outline" size={24} color={completed ? '#006dfc' : 'gray'} />
    </TouchableOpacity>
    <Text
      style={[
        styles.taskName,
        completed ? { textDecorationLine: 'line-through', color: '#888' } : null,
      ]}
    >
      {taskName}
    </Text>
    <TouchableOpacity onPress={onDelete} style={styles.delete}>
      <Icon name="delete" size={24} color="#c04a4a" />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default TaskItem;

