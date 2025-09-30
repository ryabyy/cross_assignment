import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './Header.styles';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  onPressSearch?: () => void;
  searchActive?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onPressSearch: onPressSearch, searchActive: searchActive }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => (navigation as any).openDrawer?.()}>
        <Icon name="menu" size={30} color="#006dfc" />
      </TouchableOpacity>
      <Text style={styles.title}>Task Tracker</Text>
      <TouchableOpacity onPress={onPressSearch}>
        <Icon name={searchActive ? 'keyboard-arrow-up' : 'search'} size={30} color="#006dfc" />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(Header);
