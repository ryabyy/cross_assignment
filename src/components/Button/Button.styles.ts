import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    height: 45,
    flex: 1,
  },
  iconOnlyButton: {
    paddingHorizontal: 12,
    minWidth: 48,
    maxWidth: 48,
  },
  iconOnly: {
    margin: 0,
  },
  iconWithTitle: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 500,
    marginLeft: 0,
    letterSpacing: 0.8,
  },
});
