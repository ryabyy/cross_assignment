import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TaskGroup = {
  id: number;
  name: string;
  color: string;
};

const PREDEFINED_GROUPS: TaskGroup[] = [
  { id: 0, name: 'Personal tasks', color: '#4cd484' },
  { id: 1, name: 'Work tasks', color: '#ff4d4f' },
  { id: 2, name: 'Study tasks', color: '#ffa500' },
];

interface TaskGroupContextValue {
  groups: TaskGroup[];
  selectedGroup: TaskGroup;
  setSelectedGroup: (group: TaskGroup) => void;
}

const TaskGroupContext = createContext<TaskGroupContextValue | undefined>(undefined);

export const TaskGroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState<TaskGroup>(PREDEFINED_GROUPS[0]);

  const value = useMemo(
    () => ({ groups: PREDEFINED_GROUPS, selectedGroup, setSelectedGroup }),
    [selectedGroup]
  );

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selected_group_id');
        if (saved != null) {
          const id = parseInt(saved, 10);
          const found = PREDEFINED_GROUPS.find(g => g.id === id);
          if (found) setSelectedGroup(found);
        }
      } catch (_) {
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('selected_group_id', String(selectedGroup.id));
      } catch (_) {
      }
    })();
  }, [selectedGroup]);

  return <TaskGroupContext.Provider value={value}>{children}</TaskGroupContext.Provider>;
};

export const useTaskGroup = (): TaskGroupContextValue => {
  const ctx = useContext(TaskGroupContext);
  if (!ctx) throw new Error('useTaskGroup must be used within a TaskGroupProvider');
  return ctx;
};
