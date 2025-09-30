import React, { useEffect, useState } from 'react';
import { View, Alert, BackHandler } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TaskForm from '../../components/TaskForm/TaskForm';
import Button from '../../components/Button/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './TaskScreen.styles';
import TaskGroup from '../../components/TaskGroup/TaskGroup';
import { TaskWithPriority, CreateTaskRequest, PriorityLevel } from '../../api/types';
import { convertPriorityToNumber } from '../../api/utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTask as createTaskThunk, updateTask as updateTaskThunk, deleteTask as deleteTaskThunk, toggleTaskCompletion as toggleTaskCompletionThunk } from '../../store/tasksSlice';
import { useTaskGroup } from '../../context/TaskGroupContext';
import UnlockGate from '../../components/Security/UnlockGate';

type RootStackParamList = {
  TaskDetails: { 
    taskId?: string; 
    taskName?: string; 
    isNew?: boolean; 
    completed?: boolean;
  };
};

type TaskScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;
type TaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetails'>;

const TaskScreen: React.FC = () => {
  const route = useRoute<TaskScreenRouteProp>();
  const navigation = useNavigation<TaskScreenNavigationProp>();
  const { taskId, taskName = '', isNew = false, completed } = route.params || {};
  const dispatch = useAppDispatch();
  const { groups, selectedGroup } = useTaskGroup();

  const currentTask = useAppSelector(state =>
    taskId ? state.tasks.items.find((t: TaskWithPriority) => t.id === taskId) : undefined
  );

  const [name, setName] = useState<string>(taskName);
  const [details, setDetails] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(!!completed);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState<number>(selectedGroup.id);
  
  const [originalState, setOriginalState] = useState<{
    name: string;
    details: string;
    isCompleted: boolean;
    startDate: string;
    endDate: string;
    tags: string;
    priority: PriorityLevel;
    groupId: number;
  } | null>(null);

  useEffect(() => {
    if (!isNew && currentTask) {
      const taskData = {
        name: currentTask.title,
        details: currentTask.description,
        isCompleted: currentTask.completed,
        startDate: currentTask.start_date,
        endDate: currentTask.end_date,
        tags: currentTask.tags,
        priority: currentTask.priority,
        groupId: currentTask.group_id,
      };

      setName(taskData.name);
      setDetails(taskData.details);
      setIsCompleted(taskData.isCompleted);
      setStartDate(taskData.startDate);
      setEndDate(taskData.endDate);
      setTags(taskData.tags);
      setPriority(taskData.priority);
      setGroupId(taskData.groupId);

      setOriginalState(taskData);
    }
  }, [isNew, currentTask]);

  const parseDate = (value: string): Date | null => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const isOriginalDateInvalid = (): boolean => {
    if (!originalState) return false;
    const os = parseDate(originalState.startDate);
    const oe = parseDate(originalState.endDate);
    if (!os || !oe) return false;
    return os.getTime() > oe.getTime();
  };

  const didUserChangeDates = (): boolean => {
    if (!originalState) return true;
    return (
      startDate !== originalState.startDate ||
      endDate !== originalState.endDate
    );
  };

  const isDateRangeValidForSave = (): boolean => {
    if (originalState && isOriginalDateInvalid() && !didUserChangeDates()) {
      return true;
    }
    const s = parseDate(startDate);
    const e = parseDate(endDate);
    if (!s || !e) return true;
    return s.getTime() <= e.getTime();
  };

  const hasChanges = (): boolean => {
    if (!originalState || isNew) return false;
    
    return (
      name !== originalState.name ||
      details !== originalState.details ||
      startDate !== originalState.startDate ||
      endDate !== originalState.endDate ||
      tags !== originalState.tags ||
      priority !== originalState.priority ||
      groupId !== originalState.groupId
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
              await dispatch(deleteTaskThunk(taskId!));
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
        await dispatch(toggleTaskCompletionThunk({ id: taskId, completed: newCompleted }));
        if (originalState) {
          setOriginalState({
            ...originalState,
            isCompleted: newCompleted,
          });
        }
      } catch (error) {
        console.error('Failed to toggle completion:', error);
        Alert.alert('Error', 'Failed to update task. Please try again.');
        setIsCompleted(!newCompleted);
      }
    }
  };

  const handleSaveNewTask = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a task name.');
      return;
    }
    if (!isDateRangeValidForSave()) {
      Alert.alert('Invalid date range', 'Start date must be before or equal to end date.');
      return;
    }

    try {
      setLoading(true);
      const newTaskData: CreateTaskRequest = {
        title: name,
        description: details,
        start_date: startDate,
        end_date: endDate,
        tags: tags,
        priority: convertPriorityToNumber(priority),
        completed: isCompleted,
        createdAt: new Date().toISOString(),
        group_id: groupId,
      };
      
      await dispatch(createTaskThunk(newTaskData));
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
    if (!isDateRangeValidForSave()) {
      Alert.alert('Invalid date range', 'Start date must be before or equal to end date.');
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
        group_id: groupId,
      };
      
      await dispatch(updateTaskThunk({ id: taskId, updates: updateData }));
      
      setOriginalState({
        name,
        details,
        isCompleted,
        startDate,
        endDate,
        tags,
        priority,
        groupId,
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
    <UnlockGate>
    <View style={styles.container}>
      <View style={styles.content}>
        <TaskGroup
          groupName={(groups.find(g => g.id === groupId)?.name || selectedGroup.name) + '  '}
          groupColor={groups.find(g => g.id === groupId)?.color || selectedGroup.color}
          onSelectGroup={(g) => {
            setGroupId(g.id);
          }}
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
    </UnlockGate>
  );
};

export default TaskScreen;
