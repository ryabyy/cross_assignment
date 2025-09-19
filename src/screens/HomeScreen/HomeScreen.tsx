import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import Header from '../../components/Header/Header';
import TaskList from '../../components/TaskList/TaskList';
import Button from '../../components/Button/Button';
import ButtonTab from '../../components/ButtonTab/ButtonTab';
import TaskGroup from '../../components/TaskGroup/TaskGroup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './HomeScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../constants/screens';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  type Task = { id: string; name: string; completed?: boolean };
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'First task', completed: false },
    { id: '2', name: 'Second task', completed: true },
  ]);
  const [newTaskName, setNewTaskName] = useState('');
  type StatusFilter = 'all' | 'in_progress' | 'completed';
  const [status, setStatus] = useState<StatusFilter>('all');

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleTaskPress = (taskId: string, taskName: string) => {
    const task = tasks.find(t => t.id === taskId);
    (navigation as any).navigate(SCREENS.TASK_DETAILS, {
      taskId,
      taskName,
      completed: task?.completed ?? false,
    });
  };

  const handleAddTask = () => {
    const title = newTaskName.trim();
    if (!title) {
      (navigation as any).navigate(SCREENS.TASK_DETAILS, { isNew: true });
      return;
    }
    const id = Date.now().toString();
    setTasks(prev => [{ id, name: title, completed: false }, ...prev]);
    setNewTaskName('');
  };

  const filteredTasks = tasks.filter(t => {
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
        groupName={'Personal tasks  '}
        groupColor={'#4cd484'}
        onSelectGroup={() => { }}
      />
      <TaskList
        tasks={filteredTasks}
        onTaskComplete={handleTaskComplete}
        onTaskDelete={handleTaskDelete}
        onTaskPress={handleTaskPress}
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
        <Button
          icon={<Icon name="add" size={28} color="#006dfc" />}
          title=""
          color="#f1f1f1"
          onPress={handleAddTask}
          shape="circle"
          size={64}
          iconSize={44}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
