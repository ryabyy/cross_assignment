import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'space-evenly',
    padding: 10,
    gap: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 10,
  },
  statusTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 4,
  },
  statusButton: {
    flex: 1,
    
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
});
