import React from 'react';
import { FlatList } from 'react-native';
import TaskItem from '../TaskItem/TaskItem';
import { styles } from './TaskList.styles';

interface Task {
  id: string;
  name: string;
  completed?: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskPress: (taskId: string, taskName: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onTaskDelete,
  onTaskPress,
}) => (
  <FlatList
    data={tasks}
    renderItem={({ item }) => (
      <TaskItem
        taskId={item.id}
        taskName={item.name}
        completed={!!item.completed}
        onMarkComplete={() => onTaskComplete(item.id)}
        onDelete={() => onTaskDelete(item.id)}
        onPress={onTaskPress}
      />
    )}
    keyExtractor={item => item.id}
  />
);

export default TaskList;
