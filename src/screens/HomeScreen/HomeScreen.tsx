import React, { useState } from 'react';
import { View } from 'react-native';
import Header from '../../components/Header/Header';
import TaskForm from '../../components/TaskForm/TaskForm';
import TaskList from '../../components/TaskList/TaskList';
import Button from '../../components/Button/Button';
import TaskGroup from '../../components/TaskGroup/TaskGroup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './HomeScreen.styles';

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>(['First task', 'Second task']);

  const handleTaskComplete = (taskName: string) => {};

  const handleTaskDelete = (taskName: string) => {
    setTasks(tasks.filter(task => task !== taskName));
  };

  return (
    <View style={styles.container}>
      <Header />
      <TaskGroup
        groupName={'Personal tasks  '}
        groupColor={'#4cd484'}
        onSelectGroup={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <TaskForm />
      <TaskList
        tasks={tasks}
        onTaskComplete={handleTaskComplete}
        onTaskDelete={handleTaskDelete}
      />
      <View style={styles.buttons}>
        <Button
          icon={<Icon name="delete" size={24} color="#fff" />}
          title=""
          color="red"
          onPress={() => {}}
        />
        <Button title="Mark finished" onPress={() => {}} color={'#006dfc'} />
      </View>
    </View>
  );
};

export default HomeScreen;
