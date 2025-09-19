import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderColor: '#ddd',
  },
  colorBar: {
    width: 6,
    height: '100%',
    marginRight: 10,
    borderRadius: 5,
  },
  groupName: {
    marginLeft: 5,
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdown: {
    padding: 0,
  },
});
