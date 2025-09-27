import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { FlatList, RefreshControl, LayoutAnimation } from 'react-native';
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
  deletingId?: string | null;
  onDeleteAnimationEnd?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onTaskDelete,
  onTaskPress,
  onRefresh,
  refreshing = false,
  deletingId = null,
  onDeleteAnimationEnd,
}) => {
  const prevIdsRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const ids = tasks.map(t => t.id).join('|');
    if (prevIdsRef.current !== null && prevIdsRef.current !== ids) {
      LayoutAnimation.configureNext({
        duration: 250,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
          duration: 250,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
          duration: 200,
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleXY,
          duration: 250,
        },
      });
    }
    prevIdsRef.current = ids;
  }, [tasks]);

  const keyExtractor = useCallback((item: TaskWithPriority) => item.id, []);

  const renderItem = useCallback(({ item }: { item: TaskWithPriority }) => (
    <TaskItem
      taskId={item.id}
      taskName={item.title}
      completed={!!item.completed}
      priority={item.priority}
      onMarkComplete={() => onTaskComplete(item.id)}
      onDelete={() => onTaskDelete(item.id)}
      onPress={onTaskPress}
      isDeleting={deletingId === item.id}
      onDeleteConfirm={() => onDeleteAnimationEnd && onDeleteAnimationEnd(item.id)}
    />
  ), [onTaskComplete, onTaskDelete, onTaskPress, deletingId, onDeleteAnimationEnd]);

  return (
    <FlatList
      data={tasks}
      extraData={tasks}
      removeClippedSubviews={false}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
};

export default React.memo(TaskList);
