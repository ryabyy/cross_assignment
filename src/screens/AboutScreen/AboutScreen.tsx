import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AboutScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Icon name="info" size={48} color="#006dfc" />
      <Text style={styles.title}>About</Text>
      <Text style={styles.subtitle}>Task Tracker v1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default AboutScreen;
