import React, { useEffect, useState } from 'react';
import { View, Alert, Text, TextInput, BackHandler } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TaskForm from '../../components/TaskForm/TaskForm';
import Button from '../../components/Button/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './TaskScreen.styles';
import TaskGroup from '../../components/TaskGroup/TaskGroup';
import { TaskService } from '../../api';
import { TaskWithPriority, CreateTaskRequest, PriorityLevel } from '../../api/types';
import { convertPriorityToNumber } from '../../api/utils';

type RootStackParamList = {
  TaskDetails: { 
    taskId?: string; 
    taskName?: string; 
    isNew?: boolean; 
    completed?: boolean;
    task?: TaskWithPriority;
  };
};

type TaskScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;
type TaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetails'>;

const TaskScreen: React.FC = () => {
  const route = useRoute<TaskScreenRouteProp>();
  const navigation = useNavigation<TaskScreenNavigationProp>();
  const { taskId, taskName = '', isNew = false, completed, task } = route.params || {};

  const [name, setName] = useState<string>(taskName);
  const [details, setDetails] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(!!completed);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [loading, setLoading] = useState(false);
  
  const [originalState, setOriginalState] = useState<{
    name: string;
    details: string;
    isCompleted: boolean;
    startDate: string;
    endDate: string;
    tags: string;
    priority: PriorityLevel;
  } | null>(null);

  useEffect(() => {
    if (!isNew && task) {
      const taskData = {
        name: task.title,
        details: task.description,
        isCompleted: task.completed,
        startDate: task.start_date,
        endDate: task.end_date,
        tags: task.tags,
        priority: task.priority,
      };
      
      setName(taskData.name);
      setDetails(taskData.details);
      setIsCompleted(taskData.isCompleted);
      setStartDate(taskData.startDate);
      setEndDate(taskData.endDate);
      setTags(taskData.tags);
      setPriority(taskData.priority);
      
      setOriginalState(taskData);
    }
  }, [isNew, task]);

  const hasChanges = (): boolean => {
    if (!originalState || isNew) return false;
    
    return (
      name !== originalState.name ||
      details !== originalState.details ||
      startDate !== originalState.startDate ||
      endDate !== originalState.endDate ||
      tags !== originalState.tags ||
      priority !== originalState.priority
    );
  };

  useEffect(() => {
    const backAction = () => {
      if (hasChanges()) {
        Alert.alert(
          'Unsaved Changes',
          'You have unsaved changes. Do you want to discard them?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [hasChanges, navigation]);

  useEffect(() => {
    if (!isNew && taskId && name.trim() && !hasChanges()) {
      const timeoutId = setTimeout(() => {
        handleAutoSave();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isCompleted, isNew, taskId, hasChanges]);

  const handleAutoSave = async () => {
    if (!taskId || !name.trim()) return;
    
    try {
      const updateData: Partial<CreateTaskRequest> = {
        title: name,
        description: details,
        start_date: startDate,
        end_date: endDate,
        tags: tags,
        priority: convertPriorityToNumber(priority),
        completed: isCompleted,
      };
      
      await TaskService.updateTask(taskId, updateData);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleDelete = () => {
    if (isNew) {
      navigation.goBack();
      return;
    }

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
              setLoading(true);
              await TaskService.deleteTask(taskId!);
              navigation.goBack();
            } catch (error) {
              console.error('Failed to delete task:', error);
              Alert.alert('Error', 'Failed to delete task. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleMarkCompleted = async () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    
    if (taskId) {
      try {
        await TaskService.toggleTaskCompletion(taskId, newCompleted);
        
        if (originalState) {
          setOriginalState({
            ...originalState,
            isCompleted: newCompleted,
          });
        }
      } catch (error) {
        console.error('Failed to toggle completion:', error);
        Alert.alert('Error', 'Failed to update task. Please try again.');
        setIsCompleted(!newCompleted); // Revert on error
      }
    }
  };

  const handleSaveNewTask = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a task name.');
      return;
    }

    try {
      setLoading(true);
      const newTaskData: CreateTaskRequest = {
        title: name,
        description: details,
        start_date: startDate || new Date().toISOString(),
        end_date: endDate || new Date().toISOString(),
        tags: tags,
        priority: convertPriorityToNumber(priority),
        completed: isCompleted,
        createdAt: new Date().toISOString(),
      };
      
      await TaskService.createTask(newTaskData);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create task:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExistingTask = async () => {
    if (!taskId || !name.trim()) {
      Alert.alert('Error', 'Please enter a task name.');
      return;
    }

    try {
      setLoading(true);
      const updateData: Partial<CreateTaskRequest> = {
        title: name,
        description: details,
        start_date: startDate,
        end_date: endDate,
        tags: tags,
        priority: convertPriorityToNumber(priority),
        completed: isCompleted,
      };
      
      await TaskService.updateTask(taskId, updateData);
      
      setOriginalState({
        name,
        details,
        isCompleted,
        startDate,
        endDate,
        tags,
        priority,
      });
      
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save task:', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    if (!originalState) return;
    
    setName(originalState.name);
    setDetails(originalState.details);
    setIsCompleted(originalState.isCompleted);
    setStartDate(originalState.startDate);
    setEndDate(originalState.endDate);
    setTags(originalState.tags);
    setPriority(originalState.priority);
  };

  const handleDiscardNewTask = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TaskGroup
          groupName={'Personal tasks  '}
          groupColor={'#4cd484'}
          onSelectGroup={() => {}}
        />
        <TaskForm
          name={name}
          details={details}
          onChangeName={setName}
          onChangeDetails={setDetails}
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={setStartDate}
          onChangeEndDate={setEndDate}
          tags={tags}
          onChangeTags={setTags}
          priority={priority}
          onChangePriority={setPriority}
        />
      </View>

      {isNew ? (
        <View style={styles.bottomButtons}>
          <Button
            title="Discard"
            onPress={handleDiscardNewTask}
            color="#7e7e7e"
          />
          <Button
            title="Save Task"
            onPress={handleSaveNewTask}
            color="#006dfc"
          />
        </View>
      ) : hasChanges() ? (
        <View style={styles.bottomButtons}>
          <Button
            title="Discard"
            onPress={handleDiscardChanges}
            color="#7e7e7e"
          />
          <Button
            title="Save Changes"
            onPress={handleSaveExistingTask}
            color="#006dfc"
          />
        </View>
      ) : (
        <View style={styles.bottomButtons}>
          <Button
            icon={<Icon name="delete" size={24} color="#fff" />}
            title=""
            color="red"
            onPress={handleDelete}
          />
          <Button
            title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
            onPress={handleMarkCompleted}
            color={isCompleted ? '#006dfc' : '#3dad6b'}
          />
        </View>
      )}
    </View>
  );
};

export default TaskScreen;
