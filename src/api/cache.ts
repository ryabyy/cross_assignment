import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskWithPriority } from './types';

const CACHE_KEY = 'tasks_cache';
const CACHE_TIMESTAMP_KEY = 'tasks_cache_timestamp';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export interface CacheData {
  tasks: TaskWithPriority[];
  timestamp: number;
}

export const saveTasksToCache = async (tasks: TaskWithPriority[]): Promise<void> => {
  try {
    const cacheData: CacheData = {
      tasks,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to save tasks to cache:', error);
  }
};

export const loadTasksFromCache = async (): Promise<TaskWithPriority[] | null> => {
  try {
    const [cacheData, timestampStr] = await Promise.all([
      AsyncStorage.getItem(CACHE_KEY),
      AsyncStorage.getItem(CACHE_TIMESTAMP_KEY),
    ]);

    if (!cacheData) return null;

    const timestamp = timestampStr ? parseInt(timestampStr, 10) : 0;
    const now = Date.now();

    if (now - timestamp > CACHE_EXPIRY_MS) {
      await clearCache();
      return null;
    }

    const parsed: CacheData = JSON.parse(cacheData);
    return parsed.tasks;
  } catch (error) {
    console.warn('Failed to load tasks from cache:', error);
    return null;
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([CACHE_KEY, CACHE_TIMESTAMP_KEY]);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
};

export const isCacheValid = async (): Promise<boolean> => {
  try {
    const timestampStr = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestampStr) return false;

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    return now - timestamp <= CACHE_EXPIRY_MS;
  } catch (error) {
    return false;
  }
};
