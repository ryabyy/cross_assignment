import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './TaskItem.styles';
import { PriorityLevel } from '../../api/types';
import { getPriorityDots } from '../../api/utils';

interface TaskItemProps {
  taskId: string;
  taskName: string;
  completed?: boolean;
  priority?: PriorityLevel;
  onMarkComplete: () => void;
  onDelete: () => void;
  onPress: (taskId: string, taskName: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  taskId,
  taskName,
  completed = false,
  priority = 'medium',
  onMarkComplete,
  onDelete,
  onPress,
}) => {
  const priorityDots = getPriorityDots(priority);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(taskId, taskName)}
      activeOpacity={0.7}
    >
      <TouchableOpacity onPress={onMarkComplete} style={styles.tick}>
        <Icon name="checkbox-marked-circle-outline" size={24} color={completed ? '#006dfc' : 'gray'} />
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskName,
            completed ? { textDecorationLine: 'line-through', color: '#888' } : null,
          ]}
        >
          {taskName}
        </Text>
        <View style={styles.priorityIndicator}>
          {Array.from({ length: priorityDots }, (_, index) => (
            <View key={index} style={styles.priorityDot} />
          ))}
        </View>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.delete}>
        <Icon name="delete" size={24} color="#c04a4a" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default TaskItem;

