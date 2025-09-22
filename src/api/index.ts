export { TaskService } from './taskService';
export { 
  convertPriority, 
  convertPriorityToNumber, 
  transformTask, 
  transformTaskForAPI,
  getPriorityIcon,
} from './utils';
export type { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskWithPriority, 
  PriorityLevel 
} from './types';
