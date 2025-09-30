import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { styles } from './TaskGroupForm.styles';

export type GroupFormValues = {
  name: string;
  color: string;
};

interface GroupFormDialogProps {
  visible: boolean;
  mode: 'add' | 'edit';
  initialValues?: GroupFormValues;
  onClose: () => void;
  onSave: (values: GroupFormValues) => void;
}

const DEFAULT_COLORS = [
  '#4cd484', '#ff4d4f', '#ffa500', '#1976d2', '#9c27b0', '#009688', '#795548', '#607d8b',
  '#e91e63', '#3f51b5', '#00bcd4', '#8bc34a', '#ffc107', '#ff5722', '#2ecc71', '#1abc9c'
];

const GroupFormDialog: React.FC<GroupFormDialogProps> = ({ visible, mode, initialValues, onClose, onSave }) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [color, setColor] = useState(initialValues?.color ?? DEFAULT_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName(initialValues?.name ?? '');
      setColor(initialValues?.color ?? DEFAULT_COLORS[0]);
      setError(null);
    }
  }, [visible, initialValues]);

  const disabled = useMemo(() => {
    const trimmed = name.trim();
    if (!trimmed) return true;
    if (trimmed.length > 50) return true;
    if (!/^#[0-9a-fA-F]{3,8}$/.test(color)) return true;
    return false;
  }, [name, color]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    if (trimmed.length > 50) {
      setError('Name must be at most 50 characters');
      return;
    }
    setError(null);
    onSave({ name: trimmed, color });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.card}>
            <Text style={styles.title}>{mode === 'add' ? 'Add new group' : 'Edit group'}</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Group name"
              style={styles.input}
              maxLength={50}
            />
            <Text style={styles.hint}>{name.trim().length}/50</Text>

            <Text style={styles.label}>Color</Text>
            <ScrollView contentContainerStyle={styles.colorsWrap} horizontal showsHorizontalScrollIndicator={false}>
              {DEFAULT_COLORS.map(c => (
                <TouchableOpacity key={c} onPress={() => setColor(c)} activeOpacity={0.8}>
                  <View style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <TouchableOpacity onPress={onClose} style={[styles.button, styles.buttonGhost]}>
                <Text style={[styles.buttonText, styles.buttonGhostText]}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.button, disabled && styles.buttonDisabled]} disabled={disabled}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default GroupFormDialog;
