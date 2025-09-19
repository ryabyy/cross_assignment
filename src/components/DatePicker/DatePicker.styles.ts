import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    minWidth: 120,
    height: 45,
    flex: 1,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  dateText: {
    fontSize: 16,
    flex: 1,
    color: '#999',
    textAlign: 'center',
  },
});
