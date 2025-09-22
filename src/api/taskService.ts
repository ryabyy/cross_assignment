import axios from 'axios';
import { Task, CreateTaskRequest, TaskWithPriority } from './types';
import { transformTask } from './utils';

const BASE_URL = 'https://6840ae275b39a8039a58d780.mockapi.io/todos';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export class TaskService {
  static async getTasks(): Promise<TaskWithPriority[]> {
    try {
      const response = await api.get<Task[]>('/');
      const tasks = response.data.map(transformTask);
      const sortedTasks = tasks.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sortedTasks;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  }

  static async createTask(taskData: CreateTaskRequest): Promise<TaskWithPriority> {
    try {
      const response = await api.post<Task>('/', taskData);
      const newTask = transformTask(response.data);
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  static async updateTask(taskId: string, updates: Partial<CreateTaskRequest>): Promise<TaskWithPriority> {
    try {
      const response = await api.put<Task>(`/${taskId}`, updates);
      const updatedTask = transformTask(response.data);
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`/${taskId}`);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }

  static async toggleTaskCompletion(taskId: string, completed: boolean): Promise<TaskWithPriority> {
    return this.updateTask(taskId, { completed });
  }
}

export default TaskService;
