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
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskName: {
    flex: 1,
    fontSize: 16,
  },
  priorityIndicator: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
  },
  priorityDot: {
    width: 4,
    height: 4,
    backgroundColor: '#FF8C00',
    marginVertical: 1,
    borderRadius: 2,
  },
  delete: {
    marginLeft: 10,
  },
});
