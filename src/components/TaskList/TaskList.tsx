import React from 'react';
import { FlatList } from 'react-native';
import TaskItem from '../TaskItem/TaskItem';
import { styles } from './TaskList.styles';

interface TaskListProps {
  tasks: string[];
  onTaskComplete: (taskName: string) => void;
  onTaskDelete: (taskName: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onTaskDelete,
}) => (
  <FlatList
    data={tasks}
    renderItem={({ item }) => (
      <TaskItem
        taskName={item}
        onMarkComplete={() => onTaskComplete(item)}
        onDelete={() => onTaskDelete(item)}
      />
    )}
    keyExtractor={item => item}
  />
);

export default TaskList;
