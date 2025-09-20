import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import TaskItem from '../TaskItem/TaskItem';
import { styles } from './TaskList.styles';
import { TaskWithPriority } from '../../api/types';

interface TaskListProps {
  tasks: TaskWithPriority[];
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskPress: (taskId: string, taskName: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onTaskDelete,
  onTaskPress,
  onRefresh,
  refreshing = false,
}) => (
  <FlatList
    data={tasks}
    renderItem={({ item }) => (
      <TaskItem
        taskId={item.id}
        taskName={item.title}
        completed={!!item.completed}
        priority={item.priority}
        onMarkComplete={() => onTaskComplete(item.id)}
        onDelete={() => onTaskDelete(item.id)}
        onPress={onTaskPress}
      />
    )}
    keyExtractor={item => item.id}
    refreshControl={
      onRefresh ? (
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      ) : undefined
    }
  />
);

export default TaskList;
