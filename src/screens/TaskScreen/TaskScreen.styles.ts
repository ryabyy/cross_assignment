import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dateLabelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#444',
    fontSize: 14,
    marginBottom: 6,
  },
  dateHyphen: {
    width: 24,
    textAlign: 'center',
    color: '#999',
  },
  datePickersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateMiddleSpacer: {
    width: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  metaColumn: {
    flex: 1,
  },
  metaColumnNarrow: {
    width: 56,
  },
  metaLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    marginLeft: 2,
  },
  metaInput: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  priorityBox: {
    width: 56,
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 20,
  },
});
