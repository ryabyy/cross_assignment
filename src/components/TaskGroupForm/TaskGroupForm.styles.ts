import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#fafafa',
  },
  hint: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  colorsWrap: {
    gap: 10,
    paddingVertical: 8,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: '#006dfc',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#006dfc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#8db8ff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonGhostText: {
    color: '#333',
  },
  error: {
    marginTop: 8,
    color: '#b00020',
  },
  note: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
});
