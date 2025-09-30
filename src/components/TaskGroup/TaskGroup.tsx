import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './TaskGroup.styles';
import { TaskGroup as TG, useTaskGroup } from '../../context/TaskGroupContext';
import GroupFormDialog, { GroupFormValues } from '../TaskGroupForm/TaskGroupForm';

interface TaskGroupProps {
  groupName?: string;
  groupColor?: string;
  onSelectGroup?: (group: TG) => void;
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  groupName,
  groupColor,
  onSelectGroup,
}) => {
  const { groups, selectedGroup, setSelectedGroup, addGroup, editGroup, deleteGroup } = useTaskGroup();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<View | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editTarget, setEditTarget] = useState<TG | null>(null);

  const handleSelect = useCallback((group: TG) => {
    setSelectedGroup(group);
    onSelectGroup?.(group);
    LayoutAnimation.configureNext({
      duration: 180,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 180 },
      update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 160 },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 180 },
    });
    setOpen(false);
  }, [onSelectGroup, setSelectedGroup]);

  const openMenu = useCallback(() => {
    if (anchorRef.current && 'measureInWindow' in anchorRef.current) {
      (anchorRef.current as any).measureInWindow((x: number, y: number, width: number, height: number) => {
        setPosition({ x, y, width, height });
        LayoutAnimation.configureNext({
          duration: 200,
          create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 200 },
          update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 180 },
          delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 200 },
        });
        setOpen(true);
      });
    } else {
      LayoutAnimation.configureNext({
        duration: 200,
        create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 200 },
        update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 180 },
        delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 200 },
      });
      setOpen(true);
    }
  }, []);

  

  const displayName = (groupName ?? selectedGroup.name) + '  ';
  const displayColor = groupColor ?? selectedGroup.color;

  const canAddMore = useMemo(() => groups.length < 10, [groups.length]);

  const openAdd = () => {
    setFormMode('add');
    setEditTarget(null);
    setShowForm(true);
  };

  const openEdit = (g: TG) => {
    setFormMode('edit');
    setEditTarget(g);
    setShowForm(true);
  };

  const handleSaveForm = (values: GroupFormValues) => {
    if (formMode === 'add') {
      addGroup(values);
    } else if (formMode === 'edit' && editTarget) {
      editGroup(editTarget.id, values);
    }
    setShowForm(false);
  };

  const confirmDelete = (g: TG) => {
    Alert.alert(
      'Delete group',
      'Are you sure you want to delete this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteGroup(g.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={openMenu} style={styles.container} ref={anchorRef as any}>
      <View style={[styles.colorBar, { backgroundColor: displayColor }]} />
      <Text style={styles.groupName}>{displayName}</Text>
      <TouchableOpacity onPress={openMenu} style={styles.dropdown}>
        <Icon name="arrow-down-drop-circle-outline" size={26} color="#333" />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => { LayoutAnimation.configureNext({ duration: 180, create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 180 }, update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 160 }, delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 180 }, }); setOpen(false); }}>
        <TouchableWithoutFeedback onPress={() => { LayoutAnimation.configureNext({ duration: 180, create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 180 }, update: { type: LayoutAnimation.Types.easeInEaseOut, duration: 160 }, delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity, duration: 180 }, }); setOpen(false); }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <View
              style={{
                position: 'absolute',
                top: position.y + position.height + 6,
                left: Math.max(8, position.x - 8),
                right: 16,
                backgroundColor: '#fff',
                borderRadius: 8,
                elevation: 6,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                overflow: 'hidden',
              }}
            >
              {groups.map((g: TG) => {
                const isCurrent = selectedGroup.id === g.id;
                return (
                  <TouchableOpacity key={g.id} onPress={() => handleSelect(g)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14 }}>
                    <View style={{ width: 6, height: 24, borderRadius: 3, backgroundColor: g.color, marginRight: 12 }} />
                    <Text style={{ flex: 1, color: '#333', fontSize: 16, fontWeight: isCurrent ? '500' : '400', textDecorationLine: isCurrent ? 'underline' : 'none' }}>{g.name}</Text>
                    {isCurrent && (
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => openEdit(g)} style={{ paddingHorizontal: 6, paddingVertical: 4 }}>
                          <Icon name="pencil" size={18} color="#006dfc" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => confirmDelete(g)} style={{ paddingHorizontal: 6, paddingVertical: 4, marginLeft: 6 }}>
                          <Icon name="delete" size={18} color="#c04a4a" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {canAddMore && (
                <>
                  <View style={{ height: 1, backgroundColor: '#eee', marginTop: 4 }} />
                  <TouchableOpacity onPress={openAdd} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14 }}>
                    <View style={{ width: 6, height: 24, borderRadius: 3, backgroundColor: 'transparent', marginRight: 12 }} />
                    <Text style={{ flex: 1, color: '#666', fontSize: 16, fontWeight: '400' }}>Add new group…</Text>
                    <Icon name="plus" size={18} color="#666" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <GroupFormDialog
        visible={showForm}
        mode={formMode}
        initialValues={formMode === 'edit' && editTarget ? { name: editTarget.name, color: editTarget.color } : undefined}
        onClose={() => setShowForm(false)}
        onSave={handleSaveForm}
      />
    </TouchableOpacity>
  );
}

export default React.memo(TaskGroup);
