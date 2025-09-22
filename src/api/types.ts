export interface Task {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  tags: string;
  priority: number; // 0-100 from API
  completed: boolean;
  createdAt: string;
  group_id: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  tags: string;
  priority: number;
  completed: boolean;
  createdAt?: string;
  group_id: number;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
}

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface TaskWithPriority extends Omit<Task, 'priority'> {
  priority: PriorityLevel;
  priorityNumber: number; // Original 0-100 value
}
