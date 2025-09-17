import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './TaskGroup.styles';

interface TaskGroupProps {
  groupName: string;
  groupColor: string;
  onSelectGroup: () => void;
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  groupName,
  groupColor,
  onSelectGroup,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.colorBar, { backgroundColor: groupColor }]} />
      <Text style={styles.groupName}>{groupName}</Text>
      <TouchableOpacity onPress={onSelectGroup} style={styles.dropdown}>
        <Icon name="arrow-down-drop-circle-outline" size={26} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default TaskGroup;
