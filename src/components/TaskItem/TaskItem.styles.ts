import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tick: {
    marginRight: 10,
  },
  taskName: {
    flex: 1,
    fontSize: 16,
  },
  delete: {
    marginLeft: 10,
  },
});
