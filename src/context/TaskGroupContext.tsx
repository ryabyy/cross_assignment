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
  addGroup: (group: { name: string; color: string }) => void;
  editGroup: (id: number, updates: { name: string; color: string }) => void;
  deleteGroup: (id: number) => void;
}

const TaskGroupContext = createContext<TaskGroupContextValue | undefined>(undefined);

export const TaskGroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<TaskGroup[]>(PREDEFINED_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<TaskGroup>(PREDEFINED_GROUPS[0]);
  const [nextGroupId, setNextGroupId] = useState<number>(
    Math.max(...PREDEFINED_GROUPS.map(g => g.id)) + 1
  );

  const value = useMemo(
    () => ({ groups, selectedGroup, setSelectedGroup, addGroup, editGroup, deleteGroup }),
    [groups, selectedGroup]
  );

  useEffect(() => {
    (async () => {
      try {
        const savedGroups = await AsyncStorage.getItem('task_groups');
        if (savedGroups) {
          const parsed: TaskGroup[] = JSON.parse(savedGroups);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGroups(parsed);
          }
        }
        const saved = await AsyncStorage.getItem('selected_group_id');
        if (saved != null) {
          const id = parseInt(saved, 10);
          const found = (savedGroups ? JSON.parse(savedGroups) as TaskGroup[] : PREDEFINED_GROUPS).find(g => g.id === id);
          if (found) setSelectedGroup(found);
        }

        const savedNext = await AsyncStorage.getItem('task_groups_next_id');
        if (savedNext != null) {
          const parsedNext = parseInt(savedNext, 10);
          if (!Number.isNaN(parsedNext)) setNextGroupId(parsedNext);
        } else {
          const source = savedGroups ? (JSON.parse(savedGroups) as TaskGroup[]) : PREDEFINED_GROUPS;
          const computed = (source.length ? Math.max(...source.map(g => g.id)) : -1) + 1;
          setNextGroupId(computed);
          await AsyncStorage.setItem('task_groups_next_id', String(computed));
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

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('task_groups', JSON.stringify(groups));
      } catch (_) {
      }
    })();
  }, [groups]);

  function addGroup(input: { name: string; color: string }) {
    setGroups(prev => {
      const idToUse = nextGroupId;
      const newGroup: TaskGroup = { id: idToUse, name: input.name, color: input.color };
      const updated = [...prev, newGroup];
      setSelectedGroup(newGroup);
      return updated;
    });
    setNextGroupId(current => {
      const next = current + 1;
      AsyncStorage.setItem('task_groups_next_id', String(next)).catch(() => {});
      return next;
    });
  }

  function editGroup(id: number, updates: { name: string; color: string }) {
    setGroups(prev => {
      const updated = prev.map(g => (g.id === id ? { ...g, ...updates } as TaskGroup : g));
      if (selectedGroup.id === id) {
        setSelectedGroup(updated.find(g => g.id === id) || updated[0]);
      }
      return updated;
    });
  }

  function deleteGroup(id: number) {
    setGroups(prev => {
      const updated = prev.filter(g => g.id !== id);
      const safeUpdated = updated.length > 0 ? updated : PREDEFINED_GROUPS;
      if (selectedGroup.id === id) {
        setSelectedGroup(safeUpdated[0]);
      }
      return safeUpdated;
    });
  }

  return <TaskGroupContext.Provider value={value}>{children}</TaskGroupContext.Provider>;
};

export const useTaskGroup = (): TaskGroupContextValue => {
  const ctx = useContext(TaskGroupContext);
  if (!ctx) throw new Error('useTaskGroup must be used within a TaskGroupProvider');
  return ctx;
};
