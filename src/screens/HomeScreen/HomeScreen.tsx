import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Alert, Pressable } from 'react-native';
import Header from '../../components/Header/Header';
import TaskList from '../../components/TaskList/TaskList';
import ButtonTab from '../../components/ButtonTab/ButtonTab';
import TaskGroup from '../../components/TaskGroup/TaskGroup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './HomeScreen.styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SCREENS } from '../../constants/screens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTask, deleteTask, fetchTasks, toggleTaskCompletion } from '../../store/tasksSlice';
import { useTaskGroup } from '../../context/TaskGroupContext';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks.items);
  const loading = useAppSelector(state => state.tasks.loading);
  const { selectedGroup } = useTaskGroup();
  const [newTaskName, setNewTaskName] = useState('');
  type StatusFilter = 'all' | 'in_progress' | 'completed';
  const [status, setStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchTasks());
      return () => {};
    }, [dispatch])
  );

  const loadTasks = async () => {
    try {
      await dispatch(fetchTasks());
    } catch (error) {
      console.error('Failed to load tasks:', error);
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      await dispatch(toggleTaskCompletion({ id: taskId, completed: !task.completed }));
    } catch (error) {
      console.error('Failed to update task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteTask(taskId));
            } catch (error) {
              console.error('Failed to delete task:', error);
              Alert.alert('Error', 'Failed to delete task. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleTaskPress = (taskId: string, taskName: string) => {
    const task = tasks.find(t => t.id === taskId);
    (navigation as any).navigate(SCREENS.TASK_DETAILS, {
      taskId,
      taskName,
      completed: task?.completed ?? false,
      task: task,
    });
  };

  const handleAddTask = () => {
    const title = newTaskName.trim();
    if (!title) {
      (navigation as any).navigate(SCREENS.TASK_DETAILS, { isNew: true });
      return;
    }
    (navigation as any).navigate(SCREENS.TASK_DETAILS, { 
      isNew: true, 
      taskName: title 
    });
    setNewTaskName('');
  };

  const handleQuickSave = async () => {
    const title = newTaskName.trim();
    if (!title) return;

    try {
      const newTaskData = {
        title: title,
        description: '',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        tags: '',
        priority: 50, // Medium priority
        completed: false,
        createdAt: new Date().toISOString(),
        group_id: selectedGroup.id,
      };
      await dispatch(createTask(newTaskData));
      setNewTaskName('');
    } catch (error) {
      console.error('Failed to quick save task:', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    }
  };

  const handleRefresh = () => {
    loadTasks();
  };

  const filteredTasks = tasks.filter(t => {
    if (t.group_id !== selectedGroup.id) return false;
    if (status === 'all') return true;
    if (status === 'in_progress') return !t.completed;
    return !!t.completed;
  });

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.statusTabs}>
        <ButtonTab title="All" active={status === 'all'} onPress={() => setStatus('all')} />
        <ButtonTab
          title="In progress"
          active={status === 'in_progress'}
          onPress={() => setStatus('in_progress')}
        />
        <ButtonTab
          title="Completed"
          active={status === 'completed'}
          onPress={() => setStatus('completed')}
        />
      </View>
      <TaskGroup
        groupName={selectedGroup.name + '  '}
        groupColor={selectedGroup.color}
      />
      <TaskList
        tasks={filteredTasks}
        onTaskComplete={handleTaskComplete}
        onTaskDelete={handleTaskDelete}
        onTaskPress={handleTaskPress}
        onRefresh={handleRefresh}
        refreshing={loading}
      />
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add a new task"
          value={newTaskName}
          onChangeText={setNewTaskName}
          style={styles.textInput}
          returnKeyType="done"
          onSubmitEditing={handleAddTask}
        />
        <Pressable
          onPress={handleAddTask}
          onLongPress={handleQuickSave}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed
          ]}
        >
          <Icon name="add" size={28} color="#006dfc" />
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
