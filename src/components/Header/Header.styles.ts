import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { paddingTop: 30 },
      android: { paddingTop: 10 },
    }),
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    color: '#006dfc',
    fontWeight: 'bold',
  },
});
