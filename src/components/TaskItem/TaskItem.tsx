import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
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
  isDeleting?: boolean;
  onDeleteConfirm?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  taskId,
  taskName,
  completed = false,
  priority = 'medium',
  onMarkComplete,
  onDelete,
  onPress,
  isDeleting = false,
  onDeleteConfirm,
}) => {
  const priorityDots = getPriorityDots(priority);
  
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const removeOpacity = useRef(new Animated.Value(1)).current;
  const removeScaleY = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  useEffect(() => {
    if (isDeleting) {
      Animated.parallel([
        Animated.timing(removeOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(removeScaleY, {
          toValue: 0.01,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          onDeleteConfirm && onDeleteConfirm();
        }
      });
    }
  }, [isDeleting, onDeleteConfirm, removeOpacity, removeScaleY]);

  return (
    <Animated.View style={{ opacity: removeOpacity, transform: [{ scaleY: removeScaleY }] }}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
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
      </Animated.View>
    </Animated.View>
  );
};

function propsAreEqual(prev: Readonly<TaskItemProps>, next: Readonly<TaskItemProps>) {
  return (
    prev.taskId === next.taskId &&
    prev.taskName === next.taskName &&
    prev.completed === next.completed &&
    prev.priority === next.priority &&
    prev.isDeleting === next.isDeleting
  );
}

export default React.memo(TaskItem, propsAreEqual);
