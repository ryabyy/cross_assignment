import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './TaskGroup.styles';
import { TaskGroup as TG, useTaskGroup } from '../../context/TaskGroupContext';

interface TaskGroupProps {
  groupName: string;
  groupColor: string;
  onSelectGroup?: (group: TG) => void;
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  groupName,
  groupColor,
  onSelectGroup,
}) => {
  const { groups, selectedGroup, setSelectedGroup } = useTaskGroup();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<View | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });

  const handleSelect = (group: TG) => {
    setSelectedGroup(group);
    onSelectGroup?.(group);
    setOpen(false);
  };

  const openMenu = useCallback(() => {
    if (anchorRef.current && 'measureInWindow' in anchorRef.current) {
      (anchorRef.current as any).measureInWindow((x: number, y: number, width: number, height: number) => {
        setPosition({ x, y, width, height });
        setOpen(true);
      });
    } else {
      setOpen(true);
    }
  }, []);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={openMenu} style={styles.container} ref={anchorRef as any}>
      <View style={[styles.colorBar, { backgroundColor: groupColor }]} />
      <Text style={styles.groupName}>{groupName}</Text>
      <TouchableOpacity onPress={openMenu} style={styles.dropdown}>
        <Icon name="arrow-down-drop-circle-outline" size={26} color="#333" />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
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
              {groups.map(g => (
                <TouchableOpacity key={g.id} onPress={() => handleSelect(g)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14 }}>
                  <View style={{ width: 6, height: 24, borderRadius: 3, backgroundColor: g.color, marginRight: 12 }} />
                  <Text style={{ flex: 1, color: '#333', fontSize: 16, fontWeight: '500' }}>{g.name}</Text>
                  {selectedGroup.id === g.id && <Icon name="check" size={18} color="#006dfc" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </TouchableOpacity>
  );
}

export default TaskGroup;
