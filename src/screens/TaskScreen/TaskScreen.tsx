import React, { useEffect, useState } from 'react';
import { View, Alert, Text, TextInput } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TaskForm from '../../components/TaskForm/TaskForm';
import Button from '../../components/Button/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './TaskScreen.styles';
import TaskGroup from '../../components/TaskGroup/TaskGroup';

type RootStackParamList = {
  TaskDetails: { taskId?: string; taskName?: string; isNew?: boolean; completed?: boolean };
};

type TaskScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;
type TaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetails'>;

const TaskScreen: React.FC = () => {
  const route = useRoute<TaskScreenRouteProp>();
  const navigation = useNavigation<TaskScreenNavigationProp>();
  const { taskId, taskName = '', isNew = false, completed } = route.params || {};

  const [name, setName] = useState<string>(taskName);
  const [details, setDetails] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(!!completed);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  useEffect(() => {
    if (!isNew && taskId) {
      // TODO: Implement saving on backend
      console.log('Auto-saving task', taskId, { name, details });
    }
  }, [name, details, isNew, taskId]);

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
          onPress: () => {
            // TODO: Implement task deletion logic
            console.log('Deleting task:', taskId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleMarkCompleted = () => {
    setIsCompleted(prev => !prev);
    if (taskId) {
      console.log('Toggling completed for task:', taskId);
    }
  };

  const handleSaveNewTask = () => {
    // TODO: Persist the new task
    console.log('Saving new task:', { name, details });
    navigation.goBack();
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
