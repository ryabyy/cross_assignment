import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './Header.styles';

const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <Icon name="menu" size={30} color="#006dfc" />
      <Text style={styles.title}>Task Tracker</Text>
      <Icon name="search" size={30} color="#006dfc" />
    </View>
  );
};

export default Header;
