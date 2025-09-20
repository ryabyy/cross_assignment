import { Task, TaskWithPriority, PriorityLevel } from './types';

/**
 * Convert API priority (0-100) to 3-tier priority system
 */
export const convertPriority = (priority: number): PriorityLevel => {
  if (priority < 33) return 'low';
  if (priority <= 66) return 'medium';
  return 'high';
};

/**
 * Convert 3-tier priority back to API format (0-100)
 */
export const convertPriorityToNumber = (priority: PriorityLevel): number => {
  switch (priority) {
    case 'low': return 16; // < 33
    case 'medium': return 50; // 33-66
    case 'high': return 83; // > 66
    default: return 50;
  }
};

/**
 * Transform API task to internal format with priority conversion
 */
export const transformTask = (task: Task): TaskWithPriority => ({
  // Ensure createdAt is always present to support reliable sorting
  ...task,
  createdAt: task.createdAt || new Date().toISOString(),
  priority: convertPriority(task.priority),
  priorityNumber: task.priority,
});

/**
 * Transform internal task back to API format
 */
export const transformTaskForAPI = (task: TaskWithPriority): Task => ({
  ...task,
  priority: task.priorityNumber,
});

/**
 * Get priority icon name based on priority level
 */
export const getPriorityIcon = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'low': return 'horizontal-rule';
    case 'medium': return 'drag-handle';
    case 'high': return 'density-medium';
    default: return 'drag-handle';
  }
};

/**
 * Get number of dots for task list priority display
 */
export const getPriorityDots = (priority: PriorityLevel): number => {
  switch (priority) {
    case 'low': return 1;
    case 'medium': return 2;
    case 'high': return 3;
    default: return 2;
  }
};

/**
 * Format date string to DD.MM.YY format
 */
export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  } catch (error) {
    return dateString;
  }
};
