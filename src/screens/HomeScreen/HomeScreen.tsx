import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, TextInput, Alert, Pressable, LayoutAnimation, TouchableOpacity } from 'react-native';
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
import UnlockGate from '../../components/Security/UnlockGate';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks.items);
  const loading = useAppSelector(state => state.tasks.loading);
  const { selectedGroup } = useTaskGroup();
  const [newTaskName, setNewTaskName] = useState('');
  type StatusFilter = 'all' | 'in_progress' | 'completed';
  const [status, setStatus] = useState<StatusFilter>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchTasks());
      return () => {};
    }, [dispatch])
  );

  useLayoutEffect(() => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.scaleXY, duration: 250 },
      update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 200 },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.scaleXY, duration: 250 },
    });
  }, [tasks]);

  const loadTasks = async () => {
    try {
      await dispatch(fetchTasks());
    } catch (error) {
      console.error('Failed to load tasks:', error);
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    }
  };

  const handleTaskComplete = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      LayoutAnimation.configureNext({
        duration: 250,
        create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 250 },
        update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 200 },
        delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 250 },
      });
      await dispatch(toggleTaskCompletion({ id: taskId, completed: !task.completed }));
    } catch (error) {
      console.error('Failed to update task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  }, [tasks, dispatch]);

  const handleTaskDelete = useCallback(async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(taskId);
          },
        },
      ]
    );
  }, []);

  const handleDeleteAnimationEnd = useCallback(async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId));
    } catch (error) {
      console.error('Failed to delete task after animation:', error);
      Alert.alert('Error', 'Failed to delete task. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }, [dispatch]);

  const handleTaskPress = useCallback((taskId: string, taskName: string) => {
    const task = tasks.find(t => t.id === taskId);
    (navigation as any).navigate(SCREENS.TASK_DETAILS, {
      taskId,
      taskName,
      completed: task?.completed ?? false,
    });
  }, [navigation, tasks]);

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

  const handleQuickSave = useCallback(async () => {
    const title = newTaskName.trim();
    if (!title) return;

    try {
      LayoutAnimation.configureNext({
        duration: 250,
        create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 250 },
        update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 200 },
        delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 250 },
      });
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
  }, [newTaskName, dispatch, selectedGroup.id]);

  const handleRefresh = useCallback(() => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 250 },
      update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 200 },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 250 },
    });
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    const base = tasks.filter(t => {
      if (t.group_id !== selectedGroup.id) return false;
      if (status === 'all') return true;
      if (status === 'in_progress') return !t.completed;
      return !!t.completed;
    });
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(t => {
      const title = (t.title || '').toLowerCase();
      const description = (t.description || '').toLowerCase();
      const tags = (t.tags || '').toLowerCase();
      return title.includes(q) || description.includes(q) || tags.includes(q);
    });
  }, [tasks, selectedGroup.id, status, searchQuery]);

  const toggleSearch = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (showSearch) {
      setSearchQuery('');
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  }, [showSearch]);

  return (
    <UnlockGate>
    <View style={styles.container}>
      <Header onPressSearch={toggleSearch} searchActive={showSearch} />
      {showSearch && (
        <View style={styles.searchWrap}>
          <View style={styles.searchRow}>
            <TextInput
              placeholder="Search tasks..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              returnKeyType="search"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={22} color="#7e7e7e" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
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
      <TaskGroup />
      <TaskList
        tasks={filteredTasks}
        onTaskComplete={handleTaskComplete}
        onTaskDelete={handleTaskDelete}
        onTaskPress={handleTaskPress}
        onRefresh={handleRefresh}
        refreshing={loading}
        deletingId={deletingId}
        onDeleteAnimationEnd={handleDeleteAnimationEnd}
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
          delayLongPress={250}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed
          ]}
        >
          <Icon name="add" size={28} color="#006dfc" />
        </Pressable>
      </View>
    </View>
    </UnlockGate>
  );
};

export default HomeScreen;
