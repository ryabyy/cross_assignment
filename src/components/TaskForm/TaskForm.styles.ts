import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 10,
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 10,
  },
});
